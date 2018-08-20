var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var SEED             = require('../config/config').SEED;
var TIME_TOKEN   = require('../config/config').TIME_TOKEN;
var app = express();

var Usuario = require('../models/usuario');

//===================
// GOOGLE
//===================
var CLIENT_ID = require('../config/config').CLIENT_ID;

const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(CLIENT_ID);

///*********************
//Autenticacion google
///*********************
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    //const userid = payload['sub']; // comentariamos para hacer nuestro propio return
    // If request specified a G Suite domain:
    //const domain = payload['hd'];

    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
}

app.post('/google', async(req,res)=>{

    var token = req.body.token;

    var googleUser = await verify(token)
        .catch(e=>{
            res.status(403).json({
                ok  : false,
                mensaje: 'Token no válido.'
            });  
        })

    //Lo verificamos para guardarlo en la base de datos
    Usuario.findOne({'email':googleUser.email},(err, usuarioDB)=>{
        if(err){
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: err
            });
        }

        if (usuarioDB){
            if (usuarioDB.google === false){
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Debe utilizar su autenticación normal.'
                });
            }else{
                //Crear un token
                var token = jwt.sign({usuario:usuarioDB},SEED,{expiresIn: TIME_TOKEN});

                res.status(200).json({
                    ok      : true,
                    usuario : usuarioDB,
                    token   : token,
                    id      : usuarioDB._id
                });  
            }
        }else{
            // El usuario no existe y debe crearse.
            var usuario = new Usuario();

            usuario.nombre  = googleUser.nombre;
            usuario.email   = googleUser.email;
            usuario.img     = googleUser.img;
            usuario.google  = true;
            usuario.password='***'

            usuario.save((err, usuarioDB)=>{
                if(err){
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'Error al crear usuario',
                        errors: err
                    });
                }
                 //Crear un token
                 var token = jwt.sign({usuario:usuarioDB},SEED,{expiresIn: TIME_TOKEN});

                 res.status(200).json({
                     ok      : true,
                     usuario : usuarioDB,
                     token   : token,
                     id      : usuarioDB._id
                 });  
            });

        }
    })    
});


///*********************
//Autenticacion normal
///*********************
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
        var token = jwt.sign({usuario:usuarioDB},SEED,{expiresIn: TIME_TOKEN});


        res.status(200).json({
            ok      : true,
            usuario : usuarioDB,
            token   : token,
            id      : usuarioDB._id
         });  
    });

});


module.exports = app;