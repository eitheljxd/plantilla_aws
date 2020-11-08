const express = require('express');
const routes = express.Router({
    mergeParams: true
});
const Usuario = require('../models/usuario');

const fetch = require('node-fetch');




/**
 * @swagger
 * /user/{_id}:
 *   post:
 *     tags:
 *       - Usuario
 *     description: Inserta nuevos usuarios a la base de datos según ID de la API origen
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: _id
 *         description: ID del API (https://swapi.py4e.com/api/people/1)
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Creado
 *       500:
 *         description: Server Error
 *       400:
 *         description: Bad Request - Usuario existente
 */
routes.post('/:id', (req, res) => {

    let body = req.params.id;

    fetch('https://swapi.py4e.com/api/people/'+body+'/')
        .then(res => res.json())
        .then(json => {

    //Validar si el usuario ya existe
    Usuario.findOne({nombre: json.name}, (err, user) => {
        if(err){
            return res.status(400).json({err});
        }
        if(user){
           //Usuario si existe
           return res.status(400).json({
                msj:'El usuario ya existe'
            });
        }
       
    }).catch(err => {
         res.status(500).json({
            err
        });
      });
   

    //Lógica de negocio
    let resultado = crearUsuario(json);

        resultado.then( user => {
            res.json({user})
        }).catch( err => {

            res.status(400).json({
                err
            })
        });
    
    });
      
});

/**
 * @swagger
 * /user:
 *   get:
 *     tags:
 *       - Usuario
 *     description: Retorna todos los usuarios
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Arreglo de usuarios
 *       500:
 *         description: Server Error
 */
routes.get('/', (req, res) => {
    let resultado = listarUsuarios();
    resultado.then(usuarios => {
        res.json(usuarios)
    }).catch(err => {
        res.status(400).json(
            {
                err
            }
        )
    })
});

/**
 * @swagger
 * /user:
 *   delete:
 *     tags:
 *       - Usuario
 *     description: Elimina un usuario por Object ID
 *     produces:
 *       - application/json
 *     responses:
 *       204:
 *         description: successful operation
 *       500:
 *         description: Server Error
 *       404:
 *         description: Resources not found
 */
routes.delete('/:id', (req, res)  =>  {
    let body = req.params.id;
    Usuario.findOne({_id: body}, (err, user) => {
        if(err){
            return res.status(400).json({err});
        }
        if(!user){
           return res.status(400).json({
                msj:'El usuario no existe'
            });
        }
        if(user){
            Usuario.findByIdAndDelete(body)
                .exec().then(doc => {
                    if(!doc){return res.status(404).end();}
                    return res.status(204).json({
                        msj:"El registro fue eliminado correctamente"
                    }).end();
                }).catch(err => next(err));

        }
       
    }).catch(err => {
         res.status(500).json({
            err
        });
      });


    
});


/**
 * @swagger
 * /user/{_id}:
 *   get:
 *     tags:
 *       - Usuario
 *     description: Retorna un usuario por ID
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: _id
 *         description: Object ID del usuario/persona
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: successful operation
 *       500:
 *         description: Server Error
 */
routes.get('/:id', (req, res) => {
    let id = req.params.id;

    let resultado = listarUsuarioPorId(id);
    resultado.then(usuarios => {
        res.json(usuarios)
    }).catch(err => {
        res.status(400).json(
            {
                err
            }
        )
    })
});


async function crearUsuario(json){
    let usuario = new Usuario({
        nombre       : json.name,
        fechaNacimiento : json.birth_year,
        altura    :  json.height
    });
    return await usuario.save();
}
async function listarUsuarios(){
    let usuarios = await Usuario.find();
    return usuarios;
}
async function listarUsuarioPorId(id){
    let usuarios = await Usuario.find({
        _id : id
    });
    return usuarios;
}

module.exports = {
    routes,
};