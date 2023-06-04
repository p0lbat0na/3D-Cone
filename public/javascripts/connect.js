'use strict';
//const { Client } = require('pg');
//require('dotenv').config();
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
export function piece(){
    return ('ooooooooooooo');
}


export async function readd(table) {
    alert('ss');
    let query = ` SELECT * FROM ` + table;
    if (table == 'obj+control')
        query =
            `SELECT * FROM оbjects_of_control
                    INNER JOIN control_objects_testing ON оbjects_of_control.control_object_code= control_objects_testing.control_object_code
                    INNER JOIN sorts_of_control ON control_objects_testing.test_code= sorts_of_control.test_code
                    `;
    if (table == 'staff+spec')
        query = `SELECT * FROM staff INNER JOIN staff_specializing ON staff.worker_id= staff_specializing.worker_id
                    INNER JOIN specializations ON staff_specializing.specialization_code= specializations.specialization_code
                    `;
    const { Client } = require('pg');
    //
    //const Cursor = require('pg-cursor');

    alert(table + ' ж');

    const jsonResponse = (responseObject, responseCode = 200) => {
        res.writeHead(responseCode, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(responseObject));

        //console.log(new Date(), '-- Handled request:', req.method, req.url, responseCode);
    };

    alert('sss');
    const client = new Client({
        user: 'postgres',
        host: 'localhost',
        database: 'LNK',
        password: '4444',
        port: 5432,
    });


    client.connect((err) => {
        if (err) {
            console.error('connection error', err.stack)
        } else {
            console.log('connected')
        }
    })
    alert('ssss');
    client.query(query, (err, res) => {
        if (err) {
            console.error(err);
            return;
        }
        for (let row of res.rows) {
            console.log(row);
        }
        client.end();
    });
    let asy = async (query, pool) => {


        const client = await pool.connect();

        const name = process.argv[2] ?? 'john';
        const entries = await client.query(query);
        //console.log(`${entries.rows.map((r) => Object.values(r).join('\t')).join('\n')}`);

        let promise = new Promise((resolve, reject) => {

            //console.log(`Database entries ${entries.rowCount} row(s)`);
            //console.log(Object.keys(entries.rows?.[0]).join('\t'));
            let mass = entries.rows.map((r) => Object.values(r).join('\t')).join('\n');

            resolve(mass);
        });
        await client.end();
        let result = await promise;

        //console.log(result);
        return result;

        //return mass;

    };
    //      console.log("___________________" + asy(query, pool) + "___________________");
    alert('last s');
            //let masss = await asy(query, pool);
            //console.log(masss);
            //get_user_name().then(alert);
            //(async () => {
            //    console.log(await asy(query, pool));
            //})();
            //console.log (asy(query, pool).then(alert));

            //(async () => {
            //    const client = await pool.connect();
            //
            //    const name = process.argv[2] ?? 'john';
            //    const entries = await client.query(query);
            //    //console.log(`Database entries ${entries.rowCount} row(s)`);
            //    //console.log(Object.keys(entries.rows?.[0]).join('\t'));
            //    //
            //    ////let mass = entries.rows.map((r) => Object.values(r).join('\t')).join('\n');
            //    //console.log(`${entries.rows.map((r) => Object.values(r).join('\t')).join('\n')}`);
            //
            //    await client.end();
            //    //return mass;
            //
            //})();
            //console.log(mass);
            //cb(masss);
}


export function resp(str) {

    console.log(str);
}






//hbs.registerHelper("lifnk", function () {
//    //query = hbs.escapeExpression(query);      //экранирование выражения
//    const query = `
// SELECT *
// FROM departments
// `;
//    const { Pool } = require('pg');
//    const Cursor = require('pg-cursor');
//    let mass = 'V';

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
                
                
//                mass = mass + rows;
//                if (rows != 0) {
                                       
//                    read();
//                }
//            });
//        }
//        read();
//    })();
//    return mass;
//});


////const query = `
//// SELECT *
//// FROM departments
//// `;
////connect(query);
////export default connect;
//hbs.registerHelper('Max', function (A, B) {
//    return (A > B) ? A : B;
//});

//hbs.registerHelper('getTime', function () {
//    var myDate = new Date()
//    var hour = myDate.getHours()
//    var minute = myDate.getMinutes()
//    var second = myDate.getSeconds()
//    if (minute < 10) {
//        minute = '0' + minute
//    }
//    if (second < 10) {
//        second = '0' + second
//    }
//    return (
//        'Текущее время: ' + hour + ':' + minute + ':' + second
//    )
//})



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
export function read2() {
    console.log('hey');
}


export function read4() {

    //query = hbs.escapeExpression(query);      //экранирование выражения
    console.log('con');
    let query = ` SELECT * FROM staff`;
    const { Pool } = require('pg');
    const Cursor = require('pg-cursor');
    let mass = 'V';
    console.log(table + ' ж');

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
        var pkjo = 0;
        function read(rws, cb) {
            cursor.read(rws, (err, rows) => {

                console.log(rows);
                mass = mass + rows[0, 0];
                if (rows != 0) {

                    read(1, cb);
                }
                pkjo++;
                /*console.log(Object.keys(cursor.rows?.[0]).join('ccc'));*/

            });
            cb(pkjo, mass);
            //generateWordDocument();

        }
        console.log('dsf');
        function cons(str1, str2) {

            console.log(str1 + 'э');
            console.log(str2 + ' (*_');

        }
        import { Document, Packer } from "docx";
        import { saveAs } from "file-saver";

        function generateWordDocument() {

            let doc = new Document()
            doc.createParagraph("Title")
            doc.createParagraph("Subtitle")
            doc.createParagraph("Heading 1")
            doc.createParagraph("Heading 2")
            doc.createParagraph(
                "Aliquam gravida quam sapien, quis dapibus eros malesuada vel. Praesent tempor aliquam iaculis. Nam ut neque ex. Curabitur pretium laoreet nunc, ut ornare augue aliquet sed. Pellentesque laoreet sem risus. Cras sodales libero convallis, convallis ex sed, ultrices neque. Sed quis ullamcorper mi. Ut a leo consectetur, scelerisque nibh sit amet, egestas mauris. Donec augue sapien, vestibulum in urna et, cursus feugiat enim. Ut sit amet placerat quam, id tincidunt nulla. Cras et lorem nibh. Suspendisse posuere orci nec ligula mattis vestibulum. Suspendisse in vestibulum urna, non imperdiet enim. Vestibulum vel dolor eget neque iaculis ultrices."
            )
            saveDocumentToFile(doc, "New Document.docx")
        }
        function saveDocumentToFile(doc, fileName) {
            // Create new instance of Packer for the docx module
            const packer = new Packer()
            // Create a mime type that will associate the new file with Microsoft Word
            const mimeType =
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            // Create a Blob containing the Document instance and the mimeType
            packer.toBlob(doc).then(blob => {
                const docblob = blob.slice(0, blob.size, mimeType)
                // Save the file using saveAs from the file-saver package
                saveAs(docblob, fileName)
            })
        }
        read(5, cons);
    })();
}