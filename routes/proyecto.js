var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var mdAutenticacion = require('../middlewares/autenticacion');

var app = express();

var Proyecto = require('../models/proyecto');

//=================================
//Obtener todos los proyectos
//=================================

app.get('/', (req,res,next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Proyecto.find({},'nombre descripcion img tareas usuario')
    .skip(desde)
    .limit(2) 
    .populate('regusuario','nombre email')
    .populate('updusuario','nombre email')
    .exec( 
        (err, proyectos)=>{
            if(err){
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error cargando proyectos',
                    errors: err
                });
            }

            // Respuesta con paginación
            Proyecto.count({},(err,conteo)=>{
                res.status(200).json({
                    ok: true,
                    proyectos: proyectos,
                    total: conteo
                });
            });
        }
    );
    
});

//=================================
//Crear un nuevo proyecto
//=================================
app.post('/', mdAutenticacion.verificaToken, (req,res) => {
    var body = req.body;

    var proyecto = new Proyecto({
        nombre      : body.nombre,
        descripcion : body.descripcion,        
        img         : body.img,
        tareas      : body.tareas,        
        regusuario  : req.usuario,
        updusuario  : req.usuario
    });

    proyecto.save((err,proyectoGuardado)=>{
        if(err){
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear proyecto',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            proyecto: proyectoGuardado,
            usuariotoken: req.usuario
        });
    });  
});

//=================================
//Actualizar proyecto
//=================================
app.put('/:id',mdAutenticacion.verificaToken,(req,res)=>{
    var id = req.params.id;
    var body = req.body;

    //busco el proyecto por el id ;)
    Proyecto.findById(id,'nombre descripcion img usuario',(err, proyecto)=>{
        if(err){
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar proyecto',
                errors: err
            });
        }

        if( !proyecto ){           
            return res.status(400).json({
                ok: false,
                mensaje: 'El proyecto con el id: '+id+' no existe.',
                errors: {message: 'No existe un proyecto con ese ID.'}
            });
        }

        proyecto.nombre         = body.nombre;
        proyecto.descripcion    = body.descripcion;
        proyecto.img            = body.img;
        proyecto.tareas         = body.tareas;
        proyecto.updusuario     = req.usuario;

        proyecto.save((err,proyectoGuardado)=>{
            if(err){
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar proyecto',
                    errors: err
                });
            }
    
            res.status(200).json({
                ok: true,
                proyecto: proyectoGuardado
            });    
        });  
    });
});

//=================================
//Borrar un proyecto por ID
//=================================
app.delete('/:id',mdAutenticacion.verificaToken,(req,res)=>{
    var id = req.params.id;
    
    Proyecto.findByIdAndRemove(id,(err,proyectoBorrado)=>{
        if(err){
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar proyecto',
                errors: err
            });
        }

        if(!proyectoBorrado){
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un usuario con ese ID',
                errors: {message:'No existe un proyecto con ese ID'}
            });
        }

        res.status(200).json({
            ok: true,
            proyecto: proyectoBorrado
        });    
    });

});

module.exports = app;
