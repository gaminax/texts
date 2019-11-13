#!/usr/bin/env node

// war2.js
// Produce a clean file that is not tied to a backend
//

function CapitalizeOrig(word) {
    let word2 = ""
    let i
    for( i=0; i<word.length; i++ ) {
        let ch = word[i]
        if( i==0 ) word2 += ch.touppercase()
        else word2 += ch.tolowercase()
    }
    return word2
}
function Capitalize( word ) {
    let len = word.length
    if( len == 0 ) return word
    let word1 = word.toLowerCase()
    if( len == 1 ) return word1.toUpperCase()
    return word1[0].toUpperCase() + word1.substring(1)
}

let res = [ /^a$/, /^all$/, /^an$/, /^about$/, /^according$/, /^account$/, /^again$/, /^against$/, /^also$/, /^among$/, /^and$/, /^are$/, /^as$/, /^at$/,
    /^be$/, /^been$/, /^before$/, /^began$/, /^behind$/, /^both$/, /^but$/, /^by$/,
    /^concerning$/,
    /^for$/, /^greatly$/,
    /^he$/, /^had$/, /^her$/, /^him$/,/^himself$/, /^his$/,
    /^in$/, /^is$/, /^from$/, /^how$/, /^into$/, /^itself$/,
    /^made$/, /^many$/, /^may$/, /^means$/,
    /^not$/,
    /^of$/, /^on$/, /^one$/, /^off$/, /^other$/, /^out$/, /^own$/,
    /^pillaged$/,
    /^ready$/,
    /^sorts$/, /^taken$/,
    /^the$/, /^their$/, /^them$/, /^then$/, /^there$/, /^those$/, /^that$/, /^there$/, /^thereupon$/, /^they$/, /^through$/, /^till$/, /^to$/,
    /^upon$/, /^under$/, /^up$/,
    /^was$/, /^were$/, /^what$/, /^when$/, /^where$/, /^which$/, /^who$/, /^with$/,
    /^very$/, /^yet$/ ]

let reVerbs = [ /^adds$/, /^advanced$/, /^become$/, /^banished$/, /^blots$/,
    /^came$/, /^change$/, /^commands$/,  /^compelled$/,  /^complain$/,  /^composed$/,  /^composes$/,  /^crucifies$/,  /^cut$/,
    /^demolished$/, /^destroy$/, /^did$/, /^die$/, /^divert$/, /^dies$/, /^dismissed$/, /^distributed$/, /^espouses$/,
    /^exhibited$/, /^forces$/, /^frees$/, /^goes$/, /^had$/, /^have$/, /^happen$/, /^heard$/, /^journeying$/, /^kill$/, /^lefts$/, /^makes$/, /^making$/, /^occasions$/, /^quenched$/,
    /^raised$/, /^received$/, /^reduced$/, /^reserved$/, /^retire$/,/^revolted$/,
    /^say$/, /^see$/, /^sent$/, /^sends$/, /^set$/, /^should$/, /^showed$/, /^spare$/, /^subdue$/, /^subdued$/, /^subject$/, /^survives$/,
    /^take$/, /^took$/, /^were$/ ]
let reNouns = [ /^actions$/, /^condition$/, /^death$/, /^interval$/, /^name$/, /^taking$/ ]

function decapitalize(word) {
    let word1 = word.toLowerCase()
    let i
    for( i=0; i<res.length; i++ ) {
        // console.log( "testing " + res[i] )
        if( res[i].test(word1) ) return word1
    }
    for( i=0; i<reVerbs.length; i++ ) {
        if( reVerbs[i].test(word1) ) return word1
    }
    for( i=0; i<reNouns.length; i++ ) {
        if( reNouns[i].test(word1) ) return word1
    }
    // console.log( "Assembling" )
    let word2 = word[0] + word1.substring(1)
    return word2
}

function normalize(line) {
    // console.log( "normalize: " + line )
    let words = line.split( ' ' )
    let words2= []
    let first = true
    let i
    for( i=0; i< words.length; i++ ) {
        let wordp= words[i]
        let len = wordp.length
        let word = wordp, p = ''
        if(  wordp[len-1] == '.' || wordp[len-1] == ',' || wordp[len-1] == ';' || wordp[len-1] == ':'  ) {
            word = wordp.substring(0, len-1); p = wordp.substring(len-1)
        }
        if(first) words2[i] = Capitalize(word) +p
        else words2[i] = decapitalize(word) +p
        if( p == '.' ) first = true
        else first = false
    }
    let line2 = words2.join( ' ' )
    // console.log( "normalized: " +line2 )
    return line2
}

var process = require('process');

/* let str = "Eagle"
console.log( str )
let str2= decapitalize( str )
console.log( str2 )
process.exit(0) */

var args = process.argv.slice(1); // args[00]=node,args[01]=war2.js
let d = args[1]
let fe1 = args[2]
console.log( "fe1=" + fe1 )
let dfe1 = d +"/" +fe1
let n = fe1.length
let fe2 = fe1.substring(0, n-4) + "r.txt"
console.log( "fe2=" + fe2 )
let dfe2 = d + "/" + fe2

let fs = require( 'fs' );
let lines1 = fs.readFileSync( dfe1, 'utf8' ).toString().split( '\n' );
n1 = lines1.length;
let i1=0
let lines2 = []
let i2=0

let pPreface = /^PREFACE/
let pBook = /^BOOK [IXVLCM]+\./
let pChapter = /^CHAPTER/
let pFootnotes = /.*FOOTNOTES$/
let pNumberDot = /^[0-9]+\./
let pReturn = /\(return\)/
let pLeftBracket = /\[/g
let pRightBracket = /\]/g
let pI = /.*i\.$/

// while( i1<n && lines1[i1].length==0 ) i++
if( pBook.test( lines1[i1] ) ) {
    let book = lines1[i1++]
    console.log( "Book=" + book )
    while( lines1[i1].length==0 ) i1++
    let bookTitle = lines1[i1++]
    while( lines1[i1].length == 0 ) i1++
    while( i1<n1 && !pChapter.test( lines1[i1] ) ) {
        // Merge all separated lines before 'CHAPTER'
        bookTitle += " " + lines1[i1++]
        while( lines1[i1].length == 0 ) i1++
    }
    bookTitle = normalize( bookTitle )
    console.log( "bookTitle=" + bookTitle )
    lines2[i2++] = book
    lines2[i2++] = bookTitle
    lines2[i2++] = ""
}else if( pPreface.test( lines1[i1] ) ) {
    let preface = lines1[i1]
    console.log( "Preface=" + preface )
}else {
    console.log( "No Preface or Book <" + lines1[i1] + ">" )
    process.exit(1)
}

while( i1<n1 ) {
    // Chapters
    if( pFootnotes.test( lines1[i1] ) ) break
    if( pPreface.test( lines1[i1] ) ) {
        lines2[i2++] = lines1[i1++]
        lines2[i2++] = ""
        i1++
    }else if( pChapter.test( lines1[i1] ) ) {
        // console.log( lines1[i1] )
        lines2[i2++] = lines1[i1++]
        if( i1==n1 ) break;
        while( i1<n1 && lines1[i1].length == 0 ) { i1++; }
        if( i1==n1 ) break
        // Chapter Title lines
        // while( i1<n1 ) {
            // if( pChapter.test( lines1[i1] ) ) break;
            // if( pFootnotes.test( lines1[i1] ) ) break
            let line = lines1[i1++]
            while( i1<n1 && lines1[i1].length != 0 ) {
                line += " " + lines1[i1++]
            }
            lines2[i2++] = normalize( line )
        i1++
            // while( i1<n1 && lines1[i1].length == 0 ) i1++
        // }
        // console.log( "Chapter Title: " )
        // console.log( lines2[i2-1] )
        if( i1==n1 ) break
        lines2[i2++] = ""
    }else {
        console.log( "No chapter header, line " + i1 )
        process.exit(1)
    }
    while( i1<n1 ) {
        // paragraph
        if( pChapter.test( lines1[i1] ) ) break
        if( pFootnotes.test( lines1[i1] ) ) break
        let line = lines1[i1++]
        while( i1<n1 && lines1[i1].length != 0 ) {
            line += " " + lines1[i1++]
        }
        // remove number
        let words = line.split( " " )
        i = 0
        if( pNumberDot.test( words[0] ) ) i++
        // emit sentences
        let sentence = ""
        sep = ""
        while( i<words.length ) {
            let word = words[i]
            sentence += sep + word
            sep = " "
            let len = word.length
            // i. e.
            if( i<words.length-2 && pI.test( words[i] ) && words[i+1] == "e." )
                ; // console.log( "Match1" )
            else if( i>0 && pI.test( words[i-1] ) && words[i] == "e." )
                ; // console.log( "Match2" )
            else if( len>0 && word[len-1] == '.' ) {
                lines2[ i2++ ] = sentence
                sentence = ""
                sep = ""
            }
            i++
        }
        if( sentence != "" ) lines2[i2++] = sentence
        while( i1<n1 && lines1[i1].length == 0 ) i1++
        lines2[i2++] = ""
    }
}

if( i1<n1 && pFootnotes.test( lines1[i1] ) ) {
    lines2[i2++] = lines1[i1++]
    lines2[i2++] = ""
    while( i1<n1 && lines1[i1].length==0 ) i1++
    while( i1<n1 ) {
        // Footnotes
        let line = lines1[i1++]
        while(i1<n1 && lines1[i1].length!=0) {
            line += " " + lines1[i1++]
        }
        let words = line.split( ' ' )
        if( pReturn.test( words[1] ) ) words.splice(1,1)
        line = words.join( ' ' )
        let iLeft=0, iRight = line.length, len = line.length
        while( iLeft<line.length && line[iLeft] != "[" ) iLeft++
        if( iLeft > len ) console.log( "No \[ in:" + line )
        while( iRight>=0 && line[iRight-1]!= "]" ) --iRight
        if( iRight<0 ) console.log( "No \] in: " + line )
        let note = line.substring(iLeft+1, iRight-1 )
        note = note.replace( /\[/g, '(' )
        note = note.replace( /\]/g, ')' )
        lines2[i2++] = line.substring(0,iLeft+1) +note +line.substring( iRight-1, len )
        lines2[i2++] = ""
        while( i1<n1 && lines1[i1].length==0 ) i1++
    }
}else {
    console.log( "No footnotes i1=" +i1 +" n1=" +n1 )
    // process.exit(1)
}

// console.log( "i2=" +i2 )
// console.log( "lines2.length=" +lines2.length )


// add "\n" to lines
let buf = ""
ii = 0
n2 = lines2.length
buf = "";
while( ii < n2 ) { buf += lines2[ii] + "\n" ; ii++; }
try {
    fs.writeFileSync( dfe2, buf );
} catch(err) { console.error(err); process.exit(1); }

