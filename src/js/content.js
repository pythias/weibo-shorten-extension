chrome.storage.local.get(['long', 'tab'], function (object) {
    if (typeof shortenOnTab !== 'undefined' && object.long !== undefined) {
        shortenOnTab(object.long, object.tab);
    }
});