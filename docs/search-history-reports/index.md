# 検索履歴レポートを作成する

ブラウザ検索履歴からレポートを自動作成する手順を説明します。ある月に何をしていたか（調査、学習、娯楽など）を振り返ることができます。

出力例：[[search-history-reports/2025-05|2025-05]]

## 準備
- [[Roo Code のセットアップ]]

## 使うもの
- プロンプト（AIへの指示文） - https://raw.githubusercontent.com/noy4/kuwasidian/main/docs/prompts/search-history-report.md

## 手順
Roo Code のチャットに以下のように入力する。

### 例1）今月分のレポートを作成
```sh
@https://raw.githubusercontent.com/noy4/kuwasidian/main/docs/prompts/search-history-report.md
```

### 例2）パラメータを指定して作成
```sh
@https://raw.githubusercontent.com/noy4/kuwasidian/main/docs/prompts/search-history-report.md

browser: Safari
month: 2月
output: レポート/検索履歴レポート/
exclude: YouTube, 筋トレ関連、ニュースサイト
```

*パラメータの詳細はプロンプト原文を参照してください。

### 例3）文章でパラメータを指定して作成
```sh
@https://raw.githubusercontent.com/noy4/kuwasidian/main/docs/prompts/search-history-report.md

去年の各月のレポート、年次レポート
```

### 例4）[Maki さん](https://x.com/hAru_mAki_ch) の [グラレコプロンプト](https://github.com/Sunwood-ai-labs/MysticLibrary/blob/main/prompts/documentation/Graphic-recording-infographic-anim-v3.md) でグラレコ化

```sh
@https://raw.githubusercontent.com/noy4/kuwasidian/main/docs/prompts/search-history-report.md

対象：4月

レポート作成後、以下を適用

@https://raw.githubusercontent.com/Sunwood-ai-labs/MysticLibrary/refs/heads/main/prompts/documentation/Graphic-recording-infographic-anim-v3.md
```

## その他
プロンプト改善案受付中
