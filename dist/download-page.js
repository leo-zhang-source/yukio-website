import { setupPackageDownloads } from './package-download.js';
const query = new URLSearchParams(location.search);
let storedLanguage;
try { storedLanguage = localStorage.getItem('yukio-language'); } catch { /* Optional preference. */ }
const language = (query.get('lang') ?? storedLanguage) === 'en' ? 'en' : 'zh';
const english = {
  back: 'Back to Yukio ↗', title: 'Your buddy is ready to go.',
  description: 'Yukio 5.3 · macOS 13+ · Apple silicon<br>ZIP installer · 76.5 MB',
  download: 'Download for Mac ↓', note: 'Download from this website. No sign-in needed.',
  installTitle: 'A little place on your desktop.',
  step1: 'Open the downloaded ZIP file to extract the app.',
  step2: 'Drag Yukio.app into Applications, then open it.',
  step3: 'This release is ad-hoc signed and not Apple notarized. If macOS blocks it, try opening it once, then go to System Settings → Privacy & Security → Open Anyway and follow the system prompts.',
  availability: 'The website currently offers Apple silicon Mac 5.3. Windows distribution is paused; the Intel Mac download is currently unavailable.',
  checksum: 'Original published archive · SHA-256 checksum', checksumDownload: 'Download checksums ↗',
};
if (language === 'en') {
  document.documentElement.lang = 'en';
  document.title = 'Download Yukio · The Desktop Buddy Club';
  document.querySelectorAll('[data-copy]').forEach((element) => { element.innerHTML = english[element.dataset.copy]; });
}
const downloads = setupPackageDownloads(language);
if (query.get('package') === 'mac-arm64') downloads.download('mac-arm64');
