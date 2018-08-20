var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var mdAutenticacion = require('../middlewares/autenticacion');

var app = express();

var Tercero = require('../models/tercero');

//=================================
//Obtener todos los colaboradores
//=================================

app.get('/', (req,res,next) => {
    
    var desde = req.query.desde || 0;
    desde = Number(desde);

    Tercero.find({},'nrodoc nombre img regusuario updusuario')
    .skip(desde) // a partir del resgisro x traer los siguientes
    .limit(2) // cantidad limite de resultados
    .populate('regusuario','nombre email') //traer los datos de los documentos relacionadas
    .populate('updusuario','nombre email')
    .exec( 
        (err, terceros)=>{
            if(err){
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error cargando terceros',
                    errors: err
                });
            }

            // Respuesta con paginación
            Tercero.count({},(err,conteo)=>{
                res.status(200).json({
                    ok: true,
                    terceros: terceros,
                    total: conteo
                });
            });          
        }
    );    
});

//=================================
//Crear un nuevo tercero
//=================================
app.post('/', mdAutenticacion.verificaToken, (req,res) => {
    var body = req.body;

    var tercero = new Tercero({
        nrodoc      : body.nrodoc,
        nombre      : body.nombre,      
        img         : body.img,
        regusuario  : req.usuario,
        updusuario  : req.usuario
    });

    tercero.save((err,terceroGuardado)=>{
        if(err){
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear tercero',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            terceroGuardado: terceroGuardado,
            usuariotoken: req.usuario
        });
    });  
});

//=================================
//Actualizar tercero
//=================================
app.put('/:id',mdAutenticacion.verificaToken,(req,res)=>{
    var id = req.params.id;
    var body = req.body;

    //busco el tercero por el id ;)
    Tercero.findById(id,'nombre descripcion img regusuario',(err, tercero)=>{
        if(err){
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar tercero',
                errors: err
            });
        }

        if( !tercero ){           
            return res.status(400).json({
                ok: false,
                mensaje: 'El tercero con el id: '+id+' no existe.',
                errors: {message: 'No existe un tercero con ese ID.'}
            });
        }

        tercero.nrodoc      = body.nrodoc;
        tercero.nombre      = body.nombre;
        tercero.img         = body.img;
        tercero.updusuario  = req.usuario;

        tercero.save((err,terceroGuardado)=>{
            if(err){
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar tercero',
                    errors: err
                });
            }
    
            res.status(200).json({
                ok: true,
                tercero: terceroGuardado
            });    
        });  
    });
});

//=================================
//Borrar un proyecto por ID
//=================================
app.delete('/:id',mdAutenticacion.verificaToken,(req,res)=>{
    var id = req.params.id;
    
    Tercero.findByIdAndRemove(id,(err,terceroBorrado)=>{
        if(err){
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar tercero',
                errors: err
            });
        }

        if(!terceroBorrado){
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un tercero con ese ID',
                errors: {message:'No existe un tercero con ese ID'}
            });
        }

        res.status(200).json({
            ok: true,
            tercero: terceroBorrado
        });    
    });

});

module.exports = app;
