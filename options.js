"use strict";

// 設定内容を保存する
document.getElementById('save').onclick = function () {
  chrome.storage.local.set({
    date_first: document.querySelector('[name="date_first"]').value,
    date_last: document.querySelector('[name="date_last"]').value,
    block_time_first: document.querySelector('[name="block_time_first"]').value,
    block_time_last: document.querySelector('[name="block_time_last"]').value
  });
};

// 保存内容をすべてクリアする
document.getElementById('clear').onclick = function () {
  chrome.storage.local.clear(function () {
    location.reload();
  });
};

// 設定されている内容を画面に表示する
window.onload = function () {
  var defaults = {
    date_first: "2016/01/01",
    date_last: "2016/12/31",
    block_time_first: "14:00",
    block_time_last: "15:30"
  };
  chrome.storage.local.get(defaults, function (data) {
    document.querySelector('[name="date_first"]').setAttribute("value", data.date_first);
    document.querySelector('[name="date_last"]').setAttribute("value", data.date_last);
    document.querySelector('[name="block_time_first"]').setAttribute("value", data.block_time_first);
    document.querySelector('[name="block_time_last"]').setAttribute("value", data.block_time_last);
  });
};
