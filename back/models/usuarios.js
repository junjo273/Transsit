const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const UsuarioSchema = Schema({
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
    password: {
        type: String,
        require: true
    },
    imagen: {
        type: String,
    },
    rol: {
        type: String,
        require: true,
        default: 'ROL_USUARIO'
    },


}, { collection: 'usuarios' });

UsuarioSchema.method('toJSON', function() {
    const { __v, _id, password, ...object } = this.toObject();

    object.uid = _id;
    return object;
})

module.exports = model('Usuario', UsuarioSchema);