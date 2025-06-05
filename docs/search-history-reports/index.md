# 検索履歴レポートを作成する

ブラウザ検索履歴からレポートを自動作成する手順を説明します。ある月に何をしていたか（調査、学習、娯楽など）を振り返ることができます。

出力例：[[search-history-reports/2025-05|2025-05]]

## 準備
- [[Cline のセットアップ]]

## 使うもの
- プロンプト（AIへの指示文） - https://raw.githubusercontent.com/noy4/kuwasidian/main/docs/search-history-reports/prompt.md

## 手順
Cline のチャットに以下のように入力する。

### 例1）先月分のレポートを作成
```sh
@https://raw.githubusercontent.com/noy4/kuwasidian/main/docs/search-history-reports/prompt.md
```

### 例2）パラメータを指定して作成
```sh
@https://raw.githubusercontent.com/noy4/kuwasidian/main/docs/search-history-reports/prompt.md

browser: Safari
month: 2月
output: レポート/検索履歴レポート/
exclude: YouTube, 筋トレ関連、ニュースサイト
```

*パラメータの詳細はプロンプト原文を参照

### 例3）文章でパラメータを指定して作成
```sh
@https://raw.githubusercontent.com/noy4/kuwasidian/main/docs/search-history-reports/prompt.md

去年の各月のレポート、年次レポート
```

## その他
- プロンプト改善案受付中
- 履歴の保存期間は90日間
