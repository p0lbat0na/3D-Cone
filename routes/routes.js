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

router.get('/create-req', (req, res) => {
    res.render('create-req', {
        title: 'Новая заявка',
        isNewReq: true
    })
})

module.exports = router;