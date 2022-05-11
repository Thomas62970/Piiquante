//importation de express
const express = require('express');
//creation d'un router
const router = express.Router();
//importation du fichier pour controller les infos utilisateur
const userCtrl = require('../controllers/users');
const password = require('../middleware/password');

//creation des routes pour les users
router.post('/signup',password, userCtrl.signup);
router.post('/login', userCtrl.login);
//exportation du fichier
module.exports = router;