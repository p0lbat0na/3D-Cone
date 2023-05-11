const { Router } = require('express');
const router = Router()
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
var db = require('../public/javascripts/scr');
router.use(express.json());

function verifyToken(req, res, next) {
    const token = req.cookies.access_token;
    if (!token) {
        return res.sendStatus(401);
    }
    try {
        const decoded = jwt.verify(token, 'secret_key');
        req.user = decoded.worker_id;
        next();
    } catch (e) {
        res.sendStatus(401);
    }
}

function checkAccess( req, res, next) {
    let isStaffSpec = true;

    console.log('11');
    try {
        const token = req.cookies.access_token;
    }
    catch {
        return res.redirect('/login');
    }
    console.log('121');                      

    
    console.log('2');
    try {
        const decoded = jwt.verify(token, 'secret_key');
        req.user = decoded.worker_id;
        // тут вы можете получить информацию о пользователе из базы данных или из сессии
        // например, сделать запрос к базе данных, чтобы проверить, имеет ли пользователь доступ к определенной странице
        db.query(`SELECT * FROM staff WHERE worker_id = $1`, [req.user], function (err, data) {
            if (err || data.rows.length === 0) {
                return res.sendStatus(401);
            }
            console.log('3');
            // проверяем есть ли у пользователя доступ к странице
            //if (data.rows[0].password === '4442') {
            if (data.rows[0].job_title != 'Оператоhgр ЛНК') {
                return next();
            } else {
                return res.sendStatus(403);
            }
        });
        console.log('4');
    } catch (e) {
        res.sendStatus(401);
    }
}
function authenticate(worker_id, password) {

    let isStaffSpec = true;

    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM staff WHERE worker_id = $1 AND password = $2', [worker_id, password], (error, data) => {
            if (error) {
                reject(error);
                console.log(error)
            } else {
                //console.log(data.rows[0].worker_id);
                if (data.rows.length > 0) {
                    // генерируем токен
                    let user_id= data.rows[0].worker_id
                    password = data.rows[0].password

                    const token = jwt.sign({ user_id }, 'my-secret-key');

                    //const token = jwt.sign({ worker_id: data.rows[0].worker_id }, 'my-secret-key');
                    //const token = jwt.sign({ userId: data.rows[0].id }, 'my-secret-key');
                    console.log(data.rows[0].worker_id + " auth token " + token);
                    resolve(token);
                } else {
                    reject(new Error('auth Неправильный логин или пароль'));
                }
            }
        });
    });
}

router.post('/login', (req, res) => {
    console.log("n");
    //const { worker_id, password } = req.body; 
    console.log(req.body.worker_id + '+___________________________' + req.sign + '+___________________________');
    
    try {
        //worker_id = ;//1
        //const { password, worker_id  } = req.body;
        console.log("y");
    }
    catch (e) {
        console.log(e);
    }
    console.log("y");
    const worker_id = req.body.worker_id;
    const password = req.body.password;//'4444'


    let cookieOptions = {
        // Delete the cookie after 90 days
        expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        // Set the cookie's HttpOnly flag to ensure the cookie is 
        // not accessible through JS, making it immune to XSS attacks  
        httpOnly: true,
    };
    //if (process.env.NODE_ENV === 'production') {
    //    cookieOptions.secure = true;
    //}
    authenticate(worker_id, password)
        .then(token => {
            // добавляем токен в ответ
            //res.json({ token });
            console.log("post routes token " + token);
            res.cookie('jwt', token, cookieOptions)
            .status(200)
                .json({
                    msg: 'Successfully logged in',
                });
            console.log('post success');
        })
        .catch(error => {
            console.log('post er');
            res.status(401).send(error.message);
        });
});

router.get('/', (req, res) => {
    res.render('index', {
        title: 'Главная',
        isMain: true
    })
})

router.get('/req-list', (req, res) => {
    let sql = 'SELECT * FROM requests';
    db.query(sql, function (err, data) {
        if (err) throw err;
    res.render('req-list', {
        title: 'Список заявок',
        isReqList: true,
        userData: data
    })
    })
})

router.get('/test-list', function(req, res) {
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

router.get('/autorization', function (req, res) {
    let isStaffSpec = true;
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

router.get('/catalog', (req, res) => {
    res.render('catalog', {
        title: 'Справочник',
        isCatalog: true
    })
})

router.get('/catalog/staff', (req, res, next) => {
    let sql = 'SELECT * FROM staff';
    db.query(sql, function (err, data) {
        if (err) throw err;
        res.render('catalog', {
            title: 'Справочник',
            isCatalog: true,
            isStaff: true,
            userData: data
        });
    })
})

router.get('/catalog/objectsOfControl', (req, res, next) => {
    let sql = 'SELECT *	FROM objects_of_control';
    db.query(sql, function (err, data) {
        if (err) throw err;
        res.render('catalog', {
            title: 'Справочник',
            isCatalog: true,
            isObjectsOfControl: true,
            userData: data
        });
    })
})

router.get('/catalog/sortsOfControl', (req, res, next) => {
    let sql = 'SELECT * FROM sorts_of_control';
    db.query(sql, function (err, data) {
        if (err) throw err;
        res.render('catalog', {
            title: 'Справочник',
            isCatalog: true,
            isSortsOfControl: true,
            userData: data
        });
    })
})

router.get('/catalog/objAndControl', (req, res, next) => {
    let sql = `SELECT * FROM objects_of_control 
INNER JOIN control_objects_testing ON objects_of_control.control_object_code = control_objects_testing.control_object_code 
INNER JOIN sorts_of_control ON control_objects_testing.test_code = sorts_of_control.test_code`;
    db.query(sql, function (err, data) {
        if (err) throw err;
        res.render('catalog', {
            title: 'Справочник',
            isCatalog: true,
            isObjAndControl: true,
            userData: data
        });
    })
})

router.get('/catalog/dep', (req, res, next) => {
    let sql = 'SELECT * FROM departments';
    db.query(sql, function (err, data) {
        if (err) throw err;
        res.render('catalog', {
            title: 'Справочник',
            isCatalog: true,
            isDep: true,
            userData: data
        });
    })
})

router.get('/catalog/spec', (req, res, next) => {
    let sql = 'SELECT * FROM specializations';
    db.query(sql, function (err, data) {
        if (err) throw err;
        res.render('catalog', {
            title: 'Справочник',
            isCatalog: true,
            isSpec: true,
            userData: data
        });
    })
})
const authenticateJWT = (req, res, next) => {
    
        let authHeader=req.headers.cookie;
        let jwtStr = req.headers.cookie.indexOf('jwt=')

    const token =req.headers.cookie.substring(jwtStr + 4) ;
        

    
    
    console.log("+++___^");
    if (authHeader) {
        //const token = authHeader.split(' ')[1];
        console.log("+++___^");
        jwt.verify(token, 'my-secret-key', (err, worker_id) => {
            if (err) {
                return res.sendStatus(403);
            }
            console.log("+++___^");
            req.worker_id = worker_id;
            next();
        });
    } else {
        console.log("++er");
        res.sendStatus(401);
    }
};
router.get('/catalog/staffSpec', authenticateJWT, (req, res) => {
    let sql = `SELECT * FROM staff INNER JOIN staff_specializing ON staff.worker_id= staff_specializing.worker_id 
     INNER JOIN specializations ON staff_specializing.specialization_code= specializations.specialization_code
    `;
    //    console.log(token + "__^" + authHeader + "__^" + user + "__^" );
    
    
    //if (typeof header !== 'undefined') {
    //    console.log("+++___^");

    //    const bearer = header.split(' ');
    //    const token = bearer[1];
    //    req.token = token;
    //    console.log("+++___^");
    //    next();
    //}
    

    //try {
    //    const token4 = req.headers.authorization;
    //    const token5 = req.body.authorization;
    //    const token6 = req.body.cookie[1];
    //    const token1 = req.headers.cookie.split('.')[1];
    //    const token2 = req.body.authorization.split('.')[1];
    //    const token3 = req.body.cookies.split('.')[1];
        
    //    const token7 = req.headers.authorization.split(' ')[1];
    //    const token8 = req.body.authorization.split(' ')[1];
    //    const token9 = req.body.cookie.split(' ')[1];

    //    console.log(token1 + "__^");
    //    console.log(token2 + "__^");
    //    console.log(token3 + "__^");
    //    console.log(token4 + "__^");
    //    console.log(token5 + "__^");
    //    console.log(token6 + "__^");
    //    console.log(token7 + "__^");
    //    console.log(token8 + "__^");
    //    console.log(token9 + "__^")
    //}
    //catch (e) {
    //    console.log(e)
    //}
    //console.log('ss2')
    try {
        console.log('ss3')
        // верифицируем токен и извлекаем данные
        //const data = jwt.verify(token, 'my-secret-key');
        //res.send(`Hello, user ${data.userId}`);
        console.log('ss4')
        // ... выполнение запроса для защищенной страницы
        db.query(sql, function (err, data) {
            if (err) throw err;
            res.render('catalog', {
            title: 'Справочник',
            isCatalog: true,
            isStaffSpec: true,
            userData: data
        });
        })
    } catch (error) {
        res.status(401).send('routes css Неправильный токен  '+ error);
    }
    
})
//app.get("/login", (req, res) => {
//    const token = jwt.sign({ id: 7, role: "captain" }, "YOUR_SECRET_KEY");
//    return res
//        .cookie("access_token", token, {
//            httpOnly: true,
//            secure: process.env.NODE_ENV === "production",
//        })
//        .status(200)
//        .json({ message: "Logged in successfully 😊 👌" });
//});
router.get('/login', (req, res) => {
    res.render('login', {
        title: 'Вход',
        isLogin: true
    })
})
//router.post('/login', (req, res) => {
//    const worker_id = req.body.worker_id;
//    const password = req.body.password;
//    authenticate(worker_id, password)
//        .then(token => {
//            // добавляем токен в ответ
//            res.json({ token });
//        })
//        .catch(error => {
//            res.status(401).send(error.message);
//        });
//});

//router.get('/login', (req, res) => {
//    console.log('22');
    
//    console.log('33');
//    let worker_id = 1
//    let password = 4444

//    db.query(`SELECT * FROM staff WHERE worker_id = 1 AND password = '4444'`, function (err, data) {
//        res.render('login', {
//            title: 'Новая заявка',
//            isLogin: true
//        })
//        if (err) {
//            console.log(err);
//            res.sendStatus(500);
//            console.log('2');
//        } else if (data.rows.length > 0) {
            
//            console.log('222');
//            const token = jwt.sign({ worker_id: 1 }, 'secret_key');
//            console.log('2222');
//            res.cookie("access_token", token);
//            console.log('22222');
//            res.json({ success: true });
//            console.log('222222');
//        } else {
//            res.sendStatus(401);
//        }
//    });
//});



module.exports = router;