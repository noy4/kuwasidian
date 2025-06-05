
## インストール
以下をインストールする。
- [VSCode](https://code.visualstudio.com/) - テキストエディタ
- [Cline](https://cline.bot/)（または [Roo Code](https://roocode.com/)、[Kilo Code](https://kilocode.ai/)） - VSCode の拡張機能。AIを扱えるようにする。
- [GitHub Copilot](vscode://github.copilot-chat) - VSCode の拡張機能。AIを扱えるようにする。（Cline を安く使うために導入。月50メッセージ無料。月11ドルで無限？）

## 設定
Cline を開き、以下のように設定する。
```yaml
言語: 日本語

プロバイダー:
  - APIプロバイダー: VS Code LM API
  - 言語モデル: copilot - gemini-2.5-pro
```

Cline に「こんにちは」と送ってみる。おそらく「そのAIモデルは使えません」のように言われる。

GitHub Copilot のパネルを開く。

GitHub アカウントの作成を求められる？

AIモデル選択部分で `Gemini 2.5 Pro (Preview)` を選択する。「こんにちは」と送ってみる。「このAIモデルを使いますか？」のように聞かれるので許可する。

Cline に戻り、「こんにちは」すると使えるはず。

## 使い方
1. VSCode で適当な作業用フォルダを開く。
2. Cline のパネルを開き、チャットに指示を入力して送信する。
3. チャットの指示に従っていく。（ファイル操作などの承認を求められたら都度許可する。）

## 余談
- > Kilo Code started as a fork of [Roo Code](https://github.com/RooVetGit/Roo-Code), which itself is a fork of [Cline](https://github.com/cline/cline)
- 拡張子が `.md` のファイルは Markdown と呼ばれる形式で書かれており、VSCode で開いて右上の「Open Preview」ボタンを押すと綺麗に表示される。
