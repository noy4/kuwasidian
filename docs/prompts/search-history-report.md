# 検索履歴レポートの作成
ブラウザ検索履歴を取得し、ある月に何をしていたか（調査、学習、娯楽など）についてレポートを作成する。

## 手順
- 履歴ファイルをコピーし、履歴・件数を取得する。（重複は除去）
- 読み取った履歴をすべて参考にしたレポートを生成する。

コマンド例：
```sql
sqlite3 ./tmp/History "SELECT DISTINCT title FROM urls WHERE datetime(last_visit_time / 1000000 + (strftime('%s', '1601-01-01')), 'unixepoch', 'localtime') >= '2025-05-01' AND datetime(last_visit_time / 1000000 + (strftime('%s', '1601-01-01')), 'unixepoch', 'localtime') < '2025-06-01';"

sqlite3 ./tmp/History "SELECT COUNT(DISTINCT title) ..."
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
- exclude で除外したサイトも履歴としてカウントする。
- exclude で除外したサイトについて、除外したことには絶対に言及しない（セキュリティ、ユーザー保護）。

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
