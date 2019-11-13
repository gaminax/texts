#!/bin/bash
# Remove the html files from $TEXTS.
if [ ! -f ungen.sh ] ; then echo No ungen.sh; exit 1; fi
d_sh=`dirname $0`
cd ..
A=Josephus0090Antiquities
W=Josephus0090War
L=Josephus0090Life
if [ ! -d $A ] ; then echo No $A; exit 1; fi
if [ ! -d $W ] ; then echo No $W; exit 1; fi
if [ ! -d $L ] ; then echo No $L; exit 1; fi
rm -f *.html
rm -f $A/*.html
rm -f $W/*.html
rm -f $L/*.html


