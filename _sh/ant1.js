#!/usr/bin/env node

var process = require('process');
var args = process.argv.slice(1); // args[0]==war1.js
var dfe1 = args[1]
var d2 = args[2]
process.cwd( d2 )

let fs = require( 'fs' );
let lines = fs.readFileSync( dfe1, 'utf8' ).toString().split( '\n' );
let n = lines.length;
let i = 0;
for( ; i<n; i++ ) lines[i] = lines[i].replace('\r','');
console.log( "" + n + " lines" );

let patt = /^BOOK/;
let pattPreface = /^PREFACE/;
let patt1= /^BOOK I\./;
let first = -1;
let buf = "";
let cnt = 0;
i=0;
for( ; i<n && first==-1 ; i++ ) {
    // console.log( '' + i + '.' + lines[i] );
    if( pattPreface.test(lines[i] ) ) {
        console.log( "" + i + ". " +  lines[i] );
        cnt++;
        if( cnt == 2 ) { first = i; break; }
    }
    buf += lines[i] + "\n";
}
if( first == -1 ) {
    console.log( "pattPreface not found" ); process.exit(1);
}
    try{
        fs.writeFileSync( d2 + "/book00-toc.txt", buf );
    }catch(err) { console.error(err); process.exit(1); }
buf = lines[i] + "\n";

first = -1;
i += 1;
for( ; i<n && first==-1 ; i++ ) {
    if( patt1.test(lines[i] ) ) {
        console.log( "" + i + ". " +  lines[i] );
        first = i; break;
    }
    buf += lines[i] + "\n";
}
if( first == -1 ) {
    console.log( "patt1 not found" ); process.exit();
}

    try{
        fs.writeFileSync( d2 + "/book00-preface.txt", buf );
    }catch(err) { console.error(err); process.exit(1); }
buf = lines[i] + "\n";

console.log( "First book:" );
console.log( "<" + lines[i] + ">" );
cnt = 0;
i = i+1;

while( i<n ) {
    let j = i;
    while( j<n ) {
        if( patt.test( lines[j] )) {
            break;
        }
        buf += lines[j] + "\n" ;
        j += 1;
    }
    cnt += 1;
    console.log( "book"+cnt );
    let str0 = "0";
    if( cnt >= 10 ) str0 = "";
    try{
        fs.writeFileSync( d2 + "/book" +str0 + cnt +".txt", buf );
    }catch(err) { console.error(err); process.exit(1); }
    if( j==n ) break;
    buf = lines[j] + "\n";
    console.log( buf + "\n" );
    i=j+1;
}
console.log( "" + i + "lines" );

/*
fs.open( dfe1, (err, rd) => {
    if( err ) throw err;
    fs.fstat( rd, (err, stat) => {
        if( err ) throw err;

        fs.close( fd, (err) => {
            if( err ) throw err;
        });
    });
    xx;
});
*/
