import { useEffect, useRef, useState } from "react";

const storyBeats = [
  "鹤影掠过若尔盖的清晨",
  "九曲河水把草地记忆缓缓展开",
  "一簇火光，让故事回到声光之间",
];

const filmScenes = [
  {
    title: "胶片投影转接装置",
    text: "让一张胶片，拥有被放大的叙事空间",
    image: "/assets/scene-projector.png",
    tone: "projector",
  },
  {
    title: "便携式胶片发光展示框",
    text: "把胶片从收藏夹，带到日常光线里",
    image: "/assets/scene-display-frame.png",
    tone: "frame",
  },
  {
    title: "火漆封缄盲盒",
    text: "拆开的不只是礼物，也是一段文化记忆",
    image: "/assets/scene-blind-box-mural.png",
    tone: "blind-box",
  },
];

export function IntroOverlay() {
  const [phase, setPhase] = useState("cover");
  const [activeBeat, setActiveBeat] = useState(0);
  const [activeScene, setActiveScene] = useState(0);
  const overlayRef = useRef(null);
  const storyRef = useRef(null);
  const stageRef = useRef(null);
  const timelineRef = useRef(null);
  const gsapRef = useRef(null);
  const previousOverflowRef = useRef("");
  const reducedMotionRef = useRef(false);

  useEffect(() => {
    previousOverflowRef.current = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    reducedMotionRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const onKeyDown = (event) => {
      if (event.key === "Escape") finish();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      timelineRef.current?.kill();
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflowRef.current;
    };
  }, []);

  const loadGsap = async () => {
    if (!gsapRef.current) {
      const module = await import("gsap");
      gsapRef.current = module.gsap;
    }
    return gsapRef.current;
  };

  const finish = async () => {
    timelineRef.current?.kill();
    timelineRef.current = null;
    document.body.style.overflow = previousOverflowRef.current;
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });

    if (!overlayRef.current) {
      setPhase("done");
      return;
    }

    const gsap = await loadGsap();
    gsap.to(overlayRef.current, {
      opacity: 0,
      duration: reducedMotionRef.current ? 0.01 : 0.62,
      ease: "power2.out",
      onComplete: () => setPhase("done"),
    });
  };

  const showScene = (index) => {
    setActiveScene(index);
  };

  const playProductsFrom = async (startIndex = 0) => {
    const gsap = await loadGsap();
    timelineRef.current?.kill();
    showScene(startIndex);
    setPhase("products");

    const timeline = gsap.timeline({ onComplete: finish });
    timelineRef.current = timeline;

    if (reducedMotionRef.current) {
      timeline.call(() => showScene(startIndex)).to({}, { duration: 0.4 });
      return;
    }

    filmScenes.slice(startIndex).forEach((_, offset) => {
      const sceneIndex = startIndex + offset;
      timeline
        .call(() => showScene(sceneIndex))
        .fromTo(
          stageRef.current,
          { "--film-flash": 0.28 },
          { "--film-flash": 0, duration: 0.45, ease: "power2.out" },
        )
        .to({}, { duration: 2.55 });
    });
  };

  const playStory = async () => {
    const gsap = await loadGsap();
    timelineRef.current?.kill();
    setPhase("story");
    setActiveBeat(0);

    const timeline = gsap.timeline({ onComplete: () => playProductsFrom(0) });
    timelineRef.current = timeline;

    if (reducedMotionRef.current) {
      timeline.to({}, { duration: 0.45 });
      return;
    }

    storyBeats.forEach((_, index) => {
      timeline
        .call(() => setActiveBeat(index))
        .fromTo(
          storyRef.current,
          { "--story-warm": index === 0 ? 0 : index * 0.18, "--story-flare": index === 2 ? 0.08 : 0 },
          {
            "--story-warm": index === 2 ? 0.72 : (index + 1) * 0.18,
            "--story-flare": index === 2 ? 0.62 : 0.12,
            duration: 3.5,
            ease: "sine.inOut",
          },
        )
        .to({}, { duration: 0.45 });
    });
  };

  const skip = (event) => {
    event.stopPropagation();
    finish();
  };

  if (phase === "done") return null;

  return (
    <section
      className={`intro-overlay ${phase}`}
      ref={overlayRef}
      aria-label="封缄回响电影式开场"
    >
      <div className="intro-grain" aria-hidden="true" />
      {/* 装饰限定在纸面边缘，画芯与按钮始终位于上层。 */}
      <div className="intro-paper-ornaments" aria-hidden="true">
        <i className="paper-cloud" />
        <i className="paper-banner" />
        <i className="paper-river" />
      </div>
      <button type="button" className="intro-skip" onClick={skip}>跳过动画</button>

      <button
        type="button"
        className="intro-cover"
        onClick={playStory}
        aria-label="点击观看文化故事"
      >
        <img src="/assets/opening-concept-red-youth-v2.png" alt="青少年红军举起七根点燃火柴的红金半调壁画开场概念图" />
      </button>

      <button type="button" className="intro-cover-cta" onClick={playStory}>
        <small>封缄·回响 | 声光胶片</small>
        <strong>点击观看文化故事</strong>
      </button>

      <div
        className="story-film"
        ref={storyRef}
        style={{ "--story-warm": 0, "--story-flare": 0 }}
        aria-live="polite"
      >
        <img src="/assets/opening-story-zoige-blue.png" alt="" />
        <div className="story-crane-drift" aria-hidden="true" />
        <div className="story-match-flare" aria-hidden="true" />
        <div className="story-film-title">
          <h2>风从湿地醒来</h2>
        </div>
        <p className="story-film-subtitle">{storyBeats[activeBeat]}</p>
      </div>

      <div
        className={`film-stage tone-${filmScenes[activeScene].tone}`}
        ref={stageRef}
        style={{ "--film-flash": 0 }}
        aria-live="polite"
      >
        <div className="film-letterbox" aria-hidden="true" />
        <div className="film-screen">
          {filmScenes.map((scene, index) => (
            <figure
              className={`film-scene ${index === activeScene ? "active" : ""}`}
              key={scene.title}
              aria-hidden={index !== activeScene}
            >
              <img src={scene.image} alt="" />
            </figure>
          ))}
          <div className="film-beam" aria-hidden="true" />
          <div className="film-caption">
            <small>{String(activeScene + 1).padStart(2, "0")} / 03</small>
            <h2>{filmScenes[activeScene].title}</h2>
            <p>{filmScenes[activeScene].text}</p>
          </div>
        </div>

        <div className="film-controls" role="tablist" aria-label="产品电影章节">
          {filmScenes.map((scene, index) => (
            <button
              type="button"
              role="tab"
              aria-selected={index === activeScene}
              className={index === activeScene ? "selected" : ""}
              key={scene.title}
              onClick={(event) => {
                event.stopPropagation();
                playProductsFrom(index);
              }}
            >
              <span>{scene.title}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
