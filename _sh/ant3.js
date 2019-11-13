#!/usr/bin/env node

// jos3.js
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
function debracket( line ) {
    // replace interior square brackets in Footnotes with round
    let iFirst = -1, iLast = -1
    for( i=0; i<line.length && iFirst < 0 ; i++ ) {
        if( line[i] == '[' ) iFirst = i
    }
    for( i=line.length-1; i>=0 && iLast<0 ; --i ) {
        if( line[i] == ']' ) iLast = i
    }
    let line2 = ''
    for( i=0; i<line.length ; i++ ) {
        if( line[i]=='[' && i!=iFirst ) line2 += '('
        else if( line[i]==']' && i!=iLast  ) line2 += ')'
        else line2 += line[i]
    }
    return line2
}

var process = require('process')
var args = process.argv.slice(1) // args[00]=node,args[01]=cols.js
let d = args[1]
fe1 = args[2]
let n1 = fe1.length
let dfe1 = d +"/" +fe1

let fe2 = fe1.substring(0, n1-4) + "r.ad"
let dfe2 = d + "/" + fe2

let fs = require( 'fs' )
let lines0 = fs.readFileSync( dfe1, 'utf8' ).toString().split( '\n' );
n1 = lines0.length
let lines1 = []
// let iDash = 0x97
// let strDash = iDash.toString()
let strDash = String.fromCharCode( 0x97 )
for( i=0; i<n1 ; i++ ) {
    lines1[i] =  lines0[i].replace( strDash, "--" )
}
let pChapter = /^CHAPTER/
let pFootnotes = /^FOOTNOTES/
let pNumber = /^[0-9]+$/
let pNumberDot = /^[0-9]+\.$/
let i1 = 0, i2 = 0
let lines2 = []

let book = lines1[i1++]
let bookTitle = lines1[i1++]
i1++
lines2[i2++] = "= " + book
lines2[i2++] = ":page-noheader:"
lines2[i2++] = ":sectnums:"
lines2[i2++] = ":toc:"

let lines3 = [], i3=0
lines3[i3++] = ""
lines3[i3++] = "[abstract]"
lines3[i3++] = bookTitle
lines3[i3++] = ""

let iChapter = 1
let iParagraph = 0
while( i1<n1 && pChapter.test( lines1[i1] ) ) {
    // console.log( "Chapter " + iChapter );
    let chapter = lines1[i1++]
    let chapterTitle = lines1[i1++]
    // if( chapterTitle.length == 0 ) {
    //     console.log( "No chapter title" )
    //     while(i1<n1 && lines1[i1++].length==0) i1++
    //     console.log( "Using " + lines[i1] )
    //     chapterTitle = lines1[i1++]
    // }
    i1++
    let tf = footnote2(chapterTitle)
    lines3[i3++] = "== " + tf[0]
    lines3[i3++] = ""
    if( tf[1].length>0 ) {
        lines3[i3++] = tf[1]
        lines3[i3++] = ""
    }
    // while( i1<n1 && lines1[i1].length != 0 && !pChapter.test( lines1[i1] && !pFootnotes.test( lines1[i1] ) ) ) {
    iParagraph = 1
    while( 1 ) {
        // while( i1<n1 && lines1[i1].length != 0 && !pChapter.test( lines1[i1] ) && !pFootnotes.test( lines1[i1] ) ) {
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
            //console.log( "i1=" + i1 )
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

if( i1<n1 && pFootnotes.test( lines1[i1] ) ) {
    // lines2[i2++] = "=== " + lines1[i1++]
    // lines2[i2++] = lines1[i1++]
    i1 += 2
    while( i1<n1 ) {
        // lines2[i2++] = lines1[i1++]
        let i=0, j=0
        let line = debracket( lines1[i1] )
        let words = line.split( " " )
        if( ! pNumber.test( words[0] ) ) break;
        let words2 = []
        i1++
        // words2[j++] = "footnoteref:[" + words[i++] + ","
        // words2[j++] = ":FN" + words[i] + ": footnoteref:[" + words[i++] +","
        words2[j++] = ":FN" + words[i] + ": footnote:fn" + words[i++] +"[,"
        if( words[i] == "(return)" ) i++
        if( words[i] == "[" ) i++
        if( words[i] == "]" ) i++
        for( ; i<words.length; i++ ) {
            words2[j++] = words[i]
        }
        // words2[j++] = "]"
        lines2[i2++] = words2.join( " " )
        // lines2[i2++] = lines1[i1++] // blank
        while( i1<n1 && lines1[i1].length == 0 ) i1++
    }
    // console.log( "" + i1 +"/" + n1 )
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

