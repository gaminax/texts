#!/bin/bash
if [ -f gendocs.sh ] ; then cd ..; fi
if [ ! -d _site ] ; then echo no _site; exit 1; fi
if [ ! -d docs ] ; then echo no docs/ exit 1; fi
cp -p _site/index.html docs
for d in Josephus0090Antiquities Josephus0090War Josephus0090Life; do
    if [ ! -d docs/$d ] ; then mkdir docs/$d; fi
    if [ ! -d docs/$d ] ; then echo No directory: docs/$d; exit 1; fi
    cp -p _site/$d/*.html docs/$d
done
