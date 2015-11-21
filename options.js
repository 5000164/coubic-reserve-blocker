"use strict";

document.getElementById('save').onclick = function () {
  chrome.storage.local.set({
    date_first: document.querySelector('[name="date_first"]').value,
    date_last: document.querySelector('[name="date_last"]').value,
    block_time_first: document.querySelector('[name="block_time_first"]').value,
    block_time_last: document.querySelector('[name="block_time_last"]').value
  });
};

window.onload = function () {
  chrome.storage.local.get([
    "date_first",
    "date_last",
    "block_time_first",
    "block_time_last"
  ], function (data) {
    document.querySelector('[name="date_first"]').setAttribute("value", data.date_first);
    document.querySelector('[name="date_last"]').setAttribute("value", data.date_last);
    document.querySelector('[name="block_time_first"]').setAttribute("value", data.block_time_first);
    document.querySelector('[name="block_time_last"]').setAttribute("value", data.block_time_last);
  });
};
