var mongoose = require("mongoose");
var mongooseValidator = require("mongoose-unique-validator");

var Schema = mongoose.Schema;

var rolesValidos = {
    values:["ADMIN_ROLE","USER_ROLE"],
    message:'{VALUE} no es un rol valido.'
};

var usuarioSchema = new Schema({
    nombre      : { type: String, required: [true,'Nombre de usuario requerido']},
    email       : { type: String, unique: true, required: [true,'Email de usuario requerido']},
    password    : { type: String, required: [true,'Contraseña de usuario requerida']},
    img         : { type: String, required: false},
    role        : { type: String, required: true, default: 'USER_ROLE', enum: rolesValidos}
});

usuarioSchema.plugin(mongooseValidator,{message:"{PATH} debe ser unico"});

module.exports = mongoose.model('Usuario',usuarioSchema);
