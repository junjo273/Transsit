/*
Ruta base: /api/usuarios
*/

const { Router } = require('express');
const { obtenerUsuarios, crearUsuario, actualizarUsuario, borrarUsuario, cambiardatos,cambiarpassword,obtenerUsuariosViaje} = require('../controllers/usuarios');
const { check, query } = require('express-validator');
const { validarCampos } = require('../middleware/validar-campos');
const { validarRol } = require('../middleware/validar-rol');
const { validarJWT } = require('../middleware/validar-jwt');

const router = Router();

router.get('/', [
    validarJWT,
    query('id', 'El id de usuario debe ser válido').optional().isMongoId(),
], obtenerUsuarios);

router.get('/usuariosviaje/:id/:idviaje', [
    validarJWT,
], obtenerUsuariosViaje);

router.post('/', [
    check('nombre', 'El argumento nombre es obligatorio').not().isEmpty(),
    check('apellidos', 'El argumento apellidos es obligatorio').not().isEmpty(),
    check('telefono', 'El argumento apellidos es obligatorio').not().isEmpty(),
    check('dni', 'El argumento email es obligatorio').not().isEmpty(),
    check('email', 'El argumento email es obligatorio').not().isEmpty(),
    check('password', 'El argumento password es obligatorio').not().isEmpty(),
    validarCampos,
], crearUsuario);

router.put('/:id', [
    validarJWT,
    check('nombre', 'El argumento nombre es obligatorio').not().isEmpty(),
    check('apellidos', 'El argumento apellidos es obligatorio').not().isEmpty(),
    check('email', 'El argumento email es obligatorio').not().isEmpty(),
    validarCampos,
], actualizarUsuario);

router.delete('/:id', [
    validarJWT,
    check('id', 'El identificador no es válido').isMongoId(),
    validarCampos
], borrarUsuario);

router.put('/cambiardatos/usuario', [
    validarJWT,
], cambiardatos);

router.put('/cambiarpassword/usuario', [
    validarJWT,
], cambiarpassword);







module.exports = router;