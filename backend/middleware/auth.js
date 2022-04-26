//importation de jsonwebtoken
const jwt = require('jsonwebtoken');
//export du middleware
module.exports = (req, res, next) => {
  try {
    /*récupération du token dans le headers authorization
    l'utilisation de split va supprimé l'espace et renvoyer un tableau
    [bearer, le token]*/
    const token = req.headers.authorization.split(' ')[1];
    //on décode le token en indiquant la clé secréte en deuxiéme argument
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    //on récupére l'id utilisateur du token
    const userId = decodedToken.userId;
    req.auth = { userId }
    //si l'id utilisateur de la requéte est différent du userId 
    if (req.body.userId && req.body.userId !== userId) {
      throw 'Invalid user ID';
    //si l'userId est identique alors on passe à la suite(suivant la route soit au middleware multer soit au controllers)
    } else {
      next();
    }
  } catch {
    res.status(401).json({
      error: new Error('Invalid request!')
    });
  }
};