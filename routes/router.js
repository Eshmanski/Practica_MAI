const { Router } = require('express');
const homeRoute = require('./home');
const leadRoute = require('./leads');
const authRoute = require('./auth');

const router = Router();

router.use('/', homeRoute);
router.use('/leads', leadRoute);
router.use('/auth', authRoute);

module.exports = router;
