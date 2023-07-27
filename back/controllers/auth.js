const { response } = require('express');
const bcrypt = require('bcryptjs');

const Usuario = require('../models/usuarios');
const Baneados = require('../models/baneados');
const { generarJWT } = require('../helpers/jwt');
const jwt = require('jsonwebtoken');

const token = async(req, res = response) => {

    const token = req.headers['x-token'];

    try {
        const { uid, rol, ...object } = jwt.verify(token, process.env.JWTSECRET);

        const usuarioBD = await Usuario.findById(uid);
        if (!usuarioBD) {
            return res.status(400).json({
                ok: false,
                msg: 'Token no válido',
                token: ''
            });
        }
        const nuevorol = usuarioBD.rol;
        const nuevoToken = await generarJWT(uid, rol);

        res.json({
            ok: true,
            msg: 'Token',
            uid: uid,
            rol: nuevorol,
            token: nuevoToken
        });
    } catch {
        return res.status(400).json({
            ok: false,
            msg: 'Token no válido',
            token: ''
        });
    }
}

const login = async(req, res = response) => {

    const { email, password } = req.body;
    try {

        const usuarioBD = await Usuario.findOne({ email });
        if (!usuarioBD) {
            return res.status(400).json({
                ok: false,
                msg: 'Usuario o contraseña incorrectos',
                token: ''
            });
        }
        const Banneado = await Baneados.findOne({ email: email });
        if (Banneado) {
          console.log('Has sido vetado de esta plataforma');
          return res.status(400).json({
              ok: false,
              msg: 'Has sido vetado de esta plataforma'
          });
        }

        const validPassword = bcrypt.compareSync(password, usuarioBD.password);
        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'Usuario o contraseña incorrectos',
                token: ''
            });
        }

        const { _id, rol, nombre } = usuarioBD;
        const token = await generarJWT(usuarioBD._id, usuarioBD.rol);

        res.json({
            ok: true,
            msg: 'login',
            uid: usuarioBD._id,
            rol,
            nombre: usuarioBD.nombre,
            email: usuarioBD.email,
            token
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error en login',
            token: ''
        });
    }

}

module.exports = { login, token }