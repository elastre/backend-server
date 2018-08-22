//Requires
var express = require("express");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");

//inicializar variables
var app = express();

//************************/
// ESTE HABILIOTA EL CORS PARA ACEPTAR PETICIONES DE OTROS DOMINIOS
// Se utilizara este para pruebas, pero debo configurar el cors con un middleware
// como este : https://github.com/expressjs/cors
//************************/
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods","POST, GET, PUT, DELETE, OPTIONS");
    next();
  });
//***********************/

//Body-Parser
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//Importamos Rutas
var appRoutes = require("./routes/app");
var usuarioRoutes = require("./routes/usuario");
var loginRoutes = require("./routes/login");
var proyectoRoutes = require("./routes/proyecto");
var terceroRoutes = require("./routes/tercero");
var busquedaRoutes = require("./routes/busqueda");
var uploadRoutes = require("./routes/upload");
var imagenesRoutes = require("./routes/imagenes");

//Conexion a la base de datos
mongoose.connection.openUri('mongodb://localhost:27017/trazableDB', (err,res)=>{
    if(err) throw err;

    console.log('Base de Datos: \x1b[32m%s\x1b[0m','online'); 
});

/*Server index config : Este es opcional para visualizar imagenes en el servidor
solo se activa si deseamos verificar las imagenes en el navegador con la ruta:
localhost:3000/uploads, sino por seguridad dejar este codigo comentariado. 
*/ /*
var serveIndex = require('serve-index');
app.use(express.static(__dirname + '/'))
app.use('/uploads', serveIndex(__dirname + '/uploads'));
*///*************************************/


//Rutas 
app.use('/usuario',usuarioRoutes);
app.use('/proyecto',proyectoRoutes);
app.use('/tercero',terceroRoutes);
app.use('/login',loginRoutes);
app.use('/busqueda',busquedaRoutes);
app.use('/upload',uploadRoutes);
app.use('/img',imagenesRoutes);

app.use('/',appRoutes);


//Escuchar peticiones
app.listen(3000, ()=>{
   console.log('Express server puerto 3000: \x1b[32m%s\x1b[0m','online'); 
});

