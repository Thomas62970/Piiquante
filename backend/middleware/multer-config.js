//importation de multer
const multer = require('multer');
//création d'un dictionnaire pour les extension 
const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};
//on configure multer avec la méthode diskstorage
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'images');
  },
  filename: (req, file, callback) => {
    //on supprime les espace avec split et avec join on les remplace par '_'
    const name = file.originalname.split(' ').join('_');
    //on récupére l'extension de l'image et la remplace a l'aide du dictionnaire
    const extension = MIME_TYPES[file.mimetype];
    //on créer le nouveau nom du fichier en ajoutant un time-stamp pour le rendre le plus unique possible
    callback(null, name + Date.now() + '.' + extension);
  }
});
//exportation du middleware
module.exports = multer({storage: storage}).single('image');