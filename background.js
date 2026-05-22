// background.js
chrome.webRequest.onHeadersReceived.addListener(
  function(details) {
    chrome.storage.local.get(['isCapturing'], (res) => {
      if (res.isCapturing === false) return; 

      const contentType = details.responseHeaders?.find(
        h => h.name.toLowerCase() === 'content-type'
      )?.value?.toLowerCase();

      const isAudioHeader = contentType && contentType.includes('audio/');
      const isAudioUrl = details.url.match(/\.(aac|mp3|m4a|wav|ogg)(\?|$)/i);

      if (isAudioHeader || isAudioUrl) {
        chrome.storage.local.get(['history'], (result) => {
          const history = result.history || [];
          if (!history.some(item => item.url === details.url)) {
            const newEntry = {
               id: details.requestId + Date.now(),
               url: details.url,
               type: contentType || 'audio/aac',
               timestamp: Date.now()
            };
            const updated = [newEntry, ...history].slice(0, 50);
            chrome.storage.local.set({ history: updated }, () => {
               chrome.runtime.sendMessage({ type: 'AUDIO_CAPTURED', data: newEntry }).catch(() => {});
            });
          }
        });
      }
    });
  },
  { urls: ["<all_urls>"] },
  ["responseHeaders"]
);