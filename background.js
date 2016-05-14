"use strict";

// 登録処理を開始する
chrome.browserAction.onClicked.addListener(function () {
  // 実行対象のタブ ID を取得する
  chrome.storage.local.get("exec_tab_id", function (storage) {
    var execTabId = storage.exec_tab_id;

    // 実行対象のタブがない場合のみ実行する
    if (typeof execTabId === "undefined") {
      // 現在のタブ ID を取得する
      chrome.tabs.getSelected(null, function (tab) {
        var currentTabId = tab.id;

        // 実行を開始する
        var start_data = {
          exec_flag: true,
          exec_tab_id: currentTabId,
          exec_date: undefined
        };
        chrome.storage.local.set(start_data, function () {
          // content_scripts で実行されるため画面をリロードする
          chrome.tabs.reload();
        });
      });
    }
    else {
      alert("現在実行中です。");
    }
  });
});

// 現在のタブ ID を返す
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  sendResponse(sender.tab.id);
});
