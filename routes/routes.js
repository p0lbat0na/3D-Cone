<<<<<<< HEAD

import * as  express from 'express'
const router = express.Router();
import * as  bodyParser from 'body-parser'
router.use(express.json());

router.post('/cone', (req, res) => {
    try {
        let data = {
            radius: req.body.radius,
            height: req.body.height,
            segments: req.body.segments,
            segments_height: 1
        };
=======
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


const authenticateJWT = (req, res, next) => {

    let authHeader = req.headers.cookie;

    if (authHeader) {
        let jwtStr = req.headers.cookie.indexOf('accessToken');
        const tokenDem = req.headers.cookie.substring(jwtStr + 20);
        const token = tokenDem.substring(0, tokenDem.indexOf('%'));
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
                    if (data.rows[0].job_title == role1[0] ||
                        data.rows[0].job_title == role1[1] ||
                        data.rows[0].job_title == role1[2])
                        isOperator = true;
                    else {
                        if (data.rows[0].job_title == role2[0] ||
                            data.rows[0].job_title == role2[1] ||
                            data.rows[0].job_title == role2[2])
                            isExecutor = true;
                        else isDeclarant = true;
                    } const worker_name = data.rows[0].full_name;

                    const token = {
                        accessToken: jwt.sign({
                            user_id: worker_id,
                            isDeclarant: isDeclarant,
                            isExecutor: isExecutor,
                            isOperator: isOperator,
                            user_name: worker_name
                        }, accessTokenSecret, { expiresIn: '30m' }),
                        refreshToken: jwt.sign({
                            user_id: worker_id,
                            isDeclarant: isDeclarant,
                            isExecutor: isExecutor,
                            isOperator: isOperator,
                            user_name: worker_name
                        }, refreshTokenSecret)
                    }; resolve(token);
                } else {
                    reject(new Error('Неправильный логин или пароль'));
                }
            }
        });
    });
}

function write(table, attr, value, returnCode) {
    return new Promise((resolve, reject) => {
        let q = 'INSERT INTO public.' + table + '(' + attr + ') VALUES(' + value + ') RETURNING ' + returnCode + ' AS return_code';
        console.log(q);
        db.query(q, (error, data) => {

            if (error) {
                reject(error);
            } else {
                if (data) {
                    resolve(data);
                } else {
                    reject('no data?;(');
                }
            }
        });
    });
}

function getTime() {
    let myDate = new Date()
    let day = myDate.getDay();
    let month = myDate.getMonth();
    let year = myDate.getFullYear();

    let hour = myDate.getHours()
    let minute = myDate.getMinutes()
    let sec = myDate.getSeconds()
    console.log(sec)

    console.log(minute)
    if (minute < 10) {
        minute = '0' + minute
    }
    console.log(minute + 'min')

    return (
        day + '.' + month + '.' + year + ' ' + hour + ':' + minute + ':' + sec
    )
}

function del(table, row, condition) {
    return new Promise((resolve, reject) => {
        if (typeof (condition) != 'number')
            condition = `'` + condition + `'`
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

function anyRequest(sql) {
    return new Promise((resolve, reject) => {

        console.log('###########' + sql);
        db.query(sql, (error, data) => {

            if (error) {
                reject(error);
                console.log(error);
            } else {
                console.log('Запрос выполнен' + sql)
                resolve(data);
            }
        });
    });
}

router.post('/anyRequest', (req, res) => {
    const sql = req.body.sql;

    anyRequest(sql)

        .then(data => {
            res.send(data);
        })
        .catch(error => {
            console.log(error);
            res.status(401).send(error);
        });
});

router.post('/login', (req, res) => {

    const worker_id = req.body.worker_id;
    const password = req.body.password;

    let cookieOptions = {
        // Delete the cookie after 90 days
        expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), httpOnly: true,
    };
    cookieOptions.secure = true;

    authenticate(worker_id, password)
        .then(token => {
            // добавляем токен в ответ
            //res.json({ token });
            refreshTokens.push(token.refreshToken);
            console.log("post routes token " + token.refreshToken);
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

        .then(data => {
            res.send(data.rows[0].return_code);

        })
        .catch(error => {
            console.log('33333' + error);
            res.status(401).send(error);
        });
});

router.post('/insert-test', (req, res) => {
    const request_code = req.body.return_req_code;
    const control_code = req.body.control_code;
    const object_reg_number = req.body.reg_num;
    const line_code = req.body.line_num;
    const comment = req.body.comment;
    const files = req.body.files;

    let attr = `request_code, control_object_testing_code, line_code, testing_status, object_reg_number, comment, files`
    let val = request_code + `, '` + control_code + `', ` + line_code + `, 'в обработке'` + `, '` + object_reg_number + `', '` + comment + `', '` + files + `'`;


    write('tests_in_requests', attr, val, 'test_in_request_code')

        .then(data => {
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
>>>>>>> a443a7ba811cd16c92b8e5b8faa6dab2608cdef6

        if (req.body.smooth) {
            data.segments_height = 1000;
            data.segments = 1000;
        }

<<<<<<< HEAD
        res.send(data);
    }
    catch (er) {
        console.log(er);
        res.status(401).send(er);
    };
=======
        const user = req.user;
        db.query(sql, function (err, data) {
            if (err) throw err;
            if (data.rows.length == 0) {
                res.status(400).send('Запрос не дал результатов')
            }
            else {

                res.render('req-list', {
                    title: 'Заявка ' + num,
                    isReqList: true,
                    userData: data,
                    user: user
                });
            }
        })
    }
    catch (err) {
        console.log(error);
    };
});

router.post('/test-list/search', (req, res, next) => {
    try {
        num = req.body.num;
        req.requires_processing = req.body.requires_processing;

        let sql = 'SELECT * FROM tests_in_requests ';

        let title = 'Список испытаний'
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
            else
                sql = sql + ` WHERE testing_status='в работе'`;

        }

        sql = sql + ' ORDER BY test_in_request_code DESC';
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
        let wrongToken = "wrongToken"
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


>>>>>>> a443a7ba811cd16c92b8e5b8faa6dab2608cdef6
});

export { router };

<<<<<<< HEAD
=======
router.get('/', authenticateJWT, (req, res) => {
    res.render('index', {
        title: 'Главная',
        isMain: true,
        user: req.user
    })
    console.log(refreshTokens[0]);
    console.log(refreshTokens[1]);
    console.log(refreshTokens[2]);
})

router.get('/req-list', authenticateJWT, (req, res) => {
    if (!req.user.isExecutor) {

        let sql = 'SELECT * FROM requests ';
        if (req.user.isDeclarant)
            sql = sql + `WHERE worker_id = ` + req.user.user_id;
        sql = sql + ' ORDER BY request_code DESC';

        db.query(sql, function (err, data) {
            if (err) throw err;
            let options = { year: 'numeric', month: 'numeric', day: 'numeric' };

            for (let i = 0; i < data.rowCount; i++) {

                let deadline = data.rows[i].deadline.toLocaleDateString("en-US", { year: 'numeric' }) + '-' +
                    data.rows[i].deadline.toLocaleDateString("en-US", { month: '2-digit' }) + '-' +
                    data.rows[i].deadline.toLocaleDateString("en-US", { day: '2-digit' });
                data.rows[i].deadline = deadline

            }

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
    console.log
    let sql = 'SELECT * FROM tests_in_requests ';
    if (req.user.isExecutor)
        sql = sql + 'WHERE worker_id=' + req.user.user_id;
    else {
        if (req.user.isDeclarant)
            sql = sql + `INNER JOIN requests on tests_in_requests.request_code=requests.request_code
            WHERE requests.worker_id = ` + req.user.user_id;
    }
    sql = sql + ' ORDER BY test_in_request_code DESC';

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
    let sql = 'SELECT * FROM departments ORDER BY department_num DESC';
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
    db.query(sql, function (err, data) {
        if (err) throw err;
        res.render('catalog', {
            title: 'Справочник',
            isCatalog: true,
            isStaffSpec: true,
            userData: data
        });
    })

})

router.get('/login', (req, res) => {
    res.render('login', {
        title: 'Вход',
        isLogin: true
    })
})

router.get('/say-my-name', authenticateJWT, (req, res) => {
    res.send(req.user)
})

router.get('/backup', authenticateJWT, (req, res) => {
    res.render('backup', {
        title: 'Администрирование',
        isMain: true,
        user: req.user
    })
})

var exePathDump = ('C:\\"Program Files"\\PostgreSQL\\15\\bin\\pg_dump.exe');
var exePathPsql = ('C:\\"Program Files"\\PostgreSQL\\15\\bin\\psql.exe');

const { execFile } = require("child_process");
const currentDir = process.cwd();
// указываем полный путь к файлу резервной копии
const backupScriptPath = path.join(currentDir, "backup.sh");
const options = {
    windowsHide: true,
    cwd: null,
    env: null,
    encoding: "utf8",
    timeout: 0,
    maxBuffer: 1024 * 1024 * 64,
    killSignal: "SIGTERM",
    shell: true,
    windowsVerbatimArguments: true,
    args: ["--disk-cache-dir=C:/LNK", exePathDump],
};

function dump(dumpName) {

    return new Promise((resolve, reject) => {
        execFile(exePathDump, [`"dbname=LNK user=postgres password=4444 client_encoding=Windows-1251" > C:/Games/LNK` + dumpName], options,
            (error, stdout, stderr) => {
                if (error !== null) {
                    console.log(`exec error:` + error)
                    console.log(stderr)
                    console.log(stdout)
                    reject(error);
                    return
                }
                console.log(stderr)
                console.log(stdout)
                console.log("Backup complete!")
                resolve("Backup complete!");

            })
    });

}
function restore(dumpName) {
    return new Promise((resolve, reject) => {
        execFile(exePathPsql, [`"dbname=LNK user=postgres password=4444" < C:/Games/` + dumpName], options,
            (error, stdout, stderr) => {
                if (error !== null) {
                    reject(error);
                    console.log(stderr)
                    console.log(stdout)
                    return
                }
                resolve("Restore complete!");
                console.log(stderr)
                console.log(stdout)
                console.log("Restore complete!")

            })

    });
    console.log('aaaaaaaaaaaa ' + backupScriptPath)

}
const { execute } = require('@getvim/execute');


router.post('/backup', (req, res) => {

    dump('_main_backup.dump')
        .then(data => {
            console.log(data);

            res.send('Резервная копия успешно создана');
        })
        .catch(error => {
            console.error(error);
            res.send(err);

        });

});

router.post('/restore', (req, res) => {


    dump('_additional_backup.dump').then(data => {
        anyRequest(`DROP SCHEMA public CASCADE;
CREATE SCHEMA public;`)
            .then(resolve => {
                console.log(resolve);
                console.log('q976');
                restore('mydb_export.dump').then(data => {
                    res.send(data);
                })
                    .catch(error => {
                        console.log(error);
                        res.status(401).send(error);
                    });

            })
            .catch(error => {
                console.error(error);

            });
    })
        .catch(error => {
            console.error(error);
            res.send(err);

        });

    //асинхронность нада

    //anyRequest(`DROP DATABASE IF EXISTS "LNK"`)


    console.log('q67');

});


module.exports = router;


router.get('/report/staff', (req, res, next) => {

    let num = req.headers.num;
    let sql = `SELECT * FROM tests_in_requests 
INNER JOIN staff ON tests_in_requests.worker_id = staff.worker_id 
INNER JOIN requests ON tests_in_requests.request_code = requests.request_code
WHERE tests_in_requests.worker_id=` + num + `  
ORDER BY requests.request_code ASC`;
    console.log('worker ' + num)
    db.query(sql, function (err, data) {
        if (err) throw err;
        if (data.rows.length == 0) {
            res.status(400).send('Запрос не дал результатов')
        }
        else {
            //let isExecutor = false;
            //for (var i = 0; i < role2.length; i++) {
            //    if (data.rows[0].job_title == role2[i])
            //        isExecutor == true;
            //}
            //if (isExecutor) {
            //    res.status(400).send('Запрос не дал результатов')

            try {
                const template = fs.readFileSync('public/templates/staff.docx', 'binary');
                const zip = new PizZip(template);
                const doc = new Docxtemplater(zip, {
                    paragraphLoop: true,
                    linebreaks: true,
                });
                let arrRows = [];
                let currentTime = getTime();
                let currentDate = currentTime.substring(0, 14)

                console.log(data.rows.length)
                let deadline = [];
                for (var i = 0; i < data.rows.length; i++) {
                    deadline[i] = data.rows[i].deadline.toLocaleDateString("en-US", { year: 'numeric' }) + '-' +
                        data.rows[i].deadline.toLocaleDateString("en-US", { month: '2-digit' }) + '-' +
                        data.rows[i].deadline.toLocaleDateString("en-US", { day: '2-digit' });

                    arrRows[i] = {
                        testCode: data.rows[i].test_in_request_code,
                        reqCode: data.rows[i].request_code,
                        dep: data.rows[i].department_num,
                        objTest: data.rows[i].control_object_testing_code,
                        status: data.rows[i].testing_status,
                        regNum: data.rows[i].object_reg_number,
                        deadline: deadline[i],
                    }
                }

                doc.render({
                    workerID: num,
                    fullName: data.rows[0].full_name,
                    jobTitle: data.rows[0].job_title,
                    contacts: data.rows[0].contacts,
                    testInRequest: arrRows,
                    currentDate: currentDate
                });
                currentTime = currentDate + currentTime.slice(14);
                console.log(currentTime)
                const buffer = doc.getZip().generate({ type: 'nodebuffer' });

                //fs.writeFileSync(currentDate.substring(0, 13) + '.docx', buffer);
                let repPath = ('public/reports/report' + num + '.docx')
                fs.writeFileSync(repPath, buffer);
                const file = (path.join(__dirname, '../public/reports/') + 'report' + num + '.docx');
                res.download(file);


                //res.send('success');

            } catch (error) {
                console.log(error);
                res.send(error);
            }
        }
    })
});
router.get('/report/obj', (req, res, next) => {
    let num = req.headers.num;

    let sql = `SELECT * FROM objects_of_control
INNER JOIN control_objects_testing ON objects_of_control.control_object_code = control_objects_testing.control_object_code
INNER JOIN sorts_of_control ON control_objects_testing.test_code = sorts_of_control.test_code
INNER JOIN tests_in_requests ON control_objects_testing.control_object_testing_code = tests_in_requests.control_object_testing_code
INNER JOIN requests ON tests_in_requests.request_code = requests.request_code
INNER JOIN departments ON requests.department_num = departments.department_num
WHERE objects_of_control.control_object_code=`+ num + ` 
ORDER BY objects_of_control.control_object_code ASC`;
    db.query(sql, function (err, data) {
        if (err) throw err;
        if (data.rows.length == 0) {
            res.status(400).send('Запрос не дал результатов')
        }
        else {
            try {

                //const mimeType =   "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                const template = fs.readFileSync('public/templates/object.docx', 'binary');
                const zip = new PizZip(template);


                const doc = new Docxtemplater(zip, {
                    paragraphLoop: true,
                    linebreaks: true,
                });



                let arrRows = [];
                let currentTime = getTime();
                let currentDate = currentTime.substring(0, 14)

                //console.log(data.rows[0].requests.worker_id)



                for (var i = 0; i < data.rows.length; i++) {
                    arrRows[i] = {
                        testName: data.rows[i].testing_full_name,
                        reqCode: data.rows[i].request_code,
                        depName: data.rows[i].dep_full_name,
                        entity: data.rows[i].entity_short_name,
                        lineNum: data.rows[i].line_code,
                        status: data.rows[i].testing_status,
                        objRegNum: data.rows[i].object_reg_number,
                        executorID: data.rows[i].worker_id,

                    }
                }
                doc.render({
                    objID: num,
                    subcategory: data.rows[0].subcategory,
                    category: data.rows[0].category,
                    objInfo: data.rows[0].additional_information,
                    testInRequest: arrRows,
                    currentDate: currentDate
                });
                currentTime = currentDate + currentTime.slice(14);
                console.log(currentTime)
                const buffer = doc.getZip().generate({ type: 'nodebuffer' });

                //fs.writeFileSync(currentDate.substring(0, 13) + '.docx', buffer);
                let repPath = ('public/reports/report' + num + '.docx')
                fs.writeFileSync(repPath, buffer);
                const file = (path.join(__dirname, '../public/reports/') + 'report' + num + '.docx');
                res.download(file);


                //res.send('success');

            } catch (error) {
                console.log(error);
                res.status(500).send(error);

            }
            //res.send(data,);
        }
    })

});
router.get('/report/request', (req, res, next) => {

    let num = req.headers.num;


    let sql = `SELECT * FROM tests_in_requests
INNER JOIN requests ON tests_in_requests.request_code = requests.request_code
INNER JOIN control_objects_testing ON tests_in_requests.control_object_testing_code = control_objects_testing.control_object_testing_code
INNER JOIN objects_of_control ON control_objects_testing.control_object_code = objects_of_control.control_object_code
INNER JOIN sorts_of_control ON control_objects_testing.test_code = sorts_of_control.test_code
INNER JOIN staff ON tests_in_requests.worker_id = staff.worker_id
INNER JOIN departments ON requests.department_num = departments.department_num
WHERE tests_in_requests.request_code=`+ num + ` 
ORDER BY tests_in_requests.test_in_request_code ASC`;

    db.query(sql, function (err, data) {
        if (err) {
            res.status(400).send('Запрос не дал результатов')
            throw err;
        }

        else {
            if (data.rows.length == 0) {
                res.status(400).send('Запрос не дал результатов')
                console.log(data.rows.length)
            }

            else {
                try {
                    const template = fs.readFileSync('public/templates/request.docx', 'binary');
                    const zip = new PizZip(template);


                    const doc = new Docxtemplater(zip, {
                        paragraphLoop: true,
                        linebreaks: true,
                    });
                    let opinionRequired = 'Заключение не требуется';
                    if (data.rows[0].opinion_reqired == true)
                        opinionRequired = 'Требуется выдача заключения';
                    let arrRows = [];
                    let currentTime = getTime();
                    let currentDate = currentTime.substring(0, 14)
                    let deadline = '';


                    deadline = data.rows[0].deadline.toLocaleDateString("en-US", { year: 'numeric' }) + '-' +
                        data.rows[0].deadline.toLocaleDateString("en-US", { month: '2-digit' }) + '-' +
                        data.rows[0].deadline.toLocaleDateString("en-US", { day: '2-digit' });


                    for (var i = 0; i < data.rows.length; i++) {
                        arrRows[i] = {
                            testCode: data.rows[0].test_in_request_code,
                            testName: data.rows[i].testing_full_name,
                            objName: data.rows[i].category + ', ' + data.rows[i].subcategory,
                            files: data.rows[i].files,
                            testStatus: data.rows[i].testing_status,
                            objRegNum: data.rows[i].object_reg_number,
                            executorID: data.rows[i].worker_id,
                            lineNum: data.rows[i].line_code,
                            comment: data.rows[i].comment,
                        }
                    }
                    doc.render({
                        declarantName: data.rows[0].director_name,
                        depName: data.rows[0].dep_full_name,
                        entity: data.rows[0].entity_short_name,
                        decContacts: data.rows[0].contacts,
                        status: data.rows[0].status,
                        opinionRequired: opinionRequired,
                        testInRequest: arrRows,
                        currentDate: currentDate,
                        deadline: deadline,
                        num: num
                    });
                    currentTime = currentDate + currentTime.slice(14);
                    console.log(currentTime)
                    const buffer = doc.getZip().generate({ type: 'nodebuffer' });

                    //fs.writeFileSync(currentDate.substring(0, 13) + '.docx', buffer);
                    let repPath = ('public/reports/reportReq' + num + '.docx')
                    fs.writeFileSync(repPath, buffer);
                    const file = (path.join(__dirname, '../public/reports/') + 'reportReq' + num + '.docx');
                    res.download(file);


                    //res.send('success');

                } catch (error) {
                    console.log(error);
                    res.status(500).send(error);

                }

                //res.send(data,);
            }
        }
    })

});
>>>>>>> a443a7ba811cd16c92b8e5b8faa6dab2608cdef6
