# Disk-space maintenance

The reader hub includes a conservative maintenance command for local
development storage. It only targets rebuildable JavaScript dependencies and
these generated directories:

- `.next`
- `.turbo`
- `coverage`
- `playwright-report`
- `test-results`
- `node_modules` (deep cleanup only)

The command never targets source code, Git history, lockfiles, environment
files, Convex data, uploads, archived outputs, Python environments, iOS Pods,
PHP dependencies, or application storage. It also protects any target directory
that contains a Git-tracked file.

## Commands

```bash
# Read-only report
npm run space:status

# Remove caches and test output, but keep installed dependencies
npm run space:clean

# Also remove node_modules; run npm install before developing again
npm run space:clean:deep

# Clean caches only when system free space is below 50 GB
npm run space:auto
```

Override the automatic threshold when needed:

```bash
SPACE_MIN_FREE_GB=75 npm run space:auto
```

The cleanup refuses to run when it detects an active reader-hub development
process. Stop the dev server first. A direct dry run is also available:

```bash
node scripts/space-maintenance.mjs deep-clean --dry-run
```

Docker is not recommended as a space-saving measure for this project. It would
move dependencies into image layers and add Docker build cache rather than
eliminate them.
