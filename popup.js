// popup.js
let currentAudio = null;
let playingId = null;

const ICONS = {
  play: '<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>',
  pause: '<svg viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>',
  download: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>'
};

function truncate(str) {
  if (str.length <= 35) return str;
  return str.substring(0, 18) + '...' + str.slice(-12);
}

function render() {
  chrome.storage.local.get(['history', 'isCapturing'], (res) => {
    const list = document.getElementById('list');
    const badge = document.getElementById('badge');
    const toggle = document.getElementById('toggle');
    
    toggle.checked = res.isCapturing !== false;
    badge.innerText = toggle.checked ? 'LIVE' : 'OFFLINE';
    badge.className = 'status-badge ' + (toggle.checked ? 'active' : '');

    const items = res.history || [];
    list.innerHTML = items.length ? '' : '<div class="empty">Detecting audio streams...</div>';
    
    items.forEach(item => {
      const li = document.createElement('li');
      li.className = 'item';
      const rawName = item.url.split('/').pop().split('?')[0] || 'stream.aac';
      const isPlaying = playingId === item.id;

      li.innerHTML = `
        <div class="info">
          <div class="filename">${truncate(rawName)}</div>
          <div class="url">${item.url}</div>
        </div>
        <div class="actions">
          <button class="btn ${isPlaying ? 'playing' : ''}" id="p-${item.id}">${isPlaying ? ICONS.pause : ICONS.play}</button>
          <button class="btn" id="d-${item.id}">${ICONS.download}</button>
        </div>
      `;
      
      li.querySelector('#p-' + item.id).onclick = () => play(item);
      li.querySelector('#d-' + item.id).onclick = () => chrome.downloads.download({ url: item.url, filename: rawName });
      list.appendChild(li);
    });
  });
}

function play(item) {
  if (playingId === item.id) {
    if (currentAudio.paused) currentAudio.play(); else currentAudio.pause();
    render(); return;
  }
  if (currentAudio) currentAudio.pause();
  playingId = item.id;
  currentAudio = new Audio(item.url);
  currentAudio.play();
  currentAudio.onplay = render;
  currentAudio.onpause = render;
  currentAudio.onended = () => { playingId = null; render(); };
  render();
}

document.getElementById('toggle').onchange = (e) => {
  chrome.storage.local.set({ isCapturing: e.target.checked }, render);
};

document.getElementById('clear').onclick = () => {
  if (currentAudio) currentAudio.pause();
  playingId = null;
  chrome.storage.local.set({ history: [] }, render);
};

chrome.runtime.onMessage.addListener(render);
document.addEventListener('DOMContentLoaded', render);