'use strict';
const debug = require('debug')('my express app');
const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const routes = require('./routes/index');
const users = require('./routes/users');
const ntlm = require('express-ntlm');
const docx = require('docx');
const jwt = require('jsonwebtoken');
const { Document, Packer, Paragraph, Table, TableCell, TableRow, TextRun } = docx;
const todoRoutes = require('./routes/routes');
const app = express();



// view engine setup

app.set('views', 'views')
app.use(todoRoutes);

// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/public/favicon.png'));
app.use(logger('dev'));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

app.set('port', process.env.PORT || 3000);

const server = app.listen(app.get('port'), function () {
    debug('Express server listening on port ' + server.address().port);
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});
// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: 'hbs',
    helpers: {
        //exit: function (request, response, next) {
        //    response.statusCode = 401;
        //    response.setHeader('WWW-Authenticate', 'NTLM'); response.end();
        //},

        substr: function (length, context, options) {
            if (context.length > length) {
                return context.substring(0, length) + "...";
            } else {
                return context;
            }
        },






        //getTime: function () {
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
        //},


        connect2: function (table) {

            let query = ` SELECT * FROM ` + table;
            if (table == 'obj+control')
                query = `SELECT * FROM оbjects_of_control 
INNER JOIN control_objects_testing ON оbjects_of_control.control_object_code= control_objects_testing.control_object_code 
INNER JOIN sorts_of_control ON control_objects_testing.test_code= sorts_of_control.test_code
 	`;
            if (table == 'staff+spec')
                query = `SELECT * FROM staff INNER JOIN staff_specializing ON staff.worker_id= staff_specializing.worker_id 
     INNER JOIN specializations ON staff_specializing.specialization_code= specializations.specialization_code
     INNER JOIN specializations ON staff_specializing.specialization_code= specializations.specialization_code
    `
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
                //import { Document, Packer } from "docx";
                //import { saveAs } from "file-saver";

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
        },
        isExecutor: function () {
            if (ntlm.UserName == 2 || ntlm.UserName == 3)
                return true;
            else return false;
        },
        isAdmin: function () {
            if (ntlm.UserName == 1)
                return true;
            else return false;
        },
        isDeclarant: function () {
            if (ntlm.UserName > 3)
                return true;
            else return false;
        },





        connect17: async function (table) {
            console.log('ss');

            let query = ` SELECT * FROM ` + table;
            if (table == 'obj+control')
                query =
                    `                
                SELECT * FROM оbjects_of_control 
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

            console.log(table + ' ж');

            const jsonResponse = (responseObject, responseCode = 200) => {
                res.writeHead(responseCode, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(responseObject));

                //console.log(new Date(), '-- Handled request:', req.method, req.url, responseCode);
            };

            console.log('sss');
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
            console.log('ssss');
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
            let asy = async (query) => {
                let result = 'gfdf';
                const entries = await client.query(query);
                //console.log(`${entries.rows.map((r) => Object.values(r).join('\t')).join('\n')}`);

                let promise = new Promise((resolve, reject) => {

                    //console.log(`Database entries ${entries.rowCount} row(s)`);
                    //console.log(Object.keys(entries.rows?.[0]).join('\t'));
                    let mass = entries.rows.map((r) => Object.values(r).join('\t')).join('\n');

                    resolve(mass);
                });
                await client.end();
                result = await promise;
                //console.log(result);
                return result;
            }
            let otvet = await asy(query)
            console.log(otvet);
            return (otvet);

            //let asy = async (query, pool) => {


            //    const client = await pool.connect();

            //    const name = process.argv[2] ?? 'john';
            //    const entries = await client.query(query);
            //    //console.log(`${entries.rows.map((r) => Object.values(r).join('\t')).join('\n')}`);

            //    let promise = new Promise((resolve, reject) => {

            //        //console.log(`Database entries ${entries.rowCount} row(s)`);
            //        //console.log(Object.keys(entries.rows?.[0]).join('\t'));
            //        let mass = entries.rows.map((r) => Object.values(r).join('\t')).join('\n');

            //        resolve(mass);
            //    });
            //    await client.end();
            //    let result = await promise;

            //    //console.log(result);
            //    return result;

            //    //return mass;

            //};
            //      console.log("___________________" + asy(query, pool) + "___________________");
            console.log('last s');
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
            //cb(masss);
        },



        connect: function (table, cb) {

            //query = hbs.escapeExpression(query);      //экранирование выражения

            let query = ` SELECT * FROM ` + table;
            if (table == 'obj+control')
                query =
                    `                
                SELECT * FROM оbjects_of_control 
                INNER JOIN control_objects_testing ON оbjects_of_control.control_object_code= control_objects_testing.control_object_code 
                INNER JOIN sorts_of_control ON control_objects_testing.test_code= sorts_of_control.test_code
 	            `;
            if (table == 'staff+spec')
                query = `SELECT * FROM staff INNER JOIN staff_specializing ON staff.worker_id= staff_specializing.worker_id 
                INNER JOIN specializations ON staff_specializing.specialization_code= specializations.specialization_code
                `;
            const { Pool } = require('pg');
            const Cursor = require('pg-cursor');

            console.log(table + ' ж');

            const jsonResponse = (responseObject, responseCode = 200) => {
                res.writeHead(responseCode, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(responseObject));

                console.log(new Date(), '-- Handled request:', req.method, req.url, responseCode);
            };

            const pool = new Pool({
                user: 'postgres',
                host: 'localhost',
                database: 'LNK',
                password: '4444',
                port: 5432,
            });

            pool.connect()
                .then((client) => {
                    let s = 'ъ';
                    client.query(query)
                        .then(res => {
                            for (let row of res.rows) {

                                console.log(s);
                            }
                        })
                        .catch(err => {
                            console.error(err);
                        });
                })
                .catch(err => {
                    console.error(err);
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

                console.log(result);
                return result;

                //return mass;

            };
            //      console.log("___________________" + asy(query, pool) + "___________________");
            return (asy(query, pool));

            //get_user_name().then(alert);
            //(async () => {
            //    console.log(await asy(query, pool));
            //})();  
            //console.log (asy(query, pool).then(alert));

            (async () => {
                const client = await pool.connect();

                const name = process.argv[2] ?? 'john';
                const entries = await client.query(query);
                //console.log(`Database entries ${entries.rowCount} row(s)`);
                //console.log(Object.keys(entries.rows?.[0]).join('\t'));
                //
                ////let mass = entries.rows.map((r) => Object.values(r).join('\t')).join('\n');
                //console.log(`${entries.rows.map((r) => Object.values(r).join('\t')).join('\n')}`);

                await client.end();
                //return mass;

            })();
            //console.log(mass);
            cb(mass);
        },
        ddddd: function (str) {
            console.log(str);
        },
        connect3: async function (table) {
            let s = await read(table, resp);
            //        console.log(s);                
            return s;

        }
    }
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');


let router = express.Router();
let db = require('./public/javascripts/scr');

app.get("/report_worker", async (req, res) => {
    let query = `SELECT staff.worker_id, staff.department_num, staff_additional_information,
    full_name, dep_full_name, entity_full_name, tests_in_requests.request_code, testing_status,
    test_in_request_code, control_object_testing_code FROM staff INNER JOIN departments ON 
    staff.department_num= departments.department_num INNER JOIN tests_in_requests ON 
    staff.worker_id= tests_in_requests.worker_id INNER JOIN requests ON 
    tests_in_requests.request_code= requests.request_code  
	`;
    let data = read(query);
    const doc = new Document({
        sections: [{
            properties: {},
            children: [
                new Paragraph({
                    children: [
                        new TextRun(data),
                        
                    ],
                }),
            ],
        }],
    });
});
    app.get("/report_obj", async (req, res) => {
        let query = `SELECT оbjects_of_control.control_object_code, category, subcategory, control_objects_testing.control_object_testing_code, 
test_in_request_code, testing_status, department_num, tests_in_requests.request_code, testing_status, 
test_in_request_code FROM оbjects_of_control 
INNER JOIN control_objects_testing ON оbjects_of_control.control_object_code= control_objects_testing.control_object_code 
INNER JOIN tests_in_requests ON control_objects_testing.control_object_testing_code= tests_in_requests.control_object_testing_code 
INNER JOIN requests ON tests_in_requests.request_code= requests.request_code 
INNER JOIN sorts_of_control ON control_objects_testing.test_code= sorts_of_control.test_code	 
	`;
        let data = read(query);
        const doc = new Document({
            sections: [{
                properties: {},
                children: [
                    new Paragraph({
                        children: [
                            new TextRun(data),
                            
                        ],
                    }),
                ],
            }],
        });
    const b64string = await Packer.toBase64String(doc);

    res.setHeader('Content-Disposition', 'attachment; filename=My Document.docx');
    res.send(Buffer.from(b64string, 'base64'));
})
async function read17(table) {
    console.log('ss');

    let query = ` SELECT * FROM ` + table;
    if (table == 'obj+control')
        query =
            `                
                SELECT * FROM оbjects_of_control 
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

    console.log(table + ' ж');

    const jsonResponse = (responseObject, responseCode = 200) => {
        res.writeHead(responseCode, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(responseObject));

        //console.log(new Date(), '-- Handled request:', req.method, req.url, responseCode);
    };

    console.log('sss');
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
    console.log('ssss');
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
    let asy = async (query) => {
        let result = 'gfdf';
        const entries = await client.query(query);
        //console.log(`${entries.rows.map((r) => Object.values(r).join('\t')).join('\n')}`);

        let promise = new Promise((resolve, reject) => {

            //console.log(`Database entries ${entries.rowCount} row(s)`);
            //console.log(Object.keys(entries.rows?.[0]).join('\t'));
            let mass = entries.rows.map((r) => Object.values(r).join('\t')).join('\n');

            resolve(mass);
        });
        await client.end();
        result = await promise;
        //console.log(result);
        return result;
    }
    let otvet = await asy(query)
    console.log(otvet);
    return (otvet);

    //let asy = async (query, pool) => {


    //    const client = await pool.connect();

    //    const name = process.argv[2] ?? 'john';
    //    const entries = await client.query(query);
    //    //console.log(`${entries.rows.map((r) => Object.values(r).join('\t')).join('\n')}`);

    //    let promise = new Promise((resolve, reject) => {

    //        //console.log(`Database entries ${entries.rowCount} row(s)`);
    //        //console.log(Object.keys(entries.rows?.[0]).join('\t'));
    //        let mass = entries.rows.map((r) => Object.values(r).join('\t')).join('\n');

    //        resolve(mass);
    //    });
    //    await client.end();
    //    let result = await promise;

    //    //console.log(result);
    //    return result;

    //    //return mass;

    //};
    //      console.log("___________________" + asy(query, pool) + "___________________");
    console.log('last s');
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
 async function read(table,cb) {

     let query = ` SELECT * FROM ` + table;
     if (table == 'obj+control')
         query =
             `                
                SELECT * FROM оbjects_of_control 
                INNER JOIN control_objects_testing ON оbjects_of_control.control_object_code= control_objects_testing.control_object_code 
                INNER JOIN sorts_of_control ON control_objects_testing.test_code= sorts_of_control.test_code
 	            `;
     if (table == 'staff+spec')
         query = `SELECT * FROM staff INNER JOIN staff_specializing ON staff.worker_id= staff_specializing.worker_id 
                INNER JOIN specializations ON staff_specializing.specialization_code= specializations.specialization_code
                `;
     const { Pool } = require('pg');
     const Cursor = require('pg-cursor');

     console.log(table + ' ж');

     const jsonResponse = (responseObject, responseCode = 200) => {
         res.writeHead(responseCode, { 'Content-Type': 'application/json' });
         res.end(JSON.stringify(responseObject));

         //console.log(new Date(), '-- Handled request:', req.method, req.url, responseCode);
     };

     const pool = new Pool({
         user: 'postgres',
         host: 'localhost',
         database: 'LNK',
         password: '4444',
         port: 5432,
     });

     pool.connect()
         .then((client) => {
             let s = 'ъ';
             client.query(query)
                 .then(res => {
                     for (let row of res.rows) {

                        // console.log(s);
                     }
                 })
                 .catch(err => {
                     console.error(err);
                 });
         })
         .catch(err => {
             console.error(err);
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
     let masss= await asy(query, pool);
     return masss;
     //get_user_name().then(alert);
     //(async () => {
     //    console.log(await asy(query, pool));
     //})();  
     //console.log (asy(query, pool).then(alert));

     (async () => {
         const client = await pool.connect();

         const name = process.argv[2] ?? 'john';
         const entries = await client.query(query);
         //console.log(`Database entries ${entries.rowCount} row(s)`);
         //console.log(Object.keys(entries.rows?.[0]).join('\t'));
         //
         ////let mass = entries.rows.map((r) => Object.values(r).join('\t')).join('\n');
         //console.log(`${entries.rows.map((r) => Object.values(r).join('\t')).join('\n')}`);

         await client.end();
         //return mass;

     })();
     //console.log(mass);
     cb(masss);
}

function resp (str) {
    console.log(str);
}

//app.use(ntlm());



//app.all('./views/autorization', function (request, response) {
    //response.end(JSON.stringify(request.ntlm)); // {"DomainName":"MYDOMAIN","UserName":"MYUSER","Workstation":"MYWORKSTATION"}
//});










// another routes also appear here
// this script to fetch data from MySQL databse table




module.exports = app;


































