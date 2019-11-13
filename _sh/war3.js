#!/usr/bin/env node
// war3.js
//
//
function footnote( line ) {
    let words = line.split( " " )
    let words2 = []
    let i=0, j=0, f=0;
    for( ; i<words.length; i++ ) {
        if( pNumber.test( words[i] ) ) {
            // words[j++] = "footnoteref:[" + words[i] + "]"
            words2[j++] = "{FN" +words[i] +"}"
        }else if( pNumberDot.test( words[i]) ) {
            let len = words[i].length
            let word = words[i].substr(0,len-1)
            words2[j++] = "{FN" +word +"}."
        }else words2[j++] = words[i]
    }
    return words2.join( " " )
}
function footnote2( line ) {
    // For chapter headers - asciidoc problem with footnotes
    // in headers. Separate footnote from header and put it into
    // the text
    let words = line.split( " " )
    let words2 = []
    let footnotes2 = []
    let i=0, j=0, f=0;
    for( ; i<words.length; i++ ) {
        if( pNumber.test( words[i] ) ) {
            // words[j++] = "footnoteref:[" + words[i] + "]"
            // words2[j++] = "{FN" +words[i] +"}"
            footnotes2[f++] = "{FN" +words[i] +"}"
        }else if( pNumberDot.test( words[i]) ) {
            let len = words[i].length
            let word = words[i].substr(0,len-1)
            footnotes2[f++] = "{FN" +word +"}."
        }else words2[j++] = words[i]
    }
    return [ words2.join( " " ) , footnotes2.join(" " ) ]
}
var process = require('process')
var args = process.argv.slice(1) // args[00]=node,args[01]=cols.js
let d = args[1]
let fe1 = args[2]
let dfe1= d + "/" + fe1
let n1 = fe1.length
// let fe2 = fe1.substring(0, n1-4) + "r.txt"
let fe2 = fe1.substring(0, n1-4) + "r.ad"
let dfe2 = d + "/" + fe2

let fs = require( 'fs' )
let lines0 = fs.readFileSync( dfe1, 'utf8' ).toString().split( '\n' );
n1 = lines0.length
let lines1 = lines0
let lines2 = []

let pPreface = /^PREFACE/
let pBook = /^BOOK [IXVLCM]+\./
let pChapter = /^CHAPTER/
let pFootnotes = /.*FOOTNOTES$/
let pNumber = /^[0-9]+$/
let pNumberDot = /^[0-9]+\.$/

let i1=0, i2=0
let lines3 = [], i3=0
if( pPreface.test( lines1[i1] ) ) {
    lines2[i2++] = "= " + lines1[i1]
    lines2[i2++] = ":page-title: " + "Preface"
    lines2[i2++] = ":page-noheader:"
    lines2[i2++] = ":sectnums!:"
    lines2[i2++] = ":toc!:"
}else {
    let book = lines1[i1++]
    let bookTitle = lines1[i1++]
    i1++
    lines2[i2++] = "== " + book
    lines2[i2++] = ":page-title: " + book
    lines2[i2++] = ":sectnums!:"
    lines2[i2++] = ":toc!:"

    lines3[i3++] = ""
    lines3[i3++] = "[abstract]"
    lines3[i3++] = bookTitle
    lines3[i3++] = ""
}

let iChapter = 1
let iParagraph = 0
while( i1<n1 && (pPreface.test( lines1[i1] ) || pChapter.test( lines1[i1] ) ) ) {
    if( pPreface.test( lines1[i1] ) ) {
        i1++
        i1++
        lines3[i3++] = ""
    }else {
        let chapter = lines1[i1++]
        let chapterTitle = lines1[i1++]
        i1++
        /*let tf = footnote2(chapterTitle)
        lines3[i3++] = "== " + tf[0]
        lines3[i3++] = ""
        if( tf[1].length>0 ) {
            lines3[i3++] = tf[1]
            lines3[i3++] = ""
        }*/
        lines3[i3++] = "== " + chapter
        lines3[i3++] = ""
        lines3[i3++] = "[abstract]"
        lines3[i3++] = chapterTitle
        lines3[i3++] = ""
    }

    iParagraph = 1
    while( 1 ) {
        let first = true
        while( 1 ) {
            if( i1>=n1 ) break
            if( lines1[i1].length==0 ) break;
            if( pChapter.test( lines1[i1] ) ) break;
            if( first ) {
                lines3[i3++] = "." + iParagraph
                first = false;
            }
            lines3[i3++] = footnote( lines1[i1++] )
            lines3[i3++] = "" // separate each sentence
        }
        if( lines1[i1].length == 0 ) i1++
        if( i1>= n1 ) break;
        if( lines1[i1].length==0 ) break;
        if( pChapter.test( lines1[i1] ) ) break;
        if( pFootnotes.test( lines1[i1] ) ) break;
        iParagraph++
    }
    iChapter++
}

let reComma = /,/g

if( i1<n1 && pFootnotes.test( lines1[i1] ) ) {
    i1 += 2
    while( i1<n1 ) {
        let i=0, j=0
        let words = lines1[i1].split( " " )
        if( ! pNumber.test( words[0] ) ) break;
        let words2 = []
        i1++
        // 191110 Sun. Edit out depracted AsciiDoc syntax, to eliminate warnings.
        // words2[j++] = ":FN" + words[i] + ": footnoteref:[ fn" + words[i++] +","
        words2[j++] = ":FN" + words[i] + ": footnote:fn" + words[i++] +"["
        if( words[i] == "(return)" ) i++
        if( words[i] == "[" ) i++
        if( words[i] == "]" ) i++
        for( ; i<words.length; i++ ) {
            let word = words[i].replace( reComma, "&comma;" )
            words2[j++] = word
        }
        lines2[i2++] = words2.join( " " )
        while( i1<n1 && lines1[i1].length == 0 ) i1++
    }
    let first = true
    while( i1<n1 ) {
        if(first) lines2[i2++] = "Extra lines:"
        lines2[i1++] = lines1[i1++]
        first = false;
    }
}else {
    if( i1==n1 ) console.log( "EOT" )
    console.log( "No footnotes, line " +i1 + ":" + lines1[i1] +": len=" +lines1[i1].length )
}

let lines23 = lines2.concat( lines3 )
let buf = lines23.join( "\n" )
try {
    fs.writeFileSync( dfe2, buf )
}catch(err) { console.error(err); process.exit(1) }

