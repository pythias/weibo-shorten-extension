'use strict';

function shortenOnNewTab(url) {
    chrome.tabs.create({
        url: "https://weibo.com"
    }, function (tab) {
        chrome.tabs.executeScript(tab.id, {
            code: "var request = (" + request + ");\n"
                + "var removeByMid = (" + removeByMid + ");\n"
                + "var copyToClipboard = (" + copyToClipboard + ");\n"
                + "var showMessage = (" + showMessage + ");\n"
                + "var shorten = (" + shorten + ");\n"
                + "shorten('" + url + "', " + tab.id + ");",
        });
    });
}

var shorten = function (longUrl, tabId) {
    const body = "location=v6_content_home&text=" + encodeURIComponent(longUrl) + "&appkey=&style_type=1&pic_id=&tid=&pdetail=&mid=&isReEdit=false&rank=1&rankid=&module=stissue&pub_source=main_&pub_type=dialog&isPri=0&_t=0";
    const url = "https://weibo.com/aj/mblog/add?ajwvr=6&__rnd=" + new Date().getTime();
    request(url, body, function (json) {
        try {
            if (json.code == 100002) {
                showMessage("请先登录微博");
                return;
            }

            const html = json.data.html;
            const matches = html.match(/\/t\.cn\/([0-9a-zA-Z]+)\"/);
            if (matches == null) {
                showMessage("无效地址");
                return;
            }

            const shortUrl = "https://t.cn/" + matches[1];
            copyToClipboard(shortUrl);
            showMessage("短地址为：" + shortUrl + "，已复制到剪贴板", () => {
                chrome.runtime.sendMessage({ type: 'tab-remove', data: { id: tabId } });
            });

            const midMatches = html.match(/mid=(\d+)/);
            const mid = midMatches[1];
            removeByMid(mid);
        } catch (error) {
            alert(error);
        }
    });
};

var removeByMid = function (mid) {
    const url = "https://weibo.com/aj/mblog/del?ajwvr=6";
    const body = "mid=" + mid;
    request(url, body, function (json) {
        console.log("临时微博已清除，" + json.code);
    });
};

var request = function (url, body, callback) {
    return (async () => {
        const response = await fetch(url, {
            "credentials": "include",
            "headers": {
                'Accept': '*/*',
                'Accept-Encoding': 'gzip, deflate, br',
                'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8,zh-TW;q=0.7',
                'Connection': 'keep-alive',
                'Content-Type': 'application/x-www-form-urlencoded',
                'Referer': 'https://weibo.com/',
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.167 Safari/537.36',
                'X-Requested-With': 'XMLHttpRequest'
            },
            "referrer": "https://weibo.com/",
            "referrerPolicy": "origin",
            "body": body,
            "method": "POST",
            "mode": "cors",
            "credentials": "same-origin",
        });

        callback(await response.json());
    })();
};

var copyToClipboard = function (text) {
    const input = document.createElement('input');
    input.style.position = 'fixed';
    input.style.opacity = 0;
    input.value = text;
    document.body.appendChild(input);
    input.select();
    document.execCommand('Copy', false, null);
    document.body.removeChild(input);
};

var showMessage = function (message, callback = null) {
    try {
        chrome.notifications.create(Math.random().toString(36), {
            type: 'basic',
            iconUrl: 'images/shorten-48.png',
            title: "微博t.cn短连接生成器",
            message: message,
        }, function () {

        });
        alert(message);
    } catch (error) {
        alert(message);
    } finally {
        if (callback != null) callback();
    }
};