const bcrypt = require('bcrypt');
const connection = require('./mysql_db');

// get user info from database
const getUser = (email, checkOnly) => {
    const sql = 
    `SELECT ${checkOnly ? 'email' : '*'} 
    FROM users 
    WHERE email = "${email}"`;

    return new Promise((resolve, reject) => {
        connection.query(sql, (err, result) => {
            if(err)
                reject(err);
            else if (result.length === 0)
                resolve(checkOnly ? false : null);
            else
                resolve(checkOnly ? true : result);
        });
    });
}

//add user to database
const addUser = async (body) => {
    const sql = `INSERT INTO users SET ?`;

    //hash password
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(body.password, salt);

    const user = {...body, password: hashed};

    return new Promise((resolve, reject) => {
        connection.query(sql, user, (err, result) => {
            if(err)
                reject(err);
            else
                resolve(result);
        });
    });
}

module.exports = { getUser, addUser };