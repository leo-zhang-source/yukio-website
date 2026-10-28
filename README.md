# Yukio website

雪绪与千夏的中英双语介绍网站，包含角色图鉴、十二种动作试玩、可拖动的网页伙伴、工作台截图与实际可用的下载入口。

- 网站分享入口：<https://is.gd/yukioapp>
- 网站直达地址：<https://leozhang8654.github.io/yukio-website/>
- 网站源码：<https://github.com/leozhang8654/yukio-website>
- 桌面 App 与下载：<https://github.com/leozhang8654/yukio-desktop-pet>

## 本地预览与检查

需要 Python 3 与 Node.js 24 或更新版本，无需安装 npm 依赖。

```sh
git clone https://github.com/leozhang8654/yukio-website.git
cd yukio-website
npm run dev
```

打开 <http://127.0.0.1:4173>。发布内容全部位于 `dist/`，使用相对资源路径，支持 GitHub Pages 的项目子目录。

```sh
npm run check
npm run test:physics
npm run test:demo
```

## 发布与维护

对外分享入口为 <https://is.gd/yukioapp>，含 Yukio 名称且不含个人账号名。它由 is.gd 跳转到本网站，打开后地址栏显示实际 GitHub Pages 地址。历史根地址入口继续保留；网站内容仍在本仓库统一发布。

GitHub Pages 使用 `.github/workflows/pages.yml` 发布 `dist/`。推送到 `main` 后，GitHub Actions 会先校验 JavaScript、资源引用、拖拽物理和动作轮播，再发布同一提交的静态文件。失败时查看仓库 Actions；需要恢复时，回退对应源码提交并重新运行工作流。

当前 Mac 下载为 Apple 芯片 v5.3 与保留的 Intel v0.4.6。**Windows 安装包和便携包已暂时下架**，网站仅展示暂停状态及 GitHub 发布状态入口，不提供失效链接。下载状态核对日期：2026-10-28。网站测试不代表桌面 App 已通过独立用户环境验收。

本仓库从已核对的网站快照 `35afad0` 建立，保留原有角色资源、交互和来源记录。`.openai/hosting.json` 保留历史 Sites 项目标识；当前账号无法管理该旧项目，本仓库的工作流只发布 GitHub Pages，不会修改旧 Sites 地址。不要将私钥、API 密钥、个人聊天或 NAS 的 `@eaDir` 缩略图加入仓库。

## Design and interaction notes

A responsive Chinese / English character website for [Yukio](https://github.com/leozhang8654/yukio-desktop-pet). The current design uses warm ivory, navy, sky blue and butter yellow, with a toy-style character lineup, original animation, a random-pose button, a draggable companion, workbench screenshots and platform-specific downloads. The user explicitly requested public access for this revision.

Run `npm run dev`, then open http://127.0.0.1:4173. No npm dependencies or build step are needed. The deployable website is `dist/`.

Run `npm run check` to validate JavaScript and local asset references. The `scripts/` directory records the pinned upstream commit and asset provenance. Downloads were rechecked on 2026-10-28: Apple silicon Mac uses v5.3, Intel Mac retains v0.4.6, and Windows downloads are temporarily withdrawn.

The animation gallery is a browser demo of the repository's original sprite sheets, played with the original frame sequence and durations. It does not connect to visitors' local AI sessions. The Mac workbench screenshots use the project's preset demo data.

The homepage character can be carried across the entire browser viewport. The original held artwork is rendered in a body-level fixed layer, so the hero does not clip it. A small 2-D rigid-body solver applies a spring force at the grip: the same force moves the center of mass and turns the body, while gravity and damping produce lag, overshoot and a gradual settling swing. Pointer position and velocity come from the same time-stamped path. On release, local support and friction dissipate the existing momentum near the drop point; there is no automatic return to the hero. The original animated canvas then sits at that position, with no duplicate character, and can be picked up again without shrinking. Viewport contacts account for the rotated corners and exchange linear and angular momentum. This is whole-artwork rigid-body motion, not skeletal or cloth simulation. Pointer cancellation and losing focus place her locally. The small home button and Escape restore the original homepage position. Reduced-motion mode keeps direct upright dragging and immediate local placement, and suppresses automatic animation. Physics parameters and the fixed 1/240-second integration step live in `dist/pet-physics.js`; input, placement and rendering live in `dist/pet-carry.js`.

The homepage and placed companion automatically cycle through all twelve original actions, allowing at least one complete source sequence per action. On placement the cycle starts with the original seated idle pose. The companion stays at the same viewport location while scrolling and changing actions. The pause/resume control remembers its state locally; automatic cycling stops while carried, offscreen or in a hidden tab, and resumes when appropriate. `dist/pet-demo.js` defines the order and timing. Run `npm run test:physics` and `npm run test:demo` for force, inertia, collision, local placement, action coverage and sequence-duration checks.

The earlier illustrated sakura backdrop and its prompt are retained in the source history, but the current design presents the original character art on a simple toy-style stage. Fredoka and a subset of ZCOOL KuaiLe are self-hosted, with their OFL licenses in `dist/assets/`.

Reference websites were inspected live: [Jellycat](https://jellycat.com/), [POP MART](https://www.popmart.com/us) and [SMISKI](https://smiski.com/e/). `DESIGN.md` records what informed this design. Their pictures, characters, logos and storefront mechanics are not reused. This remains a website for the actual desktop application, with actual release downloads.

The active visual theme is `dist/buddy.css`; locale-specific brand copy is in `dist/brand-copy.js`. Run `node scripts/sync-copy.mjs` after changing the brand copy to also update the initial Chinese HTML. The earlier pink theme remains in `dist/cute.css` for reference and is not loaded by the current page.

The website is silent at the user's explicit request. Audio playback, sound controls and all sound files have been removed. Dragging, local placement, the twelve-action demo and visual interaction feedback remain available.

The latest swing tuning uses more angular damping, a soft angular stop around 14 degrees and a safety cap around 22 degrees, retaining the same force-driven inertia with smaller motion.

Historical Sites identity is retained in `.openai/hosting.json`; the active publication uses GitHub Pages. This site is separate from the desktop app checkout. Source and artwork attribution remain with the original Yukio project. No license is inferred from a public GitHub repository.
