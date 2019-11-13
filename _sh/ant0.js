#!/usr/bin/env node

var process = require('process');
var args = process.argv.slice(2); // args[00]=node,args[01]=cols.js
fe1 = args[0]
let n1 = fe1.length
d = '/home/mark/Documents/Religion/Texts/Josephus0090Antiquities'
let dfe1 = d +"/" +fe1

let fe2 = fe1.substring(0, n1-4) + "r.txt"
let dfe2 = d + "/" + fe2

let fs = require( 'fs' );
let lines1 = fs.readFileSync( dfe1, 'utf8' ).toString().split( '\n' );
// sed 36, 48628
