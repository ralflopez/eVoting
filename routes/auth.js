const express = require('express');
const Joi = require('joi');
const router = express.Router();
const { connection } = require('../config/mysql_db');
const { getUser, addUser } = require('../config/mysql_users');
const { LoginUser, RegisterUser } = require('../schema/User');

router.post('/signup', async (req, res) => {
    //validate input
    const validate = RegisterUser.validate(req.body);
    if('error' in validate)
        return res.status(400).send(validate.error.details[0].message);

    //check db
    try {
        const doesExist = await getUser(validate.value.email, true);
        if(doesExist)
            res.status(400).send('User already exist');
    } catch(e) {
        res.status(500).send('Error reaching the database');
    }

    //add to db
    try {
        await addUser(validate.value);
    } catch(e) {
        res.status(500).send('Unable to add the user. Try again later');
    }

    res.send();
});

router.post('/login', async (req, res) => {
    //validate input
    const validate = LoginUser.validate(req.body);
    if('error' in validate)
        return res.status(400).send(validate.error.details[0].message);

    //check db
    try {
        const user = await getUser(validate.value.email);
        if(user.length === 0)
            res.status(400).send('User doesn\'t exist');
    } catch(e) {
        res.status(500).send('Error reaching the database');
    }

    //verify pass
    const valid = await bcrypt.compare(user[0].password, validate.value.password);
    if(!valid)
        return res.status(400).send('Invalid email or password');
    
    
    res.send();
});

module.exports = router;