const { Router } = require('express');
require("dotenv").config()
const docx = require('docx');
const saveAs = require("file-saver");
const fs = require('fs');
const Docxtemplater = require('docxtemplater');
const path = require('path');
const router = Router()
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const db = require('../public/javascripts/scr');
const PizZip = require("pizzip");
const accessTokenSecret = 'goooordon-freeman';
const refreshTokenSecret = 'gooooooordon-freeman';
let refreshTokens = [];
router.use(express.json());

const role1 = ['Оператор ЛНК', 'Директор ЛНК', 'Заместитель директора ЛНК'];
const role2 = ['Инженер по неразрушающему контролю', 'Младший специалист по неразрушающему контролю', 'Специалист по неразрушающему контролю'];
const role3 = ['Директор', 'Руководитель', 'Главный инженер', 'Заместитель директора', 'Инженер'];



router.get('/', (req, res) => {
    res.render('index', {
        title: 'Главная',

    })
    console.log('sss');
})



module.exports = router;
