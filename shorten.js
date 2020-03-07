"use strict";

const shortenButton = document.getElementById("button-shorten");
const inputLong = document.getElementById("input-long");

shortenButton.addEventListener("click", function (e) {
    e.preventDefault();
    chrome.runtime.sendMessage({ type: "shorten-button", data: { long: inputLong.value } });
});
