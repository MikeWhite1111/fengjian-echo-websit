import { useEffect, useRef, useState } from "react";
import { IntroOverlay } from "./IntroOverlay.jsx";

const navigation = [
  ["home", "首页"],
  ["about", "关于项目"],
  ["products", "产品展示"],
  ["ai-video", "AI视频"],
  ["stories", "文化故事"],
  ["join", "加入我们"],
];

const products = [
  {
    name: "胶片投影转接装置",
    tabLabel: "胶片投影转接装置",
    statement: "让一张胶片，拥有被放大的叙事空间",
    image: "/assets/scene-projector.png",
    alt: "胶片投影转接装置向右上方投射若尔盖自然风光壁画",
    scene: "projector",
    description: "通过锥形光路适配胶片画幅，兼顾投影、展示与个性化外观，让微小画面进入更大的观看场景。",
    features: ["锥形光路", "胶片适配", "外观可定制"],
  },
  {
    name: "便携式胶片发光展示框",
    tabLabel: "便携式胶片发光展示框",
    statement: "把胶片从收藏夹，带到日常光线里",
    image: "/assets/scene-display-frame.png",
    alt: "略带透视的便携式胶片发光展示框点亮红色革命壁画",
    scene: "display-frame",
    description: "80 × 60 mm便携尺寸，配合多层匀光与保护结构，让胶片在不同环境中获得均匀柔和的观看体验。",
    features: ["便携展示", "均匀发光", "多层防护"],
  },
  {
    name: "火漆封缄主题盲盒",
    tabLabel: "火漆封缄盲盒",
    statement: "拆开的不只是礼物，也是一段文化记忆",
    image: "/assets/scene-blind-box-mural.png",
    alt: "火漆封缄盲盒处于拆封瞬间并露出胶片与故事卡",
    scene: "blind-box",
    description: "牛皮纸信封、火漆封印与随机胶片共同构成开封仪式，连接实体收藏、主题故事卡与二维码内容。",
    features: ["火漆封缄", "随机胶片", "数字故事"],
  },
];

const stories = [
  {
    theme: "主题一",
    title: "红色革命文化",
    topics: "七根火柴，金色的鱼钩，红军过草地",
    body: "从一根被珍藏的火柴、一枚弯曲的鱼钩，到草地上延伸的脚印，微小物件承载着长征途中朴素而坚定的信念。",
    image: "/assets/story-red-army.jpg",
    alt: "七根火柴、金色鱼钩与红军过草地题材壁画",
    position: "center center",
  },
  {
    theme: "主题二",
    title: "藏族人文器物文化",
    topics: "藏香，哈达，经幡，玛尼石堆",
    body: "人物手中的哈达在风里舒展，把祝福、礼仪与高原生活连接起来。藏香、经幡与玛尼石让记忆落在日常器物之中。",
    image: "/assets/story-hada.jpg",
    alt: "藏族人物手持哈达，周围有经幡、玛尼石与藏香的壁画",
    position: "38% center",
  },
  {
    theme: "主题三",
    title: "藏族民俗活动文化",
    topics: "度炯节，秀吧疗法，河曲马，马上竞技",
    body: "从节庆仪式、藏医药油到河曲马驯育和马上竞技，民俗不是静止的标本，而是一代代人在高原生活中延续的智慧。",
    image: "/assets/story-horses.jpg",
    alt: "河曲马奔腾与马鞍纹样壁画",
    position: "center center",
  },
  {
    theme: "主题四",
    title: "若尔盖自然风光文化",
    topics: "黑颈鹤，草原四季，九曲黄河第一湾",
    body: "黑颈鹤掠过湿地，九曲黄河在草原上缓缓展开。自然不只是背景，也是若尔盖文化记忆持续生长的根系。",
    image: "/assets/story-cranes.jpg",
    alt: "黑颈鹤飞越九曲黄河与草原湿地壁画",
    position: "center center",
  },
];

function Brand() {
  return (
    <a className="brand" href="#home" aria-label="封缄回响首页">
      <strong>封缄·回响</strong>
      <span>声光胶片</span>
    </a>
  );
}

export function App() {
  const [activeSection, setActiveSection] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeProduct, setActiveProduct] = useState(0);
  const [imageState, setImageState] = useState("loading");
  const [submitted, setSubmitted] = useState(false);
  const [activeStory, setActiveStory] = useState(0);
  const [viewingStory, setViewingStory] = useState(null);
  const [videoOpen, setVideoOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const storyDialog = useRef(null);
  const videoDialog = useRef(null);
  const storyTrigger = useRef(null);
  const productTabs = useRef([]);
  const isStoryViewerOpen = viewingStory !== null;

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) setActiveStory(Number(visible.target.dataset.storyIndex));
    }, { rootMargin: "-20% 0px -40%", threshold: [0, 0.25, 0.5] });
    document.querySelectorAll("[data-story-index]").forEach((row) => observer.observe(row));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isStoryViewerOpen) return;
    const dialog = storyDialog.current;
    const previousOverflow = document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
      storyTrigger.current?.focus({ preventScroll: true });
    };
  }, [isStoryViewerOpen]);

  useEffect(() => {
    const dialog = videoDialog.current;
    if (!dialog) return;
    if (videoOpen) dialog.showModal();
    else dialog.close();
  }, [videoOpen]);

  function openStory(index, event) {
    storyTrigger.current = event.currentTarget;
    setViewingStory(index);
  }

  function moveStory(direction) {
    setViewingStory((index) => index === null ? null : (index + direction + stories.length) % stories.length);
  }

  function handleStoryKey(event) {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    moveStory(event.key === "ArrowRight" ? 1 : -1);
  }

  function visitStory(index) {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const row = document.getElementById(`story-${index + 1}`);
    row?.scrollIntoView({ behavior: reducedMotion ? "instant" : "smooth", block: "start" });
    row?.focus({ preventScroll: true });
    setActiveStory(index);
  }

  useEffect(() => {
    const sections = navigation.map(([id]) => document.getElementById(id)).filter(Boolean);
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveSection(visible.target.id);
      },
      { rootMargin: "-24% 0px -62%", threshold: 0 },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const hero = document.getElementById("home");
    if (!hero) return;
    const observer = new IntersectionObserver(([entry]) => {
      setIsScrolled(entry.intersectionRatio < 0.92);
    }, { threshold: [0.92, 1] });
    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const targets = document.querySelectorAll(".stacked-heading, .product-selector, .film-preview button, .story-row, .join-layout, .about-copy, .principle-row article");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) {
      targets.forEach((target) => target.classList.add("reveal-in"));
      return;
    }
    targets.forEach((target, index) => {
      target.classList.add("reveal-item");
      target.style.setProperty("--reveal-delay", `${Math.min(index % 6, 5) * 0.1}s`);
    });
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("reveal-in");
        observer.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -12%", threshold: 0.16 });
    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, []);

  function selectProduct(index) {
    if (index === activeProduct && imageState !== "error") return;
    setImageState("loading");
    setActiveProduct(index);
  }

  function handleProductKey(event, index) {
    const nextIndex = {
      ArrowRight: (index + 1) % products.length,
      ArrowLeft: (index + products.length - 1) % products.length,
      Home: 0,
      End: products.length - 1,
    }[event.key];
    if (nextIndex === undefined) return;
    event.preventDefault();
    selectProduct(nextIndex);
    productTabs.current[nextIndex]?.focus({ preventScroll: true });
  }

  function submitForm(event) {
    event.preventDefault();
    setSubmitted(true);
  }

  const product = products[activeProduct];

  return (
    <>
      <IntroOverlay />
      <header className={[
        "site-header",
        ["home", "products", "ai-video", "join"].includes(activeSection) ? "on-red" : "on-light",
        isScrolled ? "is-scrolled" : "",
      ].filter(Boolean).join(" ")}>
        <div className="header-inner">
          <Brand />
          <button
            className="menu-toggle"
            type="button"
            aria-controls="main-navigation"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? "关闭" : "菜单"}
          </button>
          <nav id="main-navigation" className={menuOpen ? "open" : ""} aria-label="主导航">
            {navigation.map(([id, label]) => (
              <a
                href={`#${id}`}
                className={activeSection === id ? "active" : ""}
                key={id}
                onClick={() => setMenuOpen(false)}
              >
                {label}
              </a>
            ))}
          </nav>
        </div>
      </header>

      <main>
        <section id="home" className="hero" aria-labelledby="hero-title">
          {/* This clean plate preserves the reference's already-composited 0.30 look.
              Do not apply opacity: 0.3 or a second red overlay to the entire plate. */}
          <div className="hero-mural" aria-hidden="true" />
          <div className="shell hero-content">
            <h1 id="hero-title">
              封缄·回响
              <span aria-hidden="true">｜</span>
              声光胶片
            </h1>
            <p className="hero-slogan">让红色故事和藏族记忆被反复看见、听见、分享</p>
            <div className="hero-actions">
              <a className="button button-gold" href="#products">探索产品</a>
              <a className="button button-outline-light" href="#stories">阅读文化故事</a>
            </div>
          </div>
        </section>

        <section id="about" className="section about" aria-labelledby="about-title">
          <div className="shell about-layout">
            <div className="about-title-wrap">
              <p className="section-kicker">关于项目</p>
              <h2 id="about-title">把文化记忆，做成能带走的光</h2>
              <div className="about-motifs" aria-hidden="true">
                <span className="mural-detail motif-0" />
                <span className="mural-detail motif-1" />
                <span className="mural-detail motif-2" />
                <span className="mural-detail motif-3" />
              </div>
            </div>
            <div className="about-copy">
              <p className="lead">“声光胶片”以实体胶片、发光展示、投影转接与二维码内容为载体，连接收藏、体验与持续传播。</p>
              <div className="principle-row">
                <article>
                  <h3>一胶一码</h3>
                  <p>每张胶片连接一段多语种内容，让实体文创成为轻量的文化入口。</p>
                </article>
                <article>
                  <h3>一次收藏，反复观看</h3>
                  <p>胶片保存画面，声光唤起故事，让旅行记忆在离开景区后继续流动。</p>
                </article>
              </div>
            </div>
          </div>
        </section>

        <section id="products" className="section products" aria-labelledby="products-title">
          <div className="shell">
            <div className="stacked-heading">
              <p className="section-kicker">产品展示</p>
              <h2 id="products-title">三种产品，三种观看记忆的方式</h2>
              <p>真实产品结构与文化视觉并置，既是功能载体，也是可以长期留存的纪念物。</p>
            </div>

            <div className="product-selector">
              <div className="product-tabs" role="tablist" aria-label="产品选择">
                {products.map((item, index) => (
                  <button
                    type="button"
                    role="tab"
                    id={`product-tab-${index}`}
                    aria-controls="product-panel"
                    aria-selected={index === activeProduct}
                    tabIndex={index === activeProduct ? 0 : -1}
                    className={index === activeProduct ? "selected" : ""}
                    onClick={() => selectProduct(index)}
                    onKeyDown={(event) => handleProductKey(event, index)}
                    ref={(element) => { productTabs.current[index] = element; }}
                    key={item.name}
                  >
                    {item.tabLabel}
                  </button>
                ))}
              </div>

              <article
                id="product-panel"
                className={`product-stage scene-${product.scene}`}
                role="tabpanel"
                aria-labelledby={`product-tab-${activeProduct}`}
                aria-live="polite"
              >
                <div className={`product-visual ${imageState}`}>
                  {imageState === "loading" && <div className="image-skeleton" aria-label="产品图片加载中" />}
                  {imageState === "error" ? (
                    <div className="image-error" role="status">产品图片暂时无法显示，请切换产品后重试。</div>
                  ) : (
                    <img
                      key={product.image}
                      src={product.image}
                      alt={product.alt}
                      onLoad={() => setImageState("ready")}
                      onError={() => setImageState("error")}
                    />
                  )}
                </div>
                <div className="product-copy">
                  <h3>{product.tabLabel}</h3>
                  <strong>{product.statement}</strong>
                  <p>{product.description}</p>
                </div>
                <div className="product-details">
                  <ul aria-label="产品特点">
                    {product.features.map((feature) => <li key={feature}>{feature}</li>)}
                  </ul>
                  <a className="text-link" href="#join">咨询合作与定制</a>
                </div>
              </article>
            </div>
          </div>
        </section>

        <section id="ai-video" className="section ai-video" aria-labelledby="video-title">
          <div className="shell video-layout">
            <div className="video-copy">
              <p className="section-kicker">AI视频</p>
              <h2 id="video-title">从一帧胶片，到一段会讲述的记忆</h2>
              <p>扫描胶片二维码，静态画面延展为中、英、藏多语种动画。历史叙事、非遗器物与自然风光，在声音和时间中重新被看见。</p>
              <button className="button button-red" type="button" onClick={() => setVideoOpen(true)}>观看 AI 视频</button>
            </div>
            <div className="film-preview">
              {stories.map((story, index) => (
                <button
                  type="button"
                  key={story.title}
                  onClick={() => visitStory(index)}
                >
                  <img className="film-ambient" src={story.image} alt="" aria-hidden="true" loading="lazy" />
                  <img className="film-art" src={story.image} alt={story.alt} loading="lazy" />
                  <span>{story.title}</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        <section id="stories" className="section stories" aria-labelledby="stories-title">
          <div className="shell stacked-heading stories-heading">
            <p className="section-kicker">文化故事</p>
            <h2 id="stories-title">四条线索，走进若尔盖</h2>
            <p>先让文字被读懂，再让画面慢慢展开。四个主题共享同一套复古壁画语言。</p>
          </div>
          <div className="story-navigation" role="navigation" aria-label="文化故事主题导航">
            <div className="shell story-navigation-inner">
              {stories.map((story, index) => (
                <a href={`#story-${index + 1}`} key={story.title}
                  aria-current={activeStory === index ? "location" : undefined}
                  onClick={() => setActiveStory(index)}>
                  <span>{story.theme}</span>{story.title}
                </a>
              ))}
            </div>
          </div>
          <div className="story-list">
            {stories.map((story, index) => (
              <article id={`story-${index + 1}`} data-story-index={index} tabIndex={-1}
                className="story-row" key={story.title} aria-labelledby={`story-title-${index}`}>
                <div className="story-copy">
                  <i className={`mural-detail story-motif motif-${index}`} aria-hidden="true" />
                  <span>{story.theme}</span>
                  <h3 id={`story-title-${index}`}>{story.title}</h3>
                  <strong>{story.topics}</strong>
                  <p>{story.body}</p>
                  <button className="text-link" type="button" onClick={() => setVideoOpen(true)}>观看相关 AI 视频</button>
                </div>
                <button type="button" className="story-visual" aria-label={`放大查看${story.title}壁画`}
                  aria-haspopup="dialog" onClick={(event) => openStory(index, event)}>
                  <img src={story.image} alt={story.alt} loading="lazy" style={{ objectPosition: story.position }} />
                  <span className="story-view-label">放大查看完整壁画</span>
                </button>
              </article>
            ))}
          </div>
        </section>

        <section id="join" className="section join" aria-labelledby="join-title">
          <div className="shell join-layout">
            <div className="join-copy">
              <p className="section-kicker">加入我们</p>
              <h2 id="join-title">一起让这些故事，被更多人带走</h2>
              <p>欢迎景区、非遗工坊、学校、文化机构与设计伙伴，共同开发内容、产品与体验场景。</p>
              <div className="join-directions">
                <span>景区零售</span>
                <span>联名产品</span>
                <span>研学课程</span>
                <span>文化数字化</span>
              </div>
            </div>

            {submitted ? (
              <div className="form-success" role="status">
                <p>已收到</p>
                <h3>谢谢你的关注</h3>
                <span>这是概念站的演示提交状态，正式上线时可接入真实邮件或表单服务。</span>
                <button type="button" className="text-link" onClick={() => setSubmitted(false)}>返回填写</button>
              </div>
            ) : (
              <form onSubmit={submitForm}>
                <label>
                  姓名或机构
                  <input name="name" required placeholder="请输入名称" />
                </label>
                <label>
                  联系方式
                  <input name="contact" required placeholder="手机、邮箱或微信" />
                </label>
                <label>
                  合作方向
                  <select name="type" defaultValue="" required>
                    <option value="" disabled>请选择合作方向</option>
                    <option>景区与渠道合作</option>
                    <option>文化内容共创</option>
                    <option>产品定制与联名</option>
                    <option>研学与公益项目</option>
                  </select>
                </label>
                <label>
                  留言
                  <textarea name="message" rows="4" placeholder="简单介绍你的想法" />
                </label>
                <button className="button button-red" type="submit">提交合作意向</button>
              </form>
            )}
          </div>
        </section>
      </main>

      <dialog className="story-dialog" ref={storyDialog} aria-labelledby="story-dialog-title"
        onCancel={(event) => { event.preventDefault(); setViewingStory(null); }}
        onClose={() => setViewingStory(null)} onKeyDown={handleStoryKey}
        onClick={(event) => { if (event.target === event.currentTarget) setViewingStory(null); }}>
        {isStoryViewerOpen && <div className="story-dialog-inner">
          <div className="story-dialog-header">
            <div aria-live="polite" aria-atomic="true">
              <p className="section-kicker">{stories[viewingStory].theme} · {viewingStory + 1} / 4</p>
              <h2 id="story-dialog-title">{stories[viewingStory].title}</h2>
            </div>
            <button type="button" className="story-close" onClick={() => setViewingStory(null)} autoFocus>关闭</button>
          </div>
          <img className="story-dialog-art" src={stories[viewingStory].image} alt={stories[viewingStory].alt} />
          <div className="story-dialog-footer">
            <button type="button" onClick={() => moveStory(-1)}>上一幅</button>
            <p>{stories[viewingStory].topics}<small>左右方向键切换 · Esc 关闭</small></p>
            <button type="button" onClick={() => moveStory(1)}>下一幅</button>
          </div>
        </div>}
      </dialog>

      <dialog className="story-dialog video-choice-dialog" ref={videoDialog} aria-labelledby="video-choice-title"
        onCancel={(event) => { event.preventDefault(); setVideoOpen(false); }}
        onClose={() => setVideoOpen(false)} onClick={(event) => { if (event.target === event.currentTarget) setVideoOpen(false); }}>
        <div className="story-dialog-inner">
          <div className="story-dialog-header">
            <div>
              <p className="section-kicker">AI 视频</p>
              <h2 id="video-choice-title">选择观看版本</h2>
            </div>
            <button type="button" className="story-close" onClick={() => setVideoOpen(false)} autoFocus>关闭</button>
          </div>
          <div className="video-options">
            <a className="button button-gold" href="/assets/ai-video-mandarin.mp4" target="_blank" rel="noreferrer">普通话版</a>
            <a className="button button-outline-light" href="/assets/ai-video-sichuan.mp4" target="_blank" rel="noreferrer">四川话版</a>
          </div>
        </div>
      </dialog>

      <footer>
        <div className="shell footer-layout">
          <Brand />
          <p>让红色故事和藏族记忆被反复看见、听见、分享</p>
          <a href="#home">回到顶部</a>
        </div>
      </footer>
    </>
  );
}
