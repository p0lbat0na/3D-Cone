const { Pool } = require('pg');
const Cursor = require('pg-cursor');


const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'LNK',
    password: '4444',
    port: 5432,
});
//let { Client } = require('pg');
//
//const client = new Client({
//    user: 'postgres',
//    host: 'localhost',
//    database: 'LNK',
//    password: '4444',
//    port: 5432,
//});
//client.connect((err) => {
//    if (err) {
//        console.error('connection error', err.stack)
//    } else {
//        console.log('connecteddddddddd')
//    }
//})
module.exports = pool;






















//alert('au')
//import { readd } from './connect.js';

//const x = 10;
//const y = 5;
//document.getElementById('x').textContent = x
//document.getElementById('y').textContent = y
////document.getElementById('demo').textContent = readd('staff')

////const { Client } = require('pg');
//alert('l');

//alert('l');