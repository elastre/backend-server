var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var app = express();

var Usuario = require('../models/usuario');

app.post('/',(req,res)=>{
    var body = req.body;

    Usuario.findOne({email:body.email},(err,usuarioDB)=>{

        if(err){
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: err
            });
        }

        if(!usuarioDB){
            return res.status(400).json({
                ok: false,
                mensaje: 'credenciales incorrectas -email',
                errors: err
            });
        }
       
        if(!bcrypt.compareSync(body.password, usuarioDB.password)){
            return res.status(400).json({
                ok: false,
                mensaje: 'credenciales incorrectas -pass',
                errors: err
            });
        }

        usuarioDB.password = '/*/***/';

        //Crear un token
        var token = jwt.sign({usuario:usuarioDB},'@SEED@TRAZABLE',{expiresIn: 14400});


        res.status(200).json({
            ok      : true,
            usuario : usuarioDB,
            token   : token,
            id      : usuarioDB._id
         });  
    });

});


module.exports = app;