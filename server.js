const express = require("express");
const app = express();
const path = require("path");
const exphbs = require("express-handlebars")
const db = require("./db/index");
const secretKey = "Shhh"
const expressFileUpload = require("express-fileupload");

//server
app.set("port", process.env.PORT || 5001);
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


app.get("*", (req, res) => {
    res.send("La ruta que quieres acceder no existe")
})