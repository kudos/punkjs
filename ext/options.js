function ping() {
  chrome.runtime.sendMessage(bridgeId, {options: true}, (response) => {
    if (typeof response != 'undefined') {
      document.getElementById('launched').classList.remove('hide');
    } else {
      document.getElementById('notfound').classList.remove('hide');
    }
  });
}

document.getElementById('try-again').addEventListener('click', () => {
  document.getElementById('launched').classList.add('hide');
  document.getElementById('notfound').classList.add('hide');
  ping();
});

document.getElementById('close').addEventListener('click', () => {
  window.close();
});

document.getElementById('install').addEventListener('click', () => {
  window.location = 'https://chrome.google.com/webstore/detail/' + bridgeId;
});

ping();
