const { Router } = require('express');
const { obtenervaloraciones, crearvaloracion, actualizarvaloracion, borrarvaloracion} = require('../controllers/valoraciones');
const { check } = require('express-validator');
const { validarCampos } = require('../middleware/validar-campos');
const { validarJWT } = require('../middleware/validar-jwt');

const router = Router();

router.get('/', [
    validarJWT,
], obtenervaloraciones);

router.post('/', [
    validarJWT,
    validarCampos,
], crearvaloracion);

router.put('/:id', [
    validarJWT,

    validarCampos,
], actualizarvaloracion);

router.delete('/:id', [
    validarJWT,
    check('id', 'El identificador no es válido').isMongoId(),
    validarCampos
], borrarvaloracion);


module.exports = router;