# YouTube履歴レポートを作成する

YouTube履歴レポートを自動作成する手順を説明します。ある月に何を見ていたかを振り返ることができます。

出力例：[[archives/youtube-history-reports/2025-04|2025-04]]

## 準備
- [[Cline のセットアップ]]

## 使うもの
- プロンプト（AIへの指示文） - https://raw.githubusercontent.com/noy4/kuwasidian/main/docs/archives/youtube-history-reports/prompt.md

## 手順
Roo Code のチャットに以下のように入力する。

### 例1）今月分のレポートを作成
```sh
@https://raw.githubusercontent.com/noy4/kuwasidian/main/docs/archives/youtube-history-reports/prompt.md
```

### 例2）パラメータを指定して作成
```sh
@https://raw.githubusercontent.com/noy4/kuwasidian/main/docs/archives/youtube-history-reports/prompt.md

browser: Safari
month: 2月
output: レポート/YouTube履歴レポート/
exclude: 政治関連
```

*パラメータの詳細はプロンプト原文を参照してください。

### 例3）文章でパラメータを指定して作成
```sh
@https://raw.githubusercontent.com/noy4/kuwasidian/main/docs/archives/youtube-history-reports/prompt.md

去年の各月のレポート、年次レポート
```

## その他
プロンプト改善案受付中
