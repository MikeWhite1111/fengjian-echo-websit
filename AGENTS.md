# Prototype Instructions

Run the local server yourself and open the preview in the browser available to this environment. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

Build app UI in `src/`. Keep `.openai/hosting.json`, `worker/index.js`, `scripts/prepare-sites-build.mjs`, and `tests/sites-worker.test.mjs` intact so the same local prototype can be handed to Sites. Before a Sites handoff, run `npm run build` and `npm run test:sites`; the build must leave `dist/client/index.html`, `dist/server/index.js`, and `dist/.openai/hosting.json`.

## Locked product and design decisions

- Opening cover and story use cream paper surroundings. Static blue-white ornaments come from opening-story-zoige-blue.png: lower-left cloud curls, upper-right prayer banners, lower-right river bends. Cover opacity 32–35%, story 25–28%, outer wash approximately 10–16%; products fade ornaments out over 600ms. Keep ornaments outside artwork and controls; mobile retains two corners only. Products retain wine red. Never overlay red or tint the youth cover image. Story title 风从湿地醒来 uses locally bundled Zhi Mang Xing and the locked gold gradient. CTA stays outside the cover. Preview stays on loopback port 4174 with strictPort; desktop launcher starts on demand, no autostart or network/proxy changes.

- This is a new website built from scratch for “封缄·回响｜声光胶片”.
- Keep the navigation in this exact order: 首页、关于项目、产品展示、AI视频、文化故事、加入我们.
- Homepage hero uses the Tibetan woman holding a hada mural, title left aligned, mural visibility 0.30.
- Cultural stories use the selected light editorial split layout: text on the left, cropped mural on the right. Theme two must preserve the woman holding the hada.
- Products are the supplied projector adapter, portable illuminated film display frame, and fire-lacquer sealed blind box; use their real supplied images.
- Locked palette: #C8161D, #A81218, #8B0000, #FAFAFA, #FFF1F0, #FFE599, #D4AF37, #8B6914, #1A1A1A, #4A4A4A, #F5E9D6.
- Avoid black-red horror styling, heavy shadows, neon, particles, flashing effects, cheap cartoons, and full-page untreated mural images.
- Homepage follows the selected hada hero composition with a single-line left-aligned “封缄·回响｜声光胶片” title and 0.30 mural visibility.
- Product scenes stay on a deep wine-red immersive background. Projector beam travels lower-left to upper-right; the display frame uses a three-quarter museum presentation; the blind box keeps the partly-open unsealing moment.
- Product tab labels are permanently fixed and identical in every state: 胶片投影转接装置、便携式胶片发光展示框、火漆封缄盲盒.
- AI video uses four equal-width film cards, one for each original mural, with complete subjects preserved.
- Latest hero source of truth: codex-clipboard-859fcde5-ec20-495a-8f1c-8f0132669019.png. Preserve that reference's visible mural treatment (labelled 0.30), composition and artwork. Remove design annotation labels and leaders only from the visual; keep current live website typography, copy and buttons. The clean background plate has the visual treatment baked in: never multiply it by another 0.3 opacity or apply another dark overlay.
- About and cultural-story white reading areas receive small, low-opacity, theme-specific details taken directly from the four original murals, not unrelated icons or invented ornament styles. Preserve left-copy/right-art structure and all existing prose.
- Cultural stories support four theme anchors, active-theme indication, full-mural modal viewing, previous/next artwork and keyboard controls. Retain accessible focus return, Escape dismissal and reduced-motion support. These are artwork interactions, not fabricated video playback.
- Opening intro is a separate React overlay, not a replacement for the original homepage. It uses the confirmed youth Red Army concept art only for the cinematic entry image; the homepage still uses the hada mural.
- Confirmed opening concept art: a neutral teenage Red Army youth, calm and determined, holding seven small lit matches at finger scale. Keep the left golden fishhook and upper-right marching silhouettes. Do not enlarge the matches into torches.
- Opening animation plays on every visit, locks body scroll while visible, provides a top-right “跳过动画” control, then releases native scrolling and reveals the original homepage.
- Current opening animation direction replaces the old Three.js spiral Long March road. Use a two-step film experience instead: first show the youth Red Army poster cover with “点击观看文化故事”, then play a horizontal cinematic three-product reel using existing scene stills and GSAP-only timing.
