#! /usr/bin/env bash

d_sh=`dirname $0`; base=$d_sh/..; cd $base
base=`pwd`; d_sh=$base/_sh
D1=$base/_src1; D2=$base/_src2/Josephus0090Antiquities; D3=$base/Josephus0090Antiquities
$d_sh/ant1.js $D1/Josephus0090Antiquities.txt $D2
if [ ! -d $D2 ] ; then echo no D2; mkdir $D2; fi
cd $D2
res=$?
if [ ! $res -eq 0 ] ; then echo cant cd $D2; exit 1; fi

for i in {1..20}
do
    echo -n " $i"
    ii=$i
    if [ "$i" -lt 10 ] ; then ii="0$ii" ; fi
    $d_sh/ant2.js $D2 book$ii.txt
    $d_sh/ant3.js $D2 book${ii}r.txt
    rm book${ii}r.txt
    # asciidoctor book${ii}rr.ad
    # rm $D3/book${ii}rr.ad
    mv book${ii}rr.ad $D3
done
echo

