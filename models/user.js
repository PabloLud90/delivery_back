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
//test

// User.findUserByEmail = (email) => {
//     const sql = `SELECT id, email, name, lastname, phone, image, password, session_token
//                  FROM users
//                  WHERE email = $1`;

//     return db.oneOrNone(sql, email);
// }

User.findUserByEmail = (email) => {
    const sql = `SELECT 
		tb1.id, 
		tb1.email, 
		tb1.name, 
		tb1.lastname, 
		tb1.phone, 
		tb1.image, 
		tb1.password, 
		tb1.session_token,
		json_agg(
			json_build_object(
			'id', tb3.id,
			'name', tb3.name,
			'image', tb3.image,
			'route', tb3.route
			)
		) AS roles
	FROM users AS tb1
	INNER JOIN user_has_roles tb2 ON tb2.user_id  = tb1.id
	INNER JOIN roles tb3 ON tb3.id  = tb2.role_id
	WHERE tb1.email = $1
	GROUP BY tb1.id`;

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