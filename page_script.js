//! Injected into the document head of the current webpage

(function init() {
  let options = {
    rewindDelta: undefined,
    skipDelta: undefined,
  };

  // Listen to event that options are updated
  document.addEventListener("optionsUpdated", (event) => {
    options.rewindDelta = event.detail.rewindDelta;
    options.skipDelta = event.detail.skipDelta;

    console.log("Received 'optionsUpdated' event:", options);
  });

  // Keymaps
  document.addEventListener("keydown", function (event) {
    switch (event.key) {
      case "r":
        reconcile();
        break;
      case "a":
        rewind(options.rewindDelta);
        break;
      case "d":
        skip(options.skipDelta);
        break;
    }
  });

  // Update player information
  function reconcile() {
    try {
      const videoPlayer = netflix.appContext.state.playerApp.getAPI().videoPlayer;
      const playerSessionId = videoPlayer.getAllPlayerSessionIds()[0];

      if (playerSessionId) {
        options.player = videoPlayer.getVideoPlayerBySessionId(playerSessionId);
        options.duration = options.player.getDuration();
      } else {
        options.player = undefined;
        options.duration = undefined;
        console.error("Tried to reconcile, but no player session found");
      }
    } catch (error) {
      console.error("Failed to reconcile:", error);
    }
  }

  // Rewind the player by x milliseconds
  function rewind(milliseconds) {
    if (!options.player) {
      console.error("Tried to rewind but player is not initialized");
      return;
    }
    const currentTime = options.player.getCurrentTime();
    options.player.seek(Math.max(0, currentTime - milliseconds));
  }

  // Skip the player by x milliseconds
  function skip(milliseconds) {
    if (!options.player) {
      console.error("Tried to skip but player is not initialized");
      return;
    }
    const currentTime = options.player.getCurrentTime();
    options.player.seek(Math.min(options.duration, currentTime + milliseconds));
  }
})();
