chrome.storage.local.get({directoryEntryId: false}, (items) => {
  if (!items.directoryEntryId) {
    return filePrompt();
  }

  chrome.fileSystem.isRestorable(items.directoryEntryId, (restorable) => {
    if (!restorable) {
      return chrome.storage.local.set({
        directoryEntryId: false
      }, function() {
        filePrompt();
      });
    }

    chrome.fileSystem.restoreEntry(items.directoryEntryId, (directoryEntry) => {
      chrome.runtime.onMessageExternal.addListener((request, sender, sendResponse) => {
        var reader = directoryEntry.createReader();
        reader.readEntries((entries) => {
          var entry = entries.find((entry) => {
            if (entry.name == request.location.hostname + '.js') {
              return entry;
            }
          });

          if (entry) {
            entry.file((file) => {
              var reader = new FileReader();
              reader.onerror = (e) => {
                console.error(e);
              };
              reader.onloadend = (e) => {
                sendResponse(e.target.result);
              };
              reader.readAsText(file);
            });
          }
        });

        // So the connection is held open until we respond
        return true;
      });
    });
  });
});

function filePrompt() {
  chrome.app.window.create('options.html', {
    id: "optionsId",
    innerBounds: {
      width: 400,
      height: 380
    }
  });
}
