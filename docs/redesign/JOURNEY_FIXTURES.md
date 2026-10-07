# TEST REDESIGN journey fixtures

October 3, 2026. Contracts HEAD `fefc16b83a5a8e0124d8cb8bce9a228dd9064ae7`; changes remain uncommitted. Implementation began only after coordinator confirmation that `task_b89ed9243426` settled succeeded. This report covers nonproduction provider/source checks; browser acceptance is coordinator-owned CUA.

## Exact scope and guard

Only `empuls3-agancy:nia-forrester:dev/redesign-oct03-4978ed34033f` / `dutiful-firefly-917`, project ID 3065332, team ID 396842, type dev, isDefault false. Management API GETs reverified deployment name/reference/type/project/default status and team/project IDs before every operator write. Last report identity verification: 2026-10-03T21:42:52.645Z. Cloud: https://dutiful-firefly-917.convex.cloud; HTTP: https://dutiful-firefly-917.convex.site; preview: http://127.0.0.1:3417.

The new internal helper requires the exact HTTP deployment URL, TEST_FIXTURE_SCOPE=redesign-oct03-4978ed34033f and SITE_URL=http://127.0.0.1:3417; any Resend API key, Stripe secret key or Stripe webhook secret rejects execution. It inserts missing fixture identities and refuses conflicting non-test records; repeat seeds preserve original IDs and user state. No profile, subscription, entitlement, RBAC or product policy edits occur. No reseed/delete, real email/payment/meeting/ticket, account creation, frontend source/environment edit, lock/dependency change, build, install, download or browser automation occurred. Available disk was approximately 1.37 GiB, below the 4 GiB floor.

Published synthetic events intentionally omit isTest so normal public listing and registration paths operate on this exact isolated dev; labels/slugs/descriptions remain TEST REDESIGN. Clubs use normal open status and reader/inner/writers tiers, linked to the preserved synthetic book. Their seeded prompts do not pre-join any account or pre-complete replies. Staff request starts requested with no staffReply. Original TEST records and the coordinator's browser-created thread/reply/bookings/Circle join coexist.

Coordinator message msg_44e6978b720b explicitly expanded scope for synthetic membership rendering plans: TEST labels, amounts 100/200/300 cents monthly and 1000/2000/3000 cents annual, both cadences, no Stripe IDs. These amounts are artificial QA inputs, not author publication metadata or commercial prices. Checkout remains unconfigured; existing account entitlements are unchanged.

## Safe operator harness

`node scripts/redesign-journeys.mjs report` is the default, repeatable read-only acceptance command. It does not sign in, push code, mutate progress/library, join clubs, reply, register, import or change policy. It compares all 48 public authentic books against locally prepared metadata and cover provenance/hashes. It checks that the existing synthetic credentials file is Git-ignored and mode 0600 without printing passwords or tokens.

Other explicit modes: `identity` reads management identity; `prepare` validates only local source/covers; `self-test` runs isolated in-memory safety tests. `seed` writes guarded additive fixtures after an explicit dev code push with codegen disabled; `catalog` writes guarded canonical input. Never rerun the earlier mutating `redesign-provider.mjs verify` harness. No shared generated API change was needed; dynamic function references/CLI names address the new helper. Never integrate this dev-only module, earlier test-guarded bootstraps or their generated API into primary.

Synthetic credentials remain only at `/Users/robthomas/orca/workspaces/nia-forrester/nia-relume-contracts/.env.redesign-accounts.json`; use free/member/editor/admin labels locally. No credential values belong in this report, screenshots, messages or exports.

## Provider records

New fixture counts: 2 events, 3 clubs, 3 threads, 1 service, 1 booking, 3 membership plans. Authentic import: 48 books and 7 series. Anonymous catalog now returns 49 books, including original synthetic TEST book. Report snapshot contains 4 TEST events, 3 TEST bookings, 4 TEST threads, 1 TEST post, 1 Circle member, 0 journey club memberships, 2 original event registrations and 3 synthetic plans. Browser steps may subsequently change these observed counts.

| Type | Name / slug | ID |
| --- | --- | --- |
| events | test-redesign-journey-in-person | kh797m7ze5hfgx4vc3py6wgc6x8fjn75 |
| events | test-redesign-journey-hybrid | kh7987xa3z4zwfrat8msecwtgx8fk98a |
| clubs | test-redesign-journey-club-reader | jx7axcec7jc2vcfmmk678hagnd8fj8vb |
| clubs | test-redesign-journey-club-inner | jx7f2z0fwy32kvaar1d7fvvdsn8fjc9k |
| clubs | test-redesign-journey-club-writers | jx7eqpyx3be9xxy9kzczdaxp5x8fj8wa |
| threads | TEST REDESIGN Browser Reading Discussion | nd7dzgnv2kqd37r5wp6zsf1tm98fj6t4 |
| threads | TEST REDESIGN Journey reader Discussion | nd7dre0xy06361mnz0j4eq9j198fjefj |
| threads | TEST REDESIGN Journey inner Discussion | nd73bfn8731w9gm333dxaa7abx8fj6je |
| threads | TEST REDESIGN Journey writers Discussion | nd723rfsygjevm6s7pzztq6c3d8fj9ra |
| services | test-redesign-journey-review | mx74f1bwdrz07ybrbvprnksfmh8fj7bk |
| bookings | TEST REDESIGN Manuscript (requested) | jd74m0a40xs3bsc184qp3tshjd8fjkd4 |
| bookings | TEST REDESIGN Browser Manuscript (requested) | jd7a5gahzs8qnbmbqzxkz37yxn8fjm33 |
| bookings | TEST REDESIGN Journey Synthetic Manuscript (requested) | jd7e7hnw2rst3k1fry3m0nyh9d8fjxbw |
| membershipPlans | reader | kx74tfvwkqjyy58r6ht41pd6jx8fkpp8 |
| membershipPlans | inner | kx70pv6qww66ffp412hb55xbzd8fky9d |
| membershipPlans | writers | kx72565e6mzj888gc13gbam92h8fjpjd |
| posts | Preserved browser TEST reply | m97577bw7g8ejxj2a00k10mvf98fkagy |

Original catalog book `k977411mh9e0v8f6safvpsfrzn8fkmzb`, serial `k971bkd9pgm5fmxg8jvwnzch8s8fj2sz`, virtual events `kh7ate6ekjek12m6q1sd4815vs8fjzh5`, `kh70j7rrppw4enz6xn9as2spkx8fkbz4`, academy service `mx7bacjkrma0ejp5v5sc4rpw218fkgjr`, course `n172v5nqpqsvvpp625a9h3m7rs8fk5qs` remain unchanged. Existing account/fixture credential file was read only. Authentic import returned series IDs: `ms7em01afknmgh2kss6skehjmd8fkppe`, `ms7ckb09rp2yms8xnhfgc9pgq18fjc0t`, `ms75fn7c49hwyz6bxnm6ef70ds8fjd8n`, `ms7607ggbkkfg1ym4y1aqqqsrh8fkkss`, `ms73k4z0v831fx61e04cb7nndn8fk4gf`, `ms71weqdhz05385jgzdq9rcp0n8fkhn8`, `ms732qksq364ey3d80kd0pwkc98fjyt0`.

## Authentic source and covers

Primary was read only. The existing primary catalogBootstrap operator shape supports arrays of canonical seriesInput/bookInput, so this helper reuses that shape and existing validators/upsert functions while inserting only absent identities. Preparation uses the authentic primary preparer in a temporary copy; only its zod import path and local asset root are adapted to installed contracts dependencies. The 49 local retailer listings normalize to 48 books/7 series. Missing publication dates/descriptions remain absent; no publication dates or authentic prices were fabricated.

Each catalog cover was hashed against the primary local file AND the existing consuming frontend public file; all 48 matched the provider's returned coverAsset metadata. This verifies local bytes and public query metadata, not browser image loading. Source SHA-256: `2de5e874051194da31243f1df0f9ed21a1952677e03ed88deb80725e07632eb2`. Primary catalogBootstrap SHA-256: `e600a502762011451fd7412408082273dfb06c6255ebad426cc65d97f7507db7`.

| Authentic slug | content ID | Local public cover | SHA-256 |
| --- | --- | --- | --- |
| lifted-b00nksc6jm | k9779xgsed8amc168rrvw6xfzd8fjwfd | /images/books/amazon/01-B00NKSC6JM.jpg | 2032375879732d7ba976637dea6a7154ea3166e0c15d7e999d88672d5827ba97 |
| courtship-a-snowflake-novel-b082ml1g9r | k97by3ce79dvka4ff39fs1ykbd8fj2sr | /images/books/amazon/02-B082ML1G9R.jpg | 01637d95b3e760a75550e34e0ad38e2424e5209ccf44fa05dbc90b76ca038245 |
| the-wanderer-a-novel-b0dnrmvsjh | k975wgzygt998x1ckzes2we64s8fk1ma | /images/books/amazon/03-B0DNRMVSJH.jpg | 8c7502d5d7459de77cdaa1de5b2e2521495affe27a03e9d0bced14e228c424a5 |
| jane-doe-black-b0bvlfmsrf | k972n9m3b8mnr7c0hgx3qce18d8fkdpd | /images/books/amazon/04-B0BVLFMSRF.jpg | 5147066028bc62a30ab5eeb9812a3b664a68374db9c0aa2b58ef2071c8538197 |
| the-takedown-the-afterwards-series-b0758pkv91 | k9763nvke8hx8pd61japk1eybs8fj3vw | /images/books/amazon/05-B0758PKV91.jpg | a68a7bd1a7ee2454009f59b089aed276c17a98c4812626693870c1bd8cc8a768 |
| may-december-b09tkgynhs | k97efp5tdgmyfp0fqqdhx1cbx58fkf24 | /images/books/amazon/06-B09TKGYNHS.jpg | bada87725c6ffab970f13368987b2c49e489e44d1b62e13f2205c1434205c731 |
| the-lover-b072v6h4sw | k97awz4a8v5fvarkvsvdbqz93x8fkg0d | /images/books/amazon/07-B072V6H4SW.jpg | 52c18d0e35f75358178c0929a4d9fbab95b3e1020d53753d5f25a48f08645d94 |
| recall-a-psychological-thriller-short-b0gdwll5gh | k976c90eprw35e1j91wcr8m0wh8fksbq | /images/books/amazon/08-B0GDWLL5GH.jpg | 1a5caf1ac94916006da66567caf635dbcc80f371700f3d78774543ce42980239 |
| in-black-white-b07w7tr5nm | k970jwtyq3app11397yb57w9a98fk6z9 | /images/books/amazon/09-B07W7TR5NM.jpg | d24d0c877e234e7e5318a2817c3559097e5982f60b4c429953947d6bf74cbb33 |
| reversible-error-b0cj1zyjg1 | k975t7aj614vj1xchy41q2gm2h8fkhpb | /images/books/amazon/10-B0CJ1ZYJG1.jpg | fe046f2866a148bf2953ea8bd39b640c5efab7c374e5e674ae9900a099e9cfe0 |
| acceptable-losses-b01ngyzo99 | k975hwk3w14vq3zjr7ba2ptwfn8fkbzp | /images/books/amazon/11-B01NGYZO99.jpg | 8771452e6514b18bab24c8380f7229de4193f56b4dd99dba914bd98040024c26 |
| the-darkest-morning-b09nzkgc59 | k971z01y653pketw4qt7mcnxzx8fk1z8 | /images/books/amazon/12-B09NZKGC59.jpg | 4868391bcdcdc613373ef3c876b3b4e638fa2aa28124f9f99380cb4bfb2eb464 |
| in-the-nothing-a-new-adult-novel-b010rq0ujc | k974hcfm3pr329td1h52zvj5fh8fkh4f | /images/books/amazon/13-B010RQ0UJC.jpg | e99cf6f7e3c60172b143c94f702de7b9fb20ee44307b5905174a55c949afa8ca |
| coffee-date-b075n96wy1 | k975kxr5vaxjjbtz3jqnd5ynj18fkvtm | /images/books/amazon/14-B075N96WY1.jpg | a2d7f1aa0737c6ccffbf5ec3b364722504d4dff129632bc7137eab1e13ae61da |
| just-lunch-b076fn4h43 | k9749k97ys2ft93jz712q5dhr98fj902 | /images/books/amazon/15-B076FN4H43.jpg | e3a032fed818611116da74661988961cd7e380d19798ec374c8031cb69210d3e |
| because-my-heart-said-so-b01g9aw4h6 | k974kct0ydh7k55kfp1qjpsyc98fkxmn | /images/books/amazon/16-B01G9AW4H6.jpg | ec68bd00f07ecefac7c184ea08c7de95acaa90660618c76eb8d51a146e44d38e |
| commitment-b008ivmkag | k979a8hn120w2j3bzx98f67hts8fjmdz | /images/books/amazon/17-B008IVMKAG.jpg | 7373110c29b4bd4e163130a23ab953ddb33dedfc9979a58ec9ede3cbd68b886b |
| a-la-carte-the-complete-coffee-date-novellas-b07g6767kn | k975z4hq1da7hz9b3x9njnnsjd8fkhe5 | /images/books/amazon/18-B07G6767KN.jpg | 8392a6658b5bfa7111065d5e55cc1dbcea1ebd002b8ef82321b67b3c5bb4371b |
| young-rich-black-an-afterwards-novella-the-afterwards-series-b01n4r8h74 | k9724ka8g142g65ckd1r634b4s8fkejv | /images/books/amazon/19-B01N4R8H74.jpg | af3a8408ffb9cad07519fc5976f58d14afbbaadf15c3efc93d321424c4ac4830 |
| table-for-two-b077kx3vl6 | k971n0zj69y03wcz0k0hpb65w98fkch9 | /images/books/amazon/20-B077KX3VL6.jpg | 87bf3e54cb803faa09f29df2cc8d7c22b7b92608fbd09da10711dfeaab18695a |
| commitment-10th-anniversary-edition-b09rv9y1pw | k975etaq30zff1ekk3rfsjde8d8fjazm | /images/books/amazon/21-B09RV9Y1PW.jpg | 3e17f61794b67cfff35eb1eb53f71eaac4662bea185d06d993858fb1c9edd1f9 |
| rhyme-reason-the-afterwards-series-b07qyddpkq | k979t9s8n2jjqa0r02xxp228sd8fj1jh | /images/books/amazon/22-B07QYDDPKQ.jpg | 242018b88fc31e04cb13938767b3496d653d1694c0ea4523395ff74da66a4b98 |
| afterwards-b00g757pb4 | k9799791psc0rdz1zp9n5bejqs8fkn49 | /images/books/amazon/23-B00G757PB4.jpg | 547efc9d31d7fa58e7a74347c75768863f883501b46a05ec592e6ab57146c43c |
| afterburn-b00jywx3d6 | k9720f9mzwcvkrbfy7490px1298fjena | /images/books/amazon/24-B00JYWX3D6.jpg | a3790120ed844260482a83bed2875ca3d74001cb4f87b38ec59b85316d7af487 |
| the-come-up-the-afterwards-series-b00upr0i46 | k971w36jeyeac4a18d05xmmfrn8fjfyc | /images/books/amazon/25-B00UPR0I46.jpg | 5d637476f5aa1a880e18abadb9ab5d02e68846f0ad8fdbae4334aaf0f427229d |
| snowflake-the-afterwards-series-b07mh1lxx7 | k9783ys8rv41zeb11r2n4wcjas8fjpqm | /images/books/amazon/26-B07MH1LXX7.jpg | 43ccce28df33ca418cb5abcf81fb45059695a45a24db8b36e2adb5c393564529 |
| ivy-s-league-b015n7gnx2 | k975s6880apw2fpyy4kn13r2ss8fk09k | /images/books/amazon/27-B015N7GNX2.jpg | ddb4685f0e7f8c6fccc4a3087dc0030e6230ad51866807196eb165ed1a32d699 |
| happily-ever-b09kbpf555 | k977c6226rjdgfh2t42b6wd8md8fknz7 | /images/books/amazon/28-B09KBPF555.jpg | b390f3d0d5f233e34322dd674ee591c6ea16eb296f54c8ad8d1c31f420686f6b |
| the-makeover-a-modern-love-story-b07bvk9mbk | k971qddpqrm4sany7xykt2d3518fj7qr | /images/books/amazon/29-B07BVK9MBK.jpg | 95a9c73977c5fea87f39c9eb703e2f9a178a07d587b7921b885cdcfc70b9e488 |
| still-a-short-story-b073yhjgpm | k97bt189a7vbq5gm1290ss0tb58fk9ez | /images/books/amazon/30-B073YHJGPM.jpg | f006c70b5495195f241fd8a7f2814e55332b8755b2adc7c7034c800cfa76db63 |
| wife-b00ikbqnzm | k975ype3g6fqh3ds5p5n6cm27n8fk1kr | /images/books/amazon/31-B00IKBQNZM.jpg | cdb70007c4132d355fba1cde41b3c0d325fecb348aadba4c374f050c7dee9c8f |
| the-broken-the-afterwards-series-b0b4vl2vvn | k975v5zn35knfws7d62pn3tyf98fkjkn | /images/books/amazon/32-B0B4VL2VVN.jpg | 0be8ac5ceab3ae1caaa693ff5be2b154957d3c6cfd176671f9d720477ac67a63 |
| not-that-kind-of-girl-b086vym6br | k97ca37mder93wqvk25hbsjynd8fkdha | /images/books/amazon/33-B086VYM6BR.jpg | cc2a1c2d914538eb9c7b38b4bed082f0f9b80bc8122fcc27910c5f607bd77032 |
| after-the-fire-the-shorts-b08lkjvkv6 | k9726h3cbb6y0p3kzdmq80trkd8fk957 | /images/books/amazon/34-B08LKJVKV6.jpg | 730c30fd1cd1789cbc79b162660b657122337517d3551f822d532b7fc1fd5d9a |
| unplanned-a-snowflake-drop-in-b0881hqgmw | k975yg7g7xmesvhp0637f46zsh8fkc00 | /images/books/amazon/35-B0881HQGMW.jpg | 58b3bd4e210b9cdb771de741c7926a496cb706c9c74a19020efd3c1f7fcba3f0 |
| silent-nights-b0841h8df6 | k9790w34n4q5c8yfqq5spf1v5s8fjz3g | /images/books/amazon/36-B0841H8DF6.jpg | 5a5939b06bbb93a4ce5723674cc7800eb4ca543491dc6af5e2776bab62d52349 |
| mistress-b00ewtu85w | k97ebc7nhe24ekergvpa7hkgd58fktpp | /images/books/amazon/37-B00EWTU85W.jpg | cc8ee2ba836f657234a93f5b3575609cad7a71824261cfabab752aa2e3c852ba |
| the-art-of-endings-b00dpyxcjo | k97952gp17y7kqmgezphgvjag58fj16d | /images/books/amazon/38-B00DPYXCJO.jpg | 698dc832f21f24a0792465514bdf455214522a03691db2c54fdd8a815d5a1ed1 |
| secret-b00asp8uao | k97aj9q631ww3e9y0fth6wwrjx8fkq1h | /images/books/amazon/39-B00ASP8UAO.jpg | 206b4e1644dadf080ebeb65cd11f0984a314c74c815ccafbc175af59d63e42c5 |
| paid-companion-b06xs237mz | k977kjnsnz9xnrk77x87qv44cx8fkcx2 | /images/books/amazon/40-B06XS237MZ.jpg | 93cfbdb452280ead8a0f8d2920578c385837f0ffb15edd1513b0375c7680fd2f |
| maybe-never-b00bjfni0e | k975pd5kqthej94pp7zqk3qmdh8fk3a1 | /images/books/amazon/41-B00BJFNI0E.jpg | 7fb7f3059101a8f6a3d6bd1fa1a2c16e4e15e75eecfd628804e642579e635517 |
| the-fall-b01ejysoaa | k97etdsgqcx4bw0ra3m4367mb18fj96r | /images/books/amazon/42-B01EJYSOAA.jpg | 363f5ce506706ebbe31efb18d54ca94b72e89f79cf1501d16d677f9892719808 |
| resistance-a-love-story-the-shorts-b08bttjym9 | k97b4c9ns11p01s0mcdvvzmped8fjq9w | /images/books/amazon/43-B08BTTJYM9.jpg | 4505250ce503d2e69480cfc1c395a0809002da65b0b73505dbe92a4a374c1db1 |
| unsuitable-men-b0096dlans | k97c183w5srt8ndwkw72bvf3gx8fk2js | /images/books/amazon/44-B0096DLANS.jpg | a58bcafdd10be8041ee0eb10a9f0dde386b24d95d5ac18dc7fbc4d35b3b567ad |
| four-stories-of-marriage-b07jmvjdwv | k975e9wtnc7dwcqtzcp1gw3c018fj9yv | /images/books/amazon/45-B07JMVJDWV.jpg | 16225da68359eaeb91fce3749f1ff1243c4aa06abd3cea8b45059818b16af589 |
| mother-b00r1t4uv8 | k9791mnkypdkyxcbe6531qsqcd8fkeb0 | /images/books/amazon/46-B00R1T4UV8.jpg | bb1ea28d6ef771cba274379bf81f9e7c2b3f2791d8a69e17199c059187cae003 |
| the-seduction-of-dylan-acosta-b008qnmhh2 | k9748jyh38tzktm7a5gkgebcad8fjb2q | /images/books/amazon/47-B008QNMHH2.jpg | 590d89dca3b8547e984bd0aafa11ec61eba5e4b973690007b96cb3aef2d6e286 |
| the-education-of-miri-acosta-the-acosta-series-1519101341 | k97cct0sfxgtyzcg0yb9n3fnb98fj9vr | /images/books/amazon/49-1519101341.jpg | c0b37a5d03280a251d36c4f68c04363cc8780ea8d792742aa6dbdf9fc951c689 |

## Validation and unresolved policy

- New safety suite: 9/9 pass, covering wrong deployment/site/scope, configured delivery keys, additive idempotency with nonempty browser community state, plan collision, authentic provenance, missing cover hash, catalog conflict and repeat import without audit writes.
- TypeScript: pass. Full lint: zero errors, five pre-existing warnings; owned-file lint: clean.
- Existing fixture/community/RBAC suites: 30 passed and the same two known policy failures. Unverified allowlisted email can bootstrap admin; reader tier can read an inner-tier club discussion. No policy fix is authorized or applied.
- Redesigned frontend source preservation: 7/7 pass. Earlier reviewed backend/generated API hashes below are unchanged.
- Real provider: exact dev identity, additive fixture IDs, 48 authentic public records and cover metadata verified. Browser acceptance remains separate; no real provider delivery was attempted.

Later read-only comparisons during concurrent coordinator browser testing found unchanged catalog and all non-registration fixture arrays. Two member registrations appeared: hybrid virtual (zero guests), `kd71kef2mz77g85vnxe45h5jvs8fjktc`; in-person (one guest), `kd78m87b20t34t5q5mn3n5pjgs8fkpwy`. Both are registered, making the later registration count four; original registration IDs/statuses remained intact. The report helper did not create these records. Concurrent browser changes mean whole-database snapshot equality cannot serve as a repeatability assertion.

## Coordinator browser checklist

Use CUA on the existing 3417 preview; preserve PID 97863 until the coordinator explicitly performs any required server-secret restart. Use only the synthetic accounts file above.

1. `/signin`: choose free/member/editor/admin from the private local file; confirm sign-in and sign-out/reload without exposing credential values.
2. `/read`, `/read/[slug]`: confirm the authentic catalog and representative covers across desktop/mobile, series grouping and book detail. Distinguish the original TEST book from 48 authentic titles. Check broken-image behavior separately from local hash verification.
3. `/events`: free account registers in-person fixture with one guest (two occupied seats); member then joins its waitlist with zero guests. Reload both states; cancel only these new journey registrations. On hybrid fixture exercise in-person with a guest and virtual with zero guests. Verify virtual guests and values outside 0–5 are rejected; guests are governed by existing product bounds, no fixture-only policy override. No real ticket or meeting link exists.
4. `/community`: member already joined Circle through coordinator CUA. Join each reader/inner/writers TEST journey club; create a TEST thread or reply to its named seeded prompt and reload. Free account remains ineligible. Use the preserved browser thread/reply as existing QA evidence, not new helper acceptance. Keep lower-tier thread-read policy concern separate; do not alter synthetic account tiers to mask it.
5. `/academy`: editor/admin opens named journey request, writes a clearly TEST reply while keeping status requested, then free account checks it in `/academy` and `/dashboard`. Do not schedule a real service. The two earlier requests remain available.
6. `/membership`: toggle both cadences, inspect all three TEST plans and synthetic feature lists. Confirm missing checkout configuration is handled without a payment or Stripe record creation.
7. `/dashboard`: verify persisted new registrations, clubs, request/reply and existing saved/progress state; coordinator previously confirmed original book progress at 30%. Avatar acceptance is a separate server-secret bridge gate below.

## Dev-only avatar server-secret handoff

Coordinator observed avatar POST 503 because the frontend lacks INTERNAL_API_SECRET. The authorized dev secret already exists in contracts ignored mode-0600 `.env.redesign-provider` / `.env.local`; do not invent or retrieve production credentials. For a separately authorized frontend handoff, first reverify both frontend public Convex URLs match dutiful-firefly-917 and confirm the secret source is the existing isolated provider file. The coordinator can then copy ONLY INTERNAL_API_SECRET into the frontend's existing ignored mode-0600 server environment in memory, preserving all unrelated keys, without stdout/clipboard/message/export logging and without a NEXT_PUBLIC prefix. Restart only the coordinator-owned preview process when explicitly authorized, then retry CUA avatar upload. This worker did not read the secret value, edit frontend env, restart the preview or claim avatar acceptance.

## Exact source hashes

| File | SHA-256 |
| --- | --- |
| convex/redesignJourneyFixtures.ts | aeac7d5e60165c2354559847dab2ebcd7cb05dc962e555343ae6f1f739a35611 |
| scripts/redesign-journeys.mjs | 234a726de4e55e50eaa6ce5a5050e493da6214b0852f51bfee5efa6c4b35898d |
| convex/redesignFixtures.ts (preserved) | 93de1838e445136219cc5f2580f2c0b25355f1df6159a7fed9113afa2f45b85b |
| convex/serialBootstrap.ts (preserved) | cff0935f37df24d7203ac7dd5afd9507f2a35fe473bfd6e6d8eaa1869e6ee2a9 |
| convex/content.ts (preserved) | c9b339e6ecf1679f7c062a271cd4049de55fe7924e32088dcadc83c932602428 |
| convex/_generated/api.d.ts (preserved) | 7d3a01ae504e0f40fde83c5b4c1787be9d1a8d4a5c149d7cb694ee1c43069b04 |

The final report-file hash is sent separately to the coordinator, avoiding a self-referential hash. No commit, push to Git, primary integration or production claim is made.
