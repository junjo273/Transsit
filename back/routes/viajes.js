const { Router } = require('express');
const { obtenerViajes, crearViaje, actualizarViaje, borrarViaje, obtenerViaje, borrarUsuario,obtenerViajesUsuario, comprobar, confirmarViaje } = require('../controllers/viajes');
const { check, query } = require('express-validator');
const { validarCampos } = require('../middleware/validar-campos');
const { validarJWT } = require('../middleware/validar-jwt');

const router = Router();

router.get('/', [
    validarJWT,
], obtenerViajes);

router.get('/:id', [
    validarJWT,
    query('id', 'El id de usuario debe ser válido').isMongoId(),
], obtenerViajesUsuario);

router.get('/datos/:id', [
    validarJWT,
    query('id', 'El id de usuario debe ser válido').isMongoId(),
], obtenerViaje);

router.post('/', [
    validarJWT,
    check('usuarios.*.id', 'El id de usuario es obligatorio').isMongoId(),
    check('usuarios.*.solicitud', 'El id de solicitud de viaje es obligatorio').isMongoId(),
    check('fecha', 'El argumento fecha es obligatorio').not().isEmpty(),
    check('salida', 'El argumento email es obligatorio').not().isEmpty(),
    check('huecos', 'El argumento password es obligatorio').not().isEmpty(),
    validarCampos,
], crearViaje);


router.get('/confirmarviaje/:estado/:id', [
    validarJWT,
    query('id', 'El id de usuario debe ser válido').isMongoId(),
], confirmarViaje);


router.put('/:id', [
    validarJWT,
    check('usuarios.*.id', 'El id de usuario es obligatorio').isMongoId(),
    check('usuarios.*.solicitud', 'El id de solicitud de viaje es obligatorio').isMongoId(),
    check('fecha', 'El argumento fecha es obligatorio').not().isEmpty(),
    check('salida', 'El argumento email es obligatorio').not().isEmpty(),
    check('huecos', 'El argumento password es obligatorio').not().isEmpty(),
    validarCampos,
], actualizarViaje);

router.delete('/:id', [
    validarJWT,
    check('id', 'El identificador no es válido').isMongoId(),
    validarCampos
], borrarViaje);

router.post('/borrarUsuario/', [
    validarJWT,
    check('uid', 'El identificador no es válido').isMongoId(),
    validarCampos
], borrarUsuario);

router.post('/google/google/', [
],validarJWT, (req, res) => {
  comprobar(req, res);
});


module.exports = router;