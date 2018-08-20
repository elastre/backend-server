var mongoose =	require('mongoose');
var Schema =	mongoose.Schema;

var proyectoSchema =	new Schema({
	nombre		: {	type: String, required: [true,	'El	nombre del proyecto es requerido.']	},
	descripcion	: {	type: String, required: false	},
	img			: {	type: String, required: false 	},
	tareas		: { type: String, required:false	},
	regusuario	: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true },
	updusuario	: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true }
}, { collection: 'Proyectos' });

module.exports =	mongoose.model('Proyecto',	proyectoSchema);
