/** manual tests */

// TODO: 以下のテストを自動化する

// APIの認証が機能しているかテスト
// 以下を devtools の console に貼り付けて実行
function fetchWithTimeout(url, options, timeout = 5000) {
  return Promise.race([
    fetch(url, options),
    new Promise((_, reject) => setTimeout(() => reject(new Error("Request timed out")), timeout)),
  ]);
}

function fetchWithRetry(url, options, retries = 3, timeout = 5000) {
  function onError(err) {
    if (retries === 0) throw err;
    return fetchWithRetry(url, options, retries - 1, timeout);
  }

  return fetchWithTimeout(url, options, timeout).catch(onError);
}

fetchWithRetry(
  `http://127.0.0.1/dmax/dmax-api/v1/user-equip-data/?equip_type=quriousarmor`,
  {
    method: "GET",
    credentials: "include", // クッキーベースの認証に必要
  },
  3,
  5000
)
  .then((response) => {
    console.log(`Response Status Code: ${response.status}`); // ステータスコードを表示
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return response.json();
  })
  .then((data) => {
    if (!Array.isArray(data)) {
      throw new Error(`response data is invalid! data: ${data}`);
    } else if (data.length === 0) {
      console.log("no record found in server DB");
    } else {
      console.log("fetch sucess: server_quriousarmor_data" + JSON.stringify(data));
    }
  })
  .catch((error) => {
    console.error("Error:", error);
    console.error("サーバーとの通信でエラーが発生しました\n" + error.stack);
  });
