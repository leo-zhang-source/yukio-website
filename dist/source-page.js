const elements = [...document.querySelectorAll('[data-source-copy]')];
const english = Object.fromEntries(elements.map((element) => [element.dataset.sourceCopy, element.innerHTML]));
const chinese = {
  skip: '跳到项目说明', home: '首页', source: '源码说明', getApp: '下载 Yukio ↗',
  title: 'Source code.',
  intro: '小小的角色，藏着许多用心的细节。看看项目说明，下载网站源码，也给你自己的页面留一个 Yukio 的位置。',
  download: '下载网站源码 ZIP ↓', repository: '在 GitHub 查看 ↗',
  downloadNote: '网站源码 · 最新 main 分支 · ZIP 由 GitHub 提供 · 无需登录',
  portraitCaption: 'Small buddy. Open the notebook.', contents: '这本笔记里有什么',
  tocOverview: '项目介绍', tocFeatures: '包含哪些功能', tocStart: '在本机运行', tocFiles: '从哪里开始修改', tocApp: '桌面应用', tocCredits: '致谢与使用说明',
  overviewTitle: '项目介绍',
  overviewBody: 'Yukio 是一位桌面伙伴，会把支持的 AI 工具的活动状态变成角色的小动作。这个仓库是她的官方网站：认识雪绪与千夏，试玩原版动画，并下载 Mac 应用。',
  overviewScope: '网站完全在浏览器中运行。网页动画演示不会连接你的助手，也不会读取本机聊天记录。桌面应用属于另一个项目。',
  repoLabel: '网站仓库', builtLabel: '使用技术', builtValue: 'HTML、CSS 与 JavaScript · 无框架，无需构建', languageLabel: '界面语言', languageValue: 'English 与中文 · 记住你的选择',
  featuresTitle: '包含哪些功能',
  featureOneTitle: '两位小伙伴。', featureOneBody: '雪绪与千夏各有十二种原版动作。选一个日常，随机看看，或让她自动循环演示。',
  featureTwoTitle: '轻轻拎起，在哪儿放下。', featureTwoBody: '在浏览器中拖动雪绪，感受轻柔的晃动与惯性。松手后，她会坐在落下的位置陪你。点击返回按钮，或按 Escape，就能回到首页原位。',
  featureThreeTitle: '看看她的工作台。', featureThreeBody: '通过使用预设演示数据的真实界面截图，了解 Mac 应用的活动工作台。点击截图，可以放大查看。',
  featureFourTitle: '一个安静舒服的小天地。', featureFourBody: '适配不同屏幕，中英文切换，支持减少动态效果，全站无音效。Mac 安装包下载提供进度、取消操作与 SHA-256 校验。',
  startTitle: '在本机运行', startBody: '下载并解压源码 ZIP，在解压后的文件夹里打开终端。只需 Python 3，就能启动网站：',
  openPreview: '打开 <a href="http://127.0.0.1:4173/" target="_blank" rel="noopener noreferrer">http://127.0.0.1:4173/ ↗</a>。浏览时保持终端运行，按 Ctrl+C 可停止服务。',
  gitIntro: '习惯使用 Git？可以先克隆仓库：', checksTitle: '分享修改之前', checksBody: '安装 Node.js 20 或更新版本后，运行项目检查。无需执行 npm install。',
  checksNote: '这些检查覆盖 JavaScript、页面资源、所有动画时间线、安装包完整性、拖动物理与演示时序。也记得用手机尺寸预览修改后的页面。',
  filesTitle: '从哪里开始修改', filesCaption: '主要文件与用途', pathLabel: '文件或目录', purposeLabel: '这里放着什么',
  fileHome: '首页内容与各个板块。', fileStyle: '配色、字体与响应式布局。', fileCopy: '首页的中英文文案。', fileApp: '动画播放、导航与页面交互。', filePet: '拖动、物理运动与自动动作演示。', fileAssets: '角色立绘、动画图集、截图与字体。', fileDownloads: '经过校验的原版 Mac 安装包分片。', fileSource: '当前源码说明页、样式与语言切换。', fileScripts: '验证脚本、文案同步与素材来源记录。',
  copyTip: '修改 <code>brand-copy.js</code> 后，运行 <code>node scripts/sync-copy.mjs</code>，同步首页初始展示的英文 HTML。可直接部署的目录是 <code>dist/</code>。',
  appTitle: '桌面应用', appBody: '想让 Yukio 住进桌面？官网当前提供适用于 Apple 芯片 Mac 的 Yukio 5.3，包含桌面角色与活动工作台。Windows 版已暂停发布，Intel Mac 版暂未提供下载。',
  appInstall: 'Mac 下载与安装说明 ↗', appRepo: '桌面应用仓库 ↗',
  appSourceNote: '桌面应用仓库目前无法匿名访问。上方的源码 ZIP 包含网站、网站素材和安装包文件，不包含桌面应用本身的源代码。',
  creditsTitle: '致谢与使用说明', creditsBody: '角色立绘与原版动画来自 Yukio 桌宠项目。网站沿用原始帧序列与播放时长，素材来源记录保存在仓库的 scripts 目录中。',
  fontCredits: 'Fredoka 与站酷快乐体由网站自行托管，对应字体许可证保存在 <code>dist/assets/</code>。',
  reuseNote: '当前仓库尚未声明项目许可证。公开可访问不代表已经授予再发布许可；如需重新发布代码、角色素材或安装包，请先查看随附声明并取得相应授权。',
  browseFiles: '浏览全部项目文件 ↗', footer: '工作有进展，桌面有陪伴。', backHome: '返回 Yukio 首页 ↗',
};
let storedLanguage;
try { storedLanguage = localStorage.getItem('yukio-language'); } catch { /* Optional preference. */ }
let language = (new URLSearchParams(location.search).get('lang') ?? storedLanguage) === 'zh' ? 'zh' : 'en';
const toggle = document.querySelector('#source-language');
function renderLanguage() {
  const copy = language === 'zh' ? chinese : english;
  elements.forEach((element) => { element.innerHTML = copy[element.dataset.sourceCopy] ?? english[element.dataset.sourceCopy]; });
  document.documentElement.lang = language === 'zh' ? 'zh-CN' : 'en';
  document.title = language === 'zh' ? '源码说明 · Yukio' : 'Source code · Yukio';
  document.querySelector('.source-portrait img').alt = language === 'zh' ? '白发蓝眼的桌面伙伴雪绪' : 'Yukio, the white-haired desktop buddy';
  toggle.textContent = language === 'zh' ? 'EN' : '中';
  toggle.setAttribute('aria-label', language === 'zh' ? 'Switch to English' : '切换到中文');
  document.querySelector('.source-header nav').setAttribute('aria-label', language === 'zh' ? '页面导航' : 'Page navigation');
  document.querySelector('.source-contents nav').setAttribute('aria-label', language === 'zh' ? '项目说明目录' : 'Guide contents');
}
toggle.addEventListener('click', () => {
  language = language === 'zh' ? 'en' : 'zh';
  try { localStorage.setItem('yukio-language', language); } catch { /* Optional preference. */ }
  renderLanguage();
});
renderLanguage();
