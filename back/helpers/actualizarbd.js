const Usuario = require('../models/usuarios');
const fs = require('fs');
const { infoToken } = require('../helpers/infotoken');

const actualizarBD = async(tipo, path, nombreArchivo, id, token) => {

    const usuario = await Usuario.findById(id);
    if (!usuario) {
        return false;
    }

    if (infoToken(token).uid !== id) {
        return false;
    }

    const fotoVieja = usuario.imagen;
    const pathFotoVieja = `${path}/${fotoVieja}`;
    if (fotoVieja && fs.existsSync(pathFotoVieja)) {
        fs.unlinkSync(pathFotoVieja);
    }

    usuario.imagen = nombreArchivo;
    await usuario.save();

    return true;

}

module.exports = { actualizarBD }