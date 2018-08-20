var mongoose =	require('mongoose');
var Schema =	mongoose.Schema;

var terceroSchema =	new Schema({
	nrodoc 			: { type: String, required: [true, 'Numero de identificación es necesario']	},
	nombre			: { type: String, required: [true, 'El nombre es necesario']	},
	img				: { type: String, required: false },
	regusuario		: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true },
	updusuario		: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true }
},{	collection: 'Terceros' });

module.exports =	mongoose.model('Tercero',	terceroSchema);