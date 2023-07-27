const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const baneadosSchema = Schema({
    nombre: {
        type: String,
        require: true
    },
    apellidos: {
        type: String,
        require: true
    },
    dni: {
        type: String,
        require: true,
    },
    telefono: {
        type: String,
        require: true,
    },
    email: {
        type: String,
        require: true,
        unique: true
    },


}, { collection: 'Baneados' });

baneadosSchema.method('toJSON', function() {
    const { __v, _id, password, ...object } = this.toObject();

    object.uid = _id;
    return object;
})

module.exports = model('Baneados', baneadosSchema);