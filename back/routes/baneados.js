const { Router } = require('express');
const { obtenerbaneados, crearbaneado, actualizarbaneado, borrarbaneado} = require('../controllers/baneados');
const { check } = require('express-validator');
const { validarCampos } = require('../middleware/validar-campos');
const { validarJWT } = require('../middleware/validar-jwt');

const router = Router();

router.get('/', [
    validarJWT,
], obtenerbaneados);

router.post('/', [
    validarJWT,
    validarCampos,
], crearbaneado);

router.put('/:id', [
    validarJWT,
    check('id', 'El identificador no es válido').isMongoId(),
    validarCampos,
], actualizarbaneado);

router.delete('/:id', [
    validarJWT,
    check('id', 'El identificador no es válido').isMongoId(),
    validarCampos
], borrarbaneado);


module.exports = router;