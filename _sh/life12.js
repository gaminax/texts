#!/usr/bin/env node
// life12.js

let d1 = '/home/mark/Downloads/Books/gutenberg.org/Josephus/trimmed'
let fe1= 'Josephus0090Life.txt'
let fe2= 'life_ad.ad'
let d2 = '/home/mark/Documents/Religion/Texts/Josephus0090Life'
process.cwd( d2 )

let dfe1 = d1 + '/' + fe1
let dfe2 = d2 + '/' + fe2
let fs = require( 'fs' );
let lines1 = fs.readFileSync( dfe1, 'utf8' ).toString().split( '\n' );
let n1 = lines1.length
// remove \r
let i  = 0
for( i=0; i<n1; i++ ) {
    lines1[i] = lines1[i].trim()
}
while( n1>0 && lines1[n1-1].length==0 ) --n1
console.log( "" + n1 + " lines" )


let pNumberDot = /^[0-9]+\./
let pNumberColon = /^[0-9]+\:/
let pFootnotes = /^Footnotes$/
let pFootnote  = /^\[[0-9]+\]$/
let pFootnoteRef = /\[Footnote/
let pLeftBracket = /\[/g
let pRightBracket= /\]/g
let pComma = /\,/g


// The text goes to lines3, and  the footnotes to lines2.
// The footnotes are then emitted before the text.
let lines2 = [], lines3 = []
let i1 = 0, i2 = 0, i3 = 0

let title = lines1[i1++]
lines2[i2++] = "= " + title
while( i1<n1 && lines1[i1].length == 0 ) i1++ // blanks
let words_a = lines1[i1++].split( ' ' ) // Author
let author = words_a[1] + " " + words_a[2]
while( i1<n1 && lines1[i1].length == 0 ) i1++ // blanks
let words_t = lines1[i1++].split( ' ' ) // Translator
let translator = words_t[2] + ' ' + words_t[3]
while( i1<n1 && lines1[i1].length == 0 ) i1++ // blanks

lines2[i2++] = ":page-title: Life:
// lines2[i2++] = ":title: " + title
lines2[i2++] = ":author: " + author
lines2[i2++] = ":translator: " + translator

let cnt = 0
while( i1<n1 && !pFootnotes.test( lines1[i1] )  ) {
    // console.log( "i1=" + i1 + " line=" +lines1[i1] )
    let line = ""
    let sep = ''
    while( i1<n1 && lines1[i1].length != 0 ) {
        line += sep + lines1[i1++]; sep = ' '
    }
    let words = line.split( ' ' )
    let iw = 0, nw = words.length
    if( pNumberDot.test(words[iw] ) ) iw++
    let sentence = ""; sep = ''
    cnt++
    lines3[i3++] = "[[Section" +cnt + "]]"
    lines3[i3++] = "." + cnt
    while( iw<nw ) {
        let word = words[iw]
        let len = word.length
        let pt = word.substring( len-1,len )
        if( pt == '.' ) {
            word = word.substring(0, len-1); --len
        } else pt = ""
        if( pFootnote.test( word ) ) {
            // and he went there. [35]
            // the multitude, [to go to war;] for his abilities ...
            let dd = word.substring(1,len-1)
            // console.log( "Footnote word=" + word + ", dd=" +dd )
            word = "{FN" +dd +"}"
        }
        sentence += sep + word
        sep = " "
        if( pt == '.' ) {
            sentence = sentence.replace( pLeftBracket , '(' )
            sentence = sentence.replace( pRightBracket , ')' )
            lines3[i3++] = sentence + pt
            lines3[i3++] = ""
            sentence = ""; sep = ""
        }
        iw++
    }
    if( sentence.length != 0 ) lines3[i3++] = sentence
    lines3[i3++] = ""
    while( i1<n1 && lines1[i1].length == 0 ) i1++
}

// Footnotes
if( i1 == n1 ) {
    console.log( "No footnotes i1=" +i1 +" n1=" + n1 )
    process.exit(1)
}
i1++
while( i1<n1 && lines1[i1].length == 0 ) i1++ // blanks

// console.log( "Footnotes ... " +lines1[i1] )

while( i1<n1 )  {
    // FootnoteRef
    let line = ""
    let sep = ""
    while( i1<n1 && lines1[i1].length != 0 ) {
        line += sep + lines1[i1++]; sep = " "
    }
    let words = line.split( " " )
    let iw = 0, nw = words.length
    if( ! pFootnoteRef.test( words[0] ) ) {
        console.log( "line " + i1 +" FootnoteRef <" +words[0] +"> not recognized" )
        console.log( words[1] )
        process.exit(1)
    }
    iw++
    let wordb = words[nw-1]
    let len = wordb.length
    if( wordb.substring( len-1) != ']' ) {
        console.log( "Footnote - no closing ']' " )
        process.exit(1)
    }
    words[nw-1] = wordb.substring(0, len-1)

    let words2 = [], iw2 = 0
    let dd = words[iw++]
    let ddn= dd.length
    if( dd[ddn-1] == ":" ) dd = dd.substring(0,ddn-1)
    // words2[iw2++] = ":FN" + dd + ": footnoteref:[ fn" + dd +", "
    words2[iw2++] = ":FN" + dd + ": footnote:fn" + dd +"[ "
    for( ; iw<words.length; iw++ ) {
        let word = words[iw]
        word = word.replace( pLeftBracket, '(' )
        word = word.replace( pRightBracket, ')' )
        word = word.replace( pComma, "&comma;" )
        words2[iw2++] = word
    }
    words2[iw2++] = ']'
    lines2[i2++] = words2.join( " " )
    while( i1<n1 && lines1[i1].length == 0 ) i1++
}
lines2[i2++] = ""

let lines23 = lines2.concat( lines3 )
// lines23 = (["= foo", "" ]).concat( lines3 )
let buf = lines23.join( "\n" )
try {
    fs.writeFileSync( dfe2, buf )
}catch(err) { console.error(err); process.exit(1) }
