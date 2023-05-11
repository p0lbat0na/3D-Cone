//const { Pool } = require('pg');
//const Cursor = require('pg-cursor');


//const pool = new Pool({
//    user: 'postgres',
//    host: 'localhost',
//    database: 'LNK',
//    password: '4444',
//    port: 5432,
//});
//(async () => {
//    const client = await pool.connect();


//    const cursor = await client.query(new Cursor(query));
//    var pkjo = 0;
//    function read(rws, cb) {
//        cursor.read(rws, (err, rows) => {

//            console.log(rows);
//            mass = mass + rows[0, 0];
//            if (rows != 0) {

//                read(1, cb);
//            }
//            pkjo++;
//            /*console.log(Object.keys(cursor.rows?.[0]).join('ccc'));*/

//        });
//        cb(pkjo, mass);
//        //generateWordDocument();

//    }
//    console.log('dsf');
//    function cons(str1, str2) {

//        console.log(str1 + 'ý');
//        console.log(str2 + ' (*_');

//    }
//    //import { Document, Packer } from "docx";
//    //import { saveAs } from "file-saver";

//    function generateWordDocument() {

//        let doc = new Document()
//        doc.createParagraph("Title")
//        doc.createParagraph("Subtitle")
//        doc.createParagraph("Heading 1")
//        doc.createParagraph("Heading 2")
//        doc.createParagraph(
//            "Aliquam gravida quam sapien, quis dapibus eros malesuada vel. Praesent tempor aliquam iaculis. Nam ut neque ex. Curabitur pretium laoreet nunc, ut ornare augue aliquet sed. Pellentesque laoreet sem risus. Cras sodales libero convallis, convallis ex sed, ultrices neque. Sed quis ullamcorper mi. Ut a leo consectetur, scelerisque nibh sit amet, egestas mauris. Donec augue sapien, vestibulum in urna et, cursus feugiat enim. Ut sit amet placerat quam, id tincidunt nulla. Cras et lorem nibh. Suspendisse posuere orci nec ligula mattis vestibulum. Suspendisse in vestibulum urna, non imperdiet enim. Vestibulum vel dolor eget neque iaculis ultrices."
//        )
//        saveDocumentToFile(doc, "New Document.docx")
//    }
//    function saveDocumentToFile(doc, fileName) {
//        // Create new instance of Packer for the docx module
//        const packer = new Packer()
//        // Create a mime type that will associate the new file with Microsoft Word
//        const mimeType =
//            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
//        // Create a Blob containing the Document instance and the mimeType
//        packer.toBlob(doc).then(blob => {
//            const docblob = blob.slice(0, blob.size, mimeType)
//            // Save the file using saveAs from the file-saver package
//            saveAs(docblob, fileName)
//        })
//    }
//    read(5, cons);
//})();
let { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'LNK',
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