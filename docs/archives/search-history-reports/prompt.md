# 検索履歴レポートの作成
ブラウザ検索履歴を取得し、ある月に何をしていたか（調査、学習、娯楽など）についてレポートを作成する。

## 手順
- 履歴ファイルをコピーし、履歴・件数を取得する。（重複は除去）
- 履歴を元にレポートを生成する。

コマンド例：
```sh
-- 履歴の取得
sqlite3 ./tmp/History "SELECT DISTINCT u.title FROM urls u JOIN visits v ON u.id = v.url WHERE datetime(v.visit_time / 1000000 + (strftime('%s', '1601-01-01')), 'unixepoch', 'localtime') >= '2025-05-01' AND datetime(v.visit_time / 1000000 + (strftime('%s', '1601-01-01')), 'unixepoch', 'localtime') < '2025-06-01';"

-- 履歴件数の取得
sqlite3 ./tmp/History "SELECT COUNT(DISTINCT u.title) ..."
```

## パラメータ（のちに指示がなければこれらの値で実行）
- browser: ブラウザの種類（例: Chrome, Brave）= Chrome
- month: 対象月（例: 2023-10）= 先月
- output: 出力先 = ./search-history-reports/
- exclude: 履歴取得後、レポートにまとめる際に言及しないサイト・ジャンル。
- annual: 年次レポートを作成するかどうか = false

## 注意
- 一時ファイルは ./tmp に保存し、作業後に削除する。
- スクリプトは絶対に作成してはいけない。
- exclude で除外したサイトについて、除外したことには絶対に言及しない（セキュリティ、ユーザー保護）。
- 履歴はファイルに書き出さず、結果をそのまま使う。

## フォーマット
### 月時レポート
```md 2025-04.md
# 検索履歴レポート 2025-04
訪問サイト数：2129件

{要約を記述。見出しは不要。}

## {😀 各トピックに対応する絵文字、タイトル、詳細}
```

### 年次レポート
```md 2025.md
# 検索履歴レポート 2025
{あとは月次レポートと同じ}
```
