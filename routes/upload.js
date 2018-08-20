var express = require("express");
var fileUpload = require('express-fileupload');
var fs = require('fs');

var app = express();

var Tercero = require('../models/tercero');
var Usuario = require('../models/usuario');
var Proyecto = require('../models/proyecto');

// default options
app.use(fileUpload());

app.put('/:tipo/:id', (req,res,next) => {
    
    var tipo = req.params.tipo;
    var id = req.params.id;

    //Validamos las colecciones permitidas por la carpeta uploads:
    var tiposValidos = ['usuarios','proyectos','terceros'];

    if (tiposValidos.indexOf(tipo) < 0){
        return res.status(400).json({
            ok: false,
            mensaje: 'Tipo de coleccion no es válida.',
            errors: {messaje:"Los tipos válidos son: " + tiposValidos.join(', ')}
        });
    }
     
    // Validamos que seleccionara un archivo
    if (!req.files){
        return res.status(400).json({
            ok: false,
            mensaje: 'No subió ningun archivo.',
            errors: {messaje:"Debe seleccionar una imagen."}
        });
    }

    //Obtener nombre del archivo
    var archivo = req.files.imagen;
    var nombreCortado = archivo.name.split('.');
    var extensionArchivo = nombreCortado[nombreCortado.length - 1];

    //Solo aceptamos estas extenciones:
    var extencionesValidas = ['png','jpg','jpeg','gif'];

    if (extencionesValidas.indexOf(extensionArchivo) < 0){
        return res.status(400).json({
            ok: false,
            mensaje: 'Extensión de archivo no permitida.',
            errors: {messaje:"Las extensiones válidas son: " + extencionesValidas.join(', ')}
        });
    }

    //Nombre del archivo personalizado.
    ///ejemplo: 1111121144-123.png
    var nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extensionArchivo}`;

    //Mover el archivo del temporal a un path
    var path = `./uploads/${tipo}/${nombreArchivo}`;

    archivo.mv(path,err =>{
        if (err){
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al mover archivo.',
                errors: err
            });
        }

        subirPorTipo(tipo, id, nombreArchivo, res);
    });

});

function subirPorTipo(tipo, id, nombreArchivo, res){

    if (tipo==='terceros'){       
           Tercero.findById(id,(err,tercero)=>{
                if(err){
                    return res.status(400).json({
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

                var pathOld = './uploads/terceros/' + tercero.img;

                //si existe el archivo lo eliminamos
                if (fs.existsSync(pathOld)){
                    fs.unlink(pathOld);
                }
                
                tercero.img = nombreArchivo;
                tercero.save((err, terceroActualizado)=>{

                    if(err){
                        return res.status(400).json({
                            ok: false,
                            mensaje: 'Error al actualizar imagen de tercero',
                            errors: err
                        });
                    }

                   return  res.status(200).json({
                        ok: true,
                        mensaje: 'Imagen de tercero actualizada',
                        terceroActualizado: terceroActualizado
                    });
                })
           })
       
    };

    if (tipo==='usuarios'){       
        Usuario.findById(id,'nombre email img',(err,usuario)=>{
             if(err){
                 return res.status(400).json({
                     ok: false,
                     mensaje: 'Error al buscar usuario',
                     errors: err
                 });
             }

            if( !usuario ){           
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El usuario con el id: '+id+' no existe.',
                    errors: {message: 'No existe un usuario con ese ID.'}
                });
            }

             var pathOld = './uploads/usuarios/' + usuario.img;

             //si existe el archivo lo eliminamos
             if (fs.existsSync(pathOld)){
                 fs.unlink(pathOld);
             }
             
             usuario.img = nombreArchivo;
             usuario.save((err, usuarioActualizado)=>{

                 if(err){
                     return res.status(400).json({
                         ok: false,
                         mensaje: 'Error al actualizar imagen de usuario',
                         errors: err
                     });
                 }

                return  res.status(200).json({
                     ok: true,
                     mensaje: 'Imagen de usuario actualizada',
                     usuarioActualizado: usuarioActualizado
                 });
             })
        })
    
    };

    if (tipo==='proyectos'){       
        Proyecto.findById(id,(err,proyecto)=>{
             if(err){
                 return res.status(400).json({
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

             var pathOld = './uploads/proyectos/' + proyecto.img;

             //si existe el archivo lo eliminamos
             if (fs.existsSync(pathOld)){
                 fs.unlink(pathOld);
             }
             
             proyecto.img = nombreArchivo;
             proyecto.save((err, proyectoActualizado)=>{

                 if(err){
                     return res.status(400).json({
                         ok: false,
                         mensaje: 'Error al actualizar imagen de proyecto',
                         errors: err
                     });
                 }

                return  res.status(200).json({
                     ok: true,
                     mensaje: 'Imagen de proyecto actualizada',
                     proyectoActualizado: proyectoActualizado
                 });
             })
        })
    
    };
}

module.exports = app;

