const copy = {
  zh: {
    loading: '正在准备安装包…', downloading: '正在下载安装包', ready: '安装包已准备好',
    hint: '如果浏览器没有开始保存，请点击下方「保存安装包」。', save: '保存安装包',
    cancel: '取消', close: '关闭', cancelled: '下载已取消', error: '下载未完成，请点击下载按钮重试。',
    integrity: '文件校验未通过，请重新下载。', label: '安装包下载进度',
  },
  en: {
    loading: 'Preparing your download…', downloading: 'Downloading the installer', ready: 'Your installer is ready',
    hint: 'If saving did not start, choose “Save installer” below.', save: 'Save installer',
    cancel: 'Cancel', close: 'Close', cancelled: 'Download cancelled', error: 'Download interrupted. Choose Download to try again.',
    integrity: 'The file did not pass verification. Please try again.', label: 'Installer download progress',
  },
};
const manifestURL = new URL('downloads/manifest.json', import.meta.url);
const hex = (buffer) => [...new Uint8Array(buffer)].map((byte) => byte.toString(16).padStart(2, '0')).join('');
const mb = (bytes) => (bytes / 1000000).toFixed(1);

export function setupPackageDownloads(initialLanguage = 'zh') {
  let language = initialLanguage === 'en' ? 'en' : 'zh';
  let controller;
  let objectURL;
  let state = 'loading';
  let details = '';
  let progress = 0;
  const panel = document.createElement('aside');
  panel.id = 'package-progress';
  panel.className = 'package-progress';
  panel.hidden = true;
  panel.innerHTML = '<div class="package-progress-heading"><strong role="status"></strong><button type="button"></button></div><p class="package-progress-detail"></p><progress max="100" value="0"></progress><p class="package-progress-hint"></p><a class="package-save" hidden></a>';
  document.body.append(panel);
  const title = panel.querySelector('strong');
  const close = panel.querySelector('button');
  const detail = panel.querySelector('.package-progress-detail');
  const meter = panel.querySelector('progress');
  const hint = panel.querySelector('.package-progress-hint');
  const save = panel.querySelector('a');
  function render() {
    const text = copy[language];
    title.textContent = text[state];
    close.textContent = text[controller ? 'cancel' : 'close'];
    detail.textContent = details;
    meter.value = progress;
    meter.hidden = !controller;
    meter.setAttribute('aria-label', text.label);
    hint.textContent = state === 'ready' ? text.hint : '';
    hint.hidden = state !== 'ready';
    save.textContent = text.save;
  }
  function releaseURL() {
    if (objectURL) URL.revokeObjectURL(objectURL);
    objectURL = undefined;
    save.hidden = true;
    save.removeAttribute('href');
  }
  close.addEventListener('click', () => {
    if (controller) controller.abort();
    else { panel.hidden = true; releaseURL(); }
  });

  async function download(id) {
    if (controller) { panel.hidden = false; return; }
    releaseURL();
    const request = new AbortController();
    controller = request;
    state = 'loading';
    details = '';
    progress = 0;
    panel.hidden = false;
    render();
    try {
      const response = await fetch(manifestURL, { signal: request.signal });
      if (!response.ok) throw new Error('manifest');
      const entry = (await response.json())[id];
      if (!entry || !Array.isArray(entry.parts)) throw new Error('package');
      const blobs = [];
      let received = 0;
      state = 'downloading';
      for (const part of entry.parts) {
        const url = new URL(part.path, manifestURL);
        if (url.origin !== manifestURL.origin || !url.pathname.startsWith(new URL('.', manifestURL).pathname)) throw new Error('path');
        const result = await fetch(url, { signal: request.signal });
        if (!result.ok || !result.body) throw new Error('part');
        const reader = result.body.getReader();
        const buffers = [];
        let partBytes = 0;
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          partBytes += value.byteLength;
          if (partBytes > part.bytes) { await reader.cancel(); throw new Error('integrity'); }
          buffers.push(value);
          received += value.byteLength;
          progress = Math.min(99, received / entry.bytes * 100);
          details = `${mb(received)} / ${mb(entry.bytes)} MB`;
          render();
        }
        const blob = new Blob(buffers);
        if (partBytes !== part.bytes || hex(await crypto.subtle.digest('SHA-256', await blob.arrayBuffer())) !== part.sha256) throw new Error('integrity');
        blobs.push(blob);
      }
      request.signal.throwIfAborted();
      const archive = new Blob(blobs, { type: entry.type });
      if (archive.size !== entry.bytes) throw new Error('integrity');
      objectURL = URL.createObjectURL(archive);
      save.href = objectURL;
      save.download = entry.filename;
      save.hidden = false;
      controller = undefined;
      progress = 100;
      state = 'ready';
      details = `${entry.filename} · ${mb(entry.bytes)} MB`;
      render();
      save.click();
    } catch (error) {
      controller = undefined;
      state = request.signal.aborted ? 'cancelled' : error.message === 'integrity' ? 'integrity' : 'error';
      details = '';
      render();
    }
  }

  document.addEventListener('click', (event) => {
    const link = event.target.closest('a[data-package]');
    if (!link || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    download(link.dataset.package);
  });
  window.addEventListener('pagehide', () => { controller?.abort(); releaseURL(); });
  return {
    download,
    setLanguage(value) { language = value === 'en' ? 'en' : 'zh'; render(); },
  };
}
