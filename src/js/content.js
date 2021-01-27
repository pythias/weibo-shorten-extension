chrome.storage.local.get(['url', 'tab'], function (data) {
    if (typeof shortenOnTab !== 'undefined' && data.url !== undefined) {
        chrome.storage.local.clear();
        shortenOnTab(data.url, data.tab);
    }
});
