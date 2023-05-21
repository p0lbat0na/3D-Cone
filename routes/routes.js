const { Router } = require('express');
const router = Router()
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
var db = require('../public/javascripts/scr');
router.use(express.json());
let  refreshTokens = [];
const accessTokenSecret = 'goooordon-freeman';
const refreshTokenSecret = 'goooordon-freeman2';

const authenticateJWT = (req, res, next) => {

    let authHeader = req.headers.cookie;

    if (authHeader) {
        let jwtStr = req.headers.cookie.indexOf('accessToken');
        const tokenDem = req.headers.cookie.substring(jwtStr + 20);
        const token = tokenDem.substring(0, tokenDem.indexOf('%'));
        //const tokenDem = authHeader.split(' ')[2];        
        //const token = tokenDem.substring(tokenDem.indexOf('=') + 1);
        ;
        //console.log(token);
        //console.log(req.headers.cookie);        
        jwt.verify(token, accessTokenSecret, (err, user) => {
            if (err) {
                console.log(err)
                //return res.sendStatus(403);
                return res.redirect('/login');
            }            
            req.user = user;
            console.log(user.user_id + ' ** ' + user.isOperator + ' ** ' + user.isDeclarant + ' ** ' + user.isExecutor + ' ** ' + user.user_name);
            next();            
        });
    } else {
        console.log("****er");
        return res.redirect('/login');
        //res.sendStatus(401);
    }
};

function authenticate(worker_id, password) {
     return new Promise((resolve, reject) => {
        db.query('SELECT * FROM staff WHERE worker_id = $1 AND password = $2', [worker_id, password], (error, data) => {
            if (error) {
                reject(error);
                console.log(error);
            } else {
                //console.log(data.rows[0].worker_id);
                
                if (data.rows.length > 0) {
                    
                    let worker_id = data.rows[0].worker_id;
                    let isDeclarant = false;
                    let isExecutor = false;
                    let isOperator = false;
                    if (data.rows[0].job_title == 'Оператор ЛНК' ||
                        data.rows[0].job_title == 'Директор ЛНК' ||
                        data.rows[0].job_title == 'Заместитель директора ЛНК')
                        isOperator = true;
                    else {
                        if (data.rows[0].job_title == 'Специалист по неразрушающему контролю' ||
                            data.rows[0].job_title == 'Младший специалист по неразрушающему контролю' ||
                            data.rows[0].job_title == 'Инженер по неразрушающему контролю')
                            isExecutor = true;
                        else isDeclarant = true;
                    }

                    //password = data.rows[0].password
                    
                    //const token = jwt.sign({ user_id }, 'my-secret-key');
                    //const accessToken = jwt.sign({ user_id, user_role }, accessTokenSecret);
                    //const refreshToken = jwt.sign({ user_id, user_role }, refreshTokenSecret);
                    const worker_name = data.rows[0].full_name;
                    
                    const token = {
                        accessToken: jwt.sign({
                            user_id: worker_id,
                            isDeclarant: isDeclarant,
                            isExecutor: isExecutor,
                            isOperator: isOperator,
                            user_name: worker_name
                        }, accessTokenSecret, { expiresIn: '20m' }),
                        refreshToken: jwt.sign({
                            user_id: worker_id,
                            isDeclarant: isDeclarant,
                            isExecutor: isExecutor,
                            isOperator: isOperator,
                            user_name: worker_name
                        }, refreshTokenSecret)
                    }; 
                    //const token = jwt.sign({ worker_id: data.rows[0].worker_id }, 'my-secret-key');
                    //const token = jwt.sign({ userId: data.rows[0].id }, 'my-secret-key');
                    //console.log(data.rows[0].worker_id + " auth token " + '\n' + token.accessToken + '\n' +token.refreshToken);
                    resolve(token);
                } else {
                    reject(new Error('Неправильный логин или пароль'));
                }            
            }
        });
    });
}

function write(table, attr, value, returnCode) {
    return new Promise((resolve, reject) => {
        //let where = 'where'
        //for (var i = 0; i < attr.length - 1; i++) {
        //    where = where + attr[i] + "=" + value[i]+'AND';
        //}
        //co
        
        let q = 'INSERT INTO public.' + table + '(' + attr + ') VALUES(' + value + ') RETURNING ' + returnCode+' AS return_code';
        console.log(q);
        //db.query('SELECT INTO $1 ($2) VALUES ($3);', [table, attr,value], (error, data) => {
        db.query(q, (error, data) => {

            if (error) {
                reject(error);
                console.log(error);
            } else {
                console.log('qq');

                if (data) {

                console.log('qqq');

                    //const token = jwt.sign({ worker_id: data.rows[0].worker_id }, 'my-secret-key');
                    //const token = jwt.sign({ userId: data.rows[0].id }, 'my-secret-key');
                    //console.log(data);
                    resolve(data);
                } else {
                    reject('no data?;(');
                }
            }
        });
    });
}

function del(table, row, condition) {
    return new Promise((resolve, reject) => {
        //let where = 'where'
        //for (var i = 0; i < attr.length - 1; i++) {
        //    where = where + attr[i] + "=" + value[i]+'AND';
        //}
        //co
        if (typeof (condition) != 'number')
            condition = `'` + condition+`'`
        let sql = 'DELETE FROM public.' + table + ' WHERE ' + row + ' = ' + condition;
        console.log(sql);
        //db.query('SELECT INTO $1 ($2) VALUES ($3);', [table, attr,value], (error, data) => {
        db.query(sql, (error, data) => {

            if (error) {
                reject(error);
                console.log(error);
            } else {

                resolve('deleted');
            }
        });
    });
}

router.post('/login', (req, res) => {
    
    const worker_id = req.body.worker_id;
    const password = req.body.password;

    let cookieOptions = {
        // Delete the cookie after 90 days
        expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        // Set the cookie's HttpOnly flag to ensure the cookie is 
        // not accessible through JS, making it immune to XSS attacks  
        httpOnly: true,
    };
    cookieOptions.secure = true;
    
    authenticate(worker_id, password)
        .then(token=> {
            // добавляем токен в ответ
            //res.json({ token });
            refreshTokens.push(token.refreshToken);
            //console.log("post routes token " + token);
            res.cookie('jwt', token, cookieOptions)
            .status(200)
                .json({
                    msg: 'Successfully logged in',
                });
            console.log('post success');
        })
        .catch(error => {
            console.log(error);
            res.status(401).send(error.message);
        });
});

router.post('/insert', (req, res) => {
    console.log('Wwwww');

    
    const department_num = req.body.department_num;
    const deadline = req.body.deadline;   
    const opinion_reqired = req.body.opinion_reqired;
    const worker_id = req.body.user_id;   

    let attr = `department_num, deadline, opinion_required, status, worker_id`
    let val = department_num + `, '` + deadline + `', ` + opinion_reqired + `, 'в обработке'` + `, ` + worker_id;
    console.log('WWWWWWWWWWWWW');

    write('requests', attr, val, 'request_code')
        
        .then(data =>    {
            // добавляем токен в ответ
            //res.json({ token });
            
            console.log(data.rows[0].return_code);

            //console.log(data.substring(data.indexOf(`'`),3));
            //console.log(data.rows[{ return_req_code }]);

            res.send(data.rows[0].return_code);

        })
        .catch(error => {
            console.log('33333' + error);
            res.status(401).send(error);
        });
});

router.post('/insert-test', (req, res) => {
    console.log('Wwwww');
    const request_code = req.body.return_req_code;
    const control_code = req.body.control_code;
    const object_reg_number = req.body.reg_num;
    const line_code = req.body.line_num;
    const comment = req.body.comment;
    const files = req.body.files;

    let attr = `request_code, control_object_testing_code, line_code, testing_status, object_reg_number, comment, files`
    let val = request_code + `, '` + control_code + `', ` + line_code + `, 'в обработке'` + `, '` + object_reg_number + `', '` + comment + `', '` + files + `'`;
    console.log('WWWWWWWWWWWWW');

    write('tests_in_requests', attr, val, 'test_in_request_code')

        .then(data => {
            // добавляем токен в ответ
            //res.json({ token });

            console.log(data.rows[0].return_code);

            //console.log(data.substring(data.indexOf(`'`),3));
            //console.log(data.rows[{ return_req_code }]);

            res.send(data.rows[0].return_code);

        })
        .catch(error => {
            console.log('33333' + error);
            res.status(401).send(error);
        });
});

router.post('/delete', (req, res) => {
    const table = req.body.table;
    const row = req.body.row;
    const condition = req.body.condition;

    console.log('Wwwww');
    del(table, row, condition)

        .then(data => {
            

            console.log(data);

            //console.log(data.substring(data.indexOf(`'`),3));
            //console.log(data.rows[{ return_req_code }]);

            res.send(data);

        })
        .catch(error => {
            console.log('33333' + error);
            res.status(401).send(error);
        });
});

router.post('/req-list/search', (req, res, next) => {
    try {
        let num = req.body.num;
        let requires_processing = req.body.requires_processing;
        
        //console.log(req.body.num + ' ^^ ' + req.requires_processing)
        let sql = 'SELECT * FROM requests';

        if (num != undefined && num != '') {
            sql = sql + ' WHERE request_code=' + num;
            if (requires_processing == true) {
                sql = sql + ` AND status='в обработке'`;
            }
        }
        else {
            if (requires_processing == true)
                sql = sql + ` WHERE status='в обработке'`;
        }
        const user = req.user;
        db.query(sql, function (err, data) {
            if (err) throw err;
            if (data.rows.length == 0) {
                res.status(400).send('Запрос не дал результатов')                
            }
            else {
                
                res.render('req-list', {
                    title: 'Заявка '+num,
                    isReqList: true,
                    userData: data,
                    user: user
                });
            }
        })
    }
        catch(err){
            console.log(error);
        };    
});

router.post('/test-list/search', (req, res, next) => {
    try {
        num = req.body.num;
        req.requires_processing = req.body.requires_processing;
        
        let sql = 'SELECT * FROM tests_in_requests';
        let title= 'Список испытаний'
        if (num != undefined && num != '') {
            if (req.body.diagonal_dir) {
                
                sql = sql + ' WHERE request_code=' + num;
                title = 'Испытания заявки ' + num;
            }
            else
            sql = sql + ' WHERE test_in_request_code=' + num;
            if (req.requires_processing == true) {
                sql = sql + ` AND testing_status='в обработке'`;
            }
        }
        
        else {
            if (req.requires_processing == true)
                sql = sql + ` WHERE testing_status='в обработке'`;
        }
        console.log(req.body.num + ' ^^ ' + sql + ' %% ' + req.body.diagonal_dir)
        const user = req.user;
        db.query(sql, function (err, data) {
            if (err) throw err;
            if (data.rows.length == 0) {
                res.status(400).send('Запрос не дал результатов')
            }
            else {
                if (req.body.is_create_req) {
                    res.send(data);
                }
                else {
                    res.render('test-list', {
                        title: title,
                        isTestList: true,
                        userData: data,
                        user: user,
                        diagonaled: req.body.diagonal_dir
                    });
                }
            }
        })
    }
    catch (err) {
        console.log(error);
    };
});

router.post('/logout', (req, res) => {
    try {
        //let jwtStr = req.headers.cookie.indexOf('refreshToken');
        //const tokenDem = req.headers.cookie.substring(jwtStr + 21);
        //const token = tokenDem.substring(0, tokenDem.indexOf('%'));
        //refreshTokens = refreshTokens.filter(token => t !== token);
        let wrongToken ="wrongToken"
        refreshTokens.push(wrongToken);
        res.send("Logout successful"); 
        jwt.destroy
        //res.status(200).clearCookie('connect.sid', {
        //    path: '/login'
        //});
        console.log('2');
    }
    catch (error) {
        console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^");
            //res.status(401).send(error.message);
        };
});


router.get('/', authenticateJWT, (req, res) => {    
    res.render('index', {
        title: 'Главная',
        isMain: true,
        user: req.user
    })
})

router.get('/req-list', authenticateJWT, (req, res) => {
    if (!req.user.isExecutor) {
       
        let sql = 'SELECT * FROM requests';
        
        db.query(sql, function (err, data) {
            if (err) throw err;
            let options = { year: 'numeric', month: 'numeric', day: 'numeric' };

            for (let i = 0; i < data.rowCount; i++) {

                let deadline = data.rows[i].deadline.toLocaleDateString("en-US", { year: 'numeric' }) + '-' +
                    data.rows[i].deadline.toLocaleDateString("en-US", { month: '2-digit' }) + '-' +
                    data.rows[i].deadline.toLocaleDateString("en-US", { day: '2-digit' });
                data.rows[i].deadline = deadline
            }
            console.log(data.rows[1])
            res.render('req-list', {
                    title: 'Список заявок',
                    isReqList: true,
                    userData: data,
                user: req.user
            });            
        })        
    }
    else {
        res.redirect('/login');
    }
})

router.get('/test-list', authenticateJWT, function (req, res) {
    let sql = 'SELECT * FROM tests_in_requests';
    db.query(sql, function (err, data) {
        if (err) throw err;
    res.render('test-list', {
        title: 'Испытания',
        isTestList: true,
        userData: data,
        user: req.user
        })
        })
})

router.get('/create-req', authenticateJWT, (req, res) => {
    console.log(req.user.user_id)
    if (req.user.isDeclarant) {
        res.render('create-req', {
            title: 'Новая заявка',
            isNewReq: true,
            user: req.user,
        })
             
    }

    else {
        res.redirect('/login');
    }
})

//router.get('/catalog', function (req, res, next) {
//    let sql = 'SELECT * FROM staff';
//    db.query(sql, function (err, data, fields) {
//        if (err) throw err;
//        res.render('catalog', { title: 'Справочник', userData: data });
//    });
//});

router.get('/catalog', authenticateJWT, (req, res) => {
    res.render('catalog', {
        title: 'Справочник',
        isCatalog: true
    })
})

router.get('/catalog/staff', authenticateJWT, (req, res, next) => {
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

router.get('/catalog/objectsOfControl', authenticateJWT, (req, res, next) => {
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

router.get('/catalog/sortsOfControl', authenticateJWT, (req, res, next) => {
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

router.get('/catalog/objAndControl', authenticateJWT, (req, res, next) => {
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

router.get('/catalog/dep', authenticateJWT, (req, res, next) => {
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

router.get('/catalog/spec', authenticateJWT, (req, res, next) => {
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

router.get('/catalog/staffSpec', authenticateJWT, (req, res) => {
    let sql = `SELECT * FROM staff INNER JOIN staff_specializing ON staff.worker_id= staff_specializing.worker_id 
     INNER JOIN specializations ON staff_specializing.specialization_code= specializations.specialization_code
    `;
    if (req.user.user_role == 'operator') {
        db.query(sql, function (err, data) {
            if (err) throw err;
            res.render('catalog', {
                title: 'Справочник',
                isCatalog: true,
                isStaffSpec: true,
                userData: data
            });
        })
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

router.get('/say-my-name', authenticateJWT, (req, res) => {
    res.send(req.user)
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

//router.get('/token', (req, res) => {
//    console.log('34');
//    let authHeader = req.headers.cookie;

//    if (authHeader) {
//        let jwtStr = req.headers.cookie.indexOf('refreshToken');
//        const tokenDem = req.headers.cookie.substring(jwtStr + 21);
//        const token = tokenDem.substring(0, tokenDem.indexOf('%'));
//        //const tokenDem = authHeader.split(' ')[2];        
//        //const token = tokenDem.substring(tokenDem.indexOf('=') + 1);
//        ;
//        console.log(token);
//        console.log(req.headers.cookie);        
//        jwt.verify(token, refreshTokenSecret, (err, user) => {
//            if (err) {
//                return res.sendStatus(403);
//            }
//            const newtoken = {
//                accessToken: jwt.sign({ user_id: worker_id, user_role: job_title, user_name: worker_name }, accessTokenSecret, { expiresIn: '20m' }),
//                refreshToken: token
//            };
            

//            res.json({
//                accessToken
//            });
//        });
//    } else {
//        console.log("****er");
//        return res.redirect('/token');
//        //res.sendStatus(401);
//    }
//});