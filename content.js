//! Runs in the context of the wepage that is currently opened

// Insert page script into the document head
const scriptElement = document.createElement("script");
scriptElement.type = "text/javascript";
scriptElement.src = chrome.runtime.getURL("page_script.js");
document.head.insertBefore(scriptElement, document.head.firstChild);

// Listen for messages from extension
chrome.runtime.onMessage.addListener(function (message) {
  if (message.type === "optionsUpdated") {
    event_update_options();
  }
});

// Dispatch Event: Update options values
function event_update_options() {
  // Default values are set on installation in background script
  chrome.storage.local.get(["rewindDelta", "skipDelta"], function (result) {
    const options = { rewindDelta: result.rewindDelta, skipDelta: result.skipDelta };

    const event = new CustomEvent("optionsUpdated", { detail: options });
    document.dispatchEvent(event);

    console.log("Received 'optionsUpdated' message:", options);
  });
}

// Run once to initialise options in page script
event_update_options();
