
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
