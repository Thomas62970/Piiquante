//importation d'express
const express = require('express');
//creation d'une application express
const app = express();
//importation de mongoose
const mongoose = require('mongoose');
//importation de path
const path = require('path');
//importation de cors
const cors = require('cors');
//importation deqs routes 
const userRoutes = require('./routes/users');
const sauceRoutes = require('./routes/sauce');
//utilisation de mongoose pour la connexion à MongoDB
mongoose.connect('mongodb+srv://Thomas:toto62970@cluster0.ego3j.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));
//permet de prendre toute les requétes de type application/json et permet d'acceder directement au body
app.use(express.json());
//appel de cors
app.use(cors());
//Permet à toutes les demande de toutes origine d'accéder à l'api
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    next();
  });
/*on attribue un middleware à chaque routes 
on utilise express static pour gerer la gestion des images*/
  app.use('/images', express.static(path.join(__dirname, 'images')));
  app.use('/api/auth', userRoutes);
  app.use('/api/sauces', sauceRoutes);


//exportation de fichier app
module.exports = app;