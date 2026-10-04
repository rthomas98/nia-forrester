# RBAC integration and isolated provider acceptance

Owner task `task_018195389363`, dispatch `ctx_af0ad83d5b4c`, 2026-10-03.

## Source integration — complete

Claude accepted the unchanged six repair hashes in frontend
`docs/redesign/RBAC_REVIEW.md`, SHA-256
`5880a9b03d1f26370caf9676c1c55232323f629de13eccb08fa705d0e23989b8`.
All five primary source baseline hashes matched the repair report before applying
the patch. Primary RBAC test baseline was
`705d73a0c3c9cdc35e96f68d8b9e85be249983a7b4559c09948f1bb286f6cd45`;
its only additional pre-repair difference from contracts was the approved audit
correction: the paid-event denial supplies valid arguments and checks the actual
entitlement error, and the inner-club denial checks FORBIDDEN. Those stronger
assertions and all new coverage were preserved in the accepted final test.

Six product/test files and the exact repair and reciprocal reports were integrated
into `/Users/robthomas/Development/nia-forrester` using `apply_patch`. A full
tracked/untracked file hash snapshot proved that only the six approved existing
files changed; every unrelated existing file was preserved. Primary generated APIs,
test-only fixture helpers, fixture suites and operator harnesses were excluded.

| Integrated file | SHA-256 |
| --- | --- |
| `convex/profiles.ts` | `84a58b261809bbc38460b1ea52113b58013d71690e12ab321eef52f5477f8cf4` |
| `convex/communityAccess.ts` | `7d69fe99d9c601f2dd1f8a8315fd021f6303ba09fbe73a52c894e8be0f8e6b85` |
| `convex/community.ts` | `3d37836d9309e1a91070ba77f33f37b163971047b1e428e178a15dbad410b5a6` |
| `convex/readerCircle.ts` | `6361cbd654c01a598d5ee5b8879e89961cd0c6a64ad41b639e210bc39a312f0b` |
| `convex/dashboard.ts` | `a8eb15d84f39fb6ee1580870aa9738c7d7626b10fb0854d4e79e7de59f702e9c` |
| `scripts/rbac-audit.test.mjs` | `8ef5ce29adebea61c173397524c50fa4b33a2769f6741d3f3146fa20de0bfd38` |
| `docs/REDESIGN_RBAC_FIX.md` | `de95bb4db831a932fee71c1b7ecfa0c331e9b9b83245a64f47829ad2c6953241` |

## Local checks — complete

- Primary `tsc --noEmit --incremental false`: pass.
- Primary `npm run lint`: zero errors, five unchanged baseline warnings (four
  generated eslint-disable directives and one unused academy-test variable).
- Primary `git diff --check`: pass.
- Primary explicit seven product Vitest suites (`community`, `events`, `academy`,
  `avatars`, `dashboard`, `rbac-audit`, `site-data`): **79/79 pass**.
- Primary Node catalog contract suite: **11/11 pass**.
- Contracts explicit eight backend Vitest suites (the seven above plus the
  existing contracts-only `redesign-fixtures` suite): **83/83 pass**.
- Contracts new test-only `redesign-rbac-fixtures` safety suite: **10/10 pass**.
- Claude's independent additional fixture probes: **8/8 pass**, as recorded in
  frontend `docs/redesign/RBAC_FIXTURE_REVIEW.md`.
- Contracts typecheck and lint: pass, the same five baseline warnings.
- Operator harness Node syntax check and contracts `git diff --check`: pass.

## Provider boundary and fixture review

Read-only management and environment inspection verified the exact reference
`empuls3-agancy:nia-forrester:dev/redesign-oct03-4978ed34033f`, deployment
`dutiful-firefly-917`, project `3065332`, team `396842`, deployment type `dev`,
`isDefault=false`. `SITE_URL` is `http://127.0.0.1:3417` and fixture scope is
`redesign-oct03-4978ed34033f`; no Stripe, Resend or webhook variable names exist.
The original four profiles have reader/reader/editor/admin roles, and the original
writers member is already joined to all three synthetic journey clubs.

The new internal additive fixture helper is contracts-only, with no primary copy:

| Test-only file | Accepted SHA-256 |
| --- | --- |
| `convex/redesignRbacFixtures.ts` | `faaa86bba3887ebd67bccbe656608431953cb46c533fa650d13dd47edb463525` |
| `scripts/redesign-rbac-fixtures.test.mjs` | `a9dcca28e6103cb9c928449e32c53aa933a610678c91f8040d5bbd0fe99829d2` |

It accepts exactly two fixed synthetic auth identities, always assigns reader
roles, inserts labeled synthetic active subscriptions and Circle joins, and never
joins clubs or patches original profiles, subscriptions or auth verification.
Exact site/scope/origin and all three delivery-key guards run before any writes.
Collisions and existing club joins fail closed; valid retries preserve rows.

## Live acceptance — passed

Final fixture/harness review report SHA-256:
`20ccb847a5a01bb133f2ff4d119ec5a066e7e8fde2f43e273f55fe62828da7be`.
The coordinator explicitly approved the exact final harness
`bba4e0edcf89cd1811d431d2ddd0e03fbc1645b7d46f3c69b6dd22e1e55046a8` in message
`msg_a662f691a765`, acknowledging the one nonidempotent positive thread/reply.
Helper, tests, harness and final review were rehashed immediately before invocation.
One `accept coordinator-approved-ctx_af0ad83d5b4c` invocation exited 0; no retries.

The full contracts backend was pushed using the explicit pinned reference with
`--push --codegen disable --typecheck enable`, followed by a read-only
`readerCircle:overview` query. The guarded helper was invoked once. Existing fixture
seed helpers were never reseeded. Exactly two additive labeled Better Auth accounts
were created through the fixed dev HTTP endpoint; no app signup/bootstrap or auth
verification mutation was used. Two active synthetic subscriptions and two Circle
joins were inserted, with zero club joins for either new account. Placeholder Stripe
IDs are TEST-only local records and do not represent payments or provider objects.

The harness reverified management identity and exact environment before every code
push, signup, sign-in, helper seed and product mutation (including expected denials).
There were **31 passing identity/env guard checks**, from `2026-10-04T01:21:31.011Z`
to `2026-10-04T01:23:44.096Z`. No Stripe/Resend/webhook variables were configured.

### Sanitized accounts for coordinator CUA

Credentials are stored only in the contracts worktree's ignored 0600
`.env.redesign-rbac-accounts.json`. The original ignored 0600
`.env.redesign-accounts.json` was read only. No passwords, cookies, access tokens or
operator credentials appear in reports or stdout. Both new accounts retain the
reader role and are paid Circle members with no joined clubs at this checkpoint.
Synthetic subscriptions expire after 30 days; helpers refuse expiry/conflict rather
than extending or overwriting records.

| Label | Tier | Auth user ID | Profile ID | Circle join ID | Subscription ID |
| --- | --- | --- | --- | --- | --- |
| TEST REDESIGN RBAC reader Unjoined | reader | `k174e8rdbk86r9wxqkd83f5nth8fmqwy` | `md790qa10zeksgetvwbsebgtsh8fnhck` | `k17cyznf8cepe224mbb65t85a18fmnr7` | `n97d6yq42z0fp1qvbzzmas15mn8fm5wk` |
| TEST REDESIGN RBAC writers Unjoined | writers | `k179qb0ercxf345qr5a10df0dx8fmrwk` | `md79xffm4nsfm6qyttpazpec2d8fm74p` | `k174shfh2pa02zhkaxyd11wcex8fneq8` | `n97f4ycmysdypmavxd0wp2r1n98fnnjx` |

### Club identities

| Club tier | Club ID | Existing journey thread ID |
| --- | --- | --- |
| reader | `jx7axcec7jc2vcfmmk678hagnd8fj8vb` | `nd7dre0xy06361mnz0j4eq9j198fjefj` |
| inner | `jx7f2z0fwy32kvaar1d7fvvdsn8fjc9k` | `nd73bfn8731w9gm333dxaa7abx8fj6je` |
| writers | `jx7eqpyx3be9xxy9kzczdaxp5x8fj8wa` | `nd723rfsygjevm6s7pzztq6c3d8fj9ra` |

### Real provider access matrix

Both discussion lists (`community:listThreads` and `readerCircle:discussions`),
thread detail, create, reply and dashboard were checked in every row below.
Each denial batch compared stored threads/posts before and after and retained all
rows unchanged; neither new identity acquired a club membership.

| Account | Club tier | Both lists | Detail | Create | Reply | Dashboard |
| --- | --- | --- | --- | --- | --- | --- |
| TEST REDESIGN RBAC reader Unjoined | reader | filtered | FORBIDDEN | FORBIDDEN | FORBIDDEN | filtered |
| TEST REDESIGN RBAC reader Unjoined | inner | filtered | FORBIDDEN | FORBIDDEN | FORBIDDEN | filtered |
| TEST REDESIGN RBAC reader Unjoined | writers | filtered | FORBIDDEN | FORBIDDEN | FORBIDDEN | filtered |
| TEST REDESIGN RBAC writers Unjoined | reader | filtered | FORBIDDEN | FORBIDDEN | FORBIDDEN | filtered |
| TEST REDESIGN RBAC writers Unjoined | inner | filtered | FORBIDDEN | FORBIDDEN | FORBIDDEN | filtered |
| TEST REDESIGN RBAC writers Unjoined | writers | filtered | FORBIDDEN | FORBIDDEN | FORBIDDEN | filtered |
| free | writers | PAID_MEMBERSHIP_REQUIRED | PAID_MEMBERSHIP_REQUIRED | PAID_MEMBERSHIP_REQUIRED | PAID_MEMBERSHIP_REQUIRED | empty |
| editor | writers | PAID_MEMBERSHIP_REQUIRED | PAID_MEMBERSHIP_REQUIRED | PAID_MEMBERSHIP_REQUIRED | PAID_MEMBERSHIP_REQUIRED | empty |
| admin | writers | PAID_MEMBERSHIP_REQUIRED | PAID_MEMBERSHIP_REQUIRED | PAID_MEMBERSHIP_REQUIRED | PAID_MEMBERSHIP_REQUIRED | empty |

The reader account is denied at its correct reader tier while unjoined and also
at the higher inner/writers tiers. The writers account is denied in every eligible
club while unjoined. Original free reader, editor and admin without subscriptions
receive PAID_MEMBERSHIP_REQUIRED, proving no staff bypass on this deployment.

The original writers member, already joined to the writers club, passed both lists,
detail body, create, reply plus persisted reply readback, and dashboard. Exactly one
new labeled `TEST REDESIGN RBAC Provider Allowed` thread and one labeled reply were
created. This harness must not be rerun blindly: these positive writes are not
idempotent. Coordinator acknowledged this before the single invocation.

- Original member auth ID: `k175y2nsc0z3h392ay5wgq5c158fk4eb`.
- Joined writers club: `jx7eqpyx3be9xxy9kzczdaxp5x8fj8wa`.
- Existing journey thread: `nd723rfsygjevm6s7pzztq6c3d8fj9ra`.
- New synthetic positive thread: `nd7910apr1wcef9jfm81z11j9n8fnhvq`.
- New synthetic positive reply: `m974wpkbmj7933yctqv46qrhwh8fnkf4`.

Original four profiles and subscriptions were compared in full before/after the
helper and again after acceptance and were identical (snapshot SHA-256
`bc5c34de0010e342b17991390199375f0a7904a046206ef9d44f46e1975348dc`). Reader/reader/editor/admin roles remain
unchanged; no existing subscription, role, Circle join or club join was modified.

### Exact provider source manifest and preservation

All manifest bytes below were rechecked after the push and match their pre-push
hashes. This includes the pre-existing generated API, which was not regenerated.
The six integrated primary files still match their reviewed hashes. An immediate
post-integration snapshot proved unrelated primary file preservation; a later
snapshot additionally observed a concurrent edit to `docs/REDESIGN_PLAN.md` outside
this worker's scope. This worker did not edit or restore that file.

| Contracts source file | SHA-256 |
| --- | --- |
| `convex/academy.ts` | `1ff6dc840ddf411c55a994f7fe8b994f8481110ca074d622294b9f248275d328` |
| `convex/auth.config.ts` | `a090a0a16acd95cc75245b29e0de1f2afe6a7c72b962dc9547800af46148a812` |
| `convex/auth.ts` | `7738948761a4a78ab90f8925ce445268243b190fa85f7a73add881dcde8c2787` |
| `convex/avatars.ts` | `85af2a3937163a40cb5d998db729d0eafc49282edf1f0f6d48eff98b468182d1` |
| `convex/billing.ts` | `cbec8d0e2560f9c82a1940c5fbfee0913580f3e2d78d87437a0d5b3418f852a6` |
| `convex/catalog.ts` | `db557873d1b385d72570c7134e63454fae8c2a0987d9ef9dc84ca6e90135305e` |
| `convex/catalogPolicy.ts` | `1719d3b8de3f0e6fae83d803d12b9b59a3c8f0a39a6810aa251544149d6322fd` |
| `convex/community.ts` | `3d37836d9309e1a91070ba77f33f37b163971047b1e428e178a15dbad410b5a6` |
| `convex/communityAccess.ts` | `7d69fe99d9c601f2dd1f8a8315fd021f6303ba09fbe73a52c894e8be0f8e6b85` |
| `convex/contact.ts` | `f7d65dc5e7cf103899f08156e451de2ba5977c2f2c5812748972cb5318dfbf71` |
| `convex/content.ts` | `c9b339e6ecf1679f7c062a271cd4049de55fe7924e32088dcadc83c932602428` |
| `convex/convex.config.ts` | `cdf7e962c6a9b6240618ca25f2dea8df87fefdfb7f2ded3a55af57a9e64c3dc0` |
| `convex/dashboard.ts` | `a8eb15d84f39fb6ee1580870aa9738c7d7626b10fb0854d4e79e7de59f702e9c` |
| `convex/email.ts` | `19185d75707f750fcaa0e94fde90deb611a729c95d3f8afb786626d377084b68` |
| `convex/eventFixtures.ts` | `df51a8bd2fad6faab3f6093b77fff7280c4becbeb2cb77f75ae1ddf69908098b` |
| `convex/events.ts` | `4d37bfd5247aebfb0b917fb33253be425ee2314b91f0806c4a8239e75da5eb04` |
| `convex/http.ts` | `cc4038d974b0f43c250ea6c66d6574594df925816b2fdd307bf1c4247a0ac986` |
| `convex/imports.ts` | `ee1403c06057fbc6a7602b550f2ee6437b40671fb4b5305552808c40f92d7a8c` |
| `convex/library.ts` | `591d74a4add6651f4e782d6ed5231bc6b49c3da6b14ee5fb944431b12ba7c025` |
| `convex/newsletter.ts` | `b52f16dd2016b558ec3b4742a3981a21db5c4012cad5d9116c31afd6229b9814` |
| `convex/profiles.ts` | `84a58b261809bbc38460b1ea52113b58013d71690e12ab321eef52f5477f8cf4` |
| `convex/progress.ts` | `13bbca15a70ee34eef3d4a7ee4886d04a3217db331bffcec7c70f2c50b79e613` |
| `convex/readerCircle.ts` | `6361cbd654c01a598d5ee5b8879e89961cd0c6a64ad41b639e210bc39a312f0b` |
| `convex/redesignFixtures.ts` | `93de1838e445136219cc5f2580f2c0b25355f1df6159a7fed9113afa2f45b85b` |
| `convex/redesignJourneyFixtures.ts` | `aeac7d5e60165c2354559847dab2ebcd7cb05dc962e555343ae6f1f739a35611` |
| `convex/redesignRbacFixtures.ts` | `faaa86bba3887ebd67bccbe656608431953cb46c533fa650d13dd47edb463525` |
| `convex/schema.ts` | `7cc847eed0224fb110c04113252af615a314db10bf079b2346da0cfde86670bf` |
| `convex/security.ts` | `9ed66daab5b017245e1b9444e567260ae269729dfe0a3c5801e3601c34b1d616` |
| `convex/seed.ts` | `7817e6276daeeee310eef3d92f380e56f91ddda40a53b2562c1a4f428255a9ff` |
| `convex/serialBootstrap.ts` | `cff0935f37df24d7203ac7dd5afd9507f2a35fe473bfd6e6d8eaa1869e6ee2a9` |
| `convex/site.ts` | `00992301b73976d3105bbe25b994990816342d472f17d1f1d272646a53b33f25` |
| `convex/_generated/api.d.ts` | `7d3a01ae504e0f40fde83c5b4c1787be9d1a8d4a5c149d7cb694ee1c43069b04` |

The primary contains the six accepted product/test files, exact repair report,
exact product reciprocal report, exact final fixture/harness reciprocal report and
this sanitized provider report. No test-only fixture helper, fixture suite, operator
harness or generated API was copied to primary.

## Remaining gates and boundaries

Coordinator CUA on `http://127.0.0.1:3417` remains required; no browser automation
was performed here. Use the two new accounts for unjoined correct-tier/lower-tier
checks before any browser join changes; the original writers member remains joined
for the positive journey. Provider API acceptance does not prove browser acceptance,
production behavior, real payment or real email delivery.

No production deployment, Git commit/push, dependency changes, environment/secret
changes, real payment/email calls, staff bootstrap promotion, original-account
reseeding or original subscription/role changes occurred. Admin onboarding review
N1 remains deliberately deferred; the verified insert-only bootstrap is unchanged.
