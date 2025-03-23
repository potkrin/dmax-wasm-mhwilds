# TODO
- [x] 散弾・剛射強化の対応
- [x] スキル火事場 検証
- [x] ダメージ検証の補助ツール
- [x] 通常強化
- [x] 連射の追撃
- [x] 蝕攻追撃のダメ検証を見やすくする
- [x] 貫通強化
- [x] 竜の一矢
- [x] 「最適化ボタン」を隠さない
- [x] 属性変換を龍属性に限定
- [x] 黒蝕竜スキルの発症・克服
- [x] 傷ありなし 傷の割合
- [x] フォースショット 何本目まで撃つか → 発動率を自動設定
- [x] localstorage 消す → 最適化ボタン → 選択武器が見つからないエラーになる
- [x] サーバJSONに入力できない
- [x] 結果画面
  - [x] モーションが何なのかわからない
  - [x] 肉質などの設定もわからない
- [x] アーティア武器管理画面
  - [x] サーバ管理
  - [x] テーブル表示
  - [x] JSON出力
- [x] タブ整理

- [x] 武器情報を表示
- [x] サーバ/ローカルの武器を切り替え
- [x] 未ログイン状態では localstorage に戻してほしい 複雑になるのでやめる
- [x] サーバ/ローカルの選択
  - [x] 連動してほしい しないほうがいいかも？
  - [x] ローカルストレージに選択結果が残って欲しい
  - [x] localstorage からサーバ利用が読み込まれた → 未ログイン → ダイアログ
  - [x] ログインの自動遷移は消したほうがいいかも。なにやっているのかわからなくなる。
- [x] アーティアの武器名にスキル情報を含める
- [x] モンスターの肉質表への外部リンク
- [ ] その他スキルが localstorage に残らない
- [ ] その他スキルもスキルレベル固定がしたい
- [ ] 致命的バグ:
  - [x] スマホ版で過去履歴を閲覧中に最適化を実行すると結果が表示されない
  - [x] アーティア武器を更新したときに武器一覧の選択肢で最新が取得できない
  - [x] スロットがないと アーティア武器を追加できない
- [ ] 不要な項目の削除 (スキルのその他設定など)
- [ ] 注意書きを 開閉で表示する 理解したボタンで閉じたまま
- [ ] 動作確認
  - [ ] 別のアカウントでログインして、武器データ管理が適切にできるか確認
  - [ ] 別のブラウザでログイン
  - [ ] 別の端末でログイン
- [ ] ダメージ計算で考慮しているスキルが何なのかを明示する
- [ ] 使い方を書く

- [ ] スマホ版表示にタイルがあるとダサい
- [ ] UI上でスキルの有効無効を表示
  - [ ] フォースショットの発動率表示
  - [ ] 散弾・剛射、通常強化
  - [ ] 属性変換
  - [ ] 弱点特効
  - [ ] 火事場 と 食事火事場 (火事場は警告つけたほうがいいかも)

- [ ] ダメージ計算の結果をAPI経由で取得
- [ ] アーティア武器にスキルを4つ以上追加しようとしたときに、制限だけではなく、エラーメッセージを出す
- [ ] ダメージ計算検証の対応
  - [ ] 狂竜症の割合 出力を変更、ダメ計算があうか検証
  - [ ] フォースショット 出力を変更、ダメ計算があうか検証
- [ ] 蝕攻の追撃の属性の会心時ダメージおかしいかも
- [ ] 特殊ビン使用時に属性ダメージを消す処理
- [ ] アーティアデータのAPIのGET処理は list ではなく get 返すべきだと思う (1件だけなので)

 1 0.00 0.00
 2 0.00 0.00 
 3 0.00 0.00
 4 0.25 0.25
 5 0.20 0.40
 6 0.33 0.50
 7 0.28 0.57
 8 0.25 0.62
 9 0.22 0.66
10 0.20 0.70



# 注意点
- 黒蝕竜の力を使わずに狂竜症を発動できるケースに対応していない
  - 黒蝕竜の力を使わないと狂竜症の効果が得られない設定になっている
  - ゴアや狂竜症モンスターからの攻撃被弾を前提に狂竜症を運用する場合、黒蝕竜の力による黒蝕一体1は不要になる
  


[2][0][0]
シュヴァル化メイル [3][2][0]
誤差人流 アーム [1][1][1]
[3][2][0]
[3][1][1]
# TODO
- **バグ**
  - [x] iOSメモリエラー時のリトライ処理
    - [x] 同じエラーを開発環境で再現できるか？ 無理だった (4GB>にすると実行時にOOMで落とされる. iOSのエラーとは違う)
    - [x] メモリ上限検証用の wasm バイナリと js グルーコード, worker 一式
      - バイナリ作成: /home/hoge/work/wasm-memory-test/wasm-memory-test.worker.js
      - worker作成: /mnt/d/work/sslServer/workerWasmMemoryTest.js
      - とりあえず配置: /home/hoge/work/react-tutorial/dmax-wasm/public/wasm-memory-test/wasm-memory-test.wasm
      - worker 呼び出し関数でエラー処理&リトライ処理 
        - 4GBworker呼び出し→失敗→1GBworker呼び出し
        - 成功→localstorageに書き込み  
    - [x] ローカルストレージに実行可能メモリ上限を保存 (有効期限付き)
  - [x] スマホ版の使い方画像が見切れている問題
  - [x] ステージング環境の nginx 設定、バックエンド設定
  - [x] result history の更新タイミングがまた即時反映されなくなっている
  - [x] ローカル/サーバーの選択肢が localstorage に保存されていないように見える
  - [x] 最適化ボタン押下時に自動スクロール
  - [x] fab 修正分のリファクタリング
  - [x] 大半のドロップダウンメニューが動作しなくなった問題
    - swiper を消したら直った...
    - swiper 対応はやめる
  - [x] swipable 再検討
  - [x] 属性の並び順がおかしい
  - [x] 背景の下部分がなぜか白になる
  - [x] 結果と履歴の高さがあっていない問題
  - [x] 結果表示ウィンドウのスクロール廃止 (リファクタリング)
  - [x] localstorage のデータがリロードでリセットされるようになった(userInputData、護石、傀異錬成)
    - デフォルト値と比較して同じ場合は localStorage.set をしないようにして対応
  - [x] 傀異錬成削除などの確認ダイアログが未実装
  - [x] SSG 対応で白黒点滅するようになった問題
    - next-themes + mui + カスタムテーマの使い方を単体で試してみないとわからないかも
    - パッと解決できないので後回し
    - [MUI SSR ちらつき issue](https://github.com/mui/material-ui/issues/15588#issuecomment-1280626188)
    - [MUI ダークモードSSRちらつきを防ぐ](https://mui.com/material-ui/experimental-api/css-theme-variables/overview/)
    - [MUI + SSR: CSS変数](https://blog.arlenx.io/posts/use-mui-css-theme-variables-to-prevent-dark-mode-ssr-flickering-in-nextjs-app) 
    - [MUI + Nextjs 公式ガイド](https://mui.com/material-ui/guides/nextjs/#pages-router)
    - [MUI + Nextjs example github](https://github.com/mui/material-ui/tree/master/examples/material-ui-nextjs-pages-router)
    - [MUI Theming](https://mui.com/material-ui/customization/theming/)
    - [MUI useMediaQuery](https://mui.com/material-ui/react-use-media-query/#usemediaquery-query-options-matches)
    - [[RFC] CSS theme variables support #27651](https://github.com/mui/material-ui/issues/27651)
    - [ ] [かっこいい切り替わりアニメーション](https://blog.arlenx.io/posts/use-mui-css-theme-variables-to-prevent-dark-mode-ssr-flickering-in-nextjs-app)
    - [ ] [CPUスロットル6xを設定しても全く白が見えない謎技術](https://mui.com/)
  - [x] 小さい文字をスマホ向け MainTab に追加
  - [x] button group のマウスオーバー時の色がおかしい
  - [x] ローカル/サーバーのタブボタン判定がおかしい
  - [x] 錬成の確認ダイアログが護石になってる
  - [x] 中間出力とグラフの高さを適切に (スマホでのスクロール防止)
  - [x] ローカル/サーバーの設定がページリロードで消える
  - [x] OOMリトライ処理がおかしい
    - 4GB→throw error→なぜかcatch されていない
    - onmessage で例外投げてキャッチできるかテストする
    - できないなら localstorage に書き込んで if 判定→1GBでリトライ
  - [x] 現在のメモリ上限の表示
  - [x] webworker で発生した全ての例外をUI上に表示する
  - [x] oom で落ちた場合のエラー表示 (4GB/1GBともに)
  - [x] モバイルで長時間動作させたときの挙動の把握、できればユーザーにレスポンス
    - iPhone はエラー時に勝手にリロードされるので難しい (OOMのエラーは録画しても目視できなかった)
  - [x] スクロールバー表示と見た目の変更
  - [x] 履歴表示遷移がおかしい
    - [x] データ0件→一回目最適化完了→2回目最適化実行→履歴に表示されない
    - [x] データ1件以上→最適化完了→正常に表示→リロード→最後の結果が見えなくないか...？ (1件ずらして表示すべき？)
  - [x] 弾矢強化のUIを変更不可に変更
  - [ ] スマホ向けUIが壊れている等 UI微調整
    - [x] グラフ縦長すぎないか
    - [x] 実行途中結果画面のチェックなどのアイコンのマージン
    - [x] Responsive: 803x723 でキュリアや狂竜症などのボックスが崩れている
    - [x] Responsive: 910x723 で攻撃と見切り(Lv7)のスキルレベルバーと発動率バーが被っている
    - [x] FireFox で閲覧すると「狂竜症」「全属性耐性」の幅がおかしい
    - [x] iPhone で閲覧すると発動率100が見切れる
    - [x] 発動率
      - [x] スライダーのバーの太さが違う問題 (Windows Chromeでしか再現しなかったので保留)
      - [x] スマホ表示のときは下線を表示する
    - [x] 護石錬成テーブルの背景色がPaperでない問題
    - [x] iPhone:Safari で閲覧するとなぜか画面を左右に引っ張れる (Chromeは問題なし)
      - 縮小すれば直る
      - 単に拡大していただけっぽい (その履歴が残っていた？)
    - [x] スマホUIでは結果表示ウィンドウ内のスクロールを無しにしたい
    - [x] スマホ画面ではタブのアイコンを上下に
    - [x] 護石・傀異錬成テーブルのスマホ向け修正
    - [x] 数字入力がバグっている
    - [x] button group で押下後に色が戻らない
    - [x] スクロールバー
  - [x] Dark モードのアイコンを月にする
  - [x] SNSやDiscord等に貼り付けたときのサムネ概要表示 (embed?)
    - リッチプレビュー、リンクプレビューという
    - \<meta> タグの og: や twitter: などで指定できる
  - [x] fabicon 作成&設定
  - [x] 最適化オプション
    - [x] 護石傀異錬成の選択肢の分離 
    - [x] メインタブのアイコン変更
    - [x] ログインの確認
    - [x] ツールチップ
    - [x] メモリ上限
    - [x] ダークモードモード切替の表示を反転させる
    - [x] ツールチップと干渉する
    - [x] スマホ向け MainTab のマージン設定忘れ
    - [x] 履歴の Divider がなぜか貫通している
    - [x] 未ログイン状態で サーバー→ローカルに切り替えたときに Tooltip が画面左上に一瞬だけ飛ぶ
  - [x] 「対応武器種」などの表示が折り返している (スマホサイズ)
    - 少なくとも 非対応→非推奨に変更
  - [x] グラフとか実行画面が上で設定入力は下のほうがイイかもしれない
    - [x] 最適化ボタン押下時に非表示にできていない
    - [x] threshold を設定すればいけそう
  - [x] スマホの場合は結果と履歴を統合したほうがいいのでは..?
  - [x] 背景色との差分
  - [x] 最適化とグラフの統合
  - [x] 高速化
    - 表の行数制限
    - 不要なコンテンツをアンマウント
  - [ ] CDN検討
  - [ ] 広告検討
  - [x] バグ
    - [x] API 送受信に失敗の snackbar が表示されない
    - [x] 最適化結果がすぐに表示されない (護石除外などの適当なボタンを押すと更新される)
    - [x] がめんこわちゃった
    - [x] 多分スマホ版の result/history がバグっている
    - [x] スキルのその他入力だけ再レンダリング阻止できてない
    - [x] 全属性耐性が100以上入力できない
    - [x] 計算結果が一周遅れてきている気がする
  - [x] 警告系
    - [x] unique key エラーを消す
    - [x] Image has legacy prop "objectFit". Did you forget to run the codemod?
  - [ ] プライバシーポリシーや著作権のフッター
  - [ ] 高速化検討
    - [ ] 他の人の React 実装を見てみる
    - [ ] [PageSpeed Insights指摘事項](https://pagespeed.web.dev/analysis/https-www-mhrspeedrun-com-dmax/qfhdby22i6?form_factor=desktop)
    - [x] Pixel3a でみるとめっちゃ重い
    - 参考記事
      - Reactのレンダリングに関する完全ガイド - Qiita
      - React (+ Redux) アプリの state 更新に関するパフォーマンス戦略 - 30歳からのプログラミング
      - Reduxを用いる時にオススメしたい3つのTips - aptpod Tech Blog
      - なぜReactは標準でComponentをmemo化しないのか？
  - [ ] ログイン画面の見た目をまともにする
    - [ ] [すばらしいサンプル コード付き](https://mdbootstrap.com/docs/standard/extended/login/#example3)
    - [ ] [Styling django-allauth Authentication Pages](https://builtwithdjango.com/blog/styling-authentication-pages)
    - [x] CSS力が足りない
      - [x] https://developer.mozilla.org/ja/docs/Learn/CSS
      - [x] [次はここから: レイアウト](https://developer.mozilla.org/ja/docs/Learn/CSS/CSS_layout/Introduction)
      - [x] CSS設計の教科書
  - [ ] 最適化の特性を書く (物理だけなら速い、属性も入ると重い、防具数が増えてもそこまで？)
    - [ ] スマホの場合、計算機だけ内部にタブ [参考](https://damage.paimon.app/calculator/)
  - [ ] 動作テスト
    - [ ] ローカル/サーバーのデータ有り無しでの最適化確認
    - [ ] 複数デバイスで使ったときにサーバーデータが消えた気がする(iphone safari と windows chrome)
  - [ ] テーマカラーの色候補: [Zenn](https://zenn.dev/ame_x/articles/e314ce3a84ad1f)
  - [ ] Fab をなんとかする
  - [x] Next.js 移行対応
    - [x] images ファイルの修正 (なにか変わってるか確認?)
    - [x] SSG/SSR対応 window, localstorage など
  - [x] console にでている warning を消す
  - [x] dmax問題出力APIの移植
  - [x] 護石テーブルのサーバー護石のUIが壊れている
  - [x] wasm ハンドルされていない例外の表示
  - [x] error message received from worker: Uncaught ReferenceError: SharedArrayBuffer is not defined
  - [x] 読みやすい段落幅 https://www.gizmodo.jp/2023/12/google-gemini.html
  - [x] 並列ソルバ起動 の欄 で1スレッドだけ表示されない
  - [x] 警告表示
    - [x] スマホの最適化処理の動作速度 
    - [x] localstorage だけだとiOSなどで消える可能性が高い問題
  - [x] ログインしないと API 通信で403になり最適化が実行できない (ログインすればローカル/サーバーどちらもいける)
  - [x] 「ログイン状態の確認に失敗しました」のメッセージがおかしい(未ログイン状態なのにでる)
  - [x] 認証が機能しているかチェック (護石など)
  - [x] ダメージスキルのところに "使い方" タブへ誘導するボタン
  - [x] BEの問題作成APIをcmsからdmaxに移植する
  - [x] 護石と傀異錬成でログイン用ダイアログが開かなくなってしまった
  - [x] CI/CDドキュメントを書く
  - [x] スマホのサイドパネル用リンクとボタン
  - [x] ドロップダウン選択時に Fabボタン(最適化) が動いてしまう問題
  - [x] sharedArrayBuffer is not defined をcatchして表示する仕組み
  - [x] 水やられが計算に反映されない
  - [x] QAテーブルに色を反映させる
  - [x] 履歴へデータを移すタイミングが遅い (たぶん計算完了時に移行になっている)
  - [x] カラーテーマをlocalstorageに保存
  - [x] 計算中にタブを切り替えると処理が中断される
  - [x] 計算中にタブを切り替えると state が消えて計算結果がわからなくなる
    - [x] 原因不明なので contextAPI に切り替える方針
  - [x] 最適化不可能のときのアイコンがほしい
  - [x] 中止を押したときの表示がおかしい
  - [x] 装備が組めなかったときに "並列ソルバ起動" がクルクル回り続ける
  - [x] 護石で同じスキルが追加できてしまう問題 再現方法: 攻撃→見切り→攻撃削除→見切り
  - [x] 傀異錬成防具未選択状態で登録を押すとエラー
  - [x] 空の護石を追加出来てしまう問題

- **High 最優先:**
  - [x] [最適化問題作成APIリクエスト先変更]
  - [x] [ローカルのCSVコピペボタンがない]
  - [x] ユーザ護石データDB保存 API提供
    - [x] APIの実装 (セッション認証付き)
    - [x] 同期処理
    - [x] 最適化時の利用データの差し替え
    - [x] 護石データが未登録の状態でのPOST処理がおかしい
    - [x] 未ログイン時自動遷移
    - [x] API URL 環境変数化
    - [x] nginx サーバー立ててログイン時の?next=の挙動確認
    - [x] UI
      - [x] APIエラーを通知
      - [x] 手動同期ボタン
      - [x] local/server の切り替えタブ
      - [x] ログイン遷移
        - [x] ログイン画面遷移ダイアログ
        - [x] 自動遷移オプション
      - [x] ログイン/ログアウトボタン
      - [x] ログイン中のみ自動同期
      - [x] 自動同期不具合 (ログイン状態でdmax開く→護石→サーバー選択→同期)
      - [x] ドロワーにログインボタン追加
      - [x] local/server の選択肢を localstorage に保存
      - [x] 未同期なのかデータが空なのかがわかるテーブルUIにする
      - [x] csvコピペボタン (ローカル⇔サーバのデータ移動で利用)
      - [x] local/server の状態表示 (タブ上, 最適化パネル) fetch 済みか否か local/server-fetched/server-not-fetched
      - [x] local/server がひと目で分かるように
      - [x] ツールチップがダイアログを貫通してしまう (z-index?)
      - [x] ツールチップが「最適化」タブ以外でも表示されている
      - [x] 削除や上書き操作に警告
        - [x] Server
        - [x] Local
      - [x] メタデータ表示
  - [x] ユーザ傀異錬成データDB保存 API提供
    - [x] APIの実装 (セッション認証付き)
    - [x] UIと同期処理の実装
  - [x] 使い方
  - [x] ステージング環境
  - [x] CI/CD: [デプロイやり方](https://softwarenote.info/p3789/)
  - [x] ヘッダ/メニュー
  - [x] ローカルビルド&コピーのスクリプト と 手順ドキュメント整備

- **Midle 実装予定:**
  - [ ] リファクタリング
      - [ ] RampageDecoなどの updateUserInputData を setter に修正できると思う
      - [ ] DmaxResult の ouputTo を DmaxSolver に移動したほうが良さそう
      - [ ] 状態管理 Context, Recoil, Redux
      - [ ] 名称整理
  - [ ] 表のページネーションの有効/無効を切り替えるUIを追加する？
  - [ ] 広告をはる？
  - [ ] CDN設定
    - [WebPageTest](https://www.webpagetest.org/)
  - [ ] fab の位置を css で決めたらjsによる移動を抑えられないか？
  - [ ] UI高速化検討
    - [ ] 巨大state分割&usememo検討
    - [ ] データ件数が多いと重い
    - [ ] Tab を アンマウントにする (データ件数が多いと重い)
    - [ ] バーチャルスクロールによって高速化検討 [バーチャルスクロール](https://zenn.dev/kohii/articles/13fbf3d0dc2170)
    - [ ] 初期表示のとき表示されないタブの描画やjs実行を遅らせる事はできないか？
  - [ ] フォントのカスタマイズ
  - [ ] スマホ表示の「スキル名」と「発動率入力・プラマイボタン」の高さがずれている
  - [ ] 位置ページあたりの護石・傀異錬成の数を制限しないと重いかもしれない (550から600個程&開発環境)
  - [ ] スレッド数, しきい値の変更機能, 除外のトグルボタン化("護石を含める")
  - [ ] ローカルストレージを利用する場合に警告 (選択肢を記憶できるように)
  - [ ] 英語対応
  - [ ] 最適化中の中間出力の頻度を上げられないか？(変化してなくてもいいので)
  - [ ] fab をもっとでかい丸いアイコンにしたい 参考: Twitter 
  - [ ] 履歴が見れても最適化の条件がわからない
  - [ ] 結果・履歴の表示を見やすくする
  - [ ] [CPUスロットル6xを設定しても全く白が見えない謎技術](https://mui.com/)
  - [ ] [使い方にこういう目次を加えたい](https://blog.arlenx.io/posts/use-mui-css-theme-variables-to-prevent-dark-mode-ssr-flickering-in-nextjs-app)
  - [ ] 何分前、昨日、1-31... のような日時表示
  - [ ] デバッグビルドにのみ print する設定?(いるか？)
  - [ ] [PageSpeed Insights](https://pagespeed.web.dev/analysis/https-www-mhrspeedrun-com-dmax/qfhdby22i6?form_factor=desktop)
    - SSG対応前
      - [2024/01/21 22:42:28 に作成したレポート](https://pagespeed.web.dev/analysis/https-www-mhrspeedrun-com-dmax/qfhdby22i6?form_factor=desktop)
      - [2024/01/22 15:16:17 に作成したレポート](https://pagespeed.web.dev/analysis/https-www-mhrspeedrun-com-dmax/mg6qzk9212?form_factor=desktop)
      - [2024/01/22 16:18:24 に作成したレポート](https://pagespeed.web.dev/analysis/https-www-mhrspeedrun-com-dmax/ael5x5e6bs?form_factor=mobile)
    - SSG対応後
      - [2024/01/22 17:56:21 に作成したレポート](https://pagespeed.web.dev/analysis/https-www-mhrspeedrun-com-dmax/bfmu5ix4zl?form_factor=mobile)
      - [2024/01/22 17:59:50 に作成したレポート](https://pagespeed.web.dev/analysis/https-www-mhrspeedrun-com-dmax/d1syh34che?form_factor=mobile)
  - [ ] [更新履歴ページ](https://damage.paimon.app/)
  - [ ] 追加スキルの追加方法 ポップアップ&複数選択可能 [参考](https://mhrise-simulator.vercel.app/)
  - [ ] 弾強化・闇討ちの発動率設定
  - [ ] 状態管理ライブラリ Recoil 検討
  - [ ] WebSockets などによるリアルタイム同期
  - [ ] cloudflare + nextjs の設定
  - [ ] 狂竜症感染率ツールチップ
  - [x] コンテンツの高さが足りないときに body の白色が見えてしまう (再現方法: めいっぱい縮小表示するなどしてウィンドウの高さを埋められないようにする)
  - [ ] サーバにユーザデータ保存
  - [ ] ひらがなカタカナ検索
  - [ ] 結果の欄を読みやすいUIにする
  - [ ] 水やられ時の肉質を表示
  - [ ] Dark/Lightモード切替時のアニメーションかっこいい(https://blog.arlenx.io/posts/use-mui-css-theme-variables-to-prevent-dark-mode-ssr-flickering-in-nextjs-app)
  - [ ] light/darkのカラーテーマを適切に切り替える(theme.pallet.primary.mainをそれぞれのモードに対応する色に)
    - [ ] [MUI v5 Theme ～基本の使い方からカスタマイズまで～](https://zenn.dev/longbridge/articles/c100d0311ed1be)
    - [ ] [ここで定義したcolorThemeを import して theme と入れ替えればいいのでは？](https://github.com/potkrin/dmax-wasm/blob/d167ca8702337a3e14c26e030bf0c7dafcce83f9/src/App.js#L226)
    - [ ] カラー自動決定してくれるサイト↑
    - [ ] ContextAPI 孫コンポーネントに渡せるらしい
  - [ ] タブ移動で入力中の項目が消える 再現方法: 護石タブでスキル入力→傀異錬成タブに移動→護石タブに戻る
  - [ ] 処理やデータの流れを図にしたい(特にdmax中間出力の処理)
  - [ ] プリセット
  - [ ] マイセット
  - [ ] 履歴

- **いつか:**
  - [ ] スキルシミュモード
  - [ ] ダメージ計算モード
  - [ ] ダメージ計算伸びグラフモード
  - [ ] scip-wasm メモリ問題, 他ライブラリ問題
  - [ ] 中間結果を表示できないか?
  - [ ] 別武器に対応
  - [ ] APIアクセス制限

# TODO
- 狂竜症感染率を NumberTextField に変更
- API取得 SnackBar: error時に close -> open にすれば snackbar は2つ→1つにできるかも
- マウスオーバーでスクロールバーが表示される
- 履歴データは indexedDB に保存
- コピペ完了時にメッセージ
- 結果表示の整形 (アイコン,文字装飾)
- 状態によって動的にUIの色を変化させる https://mui.com/material-ui/customization/how-to-customize/#dynamic-overrides
  - 0でない要素だけ色を変化させるなど
  - 選択されたチェックボックスの文字列の色を青色にする
- いろいろなUIのカスタマイズ方法 https://mui.com/material-ui/customization/how-to-customize/
  - バーを太くする、色を変えるなど
- wasm が利用可能か確認
- アニメーションを付けられる https://mui.com/material-ui/transitions/
- グラフのよいカスタム例
  - https://app.members-portalone.net/index.php?code=3eac6194b5591ce019f9a35ec8dcef27546b681a6052ffa8e85486981d68ad0a&state=c251d67c78ab22f18f795ed15335d8058b0d14b4558a7f873a7f710fff32dbb2&m=d56e0e0b7aebba00395d2848953240d802173fad61aac98bbebe168333790128
- 数値入力フィールドに -/+ ボタン追加 https://github.com/mui/material-ui/issues/19154


- 検索ボックス付きスキル入力はコンポーネント化できるかも?
  - 傀異錬成入力, 護石入力, メイン画面
- 参考になるテーマ作成サイト https://bareynol.github.io/mui-theme-creator/
  - +/- ボタン https://mui.com/material-ui/react-badge/#badge-visibility
- Tab切り替えの SwipeableView の最有効化
  - Fab の position がずれる問題のため無効化している

# 護石・錬成データ リモート管理設計（サーバーのDB上で管理）
## なぜ分離するか
当初はlocalstorage上のデータをサーバーのDBに保存するデータと同期する計画でした。
しかし、非ログイン状態での更新や別ブラウザによる更新を考慮するとlocalstorage側とDB側のどちらのデータをユーザーが望んでいるのかを判断するのが難しく、それによって同期制御も複雑になりそうだったのでやめました。
複雑になる原因はデータの保存箇所が2箇所あることなので、単一責任の原則に則りlocalstorageに保存するデータとDBに保存するデータを完全に分離して管理する方針ですすめます。

- データ保存場所: サーバーDB上のレコード 
- ServerCharmData: ブラウザ上の護石データ（サーバーDB上のレコードのGET結果）
- データの流れ
  - 追加/上書き/削除:
    1. POST (ServerCharmData + 護石データ差分) 
    2. GET -> ServerCharmData に保存
  - 取得:
    1. GET (ServerCharmData - 削除護石) 

## モード管理
モード
1. ServerCharmData モード: サーバー上のデータを利用 (ブラウザ間共有あり)
2. LocalCharmData モード: localstorage に保存したデータを利用 (ブラウザ間共有なし)

状態管理変数 ServerCarmDataMode : True/False
- True:
  - userCharmData = ServerCharmData 
  - ServerCharmManager
- False:
  - userCharmData = localstorage.getItem(userCharmData)
  - LocalCharmManager





# これは何?
dmax シミュレータの wasm 版です。ブラウザ上で dmax を動作させることを目的とします。

# 動かし方
開発環境
```sh
hoge@:dmax-wasm$ hostname
DESKTOP-BP23A1J

hoge@:dmax-wasm$ pwd
/home/hoge/work/react-tutorial/dmax-wasm

hoge@:dmax-wasm$ npm run dev

> dmax-wasm@0.1.0 dev
> node server.js

> Ready on http://localhost:3000
 ○ Compiling / ...
 ✓ Compiled / in 1815ms (2493 modules)

```

本番ビルドの動作確認
```sh
hoge@:dmax-wasm$ hostname
DESKTOP-BP23A1J

hoge@:dmax-wasm$ pwd
/home/hoge/work/react-tutorial/dmax-wasm
hoge@:dmax-wasm$ npm run build

> dmax-wasm@0.1.0 build
> next build --no-lint

 ⚠ Linting is disabled
 ✓ Checking validity of types
   ▲ Next.js 14.0.4

 ✓ Creating an optimized production build
 ✓ Compiled successfully
 ✓ Collecting page data
 ✓ Generating static pages (3/3)
 ✓ Collecting build traces
 ✓ Finalizing page optimization

Route (pages)                              Size     First Load JS
┌ ○ / (418 ms)                             360 kB          439 kB
├   /_app                                  0 B            78.4 kB
├ ○ /404                                   182 B          78.6 kB
└ λ /api/hello                             0 B            78.4 kB
+ First Load JS shared by all              78.7 kB
  ├ chunks/framework-10fac88913917d91.js   45.2 kB
  ├ chunks/main-18598cceffbdea39.js        31.8 kB
  ├ chunks/pages/_app-fee1c4e9c5c504fd.js  300 B
  ├ chunks/webpack-36d12a75f0098f30.js     1.05 kB
  └ css/23bc28149f53614d.css               282 B

○  (Static)   prerendered as static content
λ  (Dynamic)  server-rendered on demand using Node.js

hoge@:dmax-wasm$ npm start

> dmax-wasm@0.1.0 start
> next start

   ▲ Next.js 14.0.4
   - Local:        http://localhost:3000

 ✓ Ready in 153ms

```

# カスタムヘッダーの利用
wasm をブラウザで利用するためのカスタムHTTPヘッダーを付与するため、Express サーバーを導入します。
Express -> Next.js のようにアクセスされます。

```sh
npm install express
```

/server.js を定義し、npm コマンドを修正します。

```js
"scripts": {
    "dev": "node server.js",
    "build": "next build --no-lint",
    "start": "next start",
    "lint": "next lint"
  },
```

以下のコマンドで開発環境のサーバーを起動します。

```sh
npm run dev
```

本番環境/ステージング環境では nginx の設定ファイルでカスタムHTTPヘッダーを付与します。

```ini
# リダイレクトを流される側の設定
server {
    # 設定しているウェブサイトへのリクエストを通すポート
    # listen 443 ssl default_server;
    listen 8000 ssl default_server;
    # ウェブサイトのIPもしくはドメイン名
    server_name www.mhrspeedrun.com;
    ssl on;
    ssl_certificate /etc/letsencrypt/live/www.mhrspeedrun.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/www.mhrspeedrun.com/privkey.pem;

    # dmax-wasm (Next.jsサーバー) への振り分け
    location /dmax {
        proxy_pass http://localhost:3001/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        # カスタムヘッダーを追加
        add_header Cross-Origin-Opener-Policy "same-origin";
        add_header Cross-Origin-Embedder-Policy "require-corp";
    }

    location /_next/static/ {
        proxy_pass http://localhost:3001/_next/static/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        # カスタムヘッダーを追加
        add_header Cross-Origin-Opener-Policy "same-origin";
        add_header Cross-Origin-Embedder-Policy "require-corp";
    }

    location /dmax-core/ {
        proxy_pass http://localhost:3001/dmax-core/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        # カスタムヘッダーを追加
        add_header Cross-Origin-Opener-Policy "same-origin";
        add_header Cross-Origin-Embedder-Policy "require-corp";
    }
    ...略

```


# ファイル説明
参考: [Next.js Pages Router チュートリアル](https://nextjs.org/learn-pages-router/basics/create-nextjs-app)
| ファイル | 説明 |
| ---- | ---- |
| pages/ | ルーティングに利用されるフォルダ |
| pages/api/ | Next.js で提供したいAPIを定義するフォルダ (dmax-wasmでは利用しない予定) |
| pages/index.js | **http://localhost:3000/ へのアクセスに対応するファイル。ここから App.js などの dmax-wasm のコンポーネント群を呼び出す。** |
| components | pages から呼び出すコンポーネント群 |
| .github/workflows/ | github Actions による CI/CD の設定ファイル |
| exosystem.config.js | pm2 によるサーバー起動オプションを定義。github actions のスクリプトで利用 |
| public/dmax-core/ | wasm版 dmax のバイナリとその js グルーコード, 呼び出しのための webworker などを定義しているファイル群。public以下に配置しないと、**reactのテンプレートhtmlに上書きされてしまう**場合があるため、public以下に配置する。 |
| data/ | 静的なデータを定義 |
| build-and-copy.sh | (DUPLICATED) 旧 create-react-app バージョンにおいて Django サーバーのローカルリポジトリにファイルをコピーするのに利用していたスクリプトファイル。不要だが残しておく。 |



# 動作重くない？
以下の手順によりプロダクションビルドで試してみてください。
```sh
$ npm run build
$ npm start
```

単一のstate (中身はオブジェクト) で全てのUIコンポーネントの状態管理しているため、ある一つのUIに入力を行うとほぼすべてのUIパーツに再レンダリングが走ります。
ユーザ入力データの管理を簡単にするためにこのような設計にしていますが、プロダクションビルドにしても重い場合は以下のような最適化を考えます。

- state の分割
- メモ化
- React ContextAPI の利用 ...

Pixel3a (4年半程前の機種) でアクセスしたところストレスフルな動作だったので分割&メモ化を検討します。

# ブラウザ別の制限事項
- [Webブラウザ、レンダリングエンジン、JavaScriptエンジンの整理&図視化](https://qiita.com/umashiba/items/8cb47825624c5cb043d6)
### wasm のメモリ上限
- iOS: 1GB (たぶんWebKitの制限?)
- その他: 4GB (wasm32の制限)
### localstorage の有効期限
- [WebKit:7-Day Cap on All Script-Writeable Storage](https://webkit.org/tracking-prevention/#:~:text=to%2024%20hours.-,7%2DDay%20Cap%20on%20All%20Script%2DWriteable%20Storage,-Trackers%20executing%20script)
- WebKit のブラウザ(iOS上の全てのブラウザ&Safari)は7日で localstorage や indexedDB などの保存データをユーザーの同意を得ず勝手に消す
- ストレージとはいったい...? 勘弁してほしい

# エラーハンドリング: Shared Array Buffer is not defined
- wasm バイナリを再コンパイルした場合, brachistochrone.js に以下を追記する
```js
if (ENVIRONMENT_IS_PTHREAD) {
  wasmMemory = Module["wasmMemory"];
} else {
  if (Module["wasmMemory"]) {
    wasmMemory = Module["wasmMemory"];
  } else {
    wasmMemory = new WebAssembly.Memory({
      "initial": INITIAL_MEMORY / 65536,
      "maximum": INITIAL_MEMORY / 65536,
      "shared": true,
    });

    // ここから追加
    if (typeof SharedArrayBuffer === "undefined") {
      throw new Error("SharedArrayBuffer is not defined");
    }
    // ここまで追加

    if (!(wasmMemory.buffer instanceof SharedArrayBuffer)) {
      err(
        "requested a shared WebAssembly.Memory but the returned buffer is not a SharedArrayBuffer, indicating that while the browser has SharedArrayBuffer it does not have WebAssembly threads support - you may need to set a flag"
      );
      if (ENVIRONMENT_IS_NODE) {
        err(
          "(on node you may need: --experimental-wasm-threads --experimental-wasm-bulk-memory and/or recent version)"
        );
      }
      throw Error("bad memory");
    }
  }
}
```

# webworker からの postmessage が途中で途切れる問題
起動した webworker を terminate するタイミングが早すぎると未送信の postmessageが受信できなくなります。
デバッグビルドでは動作が遅いため発生しづらいですが、プロダクションビルドでは高速に動作するため問題が発生しやすくなります。

```js
  useEffect(() => {
    // dmax 最適化が完了したら allDmaxOutput に全ての中間結果を渡す (出力整形は DmaxResult と DmaxHistory コンポーネントで行う)
    if (dmaxOutput.includes("SCIP Status")) {
      updateAllDmaxOutput(dmaxOutput);
      // 最適化完了をボタンに反映
      setIsOptimizing(false);
      // 終了処理が早すぎて message を受信できず終了する
      // startWasmWorker.terminate();
    }
  }, [dmaxOutput]);
```

### 対策
1. 正常系・異常系において wasm プログラムが終了する際に出力されるメッセージを固定する
2. 終了処理を行わない



# アンマウントでstateが消える問題
## 考えられる原因
1. 自身を含む祖先の条件分岐等でレンダーされなくなるときアンマウントされる (hiddenやcssによる非表示で解決できる)
2. styled コンポーネント https://github.com/potkrin/unmount-caused-by-styled-div/tree/master
3. React.StrictMode を利用すると再マウントされる

## styled('div') の子要素内でタブ切り替えを実行するとタブ子要素がアンマウントされる問題
以下のリポジトリで再現可能
- https://github.com/potkrin/unmount-caused-by-styled-div

なにが問題か？
- タブ切り替えを行うと、タブ子要素がアンマウントされタブ子要素の state がリセットされてしまうという問題
- 一つのタブ内で重い処理とその中間出力表示を行う予定なので、中間出力を管理している state が消えると致命的

#### おしえて ChatGPT-4 先生！
ChatGPT 4

> コード内でstyledコンポーネント（AppDiv）を使用するとタブ切替時にアンマウントが発生する理由は、AppDivコンポーネントがApp関数コンポーネント内で定義されているためです。この配置により、Appコンポーネントの状態（この場合はタブの状態）が変更されるたびに、Appコンポーネントが再レンダリングされます。そして、AppDivも再作成され、新しいインスタンスとして扱われます。
>
> Reactでは、コンポーネントのインスタンスが変わると、そのコンポーネント内の子要素も新しいものとして扱われます。これにより、子要素はアンマウントされ、新しいインスタンスがマウントされます。そのため、TabChildコンポーネントもアンマウントされ、新しいインスタンスがマウントされます。
> 
> 一方、\<div>要素の場合、これはプリミティブなHTML要素であり、再レンダリング時に新しいインスタンスが生成されることはありません。従って、\<div>を使用する場合、子要素は不要にアンマウントされることはありません。
> 
> この問題を解決するためには、AppDivコンポーネントをAppコンポーネントの外に移動させることが効果的です。これにより、AppDivはアプリケーションのライフサイクルにわたって一貫したインスタンスを保持し、その子要素の不必要なアンマウントを防ぐことができます。


アンマウントで消えてほしくない state は親コンポーネントで定義して ContextAPI 経由で子・孫コンポーネントに渡したほうが安定かも

再現手順
```sh
git clone git@github.com:potkrin/unmount-caused-by-styled-div.git
cd unmount-caused-by-styled-div

# npm を導入しておいてください
# $ npm --version
#   6.14.15

npm install
npm start
# ブラウザで http://localhost:3000/ 等にアクセス
# devtools のコンソールを開いた状態でタブを切り替える
```


# Reactのレンダリングタイミング
そもそもReactデフォルトの機能でコンポーネントの再レンダリングが走るタイミングは以下のパターンになります。

1. 親コンポーネントがレンダリングされた場合（子コンポーネントのpropsに変更があったかは関与しない）
2. stateが変更された場合
  - クラスコンポーネントのthis.setState()
  - 関数コンポーネントのuseStateのセッター
  - 関数コンポーネントのuseReducerの dispatch()
3. ContextのValueが変更された場合（ConsumerComponent限定）

※stateが変更された場合は、変更前と変更後でstateをshallow比較して差分があった時のみ再レンダリングされる

※強制レンダリングであるforceUpdateの実行は除く

参考:[React、Reduxのレンダリングとメモ化のタイミングまとめ](https://qiita.com/obake_fe/items/252b48b61df435e68fc2)

# スマホ向けスワイプ機能について
タブ切り替えをスワイプで実現するためのライブラリを試してみましたが、いずれもうまく動作しなかったのでやめます

以下試したもの
- [react-swipeable-views](https://github.com/oliviertassinari/react-swipeable-views)
  - Fab の位置がおかしくなる (viewport に対して固定できない)
  - 開発停止 & react18 非対応
    ```sh
    $ npm install react-swipeable-views --dry-run
    npm ERR! Could not resolve dependency:
    npm ERR! peer react@"^15.3.0 || ^16.0.0 || ^17.0.0" from react-swipeable-views@0.14.0
    ```
- [swiper](https://github.com/nolimits4web/swiper)
  - mui の Select コンポーネントによるドロップダウンが機能しなくなった
  - Fab の位置がおかしくなる (viewport に対して固定できない)

代わりにスマホ表示ではタブボタンを画面下部に表示します(MUI の BottomNavigation のようなもの)

# dark-mode SSR/SSG flickering 対策
追加インストールメモ _φ(･\_･)
```js
npm install  @emotion/cache @emotion/server @mui/material-nextjs prop-types
```


# wasm コピースクリプト メモ
```sh
cd /home/hoge/work/scipoptsuite-8.0.3/build_webdemo/bin/examples/
mv brachistochrone.html brachistochrone1GB.html
mv brachistochrone.js brachistochrone1GB.js
mv brachistochrone.worker.js brachistochrone1GB.worker.js
mv brachistochrone.wasm brachistochrone1GB.wasm
mv brachistochrone.data brachistochron1GB.data
cp brachistochrone1GB.* ~/work/react-tutorial/dmax-wasm/public/dmax-core/
```

# SVG画像作成
- [Convertio](https://convertio.co/ja/download/76db31c5b311b3272d0da4806af20b909a0775/)
  - SVGに変換してくれる
- ```fill="currentColor"``` を指定する
```js
<SvgIcon>
  <svg
    version="1.0"
    xmlns="http://www.w3.org/2000/svg"
    width="512.000000pt"
    height="512.000000pt"
    viewBox="0 0 512.000000 512.000000"
    preserveAspectRatio="xMidYMid meet"
  >
    <g
      transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)"
      fill="currentColor" // ここ
      stroke="none"
    >
      <path
        d="M903 4960 c-58 -35 -67 -61 -74 -205 -5 -104 -11 -145 -32 -204 -89
-252 -324 -407 -607 -399 -97 3 -120 -6 -164 -66 -46 -61 -11 -254 76 -416
111 -209 291 -357 528 -436 80 -26 96 -28 255 -29 148 0 180 3 248 23 347 100
600 396 648 756 13 104 7 205 -21 324 -74 315 -335 576 -652 652 -106 25 -164
25 -205 0z"
      />
      <path
        d="M2210 4964 c-126 -13 -384 -60 -407 -72 -9 -5 5 -31 47 -87 101 -134
179 -306 211 -463 l13 -62 50 -15 c265 -79 610 -79 872 0 l49 15 27 111 c33
137 111 299 197 414 42 55 57 82 48 86 -25 15 -278 59 -420 74 -178 18 -512
18 -687 -1z"
      />
      <path
        d="M4005 4959 c-425 -104 -723 -540 -666 -974 42 -312 231 -573 514
-705 137 -65 235 -83 407 -77 123 4 158 8 230 32 242 78 430 238 542 460 75
147 104 335 62 391 -44 60 -67 69 -164 66 -283 -8 -518 147 -607 399 -21 59
-27 100 -32 204 -7 144 -16 170 -74 205 -41 25 -106 25 -212 -1z"
      />
      <path
        d="M2070 3888 c-57 -329 -252 -622 -530 -799 -41 -27 -83 -54 -93 -61
-17 -12 22 -32 340 -177 197 -91 393 -177 435 -192 211 -77 450 -78 664 -5 88
30 804 357 804 367 0 4 -9 11 -21 14 -43 14 -198 126 -270 197 -180 174 -297
390 -345 634 -9 49 -18 90 -19 92 -2 2 -50 -6 -108 -17 -241 -47 -493 -47
-731 -1 -56 11 -104 20 -107 20 -3 0 -12 -33 -19 -72z"
      />
      <path
        d="M1035 2655 c34 -129 64 -237 66 -239 8 -8 1451 -666 1460 -666 8 0
1450 657 1456 664 8 7 123 451 121 462 -2 7 -238 -96 -537 -233 -294 -134
-571 -256 -615 -272 -149 -53 -234 -66 -426 -66 -295 0 -320 8 -1052 344 -290
132 -529 241 -531 241 -2 0 24 -106 58 -235z"
      />
      <path
        d="M1187 1948 c12 -142 9 -520 -6 -638 -7 -58 -24 -166 -37 -240 -14
-76 -23 -149 -19 -167 13 -71 26 -79 726 -429 545 -272 676 -334 709 -334 33
0 164 62 709 334 700 351 713 358 726 429 4 19 -3 80 -14 139 -54 279 -74 610
-52 857 7 73 10 136 7 139 -3 2 -304 -132 -668 -299 -560 -256 -670 -303 -708
-303 -37 0 -118 34 -455 188 -832 382 -908 416 -917 416 -5 0 -6 -38 -1 -92z"
      />
    </g>
  </svg>
</SvgIcon>
                   
```

## アイコン
- [防具アイコン](https://www.iconfinder.com/icons/3938246/armor_body_costume_equipment_glove_knight_protection_icon)
- [護石アイコン](https://www.iconfinder.com/icons/7345925/talisman_amulet_charm_luck_accessory_esoteric_superstition_icon)

# lightTheme と darkTheme の要素を対称にしないとクラッシュする
SSGのちらつき対策のため導入した CSSVarsProvider によるテーマ(src/theme.js)において
**lightTheme にのみ primary.contrastText と background.paper がなかった時、**
以下の条件でアプリケーションがクラッシュした
- staging 環境で npm run build; PORT=3001 npm run start;
- ログイン中
- ライトモード

開発環境や staging 環境の未ログイン状態では再現しなかった

コンソールのエラーメッセージ (CSSVariables関連っぽい事以外さっぱりわからなかった)
```sh
framework-10fac88913917d91.js:9 TypeError: Cannot read properties of undefined (reading 'type')
   at i (_app-896c02c779f6212a.js:24:12926)
   at m (_app-896c02c779f6212a.js:24:14884)
   ... 略
```

# CDN検討
[WebPageTest](https://www.webpagetest.org/) でロケーションを指定して Largest Contentful Paint (LCP) を計測する
## FirstView
| URL           | 位置       | TFB    | LCP    | 結果 |
| ----          | ----       | ----   | ----   | ---- |
| :8000/dmax    | 東京       | 0.390S | 0.802S | https://www.webpagetest.org/result/240212_BiDcK1_TX/ |
|               | 大阪       | 0.224S | 0.592S | https://www.webpagetest.org/result/240212_AiDcBM_T3/ |
|               | シドニー   | 0.843S | 1.350S | https://www.webpagetest.org/result/240212_BiDcXX_TZ/ |
|               | 北京       | 1.072S | 1.578S | https://www.webpagetest.org/result/240212_AiDcK8_XV/ |
|               | バージニア | 1.093S | 1.714S | https://www.webpagetest.org/result/240212_BiDcBF_S8/ |
|               | サンパウロ | 1.304S | 1.947S | https://www.webpagetest.org/result/240212_AiDcBM_T3/ |
| sbfree/quest/ | 東京       | 1.004S | 1.825S | https://www.webpagetest.org/result/240212_AiDcM6_XZ/ |
|               | 大阪       | 1.140S | 1.856S | https://www.webpagetest.org/result/240212_BiDc9B_V1/ |
|               | シドニー   | 1.540S | 2.357S | https://www.webpagetest.org/result/240212_BiDcTC_VR/ |
|               | 北京       |  |  |  |
|               | バージニア | 2.044S | 3.120S | https://www.webpagetest.org/result/240212_AiDc5A_Y6/ |
|               | サンパウロ | 2.801S | 4.202S | https://www.webpagetest.org/result/240212_BiDcN5_VT/ |



[WebPageTest](https://www.webpagetest.org/) でロケーションを指定して Largest Contentful Paint (LCP) を計測する
- 同一のVPSで Next.js と Django が稼働中
- CDNなし
- Next.js は SSG
- Django は動的データからページを作成して返すので実質SSR

| URL           | 位置       | TFB    | LCP    |
| ----          | ----       | ----   | ----   |
| Next.js (SSG) | 東京       | 0.390S | 0.802S |
|               | 大阪       | 0.224S | 0.592S |
|               | シドニー   | 0.843S | 1.350S |
|               | バージニア | 1.093S | 1.714S |
|               | サンパウロ | 1.304S | 1.947S |
| Django (SSR)  | 東京       | 1.004S | 1.825S |
|               | 大阪       | 1.140S | 1.856S |
|               | シドニー   | 1.540S | 2.357S |
|               | バージニア | 2.044S | 3.120S |
|               | サンパウロ | 2.801S | 4.202S |

## First and Repeat
| URL           | Location  | TFB (F) | LCP (F) | TFB (R) | LCP (R) | result |
| ----          | ----      | ----    | ----    |  ----   | ----    | ---- |
| :8000/dmax    | Tokyo     | 0.281s  | 0.604s  | 0.186s  | 0.495s  | https://www.webpagetest.org/result/240215_BiDcA2_C1N/ |
|               | Osaka     | 0.378s  | 0.744s  | 0.181s  | 0.503s  | https://www.webpagetest.org/result/240215_AiDcEM_C4P/ |
|               | Sydney    | 0.841s  | 1.300s  | 0.455s  | 0.738s  | https://www.webpagetest.org/result/240215_AiDcBH_C4Z/ |
|               | Beijing   | 2.336s  | 4.089s  | 0.621s  | 0.934s  | https://www.webpagetest.org/result/240215_AiDcNY_C4V/ |
|               | Virginia  | 1.066s  | 1.697s  | 0.644s  | 1.030s  | https://www.webpagetest.org/result/240215_BiDcAJ_C18/ |
|               | Sao Paulo | 1.720s  | 2.352s  | 0.974s  | 1.313s  | https://www.webpagetest.org/result/240215_AiDcSE_C4B/ |
|               | London    | 1.090s  | 1.795s  | 0.898s  | 1.211s  | https://www.webpagetest.org/result/240215_AiDcTF_C4F/ |
|               | Seoul     | 1.090s  | 1.795s  | 0.898s  | 1.211s  | https://www.webpagetest.org/result/240215_BiDcAC_C24/ |
| sbfree/quest/ | Tokyo     | 1.146s  | 1.974s  | 1.059s  | 1.340s  | https://www.webpagetest.org/result/240215_AiDcSQ_C71/ |
|               | Osaka     | 1.091s  | 1.823s  | 1.100s  | 1.434s  | https://www.webpagetest.org/result/240215_AiDcNE_C75/ |
|               | Sydney    | 1.715s  | 2.526s  | 1.506s  | 1.726s  | https://www.webpagetest.org/result/240215_AiDc3Z_C7B/ |
|               | Beijing   |         |         |         |         |                                                       |
|               | Virginia  | 2.075s  | 3.055s  | 1.807s  | 2.056s  | https://www.webpagetest.org/result/240215_BiDcDA_C3F/ |
|               | Sao Paulo | 2.368s  | 3.804s  | 2.325s  | 2.578s  | https://www.webpagetest.org/result/240215_AiDc9V_C6C/ |
|               | London    | 2.447s  | 3.724s  | 2.142s  | 2.407s  | https://www.webpagetest.org/result/240215_BiDcYY_C40/ |
|               | Seoul     | 1.125s  | 2.068s  | 1.253s  | 1.496s  | https://www.webpagetest.org/result/240215_AiDcE1_C78/ |


## First and Repeat
[WebPageTest](https://www.webpagetest.org/) でロケーションを指定してページ表示速度を測定

- 同一サーバーで Next.js と Django が稼働中
  - Next.js はSSG
  - Django SSR (テンプレートエンジン+動的データを返すので実質SSR)
- TFB: 最初のデータが到着するまで何秒かかった？
- LCP: ページの最大要素が描画されるまで何秒かかった？
- (F) 初回アクセス時
- (R) 2回目以降のアクセス時

| URL           | Location  | TFB (F) | LCP (F) | TFB (R) | LCP (R) |
| ----          | ----      | ----    | ----    |  ----   | ----    |
| Next.js (SSG)   | 東京 | 0.281s  | 0.604s  | 0.186s  | 0.495s  |
|               | 大阪| 0.378s  | 0.744s  | 0.181s  | 0.503s  |
|               | ソウル| 1.090s  | 1.795s  | 0.898s  | 1.211s  |
|               | 北京| 2.336s  | 4.089s  | 0.621s  | 0.934s  |
|               | シドニー| 0.841s  | 1.300s  | 0.455s  | 0.738s  |
|               | バージニア| 1.066s  | 1.697s  | 0.644s  | 1.030s  |
|               | ロンドン| 1.090s  | 1.795s  | 0.898s  | 1.211s  |
|               | サンパウロ| 1.720s  | 2.352s  | 0.974s  | 1.313s  |
| Django (SSR)| 東京| 1.146s  | 1.974s  | 1.059s  | 1.340s  |
|               | 大阪| 1.091s  | 1.823s  | 1.100s  | 1.434s  |
|               | ソウル| 1.125s  | 2.068s  | 1.253s  | 1.496s  |
|               | 北京| 3.485s | 25.854s        |    2.422s     |    2.698s     |                                                       |
|               | シドニー| 1.715s  | 2.526s  | 1.506s  | 1.726s  |
|               | バージニア| 2.075s  | 3.055s  | 1.807s  | 2.056s  |
|               | ロンドン| 2.447s  | 3.724s  | 2.142s  | 2.407s  |
|               | サンパウロ| 2.368s  | 3.804s  | 2.325s  | 2.578s  |


- [Conohaドメイン移管(OUT)](https://support.conoha.jp/v/authcode-v/?btn_id=v-domaintransferin-v--related_v-authcode-v)
  - Conoha から他へのドメイン管理権限移管の方法 (NSレコードの書き換え)
  - AuthCode を利用すればNSレコードを手動で書き換える必要はないっぽい
- [Cloudflareにドメインを移管してみた](https://dev.classmethod.jp/articles/domain-transfer-from-onamae-to-cloudflare/)
- 証明書・TLSは大丈夫かな
  - オリジンサーバーですでに Lets Encrypt の証明書によるTLSに対応している場合、
  - Cloudflare 側では「フル（厳格）」モードを設定するだけで良いっぽい(GPT4によると)

## CDN有効化
- そもそも Cloudflare の CDN を利用するのにドメイン移管までする必要はなかった
1. Conoha のダッシュボード > ドメイン > ドメイン名選択 > ネームサーバー設定 > カスタムを選択 (Conoha(標準)ではない)
2. Cloudflare ダッシュボードで提示された自分用のネームサーバーをコピペ
   - 今回は virginia.ns.cloudflare.com, kyrie.ns.cloudflare.com だった
3. Cloudflare 側で再チェック要求のボタン押下 

DNSわからん..
なぜ .com に複数のレジストラから登録できるのか？
NSレコードを書き換えるとどうなるのか？

- レジストラとレジストリは違う
- レジストリは .com などのドメインと一対一対応
- Shared Registry System (SRS) という共有データベースのようなもので一元管理している
- レジストラはドメインがほしいユーザーとレジストリを仲介する業者
- レジストラは独自にNS(ネームサーバー)を立てている 例: ns-a1.conoha.io
- レジストラのNSはユーザーに依頼されたドメイン (例: example.com) の権威サーバーを名乗ってレジストリに委任の依頼を出す
  - 「example.com はウチのNS: ns-a1.conoha.io が権威サーバーになるので、この問い合わせが来たら ns-a1.conoha.io に委任してね」
- レジストラのNSはユーザーから依頼された複数のドメインの権威サーバーになっている事が多い
- レジストラのNSのTLD (.io) はかならずしもレジストリのTLD (.com) とあっていなくてもいい (ここ混乱してたところ)
- レジストラのNSは必ずしも権威サーバーではない
  - レジストラのNSに保存されているNSレコードを別のNS (virginia.ns.cloudflare.com) に書き換えることによって権威サーバーを書き換えられる
  - NSレコードを書き換えただけではドメイン移管にはなっていない
  - 依然として .com のSRSに example.com の登録依頼をしているのは conoha
  - conoha の .com レジストリへの依頼内容「example.com の権威サーバーは virginia.ns.cloudflare.com だからここに委任してね」
- conoha -> cloudflare にドメイン移管したら
  - cloudflare の .com レジストリへの依頼内容「example.com の権威サーバーは virginia.ns.cloudflare.com だからここに委任してね」
  - 更新手数料,shois代行手数料 などを払う先が conoha から cloudflareになる

## 有効化したら リダイレクトループになった
- ブラウザ上で「リダイレクトが繰り返し行われました」というエラーが表示されてページが閲覧できなくなった
- いわゆるリダイレクトループ
- [Cloudflare + Vercelでのリダイレクトループエラーの解消メモ](https://qiita.com/n0bisuke/items/ebdace6abf4423197373)
- [公式: ERR_TOO_MANY_REDIRECTS](https://developers.cloudflare.com/ssl/troubleshooting/too-many-redirects/)
  - 図がわかりやすい
- デフォルトでは SSL/TLS 暗号化モードが Flexible になっているのでこれを Full 以上に変える
  - Full (厳密) を選択したら解決した
  - すでに オリジンサーバー(現在稼働しているconoha vps のサーバー) で Let's Encrypt によるTLS対応しているので選択するだけだった

## 有効化したら :8000 ポートが閲覧できなくなった
- [Cloudflare でデフォルトで利用可能なポート](https://developers.cloudflare.com/fundamentals/reference/network-ports/)
  - [:3000 ポートは開いてないよ](https://community.cloudflare.com/t/need-to-add-port-for-additional-sites-on-same-ip/388971)
- nginx の設定と next.js の .env.production のポート番号を 8000 -> 8443  に書き換えて reload したら解決

## 導入後 再計測
- なんか速くなっていない気がする
- [Cloudflare を使ったキャッシュの基礎](https://numb86-tech.hatenablog.com/entry/2021/06/13/222623)
- Cf-Cache-Status: Dynamic, Hit?
- https://developers.cloudflare.com/cache/concepts/default-cache-behavior/#h_bd959d6a-39c0-4786-9bcd-6e6504dcdb97
- ルール設定しないとキャッシュに乗らないそう (全部乗っても困る)
- ユーザー個別情報を載せないように

# 広告検討
- [煩わしい自動広告の制御](https://note.com/harulog555/n/nfd3ab4fd0da4)
- [Twitter:sm_hn 自動広告の検索結果](https://twitter.com/search?q=from%3Asm_hn%20%E8%87%AA%E5%8B%95%E5%BA%83%E5%91%8A&src=typed_query&f=top)
- 審査申請だけ出した

# 参考資料
[60分で学ぶ数理最適化](https://speakerdeck.com/umepon/mathematical-optimization-in-60-minutes)

## 事務処理まわり
確定申告が必要かどうか
- 副業収入が20万円以下であれば所得税の確定申告は不要
- 住民税申告は別途必要
- 確定申告すると住民税申告もできるのでまとめるなら確定申告をする

副業申請




# [DUPLICATED] Django デプロイ用ビルド手順 (古い手順)
Django において cms/static/cms 以下にファイルを配置することを想定

```sh
# ベースディレクトリを変更する環境変数を付与してビルド
PUBLIC_URL=/static/cms npm run build

# ファイルコピー
cp -r build/* ~/work/mhr-speedrun/cms/static/cms/

# index.html のみ templates に配置し、view から参照できるようにする
cp build/index.html ~/work/mhr-speedrun/cms/templates/cms/

# 不要 index.html 削除
rm ~/work/mhr-speedrun/cms/static/cms/index.html
```

ディレクトリの様子
```sh
hoge@:mhr-speedrun$ tree cms/static/cms/
cms/static/cms/
├── asset-manifest.json
├── css # cms アプリケーション用にもとから配置されている css
│   ├── bootstrap.min.css
│   ├── bootstrap.min.css.map
│   ├── bootstrap.overwrite.css
│   ├── quest-card.css
│   └── toggle-switch.css
├── dmax-core
│   ├── brachistochrone.data
│   ├── brachistochrone.html
│   ├── brachistochrone.js
│   ├── brachistochrone.wasm
│   ├── brachistochrone.worker.js
│   └── worker3.js
├── favicon.ico
├── index.html # templates に配置するので消してよし
├── js # cms アプリケーション用にもとから配置されている js
│   ├── bootstrap.bundle.min.js
│   ├── bootstrap.bundle.min.js.map
│   ├── jquery-3.5.1.min.js
│   ├── jquery-3.5.1.min.map
│   └── shortcut.js
├── logo192.png
├── logo512.png
├── manifest.json
├── robots.txt
└── static
    ├── css
    │   ├── main.048ee325.css
    │   └── main.048ee325.css.map
    └── js
        ├── 787.45c42e5d.chunk.js
        ├── 787.45c42e5d.chunk.js.map
        ├── main.8e3880be.js
        ├── main.8e3880be.js.LICENSE.txt
        └── main.8e3880be.js.map
```

# fabicon 作成
プロンプト
```
modern flat design logo letter “D”, minimalist, design, creative, blue, purple, web agency, dynamic, white background, 8K
```

```
High-end premium modern logo of the letters '[DMAX]', featured on 99designs
```

# 以下は Next.js の README.md

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.js`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
