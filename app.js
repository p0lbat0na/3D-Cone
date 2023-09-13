'use strict';
import * as debug from 'debug';
import express from 'express';
import path from 'path';
import * as logger from 'morgan';
import bodyParser from 'body-parser';
import * as exphbs from 'express-handlebars';
import { routes } from './routes/index.js';
import { router } from './routes/routes.js';
import { fileURLToPath } from 'url';
import favicon from 'serve-favicon';

const app = express();

const __filename = fileURLToPath(import.meta.url);

// 👇️ "/home/john/Desktop/javascript"
const __dirname = path.dirname(__filename);

app.set('views', 'views')
app.use(router);

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', routes);

app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

app.set('port', process.env.PORT || 3000);

const server = app.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + server.address().port);
});

app.use(favicon(__dirname + '/public/favicon.ico'));
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

    }
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');


export { app };


































