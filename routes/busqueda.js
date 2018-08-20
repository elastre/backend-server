var express = require("express");
var app = express();

var Tercero = require("../models/tercero");
var Proyecto = require("../models/proyecto");


//**************************
// Busqueda por colección
//**************************

app.get('/coleccion/:tabla/:busqueda', (req,res,next) => {
    var busqueda = req.params.busqueda;
    var tabla = req.params.tabla;
    var regex = new RegExp(busqueda,'i');

    var promesa;

    switch(tabla){
        case 'terceros':
            promesa = buscarTerceros(busqueda,regex);
            break;
        case 'proyectos':
            promesa = buscarProyectos(busqueda,regex);
            break;
        default:
            return res.status(400).json({
                        ok: false,
                        mensaje: 'Colección de busqueda no permitida.',
                        error: {message:'Tipo de colección no valida'}
                    });
    };

    promesa.then(data=>{
        res.status(200).json({
            ok: true,
            [tabla]: data // Se usa [] para obtener: Propiedad de objeto computada ECMAScript6
        });
    });

});

//**************************
// Busqueda general
//**************************
app.get('/todo/:busqueda', (req,res,next) => {

    var busqueda = req.params.busqueda;
    var regex = new RegExp(busqueda,'i');

    Promise.all([
        buscarTerceros(busqueda,regex),
        buscarProyectos(busqueda,regex)
    ]).then( respuestas =>{
        res.status(200).json({
            ok: true,
            terceros: respuestas[0],
            proyectos: respuestas[1]
        });
    });
});

function buscarTerceros (busqueda,regex){
    return new Promise((resolve,reject)=>{
        //consultamos por un solo campo
        Tercero.find({'nombre':regex}, (err,terceros)=>{ 
           if (err){
               reject('Error al cargar terceros',err);
           }else{
               resolve(terceros);
           }
        });
    });
}

function buscarProyectos (busqueda,regex){
    return new Promise((resolve,reject)=>{
        Proyecto.find({})
        .or([{'nombre':regex},{'descripcion':regex}]) //consultamos por mas de un campo
        .exec((err,proyectos)=>{
           if (err){
               reject('Error al cargar proyectos',err);
           }else{
               resolve(proyectos);
           }
        });
    });
}

module.exports = app;
