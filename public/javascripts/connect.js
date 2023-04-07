//const { Client } = require('pg');
//require('dotenv').config();
require('express-handlebars');
const hbs = require('hbs')
//(async () => {
//    const client = new Client({
//        host: process.env.PG_HOST,
//        port: process.env.PG_PORT,
//        user: process.env.PG_USER,
//        password: process.env.PG_PASSWORD,
//        database: process.env.PG_DATABASE,
//        ssl: true,
//    });
//    await client.connect();
//    const res = await client.query('SELECT $1::text as connected', ['Connection to postgres successful!']);
//    console.log(res.rows[0].connected);
//    await client.end();
//})();


//function connect(query) {

//    const { Pool } = require('pg');
//    const Cursor = require('pg-cursor');

//    const pool = new Pool({
//        user: 'postgres',
//        host: 'localhost',
//        database: 'LNK',
//        password: '4444',
//        port: 5432,
//    });

//    (async () => {
//        const client = await pool.connect();
        

//        const cursor = await client.query(new Cursor(query));
//        function read() {
//            cursor.read(1, (err, rows) => {
//                console.log('We got the first row set');
//                console.log(rows);

//                if (rows != 0) {
//                    console.log(cursor.Pool + ' |d')
//                    read();
//                }

//            });

//        }
//        read();
//    })();
//}


hbs.registerHelper("lifnk", function () {
    //query = hbs.escapeExpression(query);      //экранирование выражения
    const query = `
 SELECT *
 FROM departments
 `;
    const { Pool } = require('pg');
    const Cursor = require('pg-cursor');
    let mass = 'V';

    const pool = new Pool({
        user: 'postgres',
        host: 'localhost',
        database: 'LNK',
        password: '4444',
        port: 5432,
    });

    (async () => {
        const client = await pool.connect();


        const cursor = await client.query(new Cursor(query));
        function read() {
            cursor.read(1, (err, rows) => {
                
                
                mass = mass + rows;
                if (rows != 0) {
                                       
                    read();
                }
            });
        }
        read();
    })();
    return mass;
});


//const query = `
// SELECT *
// FROM departments
// `;
//connect(query);
//export default connect;
hbs.registerHelper('Max', function (A, B) {
    return (A > B) ? A : B;
});

hbs.registerHelper('getTime', function () {
    var myDate = new Date()
    var hour = myDate.getHours()
    var minute = myDate.getMinutes()
    var second = myDate.getSeconds()
    if (minute < 10) {
        minute = '0' + minute
    }
    if (second < 10) {
        second = '0' + second
    }
    return (
        'Текущее время: ' + hour + ':' + minute + ':' + second
    )
})



//const { Client } = require('pg');

//const client = new Client({
//    user: 'postgres',
//    host: 'localhost',
//    database: 'LNK',
//    password: '4444',
//    port: 5432,
//});

//client.connect(); 

//const query = ` 
// SELECT * 
// FROM departments
// `;

//client.query(query, (err, res) => {
//    if (err) {
//        console.error(err);
//        return;
//    }
//    for (let row of res.rows) {
//        console.log(row);
//    }
//    client.end();
//}); 