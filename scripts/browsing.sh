#!/usr/bin/env bash
# backs up browser databases to cache and merges all visits into a JSON file

# [purarue/browserexport](https://github.com/purarue/browserexport#json)

browsing_dir="$HOME/data/browsing"
mkdir -p "$browsing_dir"

uvx browserexport --debug save --browser brave --to "$browsing_dir"

# backup databases
mkdir -p ~/.cache/browsing
rsync -Pavh "$browsing_dir/" ~/.cache/browsing

# merge all sqlite databases into a single compressed, jsonl file
tmpfile="/tmp/browsing.jsonl"
uvx browserexport --debug merge --json --stream "$browsing_dir"/* > "$tmpfile"

# remove all old datafiles
rm "$browsing_dir"/*

# move merged data to database directory
mv "$tmpfile" "$browsing_dir"
