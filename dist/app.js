import { brandCopy } from './brand-copy.js';
import { mountPetCarry } from './pet-carry.js';
import { nextDemoState, demoDelay } from './pet-demo.js';
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const storage = {
  get(key, fallback) { try { return localStorage.getItem(key) ?? fallback; } catch { return fallback; } },
  set(key, value) { try { localStorage.setItem(key, value); } catch { /* Private browsers may deny storage. */ } },
};
let language = storage.get('yukio-language', 'zh');
if (!['zh', 'en'].includes(language)) language = 'zh';
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
let paused = reducedMotion.matches;
let character = 'yukio';
let stateId = 'read_file';
let workbenchView = 'current';
let heroMessage = 'heroStatus';

const messages = {
  zh: {
    skip: '跳到正文', navLabel: '主导航', navMeet: '遇见雪绪', navPlay: '她的日常', navWorkbench: '活动工作台', navDownload: '带她回家',
    release: 'Yukio 5.3，现已相见', heroName: '雪 绪', heroHeadline: '你的 AI 在忙，<br>她也在身边。',
    heroDescription: '把 AI 的工作，变成桌面上的小小日常。<br>看见进展，接住提醒，一起完成每一步。',
    heroDownload: '让她住进桌面', heroExplore: '先认识一下', heroPlatforms: '提供 macOS 下载 · Windows 下载暂时暂停', heroStatus: '正在认真读文件…',
    heroWriting: '正在把想法写下来…', heroVerifying: '再认真检查一遍…', heroDone: '做好啦，等你来看！',
    petLabel: '点击和雪绪打招呼，也可以拖动她', petLoading: '雪绪正在赶来…', dragHint: '轻轻拎一下，试试看',
    scroll: '往下，看看她的一天', scrollLabel: '向下探索', integrations: '和你熟悉的助手，一起工作',
    playKicker: '一张小桌子，十二种小日常', playTitle: '每一步工作，<br>都有她的小动作。', playDescription: '读文件就翻书，写代码就提笔。<br>你的工作节奏，她都放在心上。',
    statesLabel: '选择工作动画', charactersLabel: '选择角色', yukioLabel: '雪绪', qianxiaLabel: '千夏', playNote: '点选一种状态，看看她会做什么。',
    animationLoading: '准备好了，选个动作吧', loading: '正在准备动画…', animationReady: '原生角色素材 · 网页试玩', animationError: '动画暂时没加载好，点一下重试',
    pause: '暂停动画', resume: '播放动画', workbenchKicker: '活动工作台 · Apple 芯片 Mac', workbenchTitle: '看见动作，<br>也读懂来龙去脉。',
    workbenchDescription: '她在桌边陪你，工作台帮你接上思路。<br>现在做什么，为什么要做，之前做到哪一步。', workbenchGuide: '了解工作台配置',
    workbenchTabs: '工作台视图', tabCurrent: '现在做什么', tabDeep: '深入解释', tabHistory: '之前做了什么', enlarge: '放大工作台截图',
    captionCurrent: '一眼看见当前工作、前后背景，以及这一步的目的。', captionDeep: '展开具体做法、用途与结果，再对照原文核查依据。', captionHistory: '按每次用户要求分段回顾，接上之前的工作思路。',
    screenshotNote: '真实界面截图 · 预设演示数据 · 点击可放大', screenshotAltCurrent: 'Mac 活动工作台：项目、当前工作与背景说明', screenshotAltDeep: 'Mac 活动工作台：深入解释与原文依据', screenshotAltHistory: 'Mac 活动工作台：按用户要求分段的历史回顾',
    togetherKicker: '小小的提醒，刚刚好的在场', togetherTitle: '陪你做事，<br>也等你的决定。', togetherDescription: '让需要你的时刻被看见。<br>把注意力，留给值得专注的事。',
    principleOneTitle: '轮到你时，她会举牌。', principleOne: '问题、错误与完成提醒，优先显示。连接支持的助手后，可以在她身边回答；每次批准仍由你决定。', principleOneTag: '你掌握决定权',
    principleTwoTitle: '多段聊天，也有头绪。', principleTwo: '把多个助手的活动放在眼前。展开聊天卡片，切换关注对象，或回到有可用链接的那段聊天。', principleTwoTag: '接得上上下文',
    principleThreeTitle: '小小一只，尊重边界。', principleThree: '活动监测与搜索在本机处理。可选的模型解释会把所选聊天的有限摘录发送到你配置的服务。', principleThreeTag: '数据去向说清楚',
    downloadTitleShort: '下载 Yukio', downloadTitle: '给桌面，<br>留一个她的位置。', downloadDescription: '下一次开始工作时，<br>让雪绪在身边陪着你。', downloadHandwriting: '那就，请多关照啦。',
    platformLabel: '为你的电脑选择版本', platformApple: 'Apple 芯片 Mac', platformIntel: 'Intel Mac', platformWindows: 'Windows',
    downloadAppleDetail: '桌面角色 + 内置活动工作台<br>支持在软件内确认并安装更新。', downloadIntelDetail: '保留的 v0.4.6 早期桌面角色版本。<br>不包含当前 Apple 芯片版活动工作台。', downloadWindowsDetail: 'Windows 安装包与便携包已暂时下架。<br>源码和历史记录仍可在 GitHub 查看。',
    downloadPaused: '下载暂时暂停', windowsStatus: '查看 Windows 发布状态', websiteSource: '网站源码 ↗',
    downloadApple: '下载 macOS 版', downloadIntel: '下载 Intel Mac 版', downloadWindows: '下载 Windows 版', downloadZip: '下载 ZIP 压缩包 ↗', downloadPortable: '下载便携 ZIP ↗', allReleases: '全部版本与校验值 ↗',
    installApple: '首次打开：将 Yukio 拖到「应用程序」。当前采用临时签名，尚未 Apple 公证；若被系统拦截，请按下方安装说明操作。', installWindows: '当前没有可下载的 Windows 安装包。请查看 GitHub 发布状态，等待后续恢复。',
    updateGuide: '正在使用 0.4.13？查看升级说明', legacyGuide: '查看该平台的安装与使用说明',
    faqTitle: '见面之前，<br>你可能想知道。', feedback: '还有问题？来 GitHub 聊聊',
    faqOneQ: 'Yukio 本身是一个 AI 编程助手吗？', faqOneA: 'Yukio 是与你的 AI 助手协作的桌面伙伴。她跟随 Codex、Claude Code 和 Deep Code 的本机活动记录，用角色动作呈现状态；她不会代替这些助手。问题回传需要支持的来源与连接配置。',
    faqTwoQ: '需要配置 API 密钥才能用吗？', faqTwoA: '基础角色动画与本机活动跟随不需要配置解释模型。工作台的深入解释属于可选能力，需要配置兼容的模型服务；当前适配器支持无需 API 密钥鉴权的本机或内网 OpenAI 兼容接口。',
    faqThreeQ: 'Mac 第一次打开被系统拦截，怎么办？', faqThreeA: '当前 Mac 包采用临时签名，尚未 Apple 公证。先确认下载来自本项目 Releases，并核对发布页校验值。首次尝试打开后，可前往「系统设置 → 隐私与安全性 → 仍要打开」，按系统提示确认。',
    faqFourQ: 'Windows、Intel Mac 也有活动工作台吗？', faqFourA: '当前内置活动工作台面向 Apple 芯片 Mac。Intel Mac 保留 v0.4.6 的早期桌面角色下载，不包含当前工作台。Windows 安装包与便携包已暂时下架，源码和历史记录仍在 GitHub 保留。',
    faqFiveQ: '网页里能看到我正在运行的 AI 吗？', faqFiveA: '这里是角色动画试玩与产品介绍，不读取你电脑上的聊天或活动记录。安装 Yukio 并选择助手来源后，桌面应用才会跟随支持的本机记录。工作台截图使用预设演示数据。',
    footerLine: '工作有进展，桌面有陪伴。', docs: '文档 ↗', issues: '反馈 ↗', footerMade: '一个小小的伙伴，一份认真陪伴。', sourceAvailable: '角色与源码来自 Yukio 项目 ↗', dialogLabel: '工作台截图大图', closeDialog: '关闭大图',
    menuOpen: '打开菜单', menuClose: '关闭菜单',
    greeting1: '你好呀，今天也一起加油。', greeting2: '在呢，慢慢来就好。', greeting3: '工作很认真，也要记得休息哦。', held: '欸？轻一点呀～', released: '落地啦，继续陪你工作。',
  },
  en: {
    skip: 'Skip to content', navLabel: 'Main navigation', navMeet: 'Meet Yukio', navPlay: 'Her little day', navWorkbench: 'Workbench', navDownload: 'Bring her home',
    release: 'Say hello to Yukio 5.3', heroName: '雪緒', heroHeadline: 'Your AI is working.<br>She’s right beside you.',
    heroDescription: 'A little life in the corner of your desktop.<br>Follow the work, catch the moments, make progress together.', heroDownload: 'Bring her home', heroExplore: 'Meet Yukio first', heroPlatforms: 'macOS downloads available · Windows downloads paused',
    heroStatus: 'Reading, very carefully…', heroWriting: 'Putting an idea on paper…', heroVerifying: 'Just one more check…', heroDone: 'All done. Over to you!',
    petLabel: 'Say hello to Yukio, or drag to pick her up', petLoading: 'Yukio is on her way…', dragHint: 'Go on, pick her up', scroll: 'A little peek into her day', scrollLabel: 'Explore below',
    integrations: 'In good company with your coding tools', playKicker: 'One little desk. Twelve little moments.', playTitle: 'Every step of your work.<br>A little move of her own.', playDescription: 'Reading files? She opens a book.<br>Writing code? Out comes her pen.',
    statesLabel: 'Choose a work animation', charactersLabel: 'Choose a character', yukioLabel: 'Yukio', qianxiaLabel: 'Qianxia', playNote: 'Pick a moment and see what she does.', animationLoading: 'Pick a little moment', loading: 'Getting her animation ready…', animationReady: 'Original character art · Browser demo', animationError: 'Couldn’t load this animation. Select it to retry.', pause: 'Pause animation', resume: 'Play animation',
    workbenchKicker: 'Activity workbench · Apple silicon Mac', workbenchTitle: 'See the little actions.<br>Understand the bigger picture.', workbenchDescription: 'She keeps you company. The workbench keeps you in the loop.<br>What’s happening, why it matters, and where you left off.', workbenchGuide: 'Set up the workbench', workbenchTabs: 'Workbench views', tabCurrent: 'What’s happening', tabDeep: 'A closer look', tabHistory: 'Where you left off', enlarge: 'Enlarge workbench screenshot',
    captionCurrent: 'Current work, the context behind it, and what this step is for.', captionDeep: 'Look into the approach and results, with original excerpts to check.', captionHistory: 'Pick up the thread with history grouped by your requests.', screenshotNote: 'Actual interface · Preset demo data · Click to enlarge', screenshotAltCurrent: 'Mac workbench: projects, current activity and context', screenshotAltDeep: 'Mac workbench: detailed explanation and source evidence', screenshotAltHistory: 'Mac workbench: history grouped by user request',
    togetherKicker: 'A gentle nudge, just when it matters', togetherTitle: 'Here for the work.<br>Waiting for your say.', togetherDescription: 'Notice the moments that need you.<br>Keep your attention where it belongs.', principleOneTitle: 'A little sign. Your decision.', principleOne: 'Questions, errors and completion come first. Connect a supported assistant to answer beside her. Approvals are always yours to make.', principleOneTag: 'You’re still in charge', principleTwoTitle: 'More chats. Less losing track.', principleTwo: 'Keep activity from your assistants in view. Expand the chat stack, switch your focus, or return through an available chat link.', principleTwoTag: 'Pick up the thread', principleThreeTitle: 'Small presence. Clear boundaries.', principleThree: 'Activity monitoring and search happen locally. Optional explanations send limited excerpts of your selected chat to the service you configure.', principleThreeTag: 'Know where your data goes',
    downloadTitleShort: 'Download Yukio', downloadTitle: 'A little room<br>on your desktop.', downloadDescription: 'Next time you settle in to work,<br>let Yukio keep you company.', downloadHandwriting: 'Let’s make a good little team.', platformLabel: 'Choose the right home for her', platformApple: 'Apple silicon Mac', platformIntel: 'Intel Mac', platformWindows: 'Windows',
    downloadAppleDetail: 'Desktop companion + built-in activity workbench.<br>Confirm and install updates inside the app.', downloadIntelDetail: 'The earlier v0.4.6 desktop companion.<br>Does not include the current Apple silicon workbench.', downloadWindowsDetail: 'Windows installers and portable downloads are temporarily withdrawn.<br>Source and historical records remain on GitHub.', downloadApple: 'Download for macOS', downloadIntel: 'Download for Intel Mac', downloadWindows: 'Download for Windows', downloadZip: 'Get the ZIP instead ↗', downloadPortable: 'Get the portable ZIP ↗', allReleases: 'All releases & checksums ↗',
    downloadPaused: 'Downloads paused', windowsStatus: 'Check Windows release status', websiteSource: 'Website source ↗',
    installApple: 'To start, drag Yukio into Applications. The app is ad-hoc signed and not Apple notarized. If macOS blocks it, follow the installation guidance below.', installWindows: 'There is currently no Windows installer to download. Check the GitHub release status for future availability.', updateGuide: 'On 0.4.13? Read the upgrade guide', legacyGuide: 'Read installation & usage instructions',
    faqTitle: 'Before you<br>say hello.', feedback: 'More questions? Find us on GitHub', faqOneQ: 'Is Yukio an AI coding assistant?', faqOneA: 'Yukio is a desktop companion for your existing AI tools. She follows local activity records from Codex, Claude Code and Deep Code and turns their states into character actions. Answer delivery depends on the assistant and connection setup.', faqTwoQ: 'Do I need an API key to use her?', faqTwoA: 'The basic companion and local activity following do not need an explanation model. Optional workbench explanations require a compatible model service. The current adapter supports local or intranet OpenAI-compatible endpoints without API-key authentication.', faqThreeQ: 'What if macOS blocks the first launch?', faqThreeA: 'The current Mac app is ad-hoc signed and not Apple notarized. Confirm your download is from this project’s Releases and check its checksum. After trying to open it, go to System Settings → Privacy & Security → Open Anyway and follow the system prompts.', faqFourQ: 'Do Windows and Intel Mac have the workbench?', faqFourA: 'The current built-in workbench is for Apple silicon Mac. Intel Mac retains the earlier v0.4.6 companion download without the current workbench. Windows installers and portable downloads are temporarily withdrawn; source and historical records remain on GitHub.', faqFiveQ: 'Can this website see my running AI tools?', faqFiveA: 'This website is a character-animation demo and product introduction. It does not read chats or activity records on your computer. The installed desktop app follows supported local records after you select an assistant. Workbench screenshots use preset demo data.',
    footerLine: 'A little progress. A little company.', docs: 'Docs ↗', issues: 'Feedback ↗', footerMade: 'A little companion. A thoughtful presence.', sourceAvailable: 'Character art & source by the Yukio project ↗', dialogLabel: 'Enlarged workbench screenshot', closeDialog: 'Close screenshot', menuOpen: 'Open navigation', menuClose: 'Close navigation', greeting1: 'Hello. Let’s make a good little team.', greeting2: 'I’m here. Take your time.', greeting3: 'Working hard? Remember a little break.', held: 'Oh! A little gently, please.', released: 'Back on the ground. Right beside you.',
  },
};
Object.assign(messages.zh, brandCopy.zh);
Object.assign(messages.en, brandCopy.en);
const t = (key) => messages[language][key] ?? messages.zh[key] ?? key;
const states = [
  ['thinking', '思考', 'Thinking'], ['read_file', '读文件', 'Reading'], ['write_file', '写代码', 'Writing'], ['view_image', '看图片', 'Looking'],
  ['verify', '跑测试', 'Testing'], ['read_web', '浏览网页', 'Browsing'], ['respond', '整理回答', 'Responding'], ['question_for_user', '等待你', 'Waiting'],
  ['task_complete', '完成啦', 'All done'], ['default_work', '日常工作', 'Working'], ['idle', '休息一下', 'A little rest'], ['failed', '遇到问题', 'A problem'],
];
const stateName = (id) => states.find((s) => s[0] === id)?.[language === 'zh' ? 1 : 2] ?? id;

const metadataCache = new Map();
const imageCache = new Map();
async function metadata(skin) {
  if (!metadataCache.has(skin)) {
    const url = skin === 'yukio' ? 'assets/motion.json' : 'assets/qianxia-motion.json';
    metadataCache.set(skin, fetch(url).then((r) => { if (!r.ok) throw new Error(`Animation metadata: ${r.status}`); return r.json(); }).catch((e) => { metadataCache.delete(skin); throw e; }));
  }
  return metadataCache.get(skin);
}
async function sheet(url) {
  if (imageCache.has(url)) {
    const value = imageCache.get(url);
    imageCache.delete(url);
    imageCache.set(url, value);
    return value;
  }
  const promise = new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => { imageCache.delete(url); reject(new Error(`Could not load ${url}`)); };
    image.src = url;
  });
  imageCache.set(url, promise);
  // Native sprite sheets are decoded only when selected; bound retained images.
  while (imageCache.size > 3) imageCache.delete(imageCache.keys().next().value);
  return promise;
}

class SpritePlayer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.elapsed = 0;
    this.lastTime = null;
    this.visible = true;
    this.paused = reducedMotion.matches;
    this.token = 0;
    this.currentFrame = -1;
  }
  async select(skin, id) {
    const token = ++this.token;
    const catalog = await metadata(skin);
    const state = catalog.states.find((s) => s.id === id);
    if (!state) throw new Error(`Missing animation: ${skin}/${id}`);
    const image = await sheet(`assets/${skin === 'yukio' ? 'motion' : 'qianxia'}/${state.asset}`);
    if (token !== this.token) return false;
    this.state = state;
    this.canvas.dataset.state = id;
    this.canvas.dataset.character = skin;
    this.image = image;
    this.elapsed = 0;
    this.lastTime = null;
    this.currentFrame = -1;
    this.width = state.frameWidth * (state.pixelScale ?? 1);
    this.height = state.frameHeight * (state.pixelScale ?? 1);
    this.columns = Math.floor(image.naturalWidth / this.width);
    this.ends = [];
    let duration = 0;
    for (const ms of state.durationsMs) this.ends.push(duration += ms);
    this.duration = duration;
    this.draw(0);
    return true;
  }
  draw(index) {
    if (!this.image || index === this.currentFrame) return;
    const frame = this.state.sequence[index];
    const sourceX = (frame % this.columns) * this.width;
    const sourceY = Math.floor(frame / this.columns) * this.height;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.drawImage(this.image, sourceX, sourceY, this.width, this.height, 0, 0, this.canvas.width, this.canvas.height);
    this.currentFrame = index;
    this.canvas.dataset.frame = String(index);
  }
  tick(now) {
    if (!this.visible || document.hidden || this.paused || !this.image) { this.lastTime = null; return; }
    const delta = this.lastTime === null ? 0 : Math.min(now - this.lastTime, 120);
    this.lastTime = now;
    this.elapsed += delta;
    let position = this.elapsed % this.duration;
    if (!this.state.loop && this.elapsed >= this.duration) position = this.duration - 1;
    let low = 0, high = this.ends.length - 1;
    while (low < high) { const middle = Math.floor((low + high) / 2); if (position < this.ends[middle]) high = middle; else low = middle + 1; }
    this.draw(low);
    if (this.canvas.id === 'play-canvas') $('#animation-progress').style.width = `${position / this.duration * 100}%`;
  }
}

const heroPlayer = new SpritePlayer($('#hero-canvas'));
const playPlayer = new SpritePlayer($('#play-canvas'));
const players = [heroPlayer, playPlayer];
const playerObserver = new IntersectionObserver((entries) => {
  for (const entry of entries) {
    const player = players.find((p) => p.canvas === entry.target);
    player.visible = entry.isIntersecting; player.lastTime = null;
    if (player === heroPlayer) scheduleHeroDemo();
  }
}, { rootMargin: '80px' });
players.forEach((p) => playerObserver.observe(p.canvas));
function animate(now) { for (const p of players) p.tick(now); requestAnimationFrame(animate); }
requestAnimationFrame(animate);

function renderStates() {
  const list = $('#state-list');
  list.replaceChildren(...states.map(([id]) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'state-option';
    button.dataset.state = id;
    button.setAttribute('aria-pressed', String(id === stateId));
    const label = document.createElement('span');
    label.textContent = stateName(id);
    const arrow = document.createElement('span');
    arrow.textContent = '↗';
    arrow.setAttribute('aria-hidden', 'true');
    button.append(label, arrow);
    button.addEventListener('click', () => {  selectState(id); });
    return button;
  }));
  updateStateLabels();
}
function updateStateLabels() {
  $('#state-title').textContent = stateName(stateId);
  $('#state-number').textContent = `${String(states.findIndex((s) => s[0] === stateId) + 1).padStart(2, '0')} / 12`;
  $('#play-canvas').setAttribute('aria-label', `${character === 'yukio' ? t('yukioLabel') : t('qianxiaLabel')} · ${stateName(stateId)}`);
}
let stateRequest = 0;
async function selectState(id) {
  const request = ++stateRequest;
  stateId = id;
  $$('.state-option').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.state === id)));
  updateStateLabels();
  $('#animation-loading').textContent = t('loading');
  $('#play-canvas').setAttribute('aria-busy', 'true');
  try {
    const selected = await playPlayer.select(character, id);
    if (request !== stateRequest || !selected) return;
    $('#animation-loading').textContent = t('animationReady');
    $('#play-canvas').setAttribute('aria-busy', 'false');
    $('#play-canvas').dataset.state = id;
    $('#play-canvas').dataset.character = character;
  } catch (error) {
    if (request !== stateRequest) return;
    $('#animation-loading').textContent = t('animationError');
    $('#play-canvas').setAttribute('aria-busy', 'false');
    console.error(error.message);
  }
}
$$('button[data-character]').forEach((button) => button.addEventListener('click', () => {
  character = button.dataset.character;
  $$('button[data-character]').forEach((b) => { const active = b === button; b.classList.toggle('active', active); b.setAttribute('aria-pressed', String(active)); });

  selectState(stateId);
}));
$$('[data-meet-character]').forEach((link) => link.addEventListener('click', () => {
  character = link.dataset.meetCharacter;
  $$('button[data-character]').forEach((button) => {
    const active = button.dataset.character === character;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });
  selectState('idle');

}));
function updatePause() {
  playPlayer.paused = paused;
  $('#pause-toggle').classList.toggle('is-paused', paused);
  $('#pause-toggle').setAttribute('aria-pressed', String(paused));
  $('#pause-toggle').setAttribute('aria-label', t(paused ? 'resume' : 'pause'));
  $('#pause-toggle').title = t(paused ? 'resume' : 'pause');
}
$('#pause-toggle').addEventListener('click', () => { paused = !paused; updatePause();  });
$('#shuffle-state').addEventListener('click', () => {
  const choices = states.filter(([id]) => id !== stateId);
  selectState(choices[Math.floor(Math.random() * choices.length)][0]);

});
reducedMotion.addEventListener('change', (event) => {
  paused = event.matches; updatePause();
  heroPlayer.paused = event.matches || heroDemoPaused || heroCarry.active;
  updateHeroDemoControls(); scheduleHeroDemo();
});

// The public source sprite and its original held pose are used for this demo.
const heroPet = $('#hero-pet');
let greetingIndex = 0;
let heroState = 'read_file';
let resetGreeting;
let heroDemoTimer = null;
let heroRequest = 0;
let heroDemoPaused = storage.get('yukio-demo-paused', 'false') === 'true';
function updateHeroDemoControls() {
  const stopped = heroDemoPaused || reducedMotion.matches;
  const button = $('#pet-demo-toggle');
  button.classList.toggle('is-paused', stopped);
  button.setAttribute('aria-pressed', String(stopped));
  button.setAttribute('aria-label', t(stopped ? 'demoResume' : 'demoPause'));
  button.title = t(stopped ? 'demoResume' : 'demoPause');
  $('#pet-home').title = t('petHome');
  $('#pet-demo-status').textContent = t(stopped ? 'demoPaused' : 'demoLabel')+' · '+stateName(heroState);
}
function setHeroMessage(key) {
  heroMessage = key;
  $('#hero-status').textContent = key === 'demoAction' ? t(key).replace('{action}',stateName(heroState)) : t(key);
  $('.hero-bubble').setAttribute('aria-live',key === 'demoAction' ? 'off' : 'polite');
  updateHeroDemoControls();
}
function stopHeroDemo() { clearTimeout(heroDemoTimer); heroDemoTimer = null; }
function scheduleHeroDemo() {
  stopHeroDemo();
  if (heroCarry.active || document.hidden || !heroPlayer.visible || heroDemoPaused || reducedMotion.matches) return;
  heroDemoTimer = setTimeout(() => showHeroAction(nextDemoState(heroState)),demoDelay(heroPlayer.duration ?? 0));
}
async function showHeroAction(id, announce = true) {
  stopHeroDemo();
  const request = ++heroRequest;
  heroState = id;
  updateHeroDemoControls();
  try {
    const selected = await heroPlayer.select('yukio',id);
    if (!selected || request !== heroRequest) return;
    heroPet.classList.add('ready');
    if (announce && !heroCarry.active) setHeroMessage('demoAction');
  } catch {
    if (request !== heroRequest) return;
    if (!heroPlayer.image) {
      const image = new Image();
      image.onload = () => {
        if (request !== heroRequest) return;
        heroPlayer.ctx.drawImage(image,0,0,384,416); heroPet.classList.add('ready');
      };
      image.src = 'assets/yukio-neutral.png';
    }
  }
  if (request === heroRequest) scheduleHeroDemo();
}
function greet() {
  clearTimeout(resetGreeting);
  stopHeroDemo();
  setHeroMessage(`greeting${greetingIndex++ % 3 + 1}`);
  heroPet.classList.remove('greeting');
  void heroPet.offsetWidth;
  heroPet.classList.add('greeting');

  resetGreeting = setTimeout(() => { setHeroMessage('demoAction'); scheduleHeroDemo(); }, 3500);
}
const heroCarry = mountPetCarry({
  element: heroPet, layer: $('#drag-layer'), puppet: $('#drag-puppet'), shadow: $('#drag-shadow'),
  companion: $('#pet-companion'), homeButton: $('#pet-home'), reducedMotion,
  onPickup() {
    clearTimeout(resetGreeting); stopHeroDemo();
    ++heroRequest; ++heroPlayer.token; heroPlayer.paused = true;
    setHeroMessage('held');
  },
  onRelease() {
    setHeroMessage('released');
    clearTimeout(resetGreeting);
    heroPlayer.paused = heroDemoPaused || reducedMotion.matches;
    showHeroAction('idle',false);
  },
  onSettle() {
    heroPlayer.visible = true;
    heroPlayer.paused = heroDemoPaused || reducedMotion.matches;
    setHeroMessage('demoAction'); scheduleHeroDemo();
  },
  onReset() {
    clearTimeout(resetGreeting);
    heroPlayer.paused = heroDemoPaused || reducedMotion.matches;
    showHeroAction('read_file');
  },
  onClick: greet,
});
$('#pet-demo-toggle').addEventListener('click', () => {
  heroDemoPaused = !heroDemoPaused;
  storage.set('yukio-demo-paused',String(heroDemoPaused));
  heroPlayer.paused = heroDemoPaused || reducedMotion.matches;
  updateHeroDemoControls(); scheduleHeroDemo();
});
document.addEventListener('visibilitychange',scheduleHeroDemo);
heroPlayer.paused = heroDemoPaused || reducedMotion.matches;
showHeroAction(heroState);

const viewNames = { current: 'Current', deep: 'Deep', history: 'History' };
function updateWorkbench() {
  for (const button of $$('[data-view]')) {
    const active = button.dataset.view === workbenchView;
    button.classList.toggle('active', active);
    button.setAttribute('aria-selected', String(active));
    button.tabIndex = active ? 0 : -1;
  }
  const suffix = viewNames[workbenchView];
  $('#workbench-panel').setAttribute('aria-labelledby', `tab-${workbenchView}`);
  $('#workbench-image').src = `assets/workbench-${workbenchView}.png`;
  $('#workbench-image').alt = t(`screenshotAlt${suffix}`);
  $('#workbench-caption').textContent = t(`caption${suffix}`);
}
$$('[data-view]').forEach((button) => button.addEventListener('click', () => { workbenchView = button.dataset.view; updateWorkbench();  }));
$('.workbench-tabs').addEventListener('keydown', (event) => {
  const buttons = $$('[data-view]');
  const index = buttons.indexOf(document.activeElement);
  if (index < 0 || !['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
  event.preventDefault();
  const next = event.key === 'Home' ? 0 : event.key === 'End' ? buttons.length - 1 : (index + (event.key === 'ArrowRight' ? 1 : -1) + buttons.length) % buttons.length;
  buttons[next].focus(); buttons[next].click();
});
const imageDialog = $('#image-dialog');
$('#enlarge-workbench').addEventListener('click', () => {
  $('#dialog-image').src = $('#workbench-image').src;
  $('#dialog-image').alt = $('#workbench-image').alt;
  imageDialog.showModal();
  document.body.style.overflow = 'hidden';

});
$('#close-dialog').addEventListener('click', () => imageDialog.close());
imageDialog.addEventListener('click', (event) => { if (event.target !== imageDialog) return; const rect = imageDialog.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) imageDialog.close(); });
imageDialog.addEventListener('close', () => { document.body.style.overflow = ''; $('#enlarge-workbench').focus({ preventScroll: true }); });

const downloadBase = 'https://github.com/leozhang8654/yukio-desktop-pet/releases/download/';
const platforms = {
  apple: { version: 'v5.3', requirement: 'macOS 13+ · Apple silicon', file: 'v5.3/Yukio-5.3-macOS-arm64.dmg', alt: 'v5.3/Yukio-5.3-macOS-arm64.zip', type: '.dmg', label: 'downloadApple', detail: 'downloadAppleDetail', install: 'installApple' },
  intel: { version: 'v0.4.6', requirement: 'macOS 13+ · Intel', file: 'v0.4.6/Yukio-0.4.6-macOS.dmg', alt: 'v0.4.6/Yukio-0.4.6-macOS.zip', type: '.dmg', label: 'downloadIntel', detail: 'downloadIntelDetail', install: 'installApple' },
  windows: { available: false, requirement: 'Windows 10 / 11 · x64', type: '', label: 'downloadPaused', detail: 'downloadWindowsDetail', install: 'installWindows' },
};
const initialPlatform = storage.get('yukio-platform', /Windows/i.test(navigator.userAgent) ? 'windows' : 'apple');
$('#platform-select').value = Object.hasOwn(platforms, initialPlatform) ? initialPlatform : 'apple';
function updateDownload() {
  const platform = $('#platform-select').value;
  const data = platforms[platform];
  const available = data.available !== false;
  $('#download-version').textContent = available ? data.version : t('downloadPaused');
  $('#download-requirement').textContent = data.requirement;
  if (available) {
    $('#download-link').href = downloadBase + data.file;
    $('#download-link').removeAttribute('aria-disabled');
    $('#download-alt').href = downloadBase + data.alt;
  } else {
    $('#download-link').removeAttribute('href');
    $('#download-link').setAttribute('aria-disabled', 'true');
    $('#download-alt').removeAttribute('href');
  }
  $('#download-alt').hidden = !available;
  $('#download-filetype').textContent = data.type;
  $('#download-button-label').textContent = t(data.label);
  $('#download-detail').innerHTML = t(data.detail);
  $('#install-note').textContent = t(data.install);
  $('#download-alt').textContent = t(platform === 'windows' ? 'downloadPortable' : 'downloadZip');
  $('.install-guide span:first-child').textContent = t(platform === 'windows' ? 'windowsStatus' : platform === 'apple' ? 'updateGuide' : 'legacyGuide');
  $('.install-guide').href = platform === 'windows' ? 'https://github.com/leozhang8654/yukio-desktop-pet/releases' : platform === 'apple' ? 'https://github.com/leozhang8654/yukio-desktop-pet/blob/main/docs/MANUAL-UPDATES.md' : `https://github.com/leozhang8654/yukio-desktop-pet/blob/main/YukioPlayer/README${language === 'zh' ? '.zh-CN' : ''}.md`;
}
$('#platform-select').addEventListener('change', () => { storage.set('yukio-platform', $('#platform-select').value); updateDownload();  });

let menuOpen = false;
function setMenu(open) {
  menuOpen = open;
  $('#mobile-nav').hidden = !open;
  $('#menu-toggle').setAttribute('aria-expanded', String(open));
  $('#menu-toggle').setAttribute('aria-label', t(open ? 'menuClose' : 'menuOpen'));
}
$('#menu-toggle').addEventListener('click', () => { setMenu(!menuOpen);  });
$$('#mobile-nav a').forEach((a) => a.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && menuOpen) { setMenu(false); $('#menu-toggle').focus(); } });
document.addEventListener('click', (event) => { if (menuOpen && !$('.site-header').contains(event.target)) setMenu(false); });
matchMedia('(min-width: 651px)').addEventListener('change', (event) => { if (event.matches) setMenu(false); });

function applyLanguage() {
  document.documentElement.lang = language === 'zh' ? 'zh-CN' : 'en';
  document.title = language === 'zh' ? 'Yukio · 桌面搭子俱乐部' : 'Yukio — The Desktop Buddy Club';
  $$('[data-i18n]').forEach((element) => { element.innerHTML = t(element.dataset.i18n); });
  $$('[data-i18n-aria]').forEach((element) => element.setAttribute('aria-label', t(element.dataset.i18nAria)));
  $('#language-toggle').textContent = language === 'zh' ? 'EN' : '中';
  $('#language-toggle').setAttribute('aria-label', language === 'zh' ? 'Switch to English' : '切换到中文');
  setHeroMessage(heroMessage);
  renderStates(); updateWorkbench(); updateDownload(); updatePause(); setMenu(menuOpen);
  $('#animation-loading').textContent = t(playPlayer.image ? 'animationReady' : 'animationLoading');
}
$('#language-toggle').addEventListener('click', () => { language = language === 'zh' ? 'en' : 'zh'; storage.set('yukio-language', language); applyLanguage();  });
applyLanguage();
selectState(stateId);

// Progressive enhancement: content is fully visible if JavaScript is unavailable.
const revealObserver = new IntersectionObserver((entries) => {
  for (const entry of entries) if (entry.isIntersecting) { entry.target.classList.add('visible'); revealObserver.unobserve(entry.target); }
}, { threshold: 0.08, rootMargin: '0px 0px 24px 0px' });
$$('.reveal').forEach((element) => revealObserver.observe(element));
document.body.classList.add('js-ready');
