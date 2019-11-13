#!/bin/bash
# The .ad files are in $TEXTS and not in $TEXTS/_pre

ungen.sh

jekyll build
TEXTS=$HOME/ws/github/gaminax/texts
A=Josephus0090Antiquities
W=Josephus0090War
L=Josephus0090Life
cp $TEXTS/*.html $TEXTS
cp $TEXTS/_site/$A/*.html $TEXTS/$A
cp $TEXTS/_site/$W/*.html $TEXTS/$W
cp $TEXTS/_site/$L/*.html $TEXTS/$L

