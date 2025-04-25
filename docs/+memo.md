[[+memo.archive]]






daily:
anki


publish notes
	vitepress-template
	posts
	




---
[[youtube flashcard]]



  

コマンド例：

```bash

sqlite3 ./tmp/history.db "SELECT DISTINCT title FROM urls WHERE title != '' AND datetime(last_visit_time / 1000000 - 11644473600, 'unixepoch') >= '2025-04-01' AND datetime(last_visit_time / 1000000 - 11644473600, 'unixepoch') < '2025-05-01';" > ./tmp/browser-history-2025-04.txt

```






---


core:
visuallize

