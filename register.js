"use strict";

// 保存されていた値を取得
chrome.storage.local.get([
  "exec_flag",
  "exec_date",
  "date_first",
  "date_last",
  "block_time_first",
  "block_time_last"
], function (data) {
  // 実行フラグが立っている場合のみ処理を行う
  if (data.exec_flag) {
    // 日時が設定されていない場合は処理しない
    if (
      typeof data.date_first === "undefined"
      ||
      typeof data.date_last === "undefined"
      ||
      typeof data.block_time_first === "undefined"
      ||
      typeof data.block_time_last === "undefined"
    ) {
      chrome.storage.local.remove(["exec_date"], function () {
        chrome.storage.local.set({exec_flag: false}, function () {
          location.reload();
        });
      });
    }

    exec(data);
  }
});

/**
 * 実行処理
 *
 * @param data
 */
function exec(data) {
  // 実行対象日を取得する
  var execDate;
  if (typeof data.exec_date === "undefined") {
    execDate = new Date(data.date_first);
  }
  else {
    execDate = new Date(data.exec_date);
  }

  // 設定する最終日を取得する
  var dateLast = new Date(data.date_last);

  // 対象日が最終日を超えた場合は処理を終了する
  if (execDate.getTime() > dateLast.getTime()) {
    chrome.storage.local.remove(["exec_date"], function () {
      chrome.storage.local.set({exec_flag: false}, function () {
        location.reload();
      });
    });
  }

  // 登録処理を行う
  register(execDate, data.block_time_first, data.block_time_last);
}

/**
 * 登録処理
 */
function register(execDate, block_time_first, block_time_last) {
  var execYear = execDate.getFullYear();
  var execMonth = execDate.getMonth() + 1;
  var execDay = execDate.getDate();
  var date = execYear + "/" + execMonth + "/" + execDay;

  // モーダルを開くのに時間がかかるため 1,000 ms 待機する
  $("[data-target=\"#offline-resv-modal\"]")[0].click();
  setTimeout(function () {
    $("[href=\"#availability-block\"]")[0].click();
    $("[name=\"blocked_hour[preferred_date]\"]").val(date);
    $("[name=\"blocked_hour[preferred_start_time]\"]").val(block_time_first);
    $("[name=\"blocked_hour[preferred_end_time]\"]").val(block_time_last);

    // 次の登録日を保存してから送信する
    var nextExecDate = getNextExecDate(execYear, execMonth, execDay);
    chrome.storage.local.set({exec_date: nextExecDate}, function () {
      // おそらく JavaScript 側でなにか処理を行っているので
      // click ではなく trigger を使用している
      $("[name=\"commit\"]").trigger("click");

      // 予約が重複したなどで登録に失敗した場合は画面が更新されないので
      // 自分で画面を更新する
      setTimeout(function () {
        location.reload();
      }, 1000);
    });
  }, 1000);
}

/**
 * 次の登録日を取得する
 */
function getNextExecDate(year, month, day) {
  var nextDay = day + 1;

  // 日が最終日を超えたら月をインクリメントする
  if (nextDay > new Date(year, month, 0).getDate()) {
    month++;
    nextDay = 1;
  }

  // 月が 12 を超えたら年をインクリメントする
  if (month > 12) {
    year++;
    month = 1;
    nextDay = 1;
  }

  return year + "/" + month + "/" + nextDay;
}
