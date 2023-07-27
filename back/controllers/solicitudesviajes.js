const { response } = require('express');
const validator = require('validator');
const jwt = require('jsonwebtoken');

const Solicitudviaje = require('../models/solicitudesviajes');
const { borrardesdeSol } = require('./viajes');
const cron = require('node-cron');
const moment = require('moment');

const obtenerSolicitudes = async(req, res = repsonse) => {

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
        
        let solicitudes, total;
        if (id) {
            [solicitudes, total] = await Promise.all([
                Solicitudviaje.findById(id),
                Solicitudviaje.countDocuments()
            ]);
        } else {
            [solicitudes, total] = await Promise.all([
                Solicitudviaje.find({}).skip(desde).limit(registropp),
                Solicitudviaje.countDocuments()
            ]);
        }


        res.status(400).json({
            ok: true,
            msg: 'obtenerSolicitudes',
            solicitudes,
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
            msg: 'Error al obtener solicitudes'
        });
    }
}



  function estaDentroDelMargen(fechaViaje_str, fechaSolicitud_str) {
    const fechaViaje = fechaViaje_str;
    const fechaSolicitud = new Date(fechaSolicitud_str);
    const diferenciaMilisegundos = fechaSolicitud - fechaViaje;
    const margenMilisegundos = 1 * 60 * 60 * 1000; // 2 HORAS DE MARGEN ARRIBA ABAJO
    return Math.abs(diferenciaMilisegundos) <= margenMilisegundos;
  }



const crearSolicitud = async(req, res = response) => {

    const { idUsuario, fecha, nombre, email } = req.body
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
        if (idUsuario) {
          let solicitudes;
          [solicitudes] = await Promise.all([
              Solicitudviaje.find({idUsuario: idUsuario}),
          ]);

          if (solicitudes!= null){
            if (solicitudes.length>0){
              for (const sol of solicitudes){
                if(estaDentroDelMargen(sol.fecha, fecha)){
                  return res.status(400).json({
                    ok: false,
                    msg: 'Tienes una solicitud de viaje para esa misma hora'
                });
                }
              }
            }
          }
          
          const solicitudviaje = new Solicitudviaje(req.body);
          await solicitudviaje.save();

          res.json({
              ok: true,
              msg: 'Solicitud de viaje creado',
              solicitud: solicitudviaje,

          });



        }
        

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error creando la Solicitud de viaje'
        });
    }
}




const actualizarSolicitud = async (req, res = response) => {
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

      let Solicitudexiste = await Solicitudviaje.findByIdAndUpdate(uid, req.body, { new: true });

      if (!Solicitudexiste) {
          return res.status(400).json({
              ok: false,
              msg: 'La solicitud de viaje no existe'
          });
      }


      res.json({
          ok: true,
          msg: 'Solicitud de viaje actualizada',
          solicitudviaje: Solicitudexiste 
      });

  } catch (error) {
      console.log(error);
      return res.status(400).json({
          ok: false,
          msg: 'Error actualizando la Solicitud de viaje'
      });
  }
}




const borrarSolicitud = async (req, res = response) => {
    const idsolicitud = req.params.id;
    const token = req.headers['x-token'];
  
    try {
      const { uid, rol } = jwt.verify(token, process.env.JWTSECRET);

      const Solicitudexiste = await Solicitudviaje.findById(idsolicitud);
      if (!Solicitudexiste) {
        return res.status(400).json({
          ok: true,
          msg: 'No existe la solicitud buscada'
        });
      }
  
      // Comprobar si el uid es igual al idUsuario de la solicitud
      if (uid != Solicitudexiste.idUsuario) {
        if (rol!= "ROL_ADMIN"){
          return res.status(401).json({
            ok: false,
            msg: 'No tienes permiso para eliminar esta solicitud'
          });
        }
        
      }

      await borrardesdeSol(idsolicitud, uid);

      const resultado = await Solicitudviaje.findByIdAndRemove(idsolicitud);

      res.json({
        ok: true,
        msg: 'Solicitud de viaje eliminado',
        resultado: resultado
      });
    } catch (error) {
      console.log(error);
      return res.status(400).json({
        ok: false,
        msg: 'Error borrando Solicitud de viaje'
      });
    }
};
  



const obtenerSolicitudesUsuario = async (req, res = response) => {
    const idUsuario = req.params.id;
    const token = req.headers['x-token'];
    try {
      const { uid, rol } = jwt.verify(token, process.env.JWTSECRET);
      if (uid !=idUsuario) {
        if (rol!= "ROL_ADMIN"){
          return res.status(401).json({
            ok: false,
            msg: 'No tienes permiso para obtener esta solicitud'
          });
        }
        
      }
  
      [solicitudes, total] = await Promise.all([
        Solicitudviaje.find({}),
        Solicitudviaje.countDocuments()
      ]);

      const solicitudesUsuario = [];
      for (let i = 0; i < solicitudes.length; i++) {
        if (solicitudes[i].idUsuario == idUsuario) {
          solicitudesUsuario.push(solicitudes[i]);
        }
      }



      res.json({
        ok: true,
        msg: 'Obtener solicitudes de viaje del usuario',
        solicitudesUsuario,
      });
    } catch (error) {
      console.log(error);
      return res.status(400).json({
        ok: false,
        msg: 'Error al obtener viajes de usuario',
      });
    }
  };



  

  const actualizarSolicitudEstado = async (req, res = response) => {
    const solicitudId = req.params.id;
    const estado = req.params.estado;
    const token = req.headers['x-token'];
    const { uid } = jwt.verify(token, process.env.JWTSECRET);
  
    try {
      const solicitud = await Solicitudviaje.findById(solicitudId);
  
      if (!solicitud) {
        return res.status(404).json({
          ok: false,
          msg: 'Solicitud not found',
        });
      }

      solicitud.estado = estado;
      if (solicitud.idUsuario == uid){
        await solicitud.save();
  
        res.json({
          ok: true,
          msg: 'Estado de la solicitud actualizado correctamente',
          solicitud,
        });
      }else{
        return res.status(400).json({
          ok: false,
          msg: 'NO TIENES PERMISO PARA MODIFICAR ESTA SOLICITUD',
        });

      }

    } catch (error) {
      console.log(error);
      return res.status(500).json({
        ok: false,
        msg: 'Error al actualizar el estado de la solicitud',
      });
    }
  };
  



  const borrarEntradasAnteriores = async () => {
    console.log('Ejecutando tarea programada de borrado de entradas anteriores a la fecha actual...');
  
    try {
      const fechaActual = moment();
      await Solicitudviaje.deleteMany({
        fecha: { $lt: fechaActual.toDate() },
      });
  
      console.log('Todas las entradas anteriores a la fecha actual han sido eliminadas.');
    } catch (error) {
      console.error('Error al eliminar entradas anteriores:', error);
    }
  };
  
  // cron.schedule('*/30 * * * * *', () => {
  //   borrarEntradasAnteriores();
  // });
  cron.schedule('*/30 * * * *', () => {
    borrarEntradasAnteriores();
  });


module.exports = { obtenerSolicitudes, crearSolicitud, actualizarSolicitud, borrarSolicitud, obtenerSolicitudesUsuario, actualizarSolicitudEstado }