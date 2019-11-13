#!/usr/bin/env node

// jos2.js
// Produce a clean file that is not tied to a backend
//
function shiftFootnote( line ) {
    // this is it. 23 And then, 
    // this is it 23. And then,
    let words = line.split( " " )
    let n = words.length
    let i = 1
    while( i<n ) {
        let wordPrev = words[i-1]
        let word = words[i]
        let nPrev = wordPrev.length
        // console.log( word +" " +pNumber.test(word) )
        if( wordPrev[nPrev-1] == '.' && pNumber.test(word) ) {
            // remove dot
            words[i-1] = wordPrev.substr(0, nPrev-1)
            // add dot
            words[i] += "."
        }
        i++
    }
    return words.join( ' ' )
}

var process = require('process');

var args = process.argv.slice(1); // args[00]=node,args[01]=cols.js
let d = args[1]
fe1 = args[2]
let n1 = fe1.length
let dfe1 = d +"/" +fe1

let fe2 = fe1.substring(0, n1-4) + "r.txt"
let dfe2 = d + "/" + fe2
// console.log( "dfe2 = " +dfe2 )

// patterns
let pBlank = /^ */
let pBook = /^BOOK [IXVLCM]+\. /
let pChapter = /^CHAPTER/
let pNumber = /^[1-9][0-9]*$/
let pNumberDot = /^[0-9]+\./
let pFootnotes = /^FOOTNOTES/
let pReturn = /^(return)$/
// process.cwd( d );

/* let tLine1 = "This is it. 10 And so he went. To it."
let tLine2 = shiftFootnote( tLine1 )
console.log( tLine1 ); console.log( tLine2 ); process.exit(0)
*/


let fs = require( 'fs' );
let lines1 = fs.readFileSync( dfe1, 'utf8' ).toString().split( '\n' );
n1 = lines1.length;
// console.log( "n1=" + n1 )

let i1 = 0, ii = 0, i2 = 0;
let lines2 = [];

while( i1<n1 && lines1[i1].length == 0 ) i1++;
ii = pBook.test( lines1[i1] );
// console.log( "bBook=" + ii );
if( ii == -1 ) {
    console.log( "BOOK not found" ); process.exit(1);
}
ii = lines1[i1].search( /\. / );
// console.log( ". = " + ii );
lines2[i2++] = lines1[i1].substr( 0 , ii );
lines2[i2  ] = lines1[i1].substr( ii+2 );
i1++
while( i1 < n1 && lines1[i1].length!=0 ) {
    lines2[i2] += " " + lines1[i1++];
}
i2++;
lines2[i2++] = ""
while( i1<n1 && lines1[i1].length == 0 ) { i1++; }

while( i1 < n1 ) {
    if( pChapter.test( lines1[i1] ) ) {
        // join chapter header lines
        ii = lines1[i1].search( /\. / );
        lines2[i2] = ""
        if( ii>0 ) lines2[i2]= lines1[i1].substr( 0, ii );
        i2++;
        // console.log( "Chapter " + lines2[i2-1] + " ii=" + ii );
        lines2[i2] = ""
        if( ii>0 && lines1[i1].length>ii+2 ) lines2[i2  ]= lines1[i1].substr( ii+2 );
        i1++;
        while( i1<n1 && lines1[i1].length != 0 ) {
            lines2[i2] += " " + lines1[i1]; i1++;
        }
        i2++
        lines2[i2++] = ""
        while( i1<n1 && lines1[i1].length == 0 ) i1++;
    }else if( pNumberDot.test( lines1[i1] ) ) {
        // 4. This is the line ...
        ii = lines1[i1].search( /\. / );
        // lines2[i2++] = "." + lines1[i1].substring(0,ii );
        lines2[i2  ] = lines1[i1].substring(ii+2);
        i1++
        while( i1<n1 && lines1[i1].length != 0 ) {
            lines2[i2] += " " + lines1[i1++];
        }
        let line = shiftFootnote( lines2[i2] )
        let sentences = line.split( "\. " );
        lines2.pop();
        // lines2.push( "" + sentences.length + " sentences" ); ++i2;
        let i = 0;
        do {
            let sentence = sentences[i];
            i++;
            if( i != sentences.length ) sentence += ".";
            // lines2.push( "" + i +". " + sentence ); i2++
            lines2.push( sentence ); i2++
        }while( i != sentences.length );
        lines2[i2++] = ""
        while( i1<n1 && lines1[i1].length == 0 ) { i1++; }
    }else if( pFootnotes.test( lines1[i1] ) ) {
        lines2[i2++] = lines1[i1++] // "FOOTNOTES"
        lines2[i2++] = lines1[i1++]
        while( i1<n1 && lines1[i1].length==0 ) i1++
        while( i1<n1 && lines1[i1].length!=0 ) {
            lines2[i2] = ""
            let sep = ""
            while( i1<n1 && lines1[i1].length != 0 ) {
                lines2[i2] += sep + lines1[i1++]
                sep = " "
            }
            i2++
            lines2[i2++] = lines1[i1++]
            while( i1<n1 && lines1[i1].length==0 ) i1++
        }
    }else {
        // copy over
        console.log( "Copying over:" )
        console.log( lines1[i1] )
        let sep = ""
        let line = ""
        while( i1<n1 && lines1[i1].length != 0 ) {
            line += sep + lines1[i1++];
            sep = " "
        }
        line = shiftFootnote(line)
        let sentences = line.split( "\. " );
        for( i=0; i<sentences.length; i++) {
            if( i<sentences.lenth-1) lines2[i2++] = sentences[i] + "."
            else lines2[i2++] = sentences[i]
        }
        lines2[i2++] = "";
        while( i1<n1 && lines1[i1].length == 0 ) i1++;
    }
}


// add "\n" to lines
ii = 0
n2 = lines2.length
buf = "";
while( ii < n2 ) { buf += lines2[ii] + "\n" ; ii++; }
try {
    fs.writeFileSync( dfe2, buf );
} catch(err) { console.error(err); process.exit(1); }


