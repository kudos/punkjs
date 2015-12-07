chrome.runtime.onMessageExternal.addListener((request, sender, sendResponse) => {
  if (request.options) {
    optionsWindow();
    return sendResponse(true);
  } else {
    chrome.storage.local.get({directoryEntryId: false}, (items) => {
      if (!items.directoryEntryId) {
        return optionsWindow();
      } else {
        chrome.fileSystem.isRestorable(items.directoryEntryId, (restorable) => {
          if (!restorable) {
            return chrome.storage.local.set({
              directoryEntryId: false
            }, function() {
              optionsWindow();
              sendResponse();
            });
          }

          getFiles(items.directoryEntryId, (entries) => {
            var matches = matchDomain(request.location.hostname, entries);
            Promise.all(matches).then((files) => {
              var defaultJs = entries.find((file) => {
                if (file.name == 'default.js') {
                  return file;
                }
              });

              if (defaultJs) {
                return readFile(defaultJs).then((contents) => {
                  sendResponse(contents + files.join(';'));
                });
              }
              sendResponse(files.join(';'));
            });
          });
        });
      }
    });
  }

  // So the connection is held open until we respond
  return true;
});

chrome.app.runtime.onLaunched.addListener((data) => {
  optionsWindow();
});

function getFiles(directoryEntryId, callback) {
  chrome.fileSystem.restoreEntry(directoryEntryId, (directoryEntry) => {
    var reader = directoryEntry.createReader();
    reader.readEntries((entries) => {
      callback(entries);
    });
  });
}

function matchDomain(domain, files) {
  domainSplit = domain.split('.');
  matches = [];
  for (var i = domainSplit.length - 1; i >= 0; i--) {
    var domainSegment = domainSplit.slice(i, domainSplit.length).join('.');
    files.forEach((entry) => {
      if (entry.name == domainSegment + '.js') {
        matches.push(readFile(entry))
      }
    });
  }
  return matches;
}

function readFile(handle) {
  return new Promise((resolve, reject) => {
    handle.file((file) => {
      var reader = new FileReader();
      reader.onerror = (e) => {
        console.error(e);
        reject(e);
      };
      reader.onloadend = (e) => {
        resolve(e.target.result);
      };
      reader.readAsText(file);
    });
  });
}

function optionsWindow() {
  chrome.app.window.create('options.html', {
    id: "optionsId",
    innerBounds: {
      width: 640,
      height: 400
    }
  });
}
