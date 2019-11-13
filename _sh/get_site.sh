#!/bin/bash

# Run from the files location, _pre.
# ROOT=$HOME/ws/github/gaminax/texts
ROOT=$(pwd)
echo $ROOT

if [ ! -d _site ] ; then echo no _site; exit 1; fi
cd _site
echo res=$?

find . -name '*.html' >../_pre/files_html.txt
cd ..
while read dfe; do
    echo $dfe
    dfe2=${dfe#./}
    cp -p _site/$dfe2 $dfe2
done <_pre/files_html.txt
