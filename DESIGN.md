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

Evidence: artwork comes from public repository commit 78b6257bf4f04f3e90b13507a91025a7a4e1b0de. Downloads rechecked 2026-10-28: Apple silicon Mac v5.3 and retained Intel Mac v0.4.6 links respond successfully. Windows installers and portable packages are temporarily withdrawn; the website shows their paused status without download links. Workbench screenshots contain preset demo data. No testimonials, usage counts, or license claims.

Publication: the reviewed website snapshot is maintained in the independent `leozhang8654/yukio-website` repository and published through GitHub Pages. The existing Sites project metadata is retained for history; it is not used by the GitHub publication workflow.
