[[+memo.archive]]
[[+memo.sub]]

[[visualization]]


**Voice Control**: パソコンを声で操作、言語学習
**Code City**: ソフト開発の建築アニメーション化
**DeepWiki Video**: [DeepWiki](https://deepwiki.com/) の動画化、deepwiki cli
**YouTube Geography**: 地理勉強、ケッペン英語


[[Geography]]
牛口　愛媛
愛媛　統計情報　可視化
土地価格Map
住処


東出
コンテナハウス
ドームハウス


stock market heatmap, circle packing

hmr dark mode



timeline
inspector
    folder size
    commits
    line changes
    last updated
new object effect


realtime-ptt
ptt-only

onstartup: ptt-only
cmd+opt+space: realtime(no-ppt)
cmd+space

```
┌─────────────────────────────────────────────┐
│  Agent Server (dist/main.js)                │
│                                             │
│  mode: 'realtime-ptt' | 'ptt-only'          │
│                                             │
│  realtime-ptt:                              │
│    - audio常にenabled                       │
│    - VAD END_OF_SPEECH → 自動commit         │
│    - PTT → interrupt + clear + 押し込み中   │
│                                             │
│  ptt-only:                                  │
│    - audio通常disabled                      │
│    - PTT押下→enable、リリース→commit        │
│    - VADイベント無視                        │
│                                             │
│  RPC: set_mode / start_turn / end_turn      │
└─────────────────────────────────────────────┘
```

