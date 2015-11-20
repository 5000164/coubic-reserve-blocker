"use strict";

var dateFirst;
var startYear;
var startMonth;
var startDay;

var dateLast;
var endYear;
var endMonth;
var endDay;

var blockTimeFirst;
var blockTimeLast;

var year;
var month;
var day;

// 保存されていた値を取得
chrome.storage.sync.get([
  "date_first",
  "date_last",
  "block_time_first",
  "block_time_last"
], function (data) {
  exec(data);
});

/**
 * 実行処理
 *
 * @param data
 */
function exec(data) {
  dateFirst = new Date(data.date_first);
  startYear = dateFirst.getFullYear();
  startMonth = dateFirst.getMonth() + 1;
  startDay = dateFirst.getDate();

  dateLast = new Date(data.date_last);
  endYear = dateLast.getFullYear();
  endMonth = dateLast.getMonth() + 1;
  endDay = dateLast.getDate();

  blockTimeFirst = data.block_time_first;
  blockTimeLast = data.block_time_last;

  year = startYear;
  month = startMonth;
  day = startDay;

  looper();
}

/**
 * 終了日まで 1 日ずつ処理を繰り返す
 */
function looper() {
  // 対象日が設定されている最終日を超えた場合は処理を終了する
  var date = new Date(year, month - 1, day);
  if (date.getTime() > dateLast.getTime()) {
    return;
  }

  // 月が 12 を超えたら年をインクリメントして 1 から行う
  if (month > 12) {
    month = 1;
    year++;
    looper();
    return;
  }

  // 日が最終日を超えたら月をインクリメントして 1 から行う
  if (day > new Date(year, month, 0).getDate()) {
    day = 1;
    month++;
    looper();
    return;
  }

  // 妥当な日付の場合は登録処理を行う
  register();

  // 日をインクリメントして処理を行う
  // 処理を同期させるために setTimeout を使用する
  setTimeout(function () {
    day++;
    looper();
  }, 5000);
}

/**
 * 登録処理
 */
function register() {
  // 処理の同期を取るためにすべて setTimeout でつなげている

  // モーダルを開く
  $("[data-target=\"#offline-resv-modal\"]")[0].click();
  setTimeout(function () {
    // 予約のブロックを選択
    $("[href=\"#availability-block\"]")[0].click();
    setTimeout(function () {
      // ブロックする日をセット
      $("[name=\"blocked_hour[preferred_date]\"]").val(year + "/" + month + "/" + day);
      setTimeout(function () {
        // ブロックを開始する時間をセット
        $("[name=\"blocked_hour[preferred_start_time]\"]").val(blockTimeFirst);
        setTimeout(function () {
          // ブロックを終了する時間をセット
          $("[name=\"blocked_hour[preferred_end_time]\"]").val(blockTimeLast);
          setTimeout(function () {
            // おそらく JavaScript 側でなにか処理を行っているので
            // click ではなく trigger を使用している
            $("[name=\"commit\"]").trigger("click");
            setTimeout(function () {
              // エラーが出た場合は画面が更新されないので自分で画面を更新する
              location.reload();
            }, 1000);
          }, 1000);
        }, 100);
      }, 100);
    }, 100);
  }, 1000);
}
