const db = require('../config/config');

 const Rol = {};

 Rol.create = (user_id, role_id) => {
    const sql = `
    INSERT INTO user_has_roles (
        user_id, role_id, created_at, updated_at
        )
    VALUES ($1, $2, $3, $4)`;

    return db.none(sql, [
        user_id,
        role_id,
        new Date(),
        new Date()
    ]);
 } 

 module.exports = Rol; 