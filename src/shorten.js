const shortenButton = document.getElementById("button-shorten");
const inputLong = document.getElementById("input-long");
const spanVersion = document.getElementById("span-version");

spanVersion.innerText = "v" + chrome.runtime.getManifest().version;

inputLong.addEventListener("keyup", function(e) {
    if (event.keyCode === 13) {
        e.preventDefault();
        shortenButton.click();
    }
});

shortenButton.addEventListener("click", function (e) {
    e.preventDefault();
    chrome.runtime.sendMessage({ type: "shorten-button", data: { long: inputLong.value } });
});
