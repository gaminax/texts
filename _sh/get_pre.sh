#!/bin/bash
# mv the AsciiDoc files out of the _pre folders
# so as to have them generated into _site

cd _pre
find . -name '*.ad' >../_sh/files_ad.txt
cd ..
while read dfe; do
    # echo $dfe
    dfe2=${dfe#./}
    echo cp -p _pre/$dfe2 $dfe2
    cp -p _pre/$dfe2 $dfe2
done <_sh/files_ad.txt 

