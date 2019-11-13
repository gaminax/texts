#! /usr/bin/env bash

# the sh and js scripts are run from _sh
# find the name of the base:
d_sh=`dirname $0`
base=$d_sh/..
cd $base
base=`pwd`
d_sh=$base/_sh
echo base=$base
D1="$base/_src1"
D2="$base/_src2/Josephus0090War"
if [ ! -d $D2 ] ; then mkdir $D2; fi
D3="$base/Josephus0090War"
if [ ! -d $D3 ] ; then mkdir $D3; fi
echo d_sh=$d_sh
echo D1=$D1
echo D2=$D2
echo D3=$D3

$d_sh/war1.js $D1 $D2

cd $D2
pwd
$d_sh/war2.js $D2 book00-preface.txt
$d_sh/war3.js $D2 book00-prefacer.txt
rm book00-prefacer.txt
res=$?
echo res=$res
if [ ! $res -eq 0 ] ; then echo Cannot delete; exit 1; fi
mv book00-prefacerr.ad $D3

for i in {1..7}
do
    echo -n " $i" #show progress
    # create two digit postfix
    ii=$i
    if [ "$i" -lt 10 ] ; then ii="0$ii" ; fi
    $d_sh/war2.js $D2 book$ii.txt
    $d_sh/war3.js $D2 book${ii}r.txt
    rm book${ii}r.txt
    mv book${ii}rr.ad $D3
    # asciidoc book${ii}rr.ad
done
echo


