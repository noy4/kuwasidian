
## options
history sqlite
uri schema
native messaging
webhook


browser extension で定期実行
obsidian plugin で定期実行


browser history path:
/Users/noy/Library/Application Support/BraveSoftware/Brave-Browser/Default/History


test:
[obsidian-imgur-plugin](https://github.com/gavvvr/obsidian-imgur-plugin)
[obsidian-carry-forward](https://github.com/jglev/obsidian-carry-forward)

[obsidian-testing-framework](https://github.com/GamerGirlandCo/obsidian-testing-framework)



sqlite:
[Adding SQLite Database Integration to an Obsidian Plugin](https://forum.obsidian.md/t/adding-sqlite-database-integration-to-an-obsidian-plugin/88272)
[note-history](https://github.com/alangrainger/note-history) (sql.js)
[sql-seal](https://github.com/h-sphere/sql-seal) (sql.js)
	[feat: Reworking Database to SQLJS by kulak-at · Pull Request #17 · h-sphere/sql-seal](https://github.com/h-sphere/sql-seal/pull/17)
[obsidian-kobo-highlights-import](https://github.com/OGKevin/obsidian-kobo-highlights-import) (sql.js)

libsql:
target: "es2020",
platform: 'node'
[ERROR] Big integer literals are not available in the configured target environment ("es2018")
[ERROR] Could not resolve "node:buffer"


better-sqlite3:
Uncaught Error: The module '/Users/noy/Documents/obsidian_dev/.obsidian/plugins/hello-plugin/node_modules/.pnpm/better-sqlite3@11.8.1/node_modules/better-sqlite3/build/Release/better_sqlite3.node'
was compiled against a different Node.js version using
NODE_MODULE_VERSION 127. This version of Node.js requires
NODE_MODULE_VERSION 130. Please try re-compiling or re-installing
the module (for instance, using `npm rebuild` or `npm install`).

[better_sqlite3 was compiled against a different Node.js version #549](https://github.com/WiseLibs/better-sqlite3/issues/549)




[[automation]]
[Obsidian Send](https://forum.obsidian.md/t/obsidian-send/23899)


# 検索履歴レポート
1. Chrome 拡張でブラウザ履歴を取得
2. 履歴をAIに投げてどんな調べ物をしてたかレポートを作ってもらう
3. 履歴もしくはレポートをローカルの指定フォルダに保存（ex. history_2024_01_03.md）

(やりたいこと)
履歴を定期的（もしくはページ遷移の度）に Obsidian(メモアプリ) に保存したい。Obsidian ではローカルの指定のフォルダにメモを md ファイルとして保存する (ex. /Users/noy/Documents/Obsidian Vault/search history/history_2024_01_03.md)。ブラウザからローカルの指定フォルダにファイルを保存するために「Obsidian の webhook プラグインを実装して Chrome 拡張から叩く必要がある」と判断した。

Q1. ↑あってる？他の方法で行けそう？
Q2. そもそもブラウザの検索履歴は Chrome 拡張経由じゃなくてローカルのどっかしらのフォルダから取れる？

(メモ)
履歴取得に使える Chrome Extension API
- chrome.history.search
- chrome.tabs.onUpdated
https://developer.chrome.com/docs/extensions/reference/api/history#method-search

定期実行
- chrome.alarms

webhook じゃない場合の保存方法
1. chrome.downloads.download
2. 擬似 \<a href="url" download> を作成、コード上でクリック
↑どちらにせよ保存先指定のウィンドウが出てしまう。ブラウザの設定でオフにする必要がある。オフにしてダウンロード先に Obsidian のフォルダを指定することはしたくない。他のダウンロードの時にめんどいので。


(参考)
- WakaTime - VSCode, ブラウザ上でどのリポジトリについて何分見てたか集計してくれる Chrome 拡張 (https://github.com/wakatime/browser-wakatime/blob/master/src/background.ts)
- 誰かが作った Obsidian Webhook プラグイン（動かんかった） (https://github.com/trashhalo/obsidian-webhooks)

Chrome 拡張の勉強で疲れた。Obsidian のプラグインの実装の勉強がいるなら一旦休憩。

---
## Extensions
[Export Chrome History](https://chromewebstore.google.com/detail/export-chrome-history/dihloblpkeiddiaojbagoecedbfpifdj?hl=en)
[History export](https://chromewebstore.google.com/detail/history-export/lpmoaclacdaofhlijejogfldmgkdlglj)



chrome.tabs.onUpdated, chrome.downloads.download
	file chooser shows up
a.download
	path to save
chrome.history.search

タブ作成・遷移時に title,url を保存

valut の path に保存
webhooks
obsidian script
os automation

chrome extension - get site info and hit webhook
obsidian webhook plugin


https://github.com/wakatime/browser-wakatime/blob/master/src/background.ts
https://github.com/trashhalo/obsidian-webhooks

[Save all browsing history to obsidian](https://forum.obsidian.md/t/save-all-browsing-history-to-obsidian/51731)
[Internet Usage History](https://forum.obsidian.md/t/internet-usage-history/52831)

[[Browser History Report]]
