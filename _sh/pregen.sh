#!/bin/bash

# Generate the html files directly.
# The problem is that there are no titles in the html head.
# It seems as though there is no lost formatting.
# Where are the definitions of the AsciiDoc classes?

D3="$HOME/ws/github/gaminax/texts/_pre"
D4="$HOME/ws/github/gaminax/texts"
D3A="$HOME/ws/github/gaminax/texts/_pre/Josephus0090Antiquities"
D4A="$HOME/ws/github/gaminax/texts/Josephus0090Antiquities"
D3L="$HOME/ws/github/gaminax/texts/_pre/Josephus0090Life"
D4L="$HOME/ws/github/gaminax/texts/Josephus0090Life"
D3W="$HOME/ws/github/gaminax/texts/_pre/Josephus0090War"
D4W="$HOME/ws/github/gaminax/texts/Josephus0090War"

cd $D3A
for fe in *.ad ; do asciidoctor -s $fe; done
for fe in *.html; do cat $D3/ymlDefault.txt $fe >$D4A/$fe; done
rm *.html

cd $D3L
for fe in *.ad ; do asciidoctor -s $fe; done
for fe in *.html; do cat $D3/ymlDefault.txt $fe >$D4L/$fe; done
rm *.html

cd $D3W
for fe in *.ad ; do asciidoctor -s $fe; done
for fe in *.html; do cat $D3/ymlDefault.txt $fe >$D4W/$fe; done
rm *.html

cd $D3
asciidoctor -s index.ad
cat ymlDefault.txt index.html >$D4/index.html
rm index.html

