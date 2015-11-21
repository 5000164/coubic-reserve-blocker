"use strict";

// 前回の実行情報が残っていれば削除する
chrome.storage.local.remove(["exec_date"], function () {
  // 実行フラグを立てる
  chrome.storage.local.set({exec_flag: true}, function () {
    // 画面をリロードして content_scripts で実行する
    location.reload();
  });
});
