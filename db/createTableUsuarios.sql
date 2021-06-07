-- //psql -d nasa -f db/createTableUsuarios.sql -a
DROP TABLE IF EXISTS usuarios;

CREATE TABLE usuarios(
    id SERIAL, 
    email VARCHAR(50),
    name VARCHAR(50),
    password VARCHAR(50),
    auth BOOLEAN
);