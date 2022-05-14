//importation du schema de sauce et de file system
const Sauce = require('../models/sauces');
const fs = require('fs');
//creation et exportation du controllers pour ajouter une sauce (Post)
  exports.createSauce = (req, res, next) => {
    //on récupére les informations dans le champs de la requête
    const sauceObject = JSON.parse(req.body.sauce);
    //on retire id des information
    delete sauceObject._id;
    //on créer une nouvelle sauce à l'aide du schema en lui passant les information récupérer
    const sauce = new Sauce({
      ...sauceObject,
      //on modifie l'URL de l'image
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    //on sauvegarde la sauce dans la bandes de données
    sauce.save()
      .then(() => res.status(201).json({ message: 'Objet enregistré !'}))
      .catch(error => res.status(400).json({ error }));
  };

//creation et exportation du controllers pour récupérer toutes les sauces avec la méthode find
exports.getAllSauces = (req, res, next) => {
    Sauce.find().then(
      (sauces) => {
        res.status(200).json(sauces);
      }
    ).catch(
      (error) => {
        res.status(400).json({
          error: error
        });
      }
    );
  };
//création et exportation du controllers pour récupérer une sauce avec la méthode findOne
  exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({
      _id: req.params.id
    }).then(
      (sauce) => {
        res.status(200).json(sauce);
      }
    ).catch(
      (error) => {
        res.status(404).json({
          error: error
        });
      }
    );
  };
//création et exportation du controllers pour modifier une sauce avec la méthode updateOne
exports.modifySauce = (req, res, next) => {
  // Dans le cas où la requête contient un fichier, on cherche l'imageUrl de la sauce existante et on supprime l'ancien fichier du dossier images
  if (req.file) {
      Sauce.findOne({_id: req.params.id}, (e,sauce) => {
          if (e) {
              console.error("La recherche de l'imageUrl d'origine a échoué...");
          }
          else {
              const fileToDelete = sauce.imageUrl.split('/images/')[1];
              fs.unlink(`images/${fileToDelete}`, (e) => {
                  if (e) {console.error('Echec de la suppression de l\'ancien fichier');}
                  else {console.log('Ancienne image supprimée avec succès.');}
              })
          }
      })
  }
  const sauceObject = req.file ?
  // S'il y a une image dans la requête en remplacement de celle existante dans le BDD :
      {
          ...JSON.parse(req.body.sauce),
          imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
      } : 
  // S'il n'y a pas d'image dans la requête :
      {...req.body};
  
  Sauce.updateOne({_id: req.params.id, userId: req.auth.userId}, {...sauceObject, _id:req.params.id})
          .then(res.status(200).json({message: 'Sauce modifiée avec succès !'}))
          .catch(error => res.status(400).json({error}));
};



//creation et exportation du controllers pour supprimer une sauce
  exports.deleteSauce = (req, res, next) => {
    //on récupère la sauce concernée avec la méthode findOne
    Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      if (!sauce) {
        res.status(404).json({ error: new Error("Cette sauce n'existe pas !")});
      }
      // on compare Id de l'utilisateur de la sauce avec Id de l'utilisateur qui fait la requête
      if (sauce.userId !== req.auth.userId) {
        res.status(400).json({ error: new Error('Requête non autorisée !')});
      }
      return sauce;
    })
      .then(sauce => {
        //on récupére le nom du fichier
        const filename = sauce.imageUrl.split('/images/')[1];
        //on suprime le fichier et effectue le callback qui le supprime de la base de données
        fs.unlink(`images/${filename}`, () => {
          Sauce.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
            .catch(error => res.status(400).json({ error }));
        });
      })
      .catch(error => res.status(500).json({ error }));
  };
