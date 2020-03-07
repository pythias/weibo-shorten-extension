chrome.runtime.onInstalled.addListener(function () {
    chrome.contextMenus.create({
        id: "shorten-menu",
        title: "创建t.cn短连接",
        contexts: ["link"]
    });
});

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    switch (message.type) {
        case "shorten-button":
            shortenOnNewTab(message.data.long);
            break;

        case "tab-remove":
            chrome.tabs.remove(message.data.id);
            break;

        default:
            break;
    }
});

chrome.contextMenus.onClicked.addListener(function (info, tab) {
    switch (info.menuItemId) {
        case "shorten-menu":
            shortenOnNewTab(info.linkUrl);
            break;

        default:
            break;
    }
});
