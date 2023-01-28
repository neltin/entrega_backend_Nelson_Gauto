const express = require('express');
const { Server } = require('socket.io');
const { io } = require('./socket');
require("./config/dbMoongose.js");


//const AppRouters = require('./routers/app.routers');
const ViewsRouters = require('./routers/views.routers');
const BdRouters = require('./routers/bd.routers');

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

//Router
app.use(ViewsRouters);
//app.use( '/api', AppRouters);
app.use( '/api', BdRouters);

//Incorporar archivos de carpeta public con express
app.use(express.static(__dirname + '/public'));

//Puesto en Marcha
const httpServer = app.listen(PORT, () => {
    console.log("El servidor esta levantado y corriendo por el puerto", PORT);
});

//Inicializacion de Socket
const socketServer = new Server(httpServer);
io(socketServer);