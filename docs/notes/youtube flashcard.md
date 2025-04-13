[youtube-flashcard](https://github.com/noy4/youtube-flashcard)


## ソースとなる youtube のアイデア
news
tech
cooking
conversation
宿案内
説明
相槌

Accommodations

挨拶
衣類

---

## 字幕の Anki 化
YouTube, Netflix の字幕を文章単位でフラッシュカード化したい

## 音声
フラッシュカードの正解の文章には音声がつくのが望ましい。
1. TTS（自動音声読み上げ）
2. ソース動画の音声を使う

## Netflix
LanguageReactor → Excel → Anki

- [Language Reactor最強の使い方｜Netflix海外ドラマスクリプトをAnkiカードにダウンロードしよう！](https://warmankaede.com/language-reactor-howto-anki/)
- 意訳が過ぎる場合がある

## YouTube
1. 字幕データを取得し、AIで文章単位に整形
2. 文字起こしAIで文章単位で字幕を取得

自動字幕は精度が低過ぎる場合がある。その場合は文字起こし？


---
あらすじ

- youtube-flashcard, whisper で文章途中で分割され頓挫
- 平文アプローチに切り替え、src2srs
- .（ピリオド）で文章単位での分割を試みるも、例外が多く微妙（ex. Dr.）
- AI で文章単位で分割できることを発見
- Language Reactor で字幕ダウンロードできることを発見
- whisper で文章単位で分割できることを発見

netflix 様子見
youtube 動画探し
- chrome ext.
- Small Talk - transcribe

---
archive:


. がない文章を対象とすべきか？
- ai format .
- transcribe
chunk 時にややこしい

1. 文章（. あり）target.raw.txt
2. tsv - . 区切り target.splitted.txt
3. tsv - フラッシュカード最適化 target.optimized.txt

native.txt


---
research:

- [Anki Decks](https://anki-decks.com/)
- [Voracious](https://voracious.app/)
- [Ajatt-Tools/mpvacious: 🍜 Adds mpv keybindings to create Anki cards from movies and TV shows.](https://github.com/Ajatt-Tools/mpvacious)



awesome:
- [awesome-language-learning](https://github.com/Vuizur/awesome-language-learning)
- [awesome-immersion](https://github.com/nakopylov/awesome-immersion)



youtube2anki
- [dobladov/youtube2Anki](https://github.com/dobladov/youtube2Anki)
- [hugepizza/youtube2anki](https://github.com/hugepizza/youtube2anki)
- [kamui-fin/yt-to-anki](https://github.com/kamui-fin/yt-to-anki)
- [katspaugh/youtube-flashcards](https://github.com/katspaugh/youtube-flashcards)

[subs2srs · GitHub Topics](https://github.com/topics/subs2srs)
- [langkit](https://github.com/tassa-yoniso-manasi-karoto/langkit)
  - [substudy](https://github.com/emk/subtitles-rs/tree/master/substudy)
  - [movies2anki](https://github.com/kelciour/movies2anki)


tool
- [asbplayer](https://github.com/killergerbah/asbplayer)
- [OpenSubtitles](https://www.opensubtitles.org/)

- [netflix-to-anki](https://github.com/demonlexe/netflix-to-anki)
