const { Router } = require('express');
const { obtenerSolicitudes, crearSolicitud, actualizarSolicitud, borrarSolicitud, obtenerSolicitudesUsuario, actualizarSolicitudEstado } = require('../controllers/solicitudesviajes');
const { check } = require('express-validator');
const { validarCampos } = require('../middleware/validar-campos');
const { validarJWT } = require('../middleware/validar-jwt');

const router = Router();

router.get('/', [
    validarJWT,
], obtenerSolicitudes);

router.get('/:id', [
    validarJWT,
], obtenerSolicitudesUsuario);

router.post('/', [
    validarJWT,
    check('fecha', 'El argumento fecha es obligatorio').not().isEmpty(),
    check('salida', 'El argumento salida es obligatorio').not().isEmpty(),
    check('destino', 'El argumento destino es obligatorio').not().isEmpty(),
    check('pasajeros', 'El argumento pasajeros es obligatorio').optional().isNumeric(),
    validarCampos,
], crearSolicitud);

router.get('/actualizar/:estado/:id', [
    validarJWT,
], actualizarSolicitudEstado);

router.put('/:id', [
    validarJWT,
    check('id', 'El argumento id es obligatorio').isMongoId(),
    check('fecha', 'El argumento fecha es obligatorio').not().isEmpty(),
    check('salida', 'El argumento salida es obligatorio').not().isEmpty(),
    check('destino', 'El argumento destino es obligatorio').not().isEmpty(),
    check('pasajeros', 'El argumento pasajeros es obligatorio').optional().isNumeric(),
    validarCampos,
], actualizarSolicitud);

router.delete('/:id', [
    validarJWT,
    check('id', 'El identificador no es válido').isMongoId(),
    validarCampos
], borrarSolicitud);


module.exports = router;