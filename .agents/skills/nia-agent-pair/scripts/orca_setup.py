#!/usr/bin/env python3
"""Overlay only Nia Forrester collaboration files into a clean linked worker."""
import json, os, re, shutil, stat, subprocess, sys
from pathlib import Path
sys.dont_write_bytecode = True
PAIR = '.agents/skills/nia-agent-pair'
FILES = ('AGENTS.md', 'CLAUDE.md', '.claude/agents/nia-frontend.md', '.agents/skills/nia-agent-pair/SKILL.md', 'docs/ORCA_WORKFLOW.md', '.agents/skills/nia-agent-pair/scripts/orca_setup.py')
def git(root, *args):
    return subprocess.check_output(['git', *args], cwd=root, stderr=subprocess.DEVNULL)


def checkout_paths(source, target):
    source, target = source.resolve(strict=True), target.resolve(strict=True)
    if source == target or not (target / '.git').is_file() or (target / '.git').is_symlink():
        raise ValueError('Setup requires a separate Git worktree, never the primary checkout.')
    for root in (source, target):
        if Path(git(root, 'rev-parse', '--show-toplevel').decode().strip()).resolve() != root:
            raise ValueError('Setup paths must be checkout roots.')
    common = lambda root: git(root, 'rev-parse', '--path-format=absolute', '--git-common-dir').strip()
    if common(source) != common(target):
        raise ValueError('Source and target must belong to the same repository.')
    if common(target) == git(target, 'rev-parse', '--absolute-git-dir').strip():
        raise ValueError('Primary checkout is forbidden.')
    return source, target


def regular_file(path, allow_missing=False):
    if path.resolve() != path or path.is_symlink():
        raise ValueError(f'Linked file: {path.name}')
    try:
        info = path.stat()
    except FileNotFoundError:
        if allow_missing:
            return False
        raise ValueError(f'Missing file: {path.name}') from None
    if not stat.S_ISREG(info.st_mode) or info.st_nlink != 1:
        raise ValueError(f'Expected single-link regular file: {path.name}')
    return True


def reject_staged(target, relative):
    # Check independently of disk contents: staged edits may match the overlay,
    # and staged deletions have disappeared from the index entirely.
    if git(target, 'diff', '--cached', 'HEAD', '--', relative):
        raise ValueError(f'Staged target changes: {relative}')


def plan_overlay(source, target, files):
    copies = []
    for relative in files:
        src, dst = source / relative, target / relative
        regular_file(src)
        exists = regular_file(dst, allow_missing=True)
        reject_staged(target, relative)
        content = src.read_bytes()
        if not exists:
            if git(target, 'ls-tree', '--name-only', 'HEAD', '--', relative):
                raise ValueError(f'Deleted tracked target tool: {relative}')
        elif dst.read_bytes() != content:
            try:
                baseline = git(target, 'show', f'HEAD:{relative}')
            except subprocess.CalledProcessError:
                raise ValueError(f'Foreign target tool: {relative}') from None
            if baseline != dst.read_bytes():
                raise ValueError(f'Modified target tool: {relative}')
        copies.append((relative, dst, content))
    return copies


def apply_overlay(copies):
    for relative, dst, content in copies:
        dst.parent.mkdir(parents=True, exist_ok=True)
        exists = regular_file(dst, allow_missing=True)
        if exists and dst.read_bytes() == content:
            continue
        temporary = dst.with_name(dst.name + '.orca-setup-tmp')
        # Exclusive creation preserves foreign temporary files, including links.
        with temporary.open('xb') as output:
            try:
                output.write(content)
                output.flush()
                os.fsync(output.fileno())
                temporary.replace(dst)
            finally:
                if temporary.exists():
                    temporary.unlink()


def main():
    if sys.version_info < (3, 10):
        for candidate in ('/opt/homebrew/bin/python3', '/usr/local/bin/python3'):
            if Path(candidate).is_file() and subprocess.run([candidate, '-c', 'import sys;sys.exit(sys.version_info < (3,10))'], capture_output=True).returncode == 0:
                os.execv(candidate, [candidate, str(Path(__file__).resolve()), *sys.argv[1:]])
        raise ValueError('Install Python 3.10+; no supported interpreter was found.')
    os.umask(0o077)
    source, target = checkout_paths(Path(os.environ['ORCA_ROOT_PATH']), Path(os.environ['ORCA_WORKTREE_PATH']))
    if Path(__file__).resolve() != source / PAIR / 'scripts/orca_setup.py':
        raise ValueError('Invoke the primary hook through ORCA_ROOT_PATH.')
    apply_overlay(plan_overlay(source, target, FILES))
    regular_file(target / '.env.example')
    env_path = target / '.env.local'
    if not regular_file(env_path, allow_missing=True):
        with env_path.open('xb') as out:
            out.write((target / '.env.example').read_bytes())
    for name in ('package.json', 'package-lock.json'):
        regular_file(target / name)
    if (target / 'node_modules').is_symlink():
        raise ValueError('Shared node_modules is forbidden.')
    clean_env = {k: os.environ[k] for k in ('PATH', 'HOME', 'TMPDIR', 'LANG') if k in os.environ}
    subprocess.run(['npm', 'ci', '--ignore-scripts', '--no-audit', '--no-fund'], cwd=target, env=clean_env, check=True)
    print('Nia Forrester worker prepared; live providers and services were not started.')

if __name__ == '__main__':
    try:
        main()
    except Exception as error:
        sys.exit('Nia Forrester setup failed: '+str(error))
