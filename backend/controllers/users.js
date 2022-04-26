// importation de bcrypt, de jsonwebtoken et du schem users
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/users');
//on créer et exporte le middleware signup
exports.signup = (req, res, next) => {
  /*on récupére le password entré par l'utilisateur
    et on utilise bcrypt pour le hasher*/
    bcrypt.hash(req.body.password, 10)
      .then(hash => {
        //création d'un utilisateur à l'aide du schema
        const user = new User({
          email: req.body.email,
          password: hash
        });
        //on sauvegarde les données de l'utisateur dans la base de données
        user.save()
          .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
          .catch(error => res.status(400).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
  };
//on créer et exporte le middleware login
  exports.login = (req, res, next) => {
    //on récupére l'email de l'utilisateur 
    User.findOne({ email: req.body.email })
      .then(user => {
        //si l'email n'est pas dans la base de données on envoie une erreur
        if (!user) {
          return res.status(401).json({ error: 'Utilisateur non trouvé !' });
        }
        //si l'email est dans la base de données on compare le password à l'aide de bcrypt
        bcrypt.compare(req.body.password, user.password)
          .then(valid => {
            //si le password est incorect on envoie une erreur
            if (!valid) {
              return res.status(401).json({ error: 'Mot de passe incorrect !' });
            }
            //si les informations sont correct on attribue un token à l'utilisateur
            res.status(200).json({
              userId: user._id,
              //on utilise jsonwebtoken pour créer le token avec id de l'utilisateur la phrase secrète
              token: jwt.sign(
                { userId: user._id },
                'RANDOM_TOKEN_SECRET',
                //on indique le temps de validation du token créer
                { expiresIn: '24h' }
              )
            });
          })
          .catch(error => res.status(500).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
  };