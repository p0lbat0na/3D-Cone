'use strict';
import * as express from 'express';
const routes = express.Router();

/* GET home page. */
routes.get('/', function (req, res) {
    res.render('index', { title: 'Express' });
});

export { routes }; 