#!/bin/bash

# base to pre
d_sh=`dirname $0`
cd $d_sh/..

A=Josephus0090Antiquities
W=Josephus0090War
L=Josephus0090Life

cp -p *.ad _pre
cp -p $A/*.ad _pre/$A
cp -p $W/*.ad _pre/$W
cp -p $L/*.ad _pre/$L

