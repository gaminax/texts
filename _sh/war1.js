#!/usr/bin/env node
// War consists of: a toc, a preface,  and seven books divided into chapters.
// Each book has its own set of footnotes.
// In the first stage we split War up into its parts without rearranging the lines.

var process = require('process');
// Remove first argument: 'node'
var args = process.argv.slice(1);
// args[0]== war1.js
// args[1]== source folder of the one source file.
// args[2]== target folder for the book parts.
var d1 = args[1]
var d2 = args[2]

let fe1= 'Josephus0090War.txt'
process.cwd( d2 )

let dfe1 = d1 + '/' + fe1
let fs = require( 'fs' );
let lines = fs.readFileSync( dfe1, 'utf8' ).toString().split( '\n' );
let i = 0
let n = lines.length;
console.log( "" + n + "lines" )
// remove \r
let lines1 = []
let first = true
for( i=0; i<n; i++ ) {
//     let line = lines[i]
//     let nn = line.length
//     let line2= ""
//     for( j=0; j<nn; j++ ) if( line[j] != "\r" ) line2 += line[j]
//     lines1[i] = line2
    lines1[i] = lines[i].trim()
}

let pPreface = /^PREFACE/
let pBook = /^BOOK/
let pFootnotes = /WAR BOOK [IVXLCM]+ FOOTNOTES/

let buf = ""
let ln = "\n"
for(i=0; i<n && !pPreface.test( lines1[i] ); i++ ) {
    buf += lines1[i] + ln
}
console.log( "first PREFACE at " + i )
i++
for(   ; i<n && !pPreface.test( lines1[i] ); i++ ) {
    buf += lines1[i] + ln
}
console.log( "second PREFACE at " + i )
if( i==n ) {
    console.log( "pPreface not found" ); process.exit(1)
}
try { fs.writeFileSync( d2 + "/book00-toc.txt", buf ); }
catch ( err ) { console.error( err ) ; process.exit( 1 ) }

buf = ""
while( i<n && !pBook.test( lines1[i] ) ) {
    buf += lines1[i++] + ln
}
try { fs.writeFileSync( d2 + "/book00-preface.txt", buf ); }
catch ( err ) { console.error( err ) ; process.exit( 1 ) }

buf = lines1[i++] + ln

let cnt = 0
while( cnt<=20 ) {
    for( ; i<n && !(pBook.test( lines1[i] ) && !pFootnotes.test( lines1[i] ) ) ; i++ ) {
        buf += lines1[i].trim() + ln
    }
    cnt++
    let zcnt = "000" + cnt
    let nn = zcnt.length
    bookzcnt = "book" + zcnt.substring( nn-2 ,n)
    // console.log( "zcnt=" + zcnt + " bookzcnt=" + bookzcnt )
    try { fs.writeFileSync( d2 + "/" +bookzcnt +".txt" , buf ); }
    catch ( err ) { console.error( err ) ; process.exit( 1 ) }
    if( i==n ) break
    buf = lines1[i++] + ln
}

