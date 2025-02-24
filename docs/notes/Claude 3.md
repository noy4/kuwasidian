
assistant message 2連で送れるか要調査

>messages: roles must alternate between "user" and "assistant", but found multiple "assistant" roles in a row"

メッセージ：ロールは "ユーザー "と "アシスタント "を交互に使わなければならない。

n がない、生成結果は1通りだけ返される
→ 確かに複数提案とか使わん
→ GitHub Copilot みたく複数通りの生成結果から選ぶ機能がいるなら相性が悪い？

stream 終了時に token usage が返される（素晴らしい。ファック OpenAI）

OpenAI をじっと見つめながら改善を図る2番手感がいい。命名とかもグッドだったり。（prompt_tokens → input_tokens, completion_tokens → output_tokens）

モデレーションAPIがない
→ そんなんもーいらんというノリ？
→ OpenAI のを使ってもらえばいいやってノリ？

ドキュメントがっつり読むのしんどいんで細目で読んだ。
→ API reference だけしっかりめに読んだ。API 少ないので読みやすい。


## token count
anthropic の output_tokens は最後のチャンクに含まれて返ってくる。abort するとトークン数を示したチャンクまで辿り着かず、それまでに使用したトークン数を自分で集計する必要がある。

↓公式がトークン数計算ライブラリを出してくれてるが、最新のモデルには対応しておらず、概算になるよとのこと

https://github.com/anthropics/anthropic-tokenizer-typescript
>⚠️ This package can be used to count tokens for Anthropic's older models. As of the Claude 3 models, this algorithm is no longer accurate, but can be used as a very rough approximation. We suggest that you rely on `usage` in the response body wherever possible.


結局自分で計算せなアカンのかい
概算になるなら openai よりアカンやないか

完了した場合は output_tokens を使う、abort された場合は概算で計算するようにしとこうか
楽にできるよう改善されることを期待しながら。。