
const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const ViajeSchema = Schema({
    //id usuarios //estado: espera/confirma/ rechaza(se guarda para no volver a meterlo)

    usuarios: [{
        id:{ 
        type: String, 
        //ref: 'Usuario',
        require: true,
        },
        nombre:{
            type:String,
            require: true,
        },
        email:{
            type:String,
            require: true,
        },
        estado:{
            type:String,
            default: 'VACIO',
            require: true,
        },
        solicitud:{
            type: String,
            //ref: 'Solicitudviaje',
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
        },

    }],

    fechaComienzo: {
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
    lat_salida: {
        type:Number,
        require: true,
    },
    long_salida: {
        type:Number,
        require: true,
    },
    huecos: {
        type:Number,
        require: true,
        default: 5,
    },
    



}, { collection: 'Viajes' })

ViajeSchema.method('toJSON', function() {
    const { __v, _id, ...object } = this.toObject();

    object.uid = _id;
    return object;
})


module.exports = model('Viaje', ViajeSchema);
