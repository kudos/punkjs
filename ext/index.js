chrome.runtime.sendMessage(bridgeId, {location: window.location}, function(response) {
  eval(response);
});
