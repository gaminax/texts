#! /usr/bin/env bash

D1="$HOME/ws/cli/javascript/jos"
D2="$HOME/Documents/Religion/Texts/Josephus0090Life"
D3="$HOME/ws/github/gaminax/texts/Josephus0090Life"

$D1/life12.js
rm  $D3/life_ad.ad
cp -p $D2/life_ad.ad $D3

