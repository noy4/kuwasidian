# 検索履歴レポートを作成する

ある月に何をしていたか（調査、学習、娯楽など）について、ブラウザ検索履歴からレポートを自動作成する手順を説明します。パソコンでAIを使って作成します。

## 準備
以下をインストールしておく。
- [VSCode](https://code.visualstudio.com/) - テキストエディタ
- [Cline](https://cline.bot/) - VSCode の拡張機能。AI にパソコンを操作させる。

プロンプト（AIに送る指示文）：
- https://raw.githubusercontent.com/noy4/kuwasidian/main/docs/prompts/search-history-report.md

## 手順
1. VSCode で適当な作業用フォルダを開く。
2. Cline のパネルを開き、チャットに**チャット入力例**（後述）のように入力して送信する。
3. チャットの指示に従っていく。（ファイル操作などの承認を求められるので都度許可する。）
4. レポートが書き出される。

### チャット入力例
例1）今月分のレポートを作成
```sh
@https://raw.githubusercontent.com/noy4/kuwasidian/main/docs/prompts/search-history-report.md
```

例2）パラメータを指定して作成
```sh
@https://raw.githubusercontent.com/noy4/kuwasidian/main/docs/prompts/search-history-report.md

browser: Safari
month: 2月
output: レポート/検索履歴レポート/
exclude: YouTube, 筋トレ関連、ニュースサイト
```

例3）文章でパラメータを指定して作成
```sh
@https://raw.githubusercontent.com/noy4/kuwasidian/main/docs/prompts/search-history-report.md

去年の各月のレポート、年次レポート
```

*パラメータの詳細はプロンプト原文を参照してください。
