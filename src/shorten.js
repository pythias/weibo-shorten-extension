const shortenButton = document.getElementById("button-shorten");
const inputLong = document.getElementById("input-long");

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
