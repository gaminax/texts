#!/bin/bash

# pre to base
d_sh=`dirname $0`
cd $d_sh/..

A=Josephus0090Antiquities
W=Josephus0090War
L=Josephus0090Life

cp -p _pre/*.ad .
cp -p _pre/$A/*.ad $A
cp -p _pre/$W/*.ad $W
cp -p _pre/$L/*.ad $L

