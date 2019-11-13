#!/bin/bash

#pre to base
d_sh=`dirname $0`
cd $d_sh/..

for d in . Jos0090* ; do
    echo cp -p _pre/$d/*.ad $d
done
