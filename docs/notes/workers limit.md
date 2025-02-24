

Error: Failed to publish your Function. Got error: Your Functions script is over the 1 MiB size limit 

https://developers.cloudflare.com/workers/platform/limits/#worker-size

バックエンド部分のコードのサイズが1MBを超えると課金が必要になってくるっぽい。課金すると10MBまでok（7,000円/月くらい？）。

ビルドで書き出される \_worker.js を手元で zip 圧縮してみたサイズがそれっぽいので、上限は圧縮後のサイズを見るっぽい

API Route スクリプトサイズ（圧縮後）
before: 4.9MB (1MB)
after: 7.2MB (1.8MB)

openai のベータ云々のコードがでっけーんだと予想。。課金する場合の値段をちゃんと調べるのと、スクリプトサイズ減らすことを検討する。ただもうすでに上限スレスレまできてたっぽいってのはある。


cloudflare workers CPU rollover

https://developers.cloudflare.com/workers/observability/metrics-and-analytics/#cpu-time-per-execution
>In some cases, higher quantiles may appear to exceed CPU time limits without generating invocation errors because of a mechanism in the Workers runtime that allows rollover CPU time for requests below the CPU limit.

https://community.cloudflare.com/t/worker-cpu-time-rollover/187072/2
https://community.cloudflare.com/t/far-over-cpu-time-limit-for-free-plan-should-i-be-worried/512633

Free
100,000 requests / 1 day
10ms CPU time per request
script size 1MB

Xaris
17,000 requests / 1 week
35ms CPU time per request（超えてるけどなんか大丈夫っぽい）

Standard
基本料 $5（≒750円）
超えた分従量課金（超えなそう）


[https://github.com/niieani/gpt-tokenizer/blame/main/src/encodings/cl100k_base.js](https://github.com/niieani/gpt-tokenizer/blame/main/src/encodings/cl100k_base.js)

cl100k_base（gpt-4, gpt-3.5 で文字列をトークンに変換するエンコード方式）の対応表みたいなファイルだけで2MBある

Helicone が token_count のエンドポイントだけ他環境に切り出してたのはそゆことか
とはいえ Xaris でそのために別環境を用意するのは管理範囲増えて渋い
課金したが良さげ
そもそも stream の時 token 数を返してくれない openai が残念。