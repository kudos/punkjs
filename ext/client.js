var serverAppId = "ecnapnimgoienbogbgcmchpgjbgeaobk";
chrome.runtime.sendMessage(serverAppId, {location: window.location}, function(response) {
  eval(response);
});
