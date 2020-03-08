var shorten = function (longUrl, tabId) {
    longUrl = unescape(decodeURI(longUrl));
    const text = "shorten " + encodeURI(longUrl) + " at " + new Date().getTime();
    const body = "location=v6_content_home&text=" + text +
        "&appkey=&style_type=1&pic_id=&tid=&pdetail=&mid=&isReEdit=false&rank=1&" +
        "rankid=&module=stissue&pub_source=main_&pub_type=dialog&isPri=0&_t=0";
    const url = "https://weibo.com/aj/mblog/add?ajwvr=6&__rnd=" + new Date().getTime();
    request(url, body, function (json) {
        try {
            if (json.code === 100002) {
                showMessage("请先登录微博");
                return;
            }

            const html = json.data.html;
            const matches = html.match(/\/t\.cn\/([0-9a-zA-Z]+)\"/);
            if (matches === null) {
                showMessage("无效地址");
                return;
            }

            const shortUrl = "https://t.cn/" + matches[1];
            copyToClipboard(shortUrl);
            showMessage("短地址为：" + shortUrl + "，已复制到剪贴板", () => {
                chrome.runtime.sendMessage({ type: "tab-remove", data: { id: tabId } });
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
    request(url, body);
};

var request = function (url, body, callback = null) {
    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.send(body);
    xhr.onload = (e) => {
        let json = JSON.parse(xhr.responseText);
        if (callback !== null) {
            callback(json);
        }
    };
};

var copyToClipboard = function (text) {
    const input = document.createElement("input");
    input.style.position = "fixed";
    input.style.opacity = 0;
    input.value = text;
    document.body.appendChild(input);
    input.select();
    document.execCommand("Copy", false, null);
    document.body.removeChild(input);
};

var showMessage = function (message, callback = null) {
    alert(message);

    if (callback !== null) {
        callback();
    }
};

function shortenOnNewTab(url) {
    chrome.tabs.create({
        url: "https://weibo.com"
    }, function (tab) {
        url = encodeURI(escape(url));
        code = "var request = (" + request + ");\n" +
            "var removeByMid = (" + removeByMid + ");\n" +
            "var copyToClipboard = (" + copyToClipboard + ");\n" +
            "var showMessage = (" + showMessage + ");\n" +
            "var shorten = (" + shorten + ");\n" +
            "shorten('" + url + "', " + tab.id + ");";

        chrome.tabs.executeScript(tab.id, {
            code: code,
        });
    });
}