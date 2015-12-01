
function finder() {
  chrome.fileSystem.chooseEntry({type: 'openDirectory'}, function(entry) {
    if (entry.name === '.js') {
      storeEntry(entry);
    } else {
      var reader = entry.createReader();
      reader.readEntries(function(entries) {
        var found = entries.find(function(item) {
          if (item.name == '.js') {
            return true;
          }
        });
        if (found) {
          storeEntry(found);
        } else {
          document.querySelector('.error').classList.remove('hide');
          document.querySelector('.error').innerText = 'Selected path does not seem to be or contain your .js directory.';
          setTimeout(() => {
            document.querySelector('.error').classList.add('hide');
          }, 5000);
        }
      });
    }
  });
}

function storeEntry(entry) {
  chrome.storage.local.set({
    directoryEntryId: chrome.fileSystem.retainEntry(entry)
  }, function() {
    document.getElementById('path').innerText = 'Currently selected: ' + entry.name;
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
        document.getElementById('path').innerText = 'Currently selected: ' + directoryEntry.name;
      });
    });
  });
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('finder').addEventListener('click',
    finder);
