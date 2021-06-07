// const send = require('./correo');
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
        // send(usuario, false, true);
        return usuario;
    } catch (error) {
        console.log(error);
        return error;
    }
}

module.exports = {nuevoUsuario}

