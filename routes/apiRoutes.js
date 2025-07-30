const express = require('express');
const router = express.Router();
const auth = require('../routes/auth/auth')
const user = require('../routes/user/user')
const orders = require('../routes/orders/orders')
const checklists = require('../routes/checklists/checklists')
const answers = require('../routes/answers/answers')

router.use('/auth', auth)
router.use('/users', user)
router.use('/orders', orders)
router.use('/checklists', checklists)
router.use('/answers', answers)


module.exports = router