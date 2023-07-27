const { response } = require('express');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const Usuario = require('../models/usuarios');
const Baneados = require('../models/baneados');
const Viajes = require('../models/viajes');
const { generarJWT } = require('../helpers/jwt');
const jwt = require('jsonwebtoken');


const obtenerUsuarios = async(req, res) => {
    const desde = Number(req.query.desde) || 0;
    const registropp = Number(process.env.DOCSPERPAGE);


    const id = req.query.id;

    const token = req.headers['x-token'];
    try {
      const {uid,rol} = jwt.verify(token, process.env.JWTSECRET);
      if(id!=uid){
        if (rol!= "ROL_ADMIN"){
          return res.status(401).json({
            ok: false,
            msg: 'No tienes permiso para obtener este usuario'
          });
        }
      }
        
        

        let usuarios, total;
        if (id) {
            if (!validator.isMongoId(id)) {
                return res.json({
                    ok: false,
                    msg: 'El id de usuario debe ser válido'
                });
            }

            [usuarios, total] = await Promise.all([
                Usuario.findById(id),
                Usuario.countDocuments()
            ]);

        } else {
            [usuarios, total] = await Promise.all([
                Usuario.find({}).skip(desde).limit(registropp).populate('grupo'),
                Usuario.countDocuments()
            ]);
        }

        res.json({
            ok: true,
            msg: 'getUsuarios',
            usuarios,
            page: {
                desde,
                registropp,
                total
            }
        });

    } catch (error) {
        console.log(error);
        res.json({
            ok: false,
            msg: 'Error obteniedo usuarios'
        });
    }
}



const obtenerUsuariosViaje = async (req, res) => {
  const desde = Number(req.query.desde) || 0;
  const registropp = Number(process.env.DOCSPERPAGE);
  const id = req.params.id;
  const idviaje = req.params.idviaje;
  const token = req.headers['x-token'];
  try {
      const { uid } = jwt.verify(token, process.env.JWTSECRET);
      
        if (idviaje) {
          
          if (!validator.isMongoId(idviaje)) {
              return res.json({
                  ok: false,
                  msg: 'El idviaje debe ser válido'
              });
          }
          
          const viaje = await Viajes.findById(idviaje);
          if (!viaje) {
              return res.status(401).json({
                  ok: false,
                  msg: 'No se encontró ningún viaje con el idviaje proporcionado'
              });
          }

          let userFound = false;
          for (const user of viaje.usuarios) {
              if (user.id === uid) {
                  userFound = true;
                  break;
              }
          }
          if (!userFound) {
            return res.status(401).json({
                ok: false,
                msg: 'No tienes permiso para obtener este usuario'
            });
          }

          usuarios = await Usuario.findById(id);
          total = 1; // El resultado es un único usuario

            res.json({
              ok: true,
              msg: 'getUsuarios',
              usuarios,
              page: {
                  desde,
                  registropp,
                  total
              }
          });
    }

  } catch (error) {
      console.log(error);
      res.json({
          ok: false,
          msg: 'Error obteniendo usuarios'
      });
  }
}








const crearUsuario = async(req, res = response) => {
    const { email, password, rol } = req.body;

    try {

        const exiteEmail = await Usuario.findOne({ email: email });
        
        if (exiteEmail) {
            console.log('Email ya existe');
            return res.status(400).json({
                ok: false,
                msg: 'Email ya existe'
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

        const salt = bcrypt.genSaltSync();
        const cpassword = bcrypt.hashSync(password, salt);

        const usuario = new Usuario(req.body);
        usuario.email = usuario.email.toLowerCase();
        usuario.password = cpassword;

        // Almacenar en BD
        await usuario.save();

        const nuevoTokentoken = await generarJWT(usuario._id, usuario.rol);

        res.json({
            ok: true,
            msg: 'crearUsuarios',
            usuario: usuario,
            token: nuevoTokentoken,
            uid: usuario._id,
            nombre: usuario.nombre,
            rol: usuario.rol,
        });

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error creando usuario'
        });
    }
}


const actualizarUsuario = async(req, res = response) => {

    const { password, email, grupo, ...object } = req.body;
    const id = req.params.id;

    const token = req.headers['x-token'];
    try {
      const {uid,rol} = jwt.verify(token, process.env.JWTSECRET);
        if(uid!=id){
            if (rol!= "ROL_ADMIN"){
                return res.status(401).json({
                  ok: false,
                  msg: 'No tienes permiso para obtener este usuario'
                });
            }
        }
        


        const existeEmail = await Usuario.findOne({ email: email });

        if (existeEmail) {
            if (existeEmail._id != id) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Email ya existe'
                });
            }
        }
        object.email = email;
        const usuario = await Usuario.findByIdAndUpdate(id, object, { new: true });

        res.json({
            ok: true,
            msg: 'Usuario actualizado',
            usuario: usuario
        });

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error actualizando usuario'
        });
    }

}

const borrarUsuario = async(req, res = response) => {
    const uid = req.params.id;

    const token = req.headers['x-token'];
    try {
      const {rol} = jwt.verify(token, process.env.JWTSECRET);
        if (rol!= "ROL_ADMIN"){
          return res.status(401).json({
            ok: false,
            msg: 'No tienes permiso para obtener este usuario'
          });
        }
        const existeUsuario = await Usuario.findById(uid);
        if (!existeUsuario) {
            return res.status(400).json({
                ok: true,
                msg: 'El usuario no existe'
            });
        }
        const resultado = await Usuario.findByIdAndRemove(uid);

        res.json({
            ok: true,
            msg: 'Usuario eliminado',
            resultado: resultado
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: true,
            msg: 'Error borrando usuario'
        });
    }
}






const cambiardatos = async (req, res = response) => {
    // Obtener la información del usuario autenticado
    const token = req.headers['x-token'];
    const { uid } = jwt.verify(token, process.env.JWTSECRET);

  
    const {...object } = req.body;

  
    try {
      // Verificar si el usuario existe en la base de datos
      const usuario = await Usuario.findById(uid);
  
      if (!usuario) {
        return res.status(400).json({
          ok: false,
          msg: 'Usuario no encontrado',
        });
      }
      
      
      // Actualizar solo los campos proporcionados en req.body
      Object.keys(object).forEach((key) => {
        usuario[key] = object[key];
      });
  
      // Guardar los cambios en la base de datos
      const usuarioActualizado = await usuario.save();
  
      res.json({
        ok: true,
        msg: 'Usuario actualizado',
        usuario: usuarioActualizado,
      });
    } catch (error) {
      console.log(error);
      return res.status(400).json({
        ok: false,
        msg: 'Error actualizando usuario',
      });
    }
  };


  const cambiarpassword = async (req, res = response) => {
    // Obtener la información del usuario autenticado
    const token = req.headers['x-token'];
    const { uid } = jwt.verify(token, process.env.JWTSECRET);
  
    const { antigua, nueva, ...object } = req.body;
  
    try {
      // Verificar si el usuario existe en la base de datos
      const usuario = await Usuario.findById(uid);
  
      if (!usuario) {
        return res.status(400).json({
          ok: false,
          msg: 'Usuario no encontrado',
        });
      }
  
      // Verificar si la contraseña actual proporcionada es correcta
      const contrasenaCorrecta = bcrypt.compareSync(antigua, usuario.password);
  
      if (!contrasenaCorrecta) {
        return res.status(400).json({
          ok: false,
          msg: 'La contraseña actual es incorrecta',
        });
      }
  
      // Encriptar la nueva contraseña antes de guardarla en la base de datos
      const salt = bcrypt.genSaltSync();
      const nuevaEncriptada = bcrypt.hashSync(nueva, salt);
  
      // Actualizar la contraseña en la base de datos
      usuario.password = nuevaEncriptada;
  
      // Guardar los cambios en la base de datos
      const usuarioActualizado = await usuario.save();
  
      res.json({
        ok: true,
        msg: 'Contraseña actualizada',
        usuario: usuarioActualizado,
      });
    } catch (error) {
      console.log(error);
      return res.status(400).json({
        ok: false,
        msg: 'Error actualizando contraseña',
      });
    }
  };
  








module.exports = { obtenerUsuarios, crearUsuario, actualizarUsuario, borrarUsuario, cambiardatos, cambiarpassword, obtenerUsuariosViaje}