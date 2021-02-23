const express = require('express');
const router = express.Router();
const { checkAuth } = require('./auth');

router.get('/', checkAuth, (req, res) => {
    res.render('main');
});

router.get('/signup', (req, res) => {
    res.render('auth/signup');
});

router.get('/login', (req, res) => {
    res.render('auth/login');
});

module.exports = router;