const express = require('express');
const { Server } = require('socket.io');
const { io } = require('./socket');

//Coneccion BD Atlas
require("./config/dbMoongose.js");
const MongoStore = require("connect-mongo")
const cookieParser = require("cookie-parser");
const session = require("express-session");

//Rutas
const AppRouters = require('./routers/app.routers');
const ViewsRouters = require('./routers/views.routers');

const PORT = 8080;
//Inicializacion
const app = express();

//handlebars
const handlebars = require('express-handlebars');
app.engine('handlebars', handlebars.engine({}));

app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');

//Parseo json.parse
app.use(express.json()); //Parse de los Objetos que van por Body
app.use(express.urlencoded({ extended: true })); //Parseo de los formularios

//Middlewares de COOKIES-PARSE
app.use(cookieParser());

//Inicializacion de Ssession
app.use(
    session({
        name: "coder-express-session",
        secret: "express-session",
        resave: false,
        saveUninitialized: false,
        //conecta a la db con las configuraciones
        store: MongoStore.create({
            mongoUrl: "mongodb+srv://admin:admin@coder.ks8ggsg.mongodb.net/ecommerce?retryWrites=true&w=majority",
            ttl: 3600
        })
    })
);

//Router
app.use(ViewsRouters);
app.use( '/api', AppRouters);

//Incorporar archivos de carpeta public con express
app.use(express.static(__dirname + '/public'));

//Puesto en Marcha
const httpServer = app.listen(PORT, () => {
    console.log("El servidor esta levantado y corriendo por el puerto", PORT);
});

//Inicializacion de Socket
const socketServer = new Server(httpServer);
io(socketServer);