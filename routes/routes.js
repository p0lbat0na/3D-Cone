const { Router } = require('express');
const router = Router()

var db = require('../public/javascripts/scr');

module.exports = router;

router.get('/', (req, res) => {
    res.render('index', {
        title: 'Главная',
        isMain: true
    })
})

router.get('/req-list', (req, res) => {
    res.render('req-list', {
        title: 'Список заявок',
        isReqList: true
    })
})

router.get('/test-list', (req, res) => {
    res.render('test-list', {
        title: 'Испытания',
        isTestList: true
    })
})

router.get('/create-req', (req, res) => {
    res.render('create-req', {
        title: 'Новая заявка',
        isNewReq: true
    })
})


//router.get('/catalog', function (req, res, next) {
//    let sql = 'SELECT * FROM staff';
//    db.query(sql, function (err, data, fields) {
//        if (err) throw err;
//        res.render('catalog', { title: 'Справочник', userData: data });
//    });
//});

router.get('/catalog', (req, res, next) => {
    let sql = 'SELECT * FROM staff';
    db.query(sql, function (err, data) {
        if (err) throw err;
    res.render('catalog', {
        title: 'Справочник',
        isCatalog: true,
        userData: data
    });
    })
})

router.get('/autorization', function (req, res) {
    query.connectionParameters = config.reportConnStr;      //connecting to localhost
    var deviceArray = new Array();
    var sqlstr = "sdfsfdfsdsfds";
    query(sqlstr, function (err, rows, result) {
        assert.equal(rows, result.rows);
        for (var i = 0; i < rows.length; i++) {
            var device = {};
            device.name = rows[i].device;
            device.value = rows[i].totalqtyout;
            deviceArray.push(device);
        }
        res.render('d3t1', { deviceArray: deviceArray });
    });
});

module.exports = router;