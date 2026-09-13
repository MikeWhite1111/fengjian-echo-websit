import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import { before, test } from 'node:test';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { transformWithEsbuild } from 'vite';

let markup;
let source;
let introSource;
let stylesSource;
before(async () => {
  source = await readFile(new URL('../src/App.jsx', import.meta.url), 'utf8');
  introSource = await readFile(new URL('../src/IntroOverlay.jsx', import.meta.url), 'utf8');
  stylesSource = await readFile(new URL('../src/styles.css', import.meta.url), 'utf8');
  const appForSsr = source.replace('import { IntroOverlay } from "./IntroOverlay.jsx";', 'function IntroOverlay() { return null; }');
  const transformed = await transformWithEsbuild(appForSsr, 'App.jsx', { jsx: 'automatic' });
  const code = transformed.code.replace(/from (["'])(react(?:\/jsx-runtime)?)\1/g,
    (_, quote, name) => `from ${JSON.stringify(import.meta.resolve(name))}`);
  const { App } = await import(`data:text/javascript;base64,${Buffer.from(code).toString('base64')}`);
  markup = renderToStaticMarkup(createElement(App));
});

test('keeps the six original navigation anchors in order', () => {
  const nav = markup.match(/<nav[^>]*>(.*?)<\/nav>/s)[1];
  assert.deepEqual([...nav.matchAll(/href="#([^"]+)"[^>]*>([^<]+)<\/a>/g)]
    .map((match) => [match[1], match[2]]), [
    ['home', '首页'], ['about', '关于项目'], ['products', '产品展示'],
    ['ai-video', 'AI视频'], ['stories', '文化故事'], ['join', '加入我们'],
  ]);
});

test('renders one persistent set of three exact product tabs', () => {
  const tabs = [...markup.matchAll(/<button[^>]*role="tab"[^>]*>([^<]+)<\/button>/g)];
  assert.deepEqual(tabs.map((match) => match[1]), [
    '胶片投影转接装置', '便携式胶片发光展示框', '火漆封缄盲盒',
  ]);
  assert.equal((markup.match(/aria-selected="true"/g) || []).length, 1);
  assert.match(markup, /role="tabpanel" aria-labelledby="product-tab-0"/);
});

test('renders four video cards with one complete mural foreground each', () => {
  const section = markup.split('id="ai-video"')[1].split('id="stories"')[0];
  const sources = [...section.matchAll(/class="film-art" src="([^"]+)"/g)].map((match) => match[1]);
  assert.deepEqual(sources, [
    '/assets/story-red-army.jpg', '/assets/story-hada.jpg',
    '/assets/story-horses.jpg', '/assets/story-cranes.jpg',
  ]);
  assert.match(section, /从一帧胶片，到一段会讲述的记忆/);
});

test('all referenced scene and story files exist', async () => {
  const styles = await readFile(new URL('../src/styles.css', import.meta.url), 'utf8');
  const files = [...new Set([...`${source}\n${introSource}\n${styles}`.matchAll(/"(\/assets\/[^\"]+)"/g)].map((match) => match[1]))];
  await Promise.all(files.map((file) => access(new URL(`../public${file}`, import.meta.url))));
});

test('story navigation targets four accessible rows and mural viewer triggers', () => {
  for (let index = 0; index < 4; index++) {
    assert.ok(markup.includes(`href="#story-${index + 1}"`));
    assert.match(markup, new RegExp(`id="story-${index + 1}" data-story-index="${index}" tabindex="-1"`));
    assert.ok(markup.includes(`class="mural-detail story-motif motif-${index}" aria-hidden="true"`));
  }
  assert.equal((markup.match(/aria-haspopup="dialog"/g) || []).length, 4);
  assert.match(markup, /<dialog class="story-dialog"/);
});

test('hero uses the clean reference without double opacity or dark overlay', async () => {
  const styles = await readFile(new URL('../src/styles.css', import.meta.url), 'utf8');
  const heroRule = styles.match(/\.hero-mural\s*\{([^}]+)\}/)[1];
  assert.ok(heroRule.includes('/assets/hero-hada-reference-clean.png'));
  assert.doesNotMatch(heroRule, /opacity|filter|mask|transform/);
  assert.doesNotMatch(markup, /class="hero-overlay"/);
  assert.match(markup, /class="hero-slogan">让红色故事和藏族记忆被反复看见、听见、分享/);
});

test('story viewer keeps native modal, focus-return and reduced-motion safeguards', () => {
  assert.ok(source.includes('dialog.showModal()'));
  assert.ok(source.includes('storyTrigger.current?.focus({ preventScroll: true })'));
  assert.ok(source.includes('document.body.style.overflow = previousOverflow'));
  assert.ok(source.includes('(prefers-reduced-motion: reduce)'));
  assert.ok(source.includes('onCancel='));
});

test('reselect and keyboard guards are retained', () => {
  assert.match(source, /index === activeProduct && imageState !== "error"/);
  for (const key of ['ArrowLeft', 'ArrowRight', 'Home', 'End']) assert.ok(source.includes(`${key}:`));
});

test('opening intro remains an independent skippable overlay', () => {
  assert.ok(source.includes('<IntroOverlay />'));
  assert.ok(introSource.includes('const storyBeats = ['));
  assert.ok(introSource.includes('const filmScenes = ['));
  assert.ok(introSource.includes('await import("gsap")'));
  assert.doesNotMatch(introSource, /import\("three"\)|THREE|canvas/);
  assert.ok(introSource.includes('/assets/opening-concept-red-youth-v2.png'));
  assert.ok(introSource.includes('/assets/opening-story-zoige-blue.png'));
  assert.ok(introSource.includes('setPhase("story")'));
  assert.ok(introSource.includes('setPhase("products")'));
  assert.ok(introSource.includes('playProductsFrom(0)'));
  assert.ok(introSource.includes('document.body.style.overflow = "hidden"'));
  assert.ok(introSource.includes('document.body.style.overflow = previousOverflowRef.current'));
  assert.ok(introSource.includes('跳过动画'));
  assert.ok(introSource.includes('点击观看文化故事'));
  assert.ok(introSource.includes('intro-cover-cta'));
  assert.ok(introSource.includes('story-film-title'));
  assert.ok(introSource.includes('story-film-subtitle'));
  assert.ok(introSource.includes('风从湿地醒来'));
  assert.doesNotMatch(introSource, /若尔盖自然开场/);
  assert.ok(introSource.includes('Escape'));
  assert.ok(introSource.includes('film-controls'));
  assert.ok(introSource.includes('window.scrollTo({ top: 0'));
  assert.ok(introSource.includes('(prefers-reduced-motion: reduce)'));
  assert.match(stylesSource, /\.intro-overlay\s*\{[^}]*#fafafa[^}]*#fff1f0/s);
  assert.match(stylesSource, /\.intro-overlay\.products\s*\{[^}]*var\(--red-mid\)[^}]*var\(--wine\)/s);
  assert.ok(stylesSource.includes('.intro-overlay::after'));
  assert.match(stylesSource, /\.intro-cover::before\s*\{\s*content: none;/);
  assert.doesNotMatch(stylesSource.match(/\.intro-cover img\s*\{([^}]+)\}/)[1], /filter:/);
  assert.ok(stylesSource.includes('"Zhi Mang Xing"'));
  assert.match(stylesSource, /\.intro-cover-cta\s*\{[^}]*left: clamp/s);
  assert.match(stylesSource, /\.story-film-title h2\s*\{[^}]*background: linear-gradient[^}]*background-clip: text/s);
  for (const label of ['胶片投影转接装置', '便携式胶片发光展示框', '火漆封缄盲盒']) {
    assert.ok(introSource.includes(label));
  }
});
