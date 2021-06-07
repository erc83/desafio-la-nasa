require('dotenv').config();
const express = require("express");
const app = express();
const path = require("path");
const exphbs = require("express-handlebars")
const db = require("./db/index");
const jwt = require("jsonwebtoken");
const expressFileUpload = require("express-fileupload");

//server
app.set("port", process.env.PORT || 5003);
const PORT = app.get("port");
app.listen(PORT, () => {
    console.log("server on port:", PORT);
})

//Middlewares
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(__dirname + "public"));
app.use(
    expressFileUpload({
        limits: 5000000,
        abortOnLimit: true,
        responseOnLimit: "El tamaño de la imagen supera el límite permitido",
    })
);
app.use("/css", express.static(__dirname + "/node_modules/bootstrap/dist/css"));

app.engine(".hbs", 
exphbs({
    defaultLayout: "Main",
    layoutsDir: path.join(__dirname, "./views/layout"),
    partialsDir: path.join(__dirname, "./views/components"),
    extname: ".hbs",
})
);
app.set("view engine", ".hbs");

//rutas

app.get("/", (req, res) => {
    res.render("Index")
})

app.post("/usuarios", async (req, res) => {
    const {email, name, password } = req.body;
    const usuario = await db.nuevoUsuario(email, name, password);
    res.status(201).send(JSON.stringify(usuario));
})

app.get("/admin" , async (req, res) => {
    const usuarios = await db.getUsuarios();
    res.render("Admin", {usuarios});
});

app.put("/usuarios", async (req,res) => {
    const { id, auth } = req.body;
    const usuario = await db.setUsuarioStatus(id, auth);
    res.status(200).send(JSON.stringify(usuario));
})

app.get("/login", function (req, res){
    res.render("Login");
})

app.post("/verify", async function  (req, res) {
    let { email, password } = req.body;
    let user = await db.getUsuario(email, password);
    if(user) {
        if(user.auth) {
            const token = jwt.sign(
                {
                    exp: Math.floor(Date.now() / 1000) + 180,
                    data: user,
                },
                process.env.SECRET_KEY
            );
            res.send(token);
        }else{
            res.status(401).send({
                error: "Este usuario aún no esta validado para subir imagenes",
                code: 404,
            });
        }
    }else{
        res.status(404).send({
            error: "Este usuario no está registrado en la base de datos",
            code: 404,
        });
    }
});



app.get("*", (req, res) => {
    res.send("La ruta que quieres acceder no existe")
})