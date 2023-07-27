const { response } = require('express');
const validator = require('validator');
const jwt = require('jsonwebtoken');

const Baneados = require('../models/baneados');


const obtenerbaneados = async(req, res = repsonse) => {

    const desde = Number(req.query.desde) || 0;
    const registropp = Number(process.env.DOCSPERPAGE);
    const id = req.query.id;

    const token = req.headers['x-token'];
  
    try {
      const {rol} = jwt.verify(token, process.env.JWTSECRET);
      if(rol!='ROL_ADMIN'){
        return res.status(400).json({
          ok: false,
          msg: 'ERROR DE AUTORIZACION',
        });
      }
        let ban, total;
        if (id) {
            [ban, total] = await Promise.all([
              Baneados.findById(id),
              Baneados.countDocuments()
            ]);
        } else {
            [ban, total] = await Promise.all([
              Baneados.find({})
            ]);
        }


        res.status(400).json({
            ok: true,
            msg: 'obtenerbaneados',
            ban,
            page: {
                desde,
                registropp,
                total
            }
        });

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error al obtener baneados'
        });
    }
}



const crearbaneado = async (req, res = response) => {

  const token = req.headers['x-token'];
  
  try {
      const {rol} = jwt.verify(token, process.env.JWTSECRET);
      if(rol!='ROL_ADMIN'){
        return res.status(400).json({
          ok: false,
          msg: 'ERROR DE AUTORIZACION',
        });
      }

    const nuevabaneado = new Baneados(req.body);
    await nuevabaneado.save();

    res.json({
      ok: true,
      msg: 'baneado creado',
      baneado: nuevabaneado,
    });
      
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      ok: false,
      msg: 'Error creando el baneo',
    });
  }
};





const actualizarbaneado = async (req, res = response) => {
  const { idUsuario, fechaComienzo } = req.body;
  const uid = req.params.id;
  const token = req.headers['x-token'];

  try {
      const { rol } = jwt.verify(token, process.env.JWTSECRET);
      if (rol !== 'ROL_ADMIN') {
          return res.status(400).json({
              ok: false,
              msg: 'ERROR DE AUTORIZACION',
          });
      }
      
      let baneadoexiste = await Baneados.findByIdAndUpdate(uid, req.body, { new: true });

      if (!baneadoexiste) {
          return res.status(400).json({
              ok: false,
              msg: 'El registro de baneado no existe'
          });
      }

      res.json({
          ok: true,
          msg: 'baneado actualizado',
          baneado: baneadoexiste 
      });

  } catch (error) {
      console.log(error);
      return res.status(400).json({
          ok: false,
          msg: 'Error actualizando baneado'
      });
  }
}




const borrarbaneado = async (req, res = response) => {
    const idbaneado = req.params.id;
    const token = req.headers['x-token'];
  
    try {
      const {rol} = jwt.verify(token, process.env.JWTSECRET);
      if(rol!='ROL_ADMIN'){
        return res.status(400).json({
          ok: false,
          msg: 'ERROR DE AUTORIZACION',
        });
      }

      const baneadoexiste = await Baneados.findById(idbaneado);
      if (!baneadoexiste) {
        return res.status(400).json({
          ok: true,
          msg: 'No existe el baneado buscado'
        });
      }

      const resultado = await Baneados.findByIdAndRemove(idbaneado);
      res.json({
        ok: true,
        msg: 'baneado eliminado',
        resultado: resultado
      });
    } catch (error) {
      console.log(error);
      return res.status(400).json({
        ok: false,
        msg: 'Error borrando baneado'
      });
    }
};


module.exports = { obtenerbaneados, crearbaneado, actualizarbaneado, borrarbaneado}