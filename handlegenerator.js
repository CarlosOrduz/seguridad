let jwt = require( 'jsonwebtoken' );
let config = require( './config' );
const Mongolib = require("./mongodb/mongodblib");
const bcrypt = require('bcrypt');
// Clase encargada de la creación del token
class HandlerGenerator {

  login( req, res ) {
    
    // Extrae el usuario y la contraseña especificados en el cuerpo de la solicitud
    let username = req.body.username;
    let password = req.body.password;
    
    // Este usuario y contraseña, en un ambiente real, deben ser traidos de la BD

    
    // Si se especifico un usuario y contraseña, proceda con la validación
    // de lo contrario, un mensaje de error es retornado
    if( username && password ) {
   
        Mongolib.getDatabase(db=>{
            Mongolib.getUserByUsername(db,username,docs=>{
                
               let usuario=docs[0];
               console.log(usuario)
      // Si los usuarios y las contraseñas coinciden, proceda con la generación del token
      // de lo contrario, un mensaje de error es retornado
      if(typeof usuario !== "undefined" && username === usuario.username && bcrypt.compareSync(password, usuario.password) ) {
        
        // Se genera un nuevo token para el nombre de usuario el cuál expira en 24 horas
        let token = jwt.sign( { username: username },
          config.secret, { expiresIn: '24h' } );
        
        // Retorna el token el cuál debe ser usado durante las siguientes solicitudes
        res.json( {
            success: true,
            message: 'Authentication successful!',
            token: token
          });
  
      } else{
        res.status( 403 ).json( {
            success: false,
            message: 'Incorrect username or password'
          } );
      }
    })
})
    } else {

      // El error 400 corresponde a Bad Request de acuerdo al estándar HTTP
      res.status( 400 ).json( {
        success: false,
        message: 'Authentication failed! Please check the request'
      } );

    }

  }

  index( req, res ) {
    
    // Retorna una respuesta exitosa con previa validación del token
    res.json( {
      success: true,
      message: 'Index page'
    } );

  }
}

module.exports = HandlerGenerator;