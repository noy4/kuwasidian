
## インストール
以下をインストールする。
- [VSCode](https://code.visualstudio.com/) - テキストエディタ
- [Roo Code](https://roocode.com/) - VSCode の拡張機能。AIを扱えるようにする。
- [GitHub Copilot](vscode://github.copilot-chat) - VSCode の拡張機能。AIを扱えるようにする。（Roo Code を安く使うために必要。月50メッセージ無料。月11ドルで無限？）

## 設定
Roo Code を開き、以下のように設定する。
```yaml
言語: 日本語

プロバイダー:
  - APIプロバイダー: VS Code LM API
  - 言語モデル: copilot - gemini-2.5-pro
```

Roo Code に「こんにちは」と送ってみる。おそらく「そのAIモデルは使えません」のように言われる。

GitHub Copilot のパネルを開く。

GitHub アカウントの作成を求められる？

AIモデル選択部分で `Gemini 2.5 Pro (Preview)` を選択する。「こんにちは」と送ってみる。「このAIモデルを使いますか？」のように聞かれるので許可する。

Roo Code に戻り、「こんにちは」すると使えるはず。

## 使い方
1. VSCode で適当な作業用フォルダを開く。
2. Roo Code のパネルを開き、チャットに指示を入力して送信する。
3. チャットの指示に従っていく。（ファイル操作などの承認を求められたら都度許可する。）

## 余談
- Roo Code は [Cline](https://cline.bot/) の高機能版。参考：[RooCode vs Cline **UPDATED*** March 29 : r/RooCode](https://www.reddit.com/r/RooCode/comments/1jn372q/roocode_vs_cline_updated_march_29/?share_id=8QGnCavUI2VCyv7oNIryz&utm_content=2&utm_medium=ios_app&utm_name=ioscss&utm_source=share&utm_term=1)
- 拡張子が `.md` のファイルは Markdown と呼ばれる形式で書かれており、VSCode で開いて右上の「Open Preview」ボタンを押すと綺麗に表示される。
