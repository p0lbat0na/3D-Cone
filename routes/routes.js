// require("dotenv").config();
// const { Router } = require('express');
// import * as  { Router } from 'express'


import * as  express from 'express'
const router = express.Router();
import * as  bodyParser from 'body-parser'
router.use(express.json());

router.get('/', (req, res) => {
    res.render('index', {
        title: 'Главная',

    })
})

export { router };

