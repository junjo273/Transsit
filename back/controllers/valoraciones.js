const { response } = require('express');
const validator = require('validator');
const jwt = require('jsonwebtoken');

const Valoraciones = require('../models/valoraciones');


const obtenervaloraciones = async(req, res = repsonse) => {

    const desde = Number(req.query.desde) || 0;
    const registropp = Number(process.env.DOCSPERPAGE);
    const id = req.query.id;
    const token = req.headers['x-token'];

    try {
        const { rol } = jwt.verify(token, process.env.JWTSECRET);
        if (rol !== 'ROL_ADMIN') {
            return res.status(400).json({
                ok: false,
                msg: 'ERROR DE AUTORIZACION',
            });
        }
        let valoraciones, total;
        if (id) {
            [valoraciones, total] = await Promise.all([
                Valoraciones.findById(id),
                Valoraciones.countDocuments()
            ]);
        } else {
            [valoraciones, total] = await Promise.all([
                Valoraciones.find({}).skip(desde).limit(registropp),
                Valoraciones.countDocuments()
            ]);
        }


        res.status(400).json({
            ok: true,
            msg: 'obtenervaloraciones',
            valoraciones,
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
            msg: 'Error al obtener valoraciones'
        });
    }
}



const crearvaloracion = async (req, res = response) => {
  const { idUsuario, idValorado, idViaje, valoracion, descripcion, ...object } = req.body;
  const token = req.headers['x-token'];
  try {
    const { uid } = jwt.verify(token, process.env.JWTSECRET);
    // Comprobar si el uid es igual al idUsuario de la solicitud
    if (uid != idUsuario) {
      return res.status(401).json({
        ok: false,
        msg: 'No tienes permiso para eliminar esta solicitud'
      });
    }

    if (idUsuario && idValorado && idViaje) {
      const valoracionEncontrada = await Valoraciones.findOne({
        idUsuario: idUsuario,
        idValorado: idValorado,
        idViaje: idViaje,
      });

      if (valoracionEncontrada) {
        //ACTUALIZA SI YA EXISTE
        valoracionEncontrada.descripcion = descripcion;
        valoracionEncontrada.valoracion = valoracion;
        await valoracionEncontrada.save();

        res.json({
          ok: true,
          msg: 'valoracion de viaje creada',
          valoracion: valoracionEncontrada,
        });
      } else {
        const nuevaValoracion = new Valoraciones(req.body);
        await nuevaValoracion.save();

        res.json({
          ok: true,
          msg: 'valoracion de viaje creada',
          valoracion: nuevaValoracion,
        });
      }
    }else{
      return res.status(400).json({
        ok: false,
        msg: 'Error creando la valoracion de viaje',
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      ok: false,
      msg: 'Error creando la valoracion de viaje',
    });
  }
};





const actualizarvaloracion = async (req, res = response) => {
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
      let valoracionexiste = await Valoraciones.findByIdAndUpdate(uid, req.body, { new: true });

      if (!valoracionexiste) {
          return res.status(400).json({
              ok: false,
              msg: 'La valoración de viaje no existe'
          });
      }

      res.json({
          ok: true,
          msg: 'Valoración de viaje actualizada',
          valoracion: valoracionexiste
      });

  } catch (error) {
      console.log(error);
      return res.status(400).json({
          ok: false,
          msg: 'Error actualizando la valoración de viaje'
      });
  }
}





const borrarvaloracion = async (req, res = response) => {
    const idvaloracion = req.params.id;
    const token = req.headers['x-token'];

    try {
        const { rol } = jwt.verify(token, process.env.JWTSECRET);
        if (rol !== 'ROL_ADMIN') {
            return res.status(400).json({
                ok: false,
                msg: 'ERROR DE AUTORIZACION',
            });
        }

      const valoracionexiste = await Valoraciones.findById(idvaloracion);
      if (!valoracionexiste) {
        return res.status(400).json({
          ok: true,
          msg: 'No existe la valoracion buscada'
        });
      }

      const resultado = await Valoraciones.findByIdAndRemove(idvaloracion);
      res.json({
        ok: true,
        msg: 'valoracion de viaje eliminado',
        resultado: resultado
      });
    } catch (error) {
      console.log(error);
      return res.status(400).json({
        ok: false,
        msg: 'Error borrando valoracion de viaje'
      });
    }
};


module.exports = { obtenervaloraciones, crearvaloracion, actualizarvaloracion, borrarvaloracion}