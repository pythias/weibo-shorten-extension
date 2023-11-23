"use strict";

const shortenOnTab = function (longUrl, tabId, token) {
    longUrl = decodeURIComponent(longUrl);

    const text = "shorten " + encodeURIComponent(longUrl) + " at " + new Date().getTime();
    const body = "&visible=1&media=&vote=&content=" + text;
    const url = "https://weibo.com/ajax/statuses/update";
    request(url, body, token, function (json) {
        try {
            console.log(json);

            if (json.ok != 1) {
                console.log(json);
                showMessage("发微博失败，请重试。");
                return;
            }

            if (json.data.url_struct === null) {
                showMessage("无效地址");
                return;
            }

            const shortUrl = json.data.url_struct[0].short_url;
            navigator.clipboard.writeText(shortUrl).then(function () {
                showMessage("短地址为：" + shortUrl + "，已复制到剪贴板");
                chrome.runtime.sendMessage({ type: "tab-remove", data: { tab: tabId } });
            });

            removeByMid(json.data.mid, token);
        } catch (error) {
            console.log(json, error);
            showMessage("发微博失败，请重试。");
        }
    });
};

const removeByMid = function (mid, token) {
    const url = "https://weibo.com/aj/mblog/del?ajwvr=6";
    const body = "mid=" + mid;
    request(url, body, token);
};

const request = function (url, body, token, callback = null) {
    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
    xhr.setRequestHeader("X-XSRF-TOKEN", token);
    xhr.send(body);
    xhr.onload = (e) => {
        let json = JSON.parse(xhr.responseText);
        if (callback !== null) {
            callback(json);
        }
    };
    xhr.onerror = (e) => {
        console.error(xhr.statusText, e);
    };
};

const showMessage = function (message, callback = null) {
    alert(message);

    if (callback !== null) {
        callback();
    }
};

const shorten = function (url) {
    chrome.tabs.create({
        url: "https://weibo.com"
    }, function (tab) {
        const longUrl = encodeURIComponent(url);
        const tabId = tab.id;
        chrome.storage.local.set({ shortenUrl: longUrl, shortenTabId: tabId });
        chrome.scripting.executeScript({
            target: { tabId: tabId },
            function: () => {
                console.log("executeScript");
            }
        });
    });
}