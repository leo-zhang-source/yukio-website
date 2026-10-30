# Yukio website

Visual thesis: a cheerful Japanese collectible-character site, with warm ivory, ink navy, sky blue and butter yellow. Large original character artwork, playful toy-label typography and a few stars create a friendly, youthful feel.

Content: meet the desktop buddy → browse Yukio and Qianxia as a character lineup → try twelve real work animations or pick a random pose → assistant compatibility and real Mac workbench → thoughtful companion behavior → platform-specific downloads → FAQ.

User steering, 2026-10-27: specifically requested a very cute anime / 二次元 website and rejected an IT / technology aesthetic. The user initially selected an owner-private preview, then explicitly requested public access; publish this finished revision and open the audience to anyone with its URL.

Latest steering: the user prefers a style suitable for boys and explicitly asked for references from other doll / toy websites. This revision uses a fresh, playful collectible-toy direction. It does not label the actual product as exclusive to a gender.

References inspected live on 2026-10-27 through their official pages and browser screenshots:
- Jellycat: https://jellycat.com/ — character-led lifestyle hero, calm navigation and clear separation of editorial scenes from the product lineup.
- POP MART: https://www.popmart.com/us — a large character-series hero, IP-led navigation and a collection-first browse path.
- SMISKI: https://smiski.com/e/ — a small desktop companion presented through distinct pose series and cheerful, consistent character branding.
- Sonny Angel: https://www.sonnyangel.com/en/ — character introduction and series organization, reviewed through the official page text.

Application: preserve Yukio's original identity and artwork, bring the character lineup before the functional workbench, add an optional random pose button, replace romantic scenery with a bright ivory / navy toy-world composition, and keep actual platform downloads. Reference brands' images, logos, prices and storefront mechanics are not reused.

Interactions: an entrance sequence around the character, a hero pet that can be carried across the entire viewport using its native held artwork, a shared-force rigid-body swing and local seated placement on release, sprite animation at source timings with pause and reduced-motion support, state/character selection, a random-pose button, workbench screenshot tabs and an accessible image dialog. The website is silent at the user's explicit request.

Drag physics: pulling at the top attachment point moves and rotates the same body. Acceleration leaves the feet behind, braking lets them swing past the hand, and a direction change continues from the existing momentum. Release retains both velocities and then dissipates them with local placement friction and angular support. There is no home tether. Fixed substeps make the model independent of display refresh rate. Rotated-corner wall contacts prevent viewport clipping. This custom minimal solver follows the force/torque and soft-attachment principles described in the [Box2D body](https://box2d.org/documentation/group__body.html) and [mouse-joint](https://box2d.org/documentation/group__mouse__joint.html) documentation; Box2D is not a dependency. Original held artwork remains a single rigid body. Reduced motion uses an upright direct drag and immediate local placement.

Latest interaction steering: behave like the desktop app when placed, staying near the release point in a seated pose, and automatically demonstrate different actions there. Move the original animated button to a fixed companion container so there is only one Yukio and the source sprite player keeps working. Preserve artwork scale across repeated pickups. Cycle through all twelve source actions, giving each a full sequence before switching; pause during drag, hidden-tab time and reduced motion. A compact caption identifies the sequence as an action demo. Small pause/resume and home controls remain reachable at viewport edges.

Latest swing refinement: retain a roughly 14-degree soft stop and 22-degree safety cap.

Latest sound preference: the user cancelled website audio. Remove all playback code, sound controls and sound assets; preserve visual interaction feedback and the existing character behavior.

Evidence: public repository commit 78b6257bf4f04f3e90b13507a91025a7a4e1b0de, latest release v5.3, checked 2026-10-27. Apple silicon Mac has the current workbench; Intel and Windows retain v0.4.6. Workbench screenshots contain preset demo data. No testimonials, usage counts, or license claims.

2026-10-28 download revision: shorten the public URL label to `yukio`; preserve the collectible-toy visual theme and silence. Give the hero a direct Mac download, a compact version/size line and an other-platform link. Host the unchanged, checksum-matched Apple silicon v5.3 ZIP on the website with a small progress panel, cancellation and a save-again link. The matching download and installation page reuses the ivory/navy colors and original artwork. The previous GitHub links return 404 in this session. NAS release records show Windows distribution was intentionally withdrawn, so show that status; mark Intel Mac unavailable rather than linking a missing installer. Do not republish private backups or withdrawn Windows packages.

2026-10-29 taste revision: active stylesheet is `dist/taste.css`. Follow `.taste-skill/BRIEF.md`, the saved direction seed 1028623926 and `.taste-skill/CRITIQUE.md`. Remove decorative labels, index numbering, resting shadows, outlines and tiny copy; preserve the real logo, original characters, action canvas, drag physics, local placement, bilingual UI and unchanged installer. The hero borrows a character-poster composition with a blue field and a separate ivory action band. Gallery uses two flat fields, the live stage uses navy, the workbench shows its actual screenshot, behavior details become a readable menu, and the footer closes with the large original wordmark. No outside photographs, generated character art or invented proof were added.
