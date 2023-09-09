'use strict';
const debug = require('debug')('my express app');
const express = require('express');
const path = require('path');
const logger = require('morgan');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const routes = require('./routes/index');
const todoRoutes = require('./routes/routes');
const app = express();



// view engine setup

app.set('views', 'views')
app.use(todoRoutes);

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', routes);

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
        //        read117: function(){
        //        console.log('con');
        //        let query = ` SELECT * FROM staff`;
        //        let mass = 'V';
        //        console.log(' ж');





        //            function generateWordDocument() {

        //                let doc = new Document()
        //                doc.createParagraph("Title")
        //                doc.createParagraph("Subtitle")
        //                doc.createParagraph("Heading 1")
        //                doc.createParagraph("Heading 2")
        //                doc.createParagraph(
        //                    "Aliquam gravida quam sapien, quis dapibus eros malesuada vel. Praesent tempor aliquam iaculis. Nam ut neque ex. Curabitur pretium laoreet nunc, ut ornare augue aliquet sed. Pellentesque laoreet sem risus. Cras sodales libero convallis, convallis ex sed, ultrices neque. Sed quis ullamcorper mi. Ut a leo consectetur, scelerisque nibh sit amet, egestas mauris. Donec augue sapien, vestibulum in urna et, cursus feugiat enim. Ut sit amet placerat quam, id tincidunt nulla. Cras et lorem nibh. Suspendisse posuere orci nec ligula mattis vestibulum. Suspendisse in vestibulum urna, non imperdiet enim. Vestibulum vel dolor eget neque iaculis ultrices."
        //                )
        //                saveDocumentToFile(doc, "New Document.docx")
        //            }
        //            function saveDocumentToFile(doc, fileName) {
        //                // Create new instance of Packer for the docx module
        //                const packer = new Packer()
        //                // Create a mime type that will associate the new file with Microsoft Word
        //                const mimeType =
        //                    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        //                // Create a Blob containing the Document instance and the mimeType
        //                packer.toBlob(doc).then(blob => {
        //                    const docblob = blob.slice(0, blob.size, mimeType)
        //                    // Save the file using saveAs from the file-saver package
        //                    saveAs(docblob, fileName)
        //                })
        //            }
        //            try {
        //                generateWordDocument();
        //            } catch (e) {
        //                console.log(e);
        //            }
        //        ;
        //},


    }
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');


module.exports = app;


































