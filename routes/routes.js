const { Router } = require('express');
const router = Router()


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

router.get('/catalog', (req, res) => {
    res.render('catalog', {
        title: 'Справочник',
        isCatalog: true
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