const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
    nombre: {
        type:String,
        required: true, 
        unique:true
    },
    fechaNacimiento: {
        type:String,
        required:true
    },
    altura: {
        type:String,
        required: true
    }
});

module.exports = mongoose.model('Usuario', usuarioSchema);

