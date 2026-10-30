"""Import only public product assets from a pinned Yukio commit; verify Git blob hashes."""
import concurrent.futures
import hashlib
import json
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
META = json.loads((ROOT / 'scripts/upstream.json').read_text())
COMMIT = META['commit']
GIT_BLOBS = json.loads((ROOT / 'scripts/upstream-git-blobs.json').read_text())
DEST = ROOT / 'dist/assets'
PATHS = {
    'docs/readme/desk.gif': 'desk.gif',
    'docs/readme/drag.gif': 'drag.gif',
    'docs/readme/workbench-current.png': 'workbench-current.png',
    'docs/readme/workbench-deep.png': 'workbench-deep.png',
    'docs/readme/workbench-history.png': 'workbench-history.png',
    'YukioPlayer/Resources/Assets/base/held@2x.png': 'yukio-held.png',
    'YukioPlayer/Resources/Assets/base/neutral.png': 'yukio-neutral.png',
    'YukioPlayer/Resources/Assets/skins/qianxia/base/held.png': 'qianxia-held.png',
    'YukioPlayer/Resources/Assets/motion/motion.json': 'motion.json',
    'YukioPlayer/Resources/Assets/skins/qianxia/motion/motion.json': 'qianxia-motion.json',
}
STATES = ['idle', 'thinking', 'read_file', 'write_file', 'verify', 'read_web', 'view_image', 'respond', 'task_complete', 'question_for_user', 'default_work', 'failed']
for state in STATES:
    PATHS[f'YukioPlayer/Resources/Assets/motion/{state}.webp'] = f'motion/{state}.webp'
    PATHS[f'YukioPlayer/Resources/Assets/skins/qianxia/motion/{state}.webp'] = f'qianxia/{state}.webp'

def fetch(item):
    source, target = item
    destination = DEST / target
    destination.parent.mkdir(parents=True, exist_ok=True)
    url = f'https://raw.githubusercontent.com/leozhang8654/yukio-desktop-pet/{COMMIT}/{source}'
    data = urllib.request.urlopen(url, timeout=60).read()
    git_sha = hashlib.sha1(b'blob ' + str(len(data)).encode() + b'\0' + data).hexdigest()
    expected = GIT_BLOBS[source]
    if expected and git_sha != expected:
        raise ValueError(f'Git hash mismatch: {source}')
    destination.write_bytes(data)
    return {'source': source, 'file': f'assets/{target}', 'bytes': len(data), 'gitBlobSha': git_sha, 'sha256': hashlib.sha256(data).hexdigest()}

with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool:
    results = list(pool.map(fetch, PATHS.items()))
(ROOT / 'scripts/asset-provenance.json').write_text(json.dumps({'commit': COMMIT, 'files': results}, indent=2) + '\n')
print(f'Imported {len(results)} public assets ({sum(r["bytes"] for r in results):,} bytes) from {COMMIT}')
