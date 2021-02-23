const express = require('express');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const router = express.Router();
const { getUser, addUser } = require('../config/mysql_users');
const { LoginUser, RegisterUser } = require('../schema/User');

dotenv.config();

// POST
router.post('/signup', async (req, res) => {
    //validate input
    const validate = RegisterUser.validate(req.body);
    if('error' in validate)
        return res.status(400).render('auth/signup', { error: validate.error.details[0].message });

    //check db
    try {
        const doesExist = await getUser(validate.value.email, true);
        if(doesExist)
            res.status(400).json('User already exist');
    } catch(e) {
        res.status(500).render('auth/signup', { error:  'Error reaching the database' });
    }

    //add to db
    try {
        await addUser(validate.value);
    } catch(e) {
        res.status(500).render('auth/signup', { error: 'Unable to add the user. Try again later' });
    }

    res.send();
});

router.post('/login', async (req, res) => {
    //validate input
    const validate = LoginUser.validate(req.body);
    if('error' in validate)
        return res.status(400).render('auth/login', { error: validate.error.details[0].message });

    //check db
    let user;
    try {
        user = await getUser(validate.value.email);
        if(user.length === 0)
            return res.status(400).render('auth/login', { error: 'User doesn\'t exist' });
        console.log(user)
    } catch(e) {
        return res.status(500).render('auth/login', { error: 'Error reaching the database' });
    }

    //verify pass
    const valid = await bcrypt.compare(validate.value.password, user[0].password);
    if(!valid)
        return res.status(400).render('auth/login', { error: 'Invalid email or password' });
    
    //add token
    const info = {
        name: user.name,
        email: user.email
    };
    const secret = process.env.JWT_SECRET;
    const expiry = {
        expiresIn: '5h'
    }

    const token = jwt.sign(info, secret, expiry);
    
    res.header('auth-token', token).json(validate.value.email).redirect('/');
});

const checkAuth = (req, res, next) => {
    const token = req.header('auth-token');
    if(!token)
        return res.status(403).redirect('/login');
    
    try {
        const secret = process.env.JWT_SECRET;
        const validate = jwt.verify(token, secret);
        req.user = validate;
        next();
    } catch(e) {
        return res.status(403).redirect('/login');
    }
}

module.exports = { router, checkAuth };