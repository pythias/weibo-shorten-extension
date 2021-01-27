
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
            shorten(message.data.long);
            break;

        case "shorten":
            shortenOnTab(message.data.long, message.data.id);
            break;

        case "tab-remove":
            //chrome.tabs.remove(message.data.id);
            break;

        default:
            break;
    }
});

chrome.contextMenus.onClicked.addListener(function (info, tab) {
    switch (info.menuItemId) {
        case "shorten-menu":
            shorten(info.linkUrl);
            break;

        default:
            break;
    }
});
