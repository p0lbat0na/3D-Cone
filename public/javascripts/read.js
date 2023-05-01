alert('au')
let express = require('express');
alert('au')
let router = express.Router();
let db = require('./scr');
alert('au')
// another routes also appear here
// this script to fetch data from MySQL databse table
router.get('/catalog', function (req, res, next) {
    let sql = 'SELECT * FROM staff';
    db.query(sql, function (err, data, fields) {
        if (err) throw err;
        res.render('catalog', { title: 'Справочник', userData: data });
    });
});
alert('au')
module.exports = router;