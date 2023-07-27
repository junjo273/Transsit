const { response } = require('express');
const validator = require('validator');
const Solicitudviaje = require('../models/solicitudesviajes');
const Viaje = require('../models/viajes');
const jwt = require('jsonwebtoken');
const cron = require('node-cron');
const moment = require('moment');


const eliminarViajesPasados = async () => {
  console.log('Ejecutando tarea programada de actualización de estados de viajes pasados...');

  try {
    // Obtener la fecha actual
    const fechaActual = moment();

    const estadosModificar = ['VACIO', 'BUSCANDO', 'LISTO'];

    const viajesAVencer = await Viaje.find({
      fechaComienzo: { $lt: fechaActual.toDate() },
      estado: { $in: estadosModificar },
    });

    if (viajesAVencer.length > 0) {
      await Promise.all(
        viajesAVencer.map(async (viaje) => {
          const nuevoEstado = viaje.estado === 'LISTO' ? 'FINALIZADO' : 'CANCELADO';
          await Viaje.findByIdAndUpdate(viaje._id, { estado: nuevoEstado });
          console.log(`Estado del viaje con ID ${viaje._id} actualizado a "${nuevoEstado}".`);
        })
      );
    } else {
      console.log('No hay viajes pasados para actualizar o todos los viajes en estado "VACIO", "BUSCANDO" o "LISTO" ya están "FINALIZADOS" o "CANCELADOS".');
    }
  } catch (error) {
    console.error('Error al actualizar estados de viajes pasados:', error);
  }
};
// eliminarViajesPasados(); //30 segundos Para probar su funcionamiento
// cron.schedule('*/30 * * * * *', () => {
//   eliminarViajesPasados();
// });

//30 minutos
cron.schedule('*/30 * * * *', () => {  
  eliminarViajesPasados();
});


const obtenerViaje = async (req, res = repsonse) => {
  const id = req.params.id;
  const token = req.headers['x-token'];
  try {
    const { uid, rol } = jwt.verify(token, process.env.JWTSECRET);
    let solicitudes, total;
      [solicitudes, total] = await Promise.all([
        Viaje.findById(id)
    ]);
    
    if(rol!= "ROL_ADMIN"){
      if(solicitudes[0]){
        var dentro = false;
        for (usu of solicitudes[0].usuarios){
          if (usu.id == uid){
            dentro=true;
          }
        }
        if(!dentro){
          return res.status(400).json({
            ok: false,
            msg: 'no tienes permiso para acceder a este viaje',
          });
        }

      }
    }
    res.json({
      ok: true,
      msg: 'obtenerViaje',
      solicitudes,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      ok: false,
      msg: 'Error al obtener el viaje',
    });
  }
};




const obtenerViajesUsuario = async (req, res = response) => {
  const desde = Number(req.query.desde) || 0;
  const registropp = Number(process.env.DOCSPERPAGE);
  const idUsuario = req.params.id;
  const token = req.headers['x-token'];
  try {
    const { uid, rol } = jwt.verify(token, process.env.JWTSECRET);
    if (uid !=idUsuario) {
      if (rol!= "ROL_ADMIN"){
        return res.status(401).json({
          ok: false,
          msg: 'No tienes permiso para realizar esta accion'
        });
      }
      
    }

    [solicitudes, total] = await Promise.all([
      Viaje.find({}).skip(desde).limit(registropp),
      Viaje.countDocuments()
    ]);

        const solicitudesUsuario = [];
        for (let i = 0; i < solicitudes.length; i++) {
          const usuarios = solicitudes[i].usuarios;
          for (let j = 0; j < usuarios.length; j++) {
            if (usuarios[j].id === idUsuario) {
              solicitudesUsuario.push(solicitudes[i]);
              break;
            }
          }
        }
    res.json({
      ok: true,
      msg: 'Obtener viajes de usuario',
      solicitudesUsuario,
      page: {
        desde,
        registropp,
        total,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      ok: false,
      msg: 'Error al obtener viajes de usuario',
    });
  }
};



const obtenerViajes = async(req, res = repsonse) => {
    
    const desde = Number(req.query.desde) || 0;
    const registropp = Number(process.env.DOCSPERPAGE);
    const token = req.headers['x-token'];
    
    try {
      const {rol} = jwt.verify(token, process.env.JWTSECRET);

            if(rol!='ROL_ADMIN'){
              return res.status(400).json({
                ok: false,
                msg: 'ERROR DE AUTORIZACION',
              });
            }
            let solicitudes, total;
            [solicitudes, total] = await Promise.all([
                Viaje.find({}).skip(desde).limit(registropp),
                Viaje.countDocuments()
            ]);

        res.json({
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




const crearViaje = async(req, res = response) => {

    const { idUsuario, fechaComienzo } = req.body;
    const token = req.headers['x-token'];
    
    try {
            const {rol} = jwt.verify(token, process.env.JWTSECRET);

            if(rol!='ROL_ADMIN'){
              return res.status(400).json({
                ok: false,
                msg: 'ERROR DE AUTORIZACION',
              });
            }

        //COMPROBAR QUE EL USUARIO NO REALIZE DOS SOLICITDES PARA EL MISMO MOMENTO
        const ViajeExistente = await Viaje.findOne({ idUsuario, fechaComienzo });

        if (ViajeExistente) {

            return res.status(400).json({
                ok: false,
                msg: 'Ya tienes un viaje en esa fecha'
            });
            
            
        }
    
        const Viaje = new Viaje(req.body);
        await Viaje.save();

        res.json({
            ok: true,
            msg: 'Solicitud de viaje creado',
            curso,
        });

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error creando la Solicitud de viaje'
        });
    }
}




const actualizarViaje = async (req, res = response) => {
  const { idUsuario, fechaComienzo } = req.body;
  const uid = req.params.id;
  const token = req.headers['x-token'];
    
  try {
          const {rol} = jwt.verify(token, process.env.JWTSECRET);

          if(rol!='ROL_ADMIN'){
            return res.status(400).json({
              ok: false,
              msg: 'ERROR DE AUTORIZACION',
            });
          }
      const Viajeexiste = await Viaje.findById(uid);

      if (!Viajeexiste) {
          return res.status(400).json({
              ok: false,
              msg: 'El viaje no existe'
          });
      }

      //COMPROBAR QUE EL USUARIO NO REALIZE DOS SOLICITUDES PARA EL MISMO MOMENTO
      const ViajeExistente = await Viaje.findOne({ idUsuario, fechaComienzo });

      if (ViajeExistente && ViajeExistente._id.toString() !== uid) {
          return res.status(400).json({
              ok: false,
              msg: 'Ya tienes un viaje en esa fecha'
          });
      }

      const updatedViaje = await Viaje.findByIdAndUpdate(uid, req.body, { new: true });

      res.json({
          ok: true,
          msg: 'Viaje actualizado',
          viaje: updatedViaje 
      });

  } catch (error) {
      console.log(error);
      return res.status(400).json({
          ok: false,
          msg: 'Error actualizando el Viaje'
      });
  }
}





const borrarViaje = async(req, res = response) => {

    const uid = req.params.id;

    const token = req.headers['x-token'];
    
    try {
            const {rol} = jwt.verify(token, process.env.JWTSECRET);

            if(rol!='ROL_ADMIN'){
              return res.status(400).json({
                ok: false,
                msg: 'ERROR DE AUTORIZACION',
              });
            }
        const Solicitudexiste = await Viaje.findById(uid);
        if (!Solicitudexiste) {
            return res.status(400).json({
                ok: true,
                msg: 'No existe la solicitud buscada'
            });
        }
        const resultado = await Viaje.findByIdAndRemove(uid);

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
}













const confirmarViaje = async(req, res = response) => {
  const idViaje = req.params.id;
  const estado = req.params.estado;
  const token = req.headers['x-token'];


  try {
    const {uid} = jwt.verify(token, process.env.JWTSECRET);
    const idUsuario = uid;

    const viaje = await Viaje.findById(idViaje);
    if (viaje){
      var confirmados = 0;
      for (const usuario of viaje.usuarios){
        if (usuario.id == idUsuario){
          if(estado=='CONFIRMADO'){
            confirmados++;
          }
          usuario.estado = estado;
        }else{
          if (usuario.estado == 'CONFIRMADO'){
            confirmados++;
          }
        }
      }

      var viajelisto = false;
      if (confirmados>0 && confirmados == viaje.usuarios.length){
        viaje.estado="LISTO";
        viajelisto = true;
      }else{
        viaje.estado="BUSCANDO";
      }

      await viaje.save();
      res.json({
        ok: true,
        msg: 'Usuario confirmado',
        listo: viajelisto,
      });
    }

  } catch (error) {
    console.log(error);
    return res.status(400).json({
      ok: false,
      msg: 'Error confirmando viaje'
    });
  }
  


}







  
async function actualizarSolicitudesDentroViaje (solicitudId, estado){
  const solicitud = await Solicitudviaje.findById(solicitudId);
  if (solicitud){
    solicitud.estado = estado;
    await solicitud.save();
  }
}






async function borrardesdeSol(sol, idUsuario){
    const viaje = await Viaje.find({'usuarios.solicitud': sol});
    if (!viaje) {
      return;
    }

    viaje[0].usuarios = viaje[0].usuarios.filter(usuario => usuario.id !== idUsuario);
    viaje[0].huecos = actualizarpasajeros(viaje[0].usuarios);


    if(viaje[0].usuarios.length == 1){
      //ACTUALIZAR EL ESTADO DE LA SOLICITUD DEL PARTICIPANTE RESTANTE
      viaje[0].estado = "VACIO";
      viaje[0].usuarios[0].estado="ESPERA";
      actualizarSolicitudesDentroViaje(viaje[0].usuarios[0].solicitud, "BUSCANDO")
    }else{
      if (viaje[0].usuarios.length > 1){
        for (const usu of viaje[0].usuarios){
          usu.estado="ESPERA";
        }
      }
    }

    if(viaje[0].usuarios.length<=0){
      const res = await Viaje.findByIdAndRemove(viaje[0]._id);
      return;

    }else{
      await viaje[0].save();
      return;
    }
}


const borrarUsuario = async (req, res = response) => {
  const { idUsuario, uid, conservar } = req.body;
  
  const token = req.headers['x-token'];
  try {
    const { id, rol } = jwt.verify(token, process.env.JWTSECRET);
    if (id !=idUsuario) {
      if (rol!= "ROL_ADMIN"){
        return res.status(401).json({
          ok: false,
          msg: 'No tienes permiso para obtener este viaje'
        });
      }
      
    }
    const viajeExiste = await Viaje.findById(uid);

    if (!viajeExiste) {
      return res.status(400).json({
        ok: false,
        msg: 'El viaje no existe'
      });
    }

    // Filtrar y eliminar el usuario del array de usuarios
    viajeExiste.usuarios = viajeExiste.usuarios.filter(usuario => usuario.id !== idUsuario);
    viajeExiste.huecos = actualizarpasajeros(viajeExiste.usuarios);

    if(viajeExiste.usuarios.length == 1){
      //ACTUALIZAR EL ESTADO DE LA SOLICITUD DEL PARTICIPANTE RESTANTE
      viajeExiste.estado = "VACIO"
      actualizarSolicitudesDentroViaje(viajeExiste.usuarios[0].solicitud, "BUSCANDO")
    }

    if(viajeExiste.usuarios.length<=0){
      const res = await Viaje.findByIdAndRemove(uid);
      res.json({
        ok: true,
        msg: 'Viaje eliminado',
      });

    }else{ 
      await viajeExiste.save();

      res.json({
        ok: true,
        msg: 'Usuario eliminado del viaje',
        viaje: viajeExiste
      });

    }


  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: 'Error eliminando el usuario del viaje'
    });
  }
};









async function obtenerSolicitudes() {
  const [solicitudes] = await Promise.all([
    Viaje.find({})
  ]);
  return solicitudes;
}



async function comprobar(req, res) {
  const {solicitud, idUsuario,nombre,email} = req.body;
  const token = req.headers['x-token'];


  const viajes  = await obtenerSolicitudes();

  function estaDentroDelMargen(fechaViaje_str, fechaSolicitud_str) {
    const fechaViaje = new Date(fechaViaje_str);
    const fechaSolicitud = new Date(fechaSolicitud_str);
    const diferenciaMilisegundos = fechaSolicitud - fechaViaje;
    const margenMilisegundos = 2 * 60 * 60 * 1000; // 2 HORAS DE MARGEN ARRIBA ABAJO
    return Math.abs(diferenciaMilisegundos) <= margenMilisegundos;
  }

  function haversineDistance(lat1, lon1, lat2, lon2) {
    const R = 6371000.0; // Radio de la Tierra en metros
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
  }
  
  function toRadians(degrees) {
    return degrees * (Math.PI / 180);
  }
  
  function filterTripsByDistance(trips, request) {
    const result = [];
    const maxDistance = 10* 1000; //5km
    for (const trip of trips) {
      if(trip.estado!= "LISTO" && trip.estado!= "FINALIZADO")
        if(trip.huecos - solicitud.pasajeros >=0){
          if (trip.fechaComienzo && estaDentroDelMargen(trip.fechaComienzo, request.fecha)) {

            const distanceFromOrigin = haversineDistance(trip.lat_salida, trip.long_salida, request.lat_salida, request.long_salida);
            const distanceFromDestination = haversineDistance(trip.lat_destino, trip.long_destino, request.lat_destino, request.long_destino);
            
            if (distanceFromOrigin < maxDistance && distanceFromDestination < maxDistance) {
              for (const tripusuario of trip.usuarios){

                if (tripusuario.id == idUsuario){
                }else {
                  result.push(trip);
                }

              }
            }
          }
        }
    }
  
    return result;
  }

  function findClosestTrip(trips, request) {
    let minDistance = Infinity;
    let closestTrip = null;
  
    for (const trip of trips) {
      const distanceFromOrigin = haversineDistance(trip.lat_salida, trip.long_salida, request.lat_salida, request.long_salida);
      const distanceFromDestination = haversineDistance(trip.lat_destino, trip.long_destino, request.lat_destino, request.long_destino);
      const totalDistance = distanceFromOrigin + distanceFromDestination;
  
      if (totalDistance < minDistance) {
        minDistance = totalDistance;
        closestTrip = trip;
      }
    }
  
    return closestTrip;
  }
  const nuevoUsuarioData = {
    id: idUsuario,
    estado: "ESPERA",
    nombre: nombre,
    email: email,
    solicitud: solicitud.uid,
    lat_destino: solicitud.lat_destino,
    long_destino: solicitud.long_destino,
    lat_salida: solicitud.lat_salida,
    long_salida: solicitud.long_salida,
    pasajeros: solicitud.pasajeros,
  }


  try {

      const { uid, rol } = jwt.verify(token, process.env.JWTSECRET);
      if (uid !=idUsuario) {
        if (rol!= "ROL_ADMIN"){
          return res.status(401).json({
            ok: false,
            msg: 'No tienes permiso para obtener este viaje'
          });
        }
        
      }



      var boolnuevoviaje = true;
      if(viajes.length >0){
        const viajesFiltrados = filterTripsByDistance(viajes, solicitud);
        
        if(viajesFiltrados.length>0){
          const viajeMasCercano = findClosestTrip(viajesFiltrados, solicitud);
          boolnuevoviaje = false;
          console.log("añadir a viaje")
          const resultado = await nuevoUsuario(viajeMasCercano._id, nuevoUsuarioData);


          if (resultado=="USUARIO AÑADIDO"){
            res.json({
              ok: true,
              msg: 'Nuevo usuario añadido a viaje',
              agregado: true,

            });
          }else{
            return res.status(400).json({
              ok: false,
              msg: resultado,
            });
          }

        }
      }


      if(boolnuevoviaje){
        console.log("nuevo viaje");

        const nuevoViajeData = {
          usuarios: [nuevoUsuarioData] ,
          estado: "VACIO",
          fechaComienzo: solicitud.fecha,
          destino: solicitud.destino,
          lat_destino: solicitud.lat_destino,
          long_destino: solicitud.long_destino,
          lat_salida: solicitud.lat_salida,
          long_salida: solicitud.long_salida,
          huecos: 5-solicitud.pasajeros,
        }

        const resultado = await crearViajeConUsuario(nuevoViajeData);

        if (resultado=="VIAJE CREADO Y USUARIO AÑADIDO"){
          res.json({
            ok: true,
            msg: resultado,
            agregado: false,
          });
        }else{
          return res.status(400).json({
            ok: false,
            msg: resultado,
          });
        }
      }



  }catch ( error ){
    return res.status(400).json({
      ok: false,
      msg: 'Error creando Viaje'
    });
  }
  
}





function actualizarpasajeros(usuarios){
  let total = 5;
  for (const usuario of usuarios){
    total = total - usuario.pasajeros;
  }
  return total;
}



async function nuevoUsuario(uid, nuevoUsuarioData) {
  try {
    const viajeExiste = await Viaje.findById(uid);

    if (!viajeExiste) {
      return "VIAJE NO EXISTE";
    }

    // Verificar si el usuario ya existe en el viaje por su id, para evitar duplicados
    const usuarioExistente = viajeExiste.usuarios.find(usuario => usuario.id === nuevoUsuarioData.id);
    if (usuarioExistente) {
      return "USUARIO CON UN VIAJE DEMASIADO SIMILAR"; 
    }

    
    //ACTUALIZAR SOLICITUD DEL USUARIO ANTERIOR
    if(viajeExiste.usuarios.length == 1){
      actualizarSolicitudesDentroViaje(viajeExiste.usuarios[0].solicitud, "EN GRUPO")
    }

    // Añadir el nuevo usuario al array de usuarios
    viajeExiste.usuarios.push(nuevoUsuarioData);
    viajeExiste.huecos = viajeExiste.huecos - nuevoUsuarioData.pasajeros;
    viajeExiste.estado = "BUSCANDO"

    // Guardar el cambio en la base de datos
    await viajeExiste.save();

    return "USUARIO AÑADIDO";
  } catch (error) {
    console.log(error);
    return "Error añadiendo usuario"; 
  }
}


async function crearViajeConUsuario(nuevoViajeData) {
  try {
    // Crear el nuevo viaje con los datos proporcionados
    const nuevoViaje = new Viaje(nuevoViajeData);
    // Guardar el nuevo viaje en la base de datos
    await nuevoViaje.save();

    return "VIAJE CREADO Y USUARIO AÑADIDO";
  } catch (error) {
    console.log(error);
    return "Error creando Viaje"; 
  }
}










module.exports = { obtenerViajes, crearViaje, actualizarViaje, borrarViaje, obtenerViaje,obtenerViajesUsuario, borrarUsuario, comprobar, borrardesdeSol, confirmarViaje }