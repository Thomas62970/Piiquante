const passwordValid = require('password-validator');

//création du schema
const passwordSchema = new passwordValid();
//ajout des propriétés du schema
passwordSchema
.is().min(8) // min 8 caractéres
.is().max(30) // max 30 caractéres
.has().digits(1) // 1chiffre min
.has().not().spaces() //aucun espace

module.exports = (req, res, next) => {
    if(passwordSchema.validate(req.body.password)){
        next();
    } else {
        return res.status(400).json({ error })
    }
}