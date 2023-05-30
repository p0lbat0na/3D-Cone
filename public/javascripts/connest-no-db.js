
let { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    password: '4444',
    port: 5432,
});
pool.connect((err) => {
    if (err) {
        console.error('connection error', err.stack)
    } else {
        console.log('pg db connected');
    }
})
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