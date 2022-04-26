//importation d'express
const express = require('express');
//creation d'un router
const router = express.Router();
//importation des middleware et controllers nécessaires
const sauceCtrl = require('../controllers/sauce');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const likeCtrl = require('../controllers/like');
//création des routes
router.post('/',auth, multer, sauceCtrl.createSauce);
router.get('/', auth, sauceCtrl.getAllSauces);
router.get('/:id', auth, sauceCtrl.getOneSauce);
router.put('/:id', auth, multer, sauceCtrl.modifySauce);
router.delete('/:id', auth, sauceCtrl.deleteSauce);
router.post('/:id/like', auth, likeCtrl.likeSauce);
//exportation des routes
module.exports = router;