# 场景素材记录

## 开场青少年红军概念图（2026-09-03）

- 最终素材：public/assets/opening-concept-red-youth.png；只用于开场动画第一屏，不替换首页 hero。
- 工具：内置 ImageGen，先生成再精修。
- 参考输入：public/assets/story-hada.jpg 用于人物举起手臂的安静仪式感；public/assets/story-red-army.jpg 用于七根火柴、金色鱼钩、红军行进剪影和长征路叙事。
- 生成原文件：C:/Users/淮青/.codex/generated_images/01a061e8-592c-7311-8ecb-da37e5d55450/call_D0ABVm2ElbV2pFn5zddqc8J8.png。
- 精修原文件：C:/Users/淮青/.codex/generated_images/01a061e8-592c-7311-8ecb-da37e5d55450/call_K79ziXt3iAJWtqR3BrWqbNKe.png。
- 处理说明：用户确认第二版。火柴由初版的大型火炬感缩小为接近手指尺度的小火柴，保持七根且保持点燃状态。人物保持中性青少年红军形象，背景保持壁画、鱼钩、长征路和远景红军剪影。

## 首页参考图净底（2026-09-03）

- 最终素材：public/assets/hero-hada-reference-clean.png；保留旧 hero-hada.jpg，不覆盖原壁画。
- 工具：内置 ImageGen，precise-object-edit 局部编辑。
- 编辑目标：C:/Users/淮青/AppData/Local/Temp/codex-clipboard-859fcde5-ec20-495a-8f1c-8f0132669019.png。
- 生成原文件：C:/Users/淮青/.codex/generated_images/01a061e8-592c-7311-8ecb-da37e5d55450/exec-b7dc80d9-62c6-4a9f-a4b8-aba6bb81f16c.png。
- 处理说明：参考图片是已经合成的扁平图，无法从图中测出原始图层 alpha；以用户标注为 0.30 的参考观感为准保留明暗，净底按不透明背景显示，不再乘以 0.3。原图上下渐隐、红底与纹样均在底图内。所有现有网站文字及按钮由原 HTML/CSS 叠加，未改写正文或把标题栅格化。
- 最终提示词：Use case: precise-object-edit. Edit target: the supplied red and gold Chinese website hero reference. Create a CLEAN BACKGROUND PLATE for this existing website, NOT a redesign. Preserve the original canvas aspect ratio ~1.405:1, exact composition, mural placement, woman with raised hada, her face and body, mountains, incense vessel, prayer flags, cream cloud engravings, red paper texture and bottom curling ornamentation. Preserve the SAME brightness, hue, contrast and mural visibility as the supplied image; its 30% visibility look is already composited, do not dim it again. Remove ALL overlaid website UI: the six navigation labels and underline at top; large gold brand title; slogan; both outlined buttons/icons/text; all small far-left layer annotation labels, horizontal leader lines and dots, and their vertical panel edge. Seamlessly inpaint only those removed UI areas with the immediately surrounding red textured background. Keep actual Tibetan markings INSIDE the mural unchanged. No new objects, typography, borders or visual changes. Especially keep the decorative bottom left vines/clouds and lower gold cloud strokes. No text anywhere except inherent mural markings. Do not shift, crop, zoom, recolor, add dark vignettes, or invent a new artwork. This is a faithful background extraction from the approved reference, to support live editable HTML text.
- 检查：已查看生成图，标注和栅格界面文字已清除，人物、哈达、雪山、香炉与底部云纹仍在。生成编辑可能有细微纹理差异，不宣称逐像素一致。浏览器最终合成验收待完成。

## 开场青少年红军概念图 v2（2026-09-03）

- 最终素材：public/assets/opening-concept-red-youth-v2.png；用于 IntroOverlay 开场静态画芯与顶端节点。
- 工具：内置 ImageGen，按用户确认方案重新生成。
- 参考输入：opening-concept-red-youth.png 作为中央小红军画芯；用户提供的 Son Daven 截图作为深色金字与纵向半调编辑风格参考；四张主题壁画作为外圈空心背景板的同源素材。
- 生成原文件：C:/Users/淮青/.codex/generated_images/01a061e8-592c-7311-8ecb-da37e5d55450/call_418cRO9qTyVZo2PPnLnEH0A0.png。
- 处理说明：中央保留单独矩形画芯，外圈不再重复放大中央图，而是重组红色革命、藏族人文器物、藏族民俗活动、若尔盖自然风光四主题。顶部文案为“红色记忆 · 藏地回响”和“一段红色记忆 / 在声光里再次被看见”，整体采用深色底、鎏金大字、纵向半调条纹与复古壁画肌理。

## 三段式电影开场（2026-09-03）

- 当前实现：IntroOverlay 保留独立全屏覆盖层，但已废弃 Three.js 螺旋长征路，改为“封面海报 + 若尔盖自然文化故事微电影 + 横屏产品放映”三段式体验。
- 封面交互：opening-concept-red-youth-v2.png 作为电影封面，按钮文案为“点击观看文化故事”，已移出画芯放在页面左下角；右上角保留“跳过动画”。
- 故事微电影：opening-story-zoige-blue.png 作为 16:9 蓝白若尔盖水墨底图，前半段为浅纸底、蓝色远山、湿地河流、飞鹤与蓝白白象塔。白象塔按用户反馈避开鹤群竖直压线，放在偏左下的河湾视觉落点；后半段通过火柴暖金光与暗赭红叠层过渡回全站红金调性。
- 故事字幕：删除“若尔盖自然开场”小标注，“风从湿地醒来”作为左上小片名，动态字幕移到底部中央。
- 底板节奏：封面页与蓝白故事段统一改为米白纸底，叠加轻纸纹、低透明胶片颗粒、淡金胶片孔与细线；产品放映段再切回暗赭红与鎏金影院底。此调整只作用于开场覆盖层，不改网站首页或业务页面。
- 放映内容：依次展示 scene-projector.png、scene-display-frame.png、scene-blind-box-mural.png 三张产品场景静帧，配合 GSAP 时间轴、胶片颗粒、暗角、上下黑边、光束扫过和底部三段章节按钮。
- 结束逻辑：播放完毕或跳过后移除覆盖层，释放 body 滚动，并回到首页顶部。原网站首页、产品页、AI 视频页、文化故事页内容结构不改。
- 新增故事底图生成原文件：C:/Users/淮青/.codex/generated_images/01a061e8-592c-7311-8ecb-da37e5d55450/call_j5jq7jrMTSroUnAztt61lr3l.png。
- 白象塔迭代生成原文件：C:/Users/淮青/.codex/generated_images/01a061e8-592c-7311-8ecb-da37e5d55450/call_Efe76En0IVTrQt34d4pEddYZ.png、C:/Users/淮青/.codex/generated_images/01a061e8-592c-7311-8ecb-da37e5d55450/call_Qea2ZqxSngiC5zHxxQffepgP.png、C:/Users/淮青/.codex/generated_images/01a061e8-592c-7311-8ecb-da37e5d55450/call_9amHH2G6cCJhhLIiEEDwoetN.png、C:/Users/淮青/.codex/generated_images/01a061e8-592c-7311-8ecb-da37e5d55450/call_sMo4pQjglAkA1p8U0x9ioODk.png。

## 白底同源纹样

- 不生成外部图标或新画风；直接引用四张原始壁画，以 CSS 背景窗口裁取鱼钩、藏香器具、马鞍与飞鹤区域，并做局部径向边缘淡出。
- 装饰位于标题空隙或文字区右上留白，透明度 0.15–0.28；无点击行为，对辅助技术隐藏。文字与右侧主图不替换。

## 盲盒胶片内容修正

- 最终素材：public/assets/scene-blind-box-mural.png。
- 工具：内置 ImageGen，局部编辑模式。
- 输入：scene-blind-box.png 为编辑目标；story-cranes.jpg 与 story-hada.jpg 为胶片内画面来源。
- 最终提示词：仅把两张胶片内部的写实风景和建筑替换为指定黑颈鹤黄河壁画与人物哈达壁画，匹配卡片透视与光照。保持盒体、半开盒盖、五星火漆、棉绳、印章、卡片、布料、构图、相机、光线、色调和留白不变。不新增文字、二维码、物件或界面。
- 检查：两张胶片现为壁画画风，已确认的拆封构图保持；旧版本保留，未覆盖原文件。
