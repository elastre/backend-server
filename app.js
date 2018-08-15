//Requires
var express = require("express");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");

//inicializar variables
var app = express();

//Body-Parser
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//Importamos Rutas
var appRoutes = require("./routes/app");
var usuarioRoutes = require("./routes/usuario");

//Conexion a la base de datos
mongoose.connection.openUri('mongodb://localhost:27017/trazableDB', (err,res)=>{
    if(err) throw err;

    console.log('Base de Datos: \x1b[32m%s\x1b[0m','online'); 
});

//Rutas 
app.use('/usuario',usuarioRoutes);
app.use('/',appRoutes);


//Escuchar peticiones
app.listen(3000, ()=>{
   console.log('Express server puerto 3000: \x1b[32m%s\x1b[0m','online'); 
});

