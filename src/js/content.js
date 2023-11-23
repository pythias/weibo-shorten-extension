window.addEventListener('load', function () {
    chrome.runtime.sendMessage({ type: "xsrf-token" }, function (response) {
        let token = response.token;
        if (!token) {
            return;
        }

        chrome.storage.local.get(['shortenUrl', 'shortenTabId'], function (result) {
            if (!result.shortenUrl) {
                return;
            }

            chrome.storage.local.clear();
            shortenOnTab(result.shortenUrl, result.shortenTabId, token);
        });
    });
});