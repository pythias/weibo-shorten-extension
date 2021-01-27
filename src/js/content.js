chrome.storage.local.get(['url', 'tab'], function (data) {
    if (typeof shortenOnTab !== 'undefined' && data.url !== undefined) {
        shortenOnTab(data.url, data.tab);
    }
});
