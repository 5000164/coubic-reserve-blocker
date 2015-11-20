"use strict";

chrome.browserAction.onClicked.addListener(function () {
  // 先に jQuery を読み込んでから実行
  chrome.tabs.executeScript(null, {
    file: "jquery-2.1.4.min.js"
  }, function () {
    chrome.tabs.executeScript(null, {
      file: "block.js"
    });
  });
});
