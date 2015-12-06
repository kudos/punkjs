
function finder() {
  chrome.fileSystem.chooseEntry({type: 'openDirectory'}, function(entry) {
    storeEntry(entry);
  });
}

function storeEntry(entry) {
  chrome.storage.local.set({
    directoryEntryId: chrome.fileSystem.retainEntry(entry)
  }, function() {
    chrome.fileSystem.getDisplayPath(entry, (displayPath) => {
      document.getElementById('path').innerText = 'Currently selected: ' + displayPath;
      document.getElementById('success').classList.add('remove');
    });
  });
}

function restoreOptions() {
  chrome.storage.local.get({
    directoryEntryId: false
  }, function(items) {
    if (!items.directoryEntryId) {
      return;
    }

    chrome.fileSystem.isRestorable(items.directoryEntryId, (restorable) => {
      if (!restorable) {
        return;
      }

      chrome.fileSystem.restoreEntry(items.directoryEntryId, (directoryEntry) => {
        chrome.fileSystem.getDisplayPath(directoryEntry, (displayPath) => {
          document.getElementById('path').innerText = 'Currently selected: ' + displayPath;
        });
      });
    });
  });
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('finder').addEventListener('click',
    finder);
