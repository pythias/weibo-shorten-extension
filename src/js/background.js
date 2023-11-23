importScripts('utils.js');

chrome.runtime.onInstalled.addListener(function () {
    chrome.contextMenus.create({
        id: "shorten-menu",
        title: "创建t.cn短连接",
        contexts: ["link"]
    });
});

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    console.log(message);
    switch (message.type) {
        case "shorten-button":
            shorten(message.data.url);
            break;

        case "tab-remove":
            chrome.tabs.remove(message.data.tab);
            break;

        case "xsrf-token":
            chrome.cookies.get({ url: "https://weibo.com", name: 'XSRF-TOKEN' }, function (cookie) {
                if (cookie) {
                    sendResponse({ token: cookie.value });
                } else {
                    sendResponse({ token: '' });
                }
            });
            break;

        default:
            break;
    }
    return true;
});

chrome.contextMenus.onClicked.addListener(function (info, tab) {
    if (info.menuItemId === "shorten-menu") {
        shorten(info.linkUrl);
    }
});

