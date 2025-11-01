# 月次レポートを作成する

月次レポートを生成する手順を説明します。検索履歴セクションでは、ある月に何をしていたか（調査、学習、娯楽など）を振り返ることができます。

出力例：[[monthly-reports/27-09 フィリピンの呼び声|27-09 フィリピンの呼び声]]

## 準備
- [[Cline のセットアップ]]

## 使うもの
- [プロンプト（AIへの指示文）](./prompt.md) - 原文：https://raw.githubusercontent.com/noy4/kuwasidian/main/docs/monthly-reports/prompt.md

## 手順
Cline のチャットに以下のように入力する。

### 例1）先月分のレポートを作成
```sh
@https://raw.githubusercontent.com/noy4/kuwasidian/main/docs/monthly-reports/prompt.md
```

### 例2）パラメータを指定して作成
```sh
@https://raw.githubusercontent.com/noy4/kuwasidian/main/docs/monthly-reports/prompt.md

browser: Safari
month: 2月
output: レポート/月次レポート/
exclude: YouTube, 筋トレ関連、ニュースサイト

あ、やっぱ3月
```

*パラメータの詳細はプロンプト原文を参照

## その他
- Chrome系ブラウザは履歴の保存期間が90日間なので、それ以前のレポートは作成できません。
