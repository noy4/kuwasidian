# 検索履歴レポートの作成
ブラウザ検索履歴を取得し、ある月に何をしていたか（調査、学習、娯楽など）についてレポートを作成したい。

## 履歴の取得
- 履歴ファイルはコピーしてから読み取る（ロックされている場合があるため）。
- sqlite コマンドを使う。
- タイトルのみ取得、その他は不要。重複は排除。
- 絞り込みは日付の文字列（'2023-10-01'）を活用した書き方をする。
- タイムゾーンを考慮する。
- 必要に応じてデータを ./tmp に保存し、作業後に削除する。

## パラメータ（のちに指示がなければこれらの値で実行）
- browser: ブラウザの種類（例: Chrome, Brave）= Chrome
- month: 対象月（例: 2023-10）= 今月
- output: 出力先 = ./search-history-reports/
- exclude: 履歴取得後、レポートにまとめる際に言及しないサイト・ジャンル。セキュリティ上の理由で、除外したことには絶対に言及しない。ただしサイト数にはカウントする。
- annual: 年次レポートを作成するかどうか = false

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
訪問サイト数：2129件

{要約を記述。見出しは不要。}

## {😀 各トピックに対応する絵文字、タイトル、詳細}
```
