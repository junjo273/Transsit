const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const ValoracionSchema = Schema({

    idValorado: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Usuario',
        require: true,
    },
    idUsuario: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Usuario',
        require: true,
    },
    idViaje: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Usuario',
        require: true,
    },
    valoracion: {
        type: Number,
        require: true,
    }, 
    comentario: {
        type:String,
    },




}, { collection: 'Valoraciones' })

ValoracionSchema.method('toJSON', function() {
    const { __v, _id, ...object } = this.toObject();

    object.uid = _id;
    return object;
})


module.exports = model('Valoraciones', ValoracionSchema);
