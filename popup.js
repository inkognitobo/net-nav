//! Script for the popup window

// Set configuration options in popup window
chrome.storage.local.get(["rewindDelta", "skipDelta"], function (result) {
  const options = { rewindDelta: result.rewindDelta || 0, skipDelta: result.skipDelta || 0 };

  document.getElementById("rewindDelta").value = options.rewindDelta;
  document.getElementById("skipDelta").value = options.skipDelta;

  console.log("Loaded options into popup:", options);
});

document.getElementById("saveOptionsButton").addEventListener("click", () => {
  const options = {
    rewindDelta: parseInt(document.getElementById("rewindDelta").value),
    skipDelta: parseInt(document.getElementById("skipDelta").value),
  };

  // Save updated values to local storage
  chrome.storage.local.set(
    { rewindDelta: options.rewindDelta, skipDelta: options.skipDelta },
    function () {
      console.log("Options saved:", options);

      // Send message to current tab, informing content script
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { type: "optionsUpdated" });
      });
    },
  );
});
