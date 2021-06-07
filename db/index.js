const send = require('../correo');
require('dotenv').config()
const { Pool } = require("pg");
const pool = new Pool({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    password: process.env.PG_PASSWORD,
    database: process.env.PG_DATABASE,
    port: process.env.PG_PORT,
});

async function nuevoUsuario(email, name, password){
    try {
        const result = await pool.query(
            `INSERT INTO usuarios(email, name, password, auth) 
            VALUES ('${email}', '${name}', '${password}', false) RETURNING *` 
        );
        const usuario = result.rows[0];
        await send(usuario, false, true);
        return usuario;
    } catch (error) {
        console.log(error);
        return error;
    }
}

async function getUsuarios() {
    try {
        const result = await pool.query('SELECT * FROM usuarios');
        return result.rows;
    } catch (error) {
        console.log(error);
        return error;
    }
}

async function setUsuarioStatus(id, auth) {
    try {
        const result = await pool.query(
            `UPDATE usuarios SET auth = ${auth} WHERE id = ${id} RETURNING *`
        );
        const usuario = result.rows[0];
        // send(usuario, auth);
        return usuario;
    } catch (e) {
        console.log(e);
        return false;
    }
}

async function getUsuario(email, password) {
    try {
        const result = await pool.query(
            `SELECT * FROM usuarios WHERE email = '${email}' 
            AND password = '${password}'`
        );
        return result.rows[0];
    } catch (e) {
        console.log(e);
        return false;
    }
}


module.exports = {
    nuevoUsuario,
    getUsuarios,
    setUsuarioStatus,
    getUsuario
}

