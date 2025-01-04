//! Runs in the background

// On installation, set default options
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get(["rewindDelta", "skipDelta"], (result) => {
    const options = { rewindDelta: result.rewindDelta, skipDelta: result.skipDelta };
    if (!options.rewindDelta) {
      chrome.storage.local.set({ rewindDelta: 2000 });
    }
    if (!options.skipDelta) {
      chrome.storage.local.set({ skipDelta: 2000 });
    }

    console.log("Set default values for options:", options);
  });
});
