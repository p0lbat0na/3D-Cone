// require("dotenv").config();
// const { Router } = require('express');
// import * as  { Router } from 'express'


import * as  express from 'express'
const router = express.Router();
import * as  bodyParser from 'body-parser'
router.use(express.json());

const role1 = ['Оператор ЛНК', 'Директор ЛНК', 'Заместитель директора ЛНК'];
const role2 = ['Инженер по неразрушающему контролю', 'Младший специалист по неразрушающему контролю', 'Специалист по неразрушающему контролю'];
const role3 = ['Директор', 'Руководитель', 'Главный инженер', 'Заместитель директора', 'Инженер'];

router.get('/', (req, res) => {
    res.render('index', {
        title: 'Главная',

    })
})

export { router };

