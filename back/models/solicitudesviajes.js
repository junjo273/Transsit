const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const SolicitudviajeSchema = Schema({

    idUsuario: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Usuario',
    },
    fecha: {
        type: Date,
        require: true,
    }, 
    estado: {
        type:String,
        default: 'BUSCANDO',
        require: true,
    },
    destino: {
        type:String,
        require: true,
    },
    lat_destino: {
        type:Number,
        require: true,
    },
    long_destino: {
        type:Number,
        require: true,
    },
    salida: {
        type:String,
        require: true,
    },
    lat_salida: {
        type:Number,
        require: true,
    },
    long_salida: {
        type:Number,
        require: true,
    },
    pasajeros: {
        type:Number,
        require: true,
        default: 1,
    },



}, { collection: 'SolicitudViaje' })

SolicitudviajeSchema.method('toJSON', function() {
    const { __v, _id, ...object } = this.toObject();

    object.uid = _id;
    return object;
})


module.exports = model('Solicitudviaje', SolicitudviajeSchema);
