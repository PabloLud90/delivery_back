const db = require('../config/config');
const crypto = require('crypto');

const User = {};

User.getAll = () => {
    const sql = `SELECT * FROM users`;

    return db.manyOrNone(sql);
}

User.findUserById = (id, callback) => {
    const sql = `SELECT id, email, name, lastname, phone, image, password, session_token
                 FROM users
                 WHERE id = $1`;

    return db.oneOrNone(sql, [id]).then(user =>{callback(null, user);});
}

User.findUserByEmail = (email) => {
    const sql = `SELECT id, email, name, lastname, phone, image, password, session_token
                 FROM users
                 WHERE email = $1`;

    return db.oneOrNone(sql, email);
}

User.createUser = (user) => {
    //Encriptar la contraseña
    const myPasswordHash = crypto.createHash('md5').update(user.password).digest('hex');
    user.password = myPasswordHash;
    const sql = `INSERT INTO users(email, name, lastname, phone, image, password, created_at, updated_at)
                 VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`;

    return db.oneOrNone(sql, [user.email, user.name, user.lastname, user.phone, user.image, user.password, new Date(), new Date()]);           
}

User.passwordMatch = (password, hash) => {
    const myPasswordHash = crypto.createHash('md5').update(password).digest('hex');
    if(myPasswordHash === hash) {
        return true;
    }else{
        return false;
    }
   // return myPasswordHash === hash;
}

module.exports = User;