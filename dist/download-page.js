import { setupPackageDownloads } from './package-download.js';
const query = new URLSearchParams(location.search);
let storedLanguage;
try { storedLanguage = localStorage.getItem('yukio-language'); } catch { /* Optional preference. */ }
const language = (query.get('lang') ?? storedLanguage) === 'zh' ? 'zh' : 'en';
const english = {
  source: 'Source code ↗', back: 'Back to Yukio ↗', title: 'Your buddy is ready to go.',
  description: 'Yukio 5.3 · macOS 13+ · Apple silicon<br>ZIP installer · 76.5 MB',
  download: 'Download for Mac ↓', note: 'Download from this website. No sign-in needed.',
  installTitle: 'A little place on your desktop.',
  step1: 'Open the downloaded ZIP file to extract the app.',
  step2: 'Drag Yukio.app into Applications, then open it.',
  step3: 'This release is ad-hoc signed and not Apple notarized. If macOS blocks it, try opening it once, then go to System Settings → Privacy & Security → Open Anyway and follow the system prompts.',
  availability: 'The website currently offers Apple silicon Mac 5.3. Windows distribution is paused; the Intel Mac download is currently unavailable.',
  checksum: 'Original published archive · SHA-256 checksum', checksumDownload: 'Download checksums ↗',
};
const chinese = {
  "source": "源码说明 ↗",
  "back": "返回官网 ↗",
  "title": "小搭子，准备出发。",
  "description": "Yukio 5.3 · macOS 13+ · Apple 芯片<br>ZIP 安装包 · 76.5 MB",
  "download": "下载 macOS 版 ↓",
  "note": "直接从官网下载，无需登录。",
  "installTitle": "给她安顿一个小位置。",
  "step1": "下载完成后，双击 ZIP 压缩包解压。",
  "step2": "把 Yukio.app 拖到「应用程序」，再打开。",
  "step3": "当前安装包采用临时签名，尚未 Apple 公证。如被系统拦截，首次尝试打开后，前往「系统设置 → 隐私与安全性 → 仍要打开」，按系统提示确认。",
  "availability": "目前官网提供 Apple 芯片 Mac 5.3。Windows 版已暂停发布；Intel Mac 版暂未提供。",
  "checksum": "原发布安装包 · SHA-256 校验值",
  "checksumDownload": "下载校验值文件 ↗"
};
const copy = language === 'en' ? english : chinese;
document.documentElement.lang = language === 'en' ? 'en' : 'zh-CN';
document.title = language === 'en' ? 'Download Yukio · The Desktop Buddy Club' : '下载 Yukio · 桌面搭子俱乐部';
document.querySelectorAll('[data-copy]').forEach((element) => { element.innerHTML = copy[element.dataset.copy]; });
document.querySelector('.download-page-hero img').alt = language === 'en' ? 'Yukio' : '雪绪';
const downloads = setupPackageDownloads(language);
if (query.get('package') === 'mac-arm64') downloads.download('mac-arm64');
