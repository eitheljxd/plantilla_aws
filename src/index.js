const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const config = require('config');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');
const {
    routes: userRoutes,
} = require('./user/routes');

const swaggerOptions = {
    swaggerDefinition: {
      info: {
        title: "API WAR",
        version: '1.0.0',
      },
    },
    apis: ["./user/routes.js"],
  };

  const swaggerDocs = swaggerJsDoc(swaggerOptions);
 
  mongoose.connect("mongodb+srv://eithelj:canchia123@cluster0-dqd4k.azure.mongodb.net/test?authSource=admin&replicaSet=Cluster0-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true", {useNewUrlParser: true, useUnifiedTopology: true})
  .then(() => console.log('Conectado a MongoDB...'))
  .catch(err => console.log('No se pudo conectar con MongoDB..', err));

const app = express();




app.use(cors());
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs));
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use('/user', userRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log('Api RESTFul Ok, y ejecutándose...');
})

module.exports = app;

