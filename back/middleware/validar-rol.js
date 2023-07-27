const { resonse } = require('express');
const rolesPermitidos = ['ROL_USUARIO', 'ROL_ADMIN'];

const validarRol = (req, res = repsonse, next) => {

    const rol = req.body.rolToken;

    if (rol && !rolesPermitidos.includes(rol)) {
        return res.status(400).json({
            ok: false,
            msg: 'Rol no permitido'
        });
    }
    next();
}

module.exports = { validarRol }