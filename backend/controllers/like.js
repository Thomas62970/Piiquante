//importation du schéme de sauce
const Sauce = require('../models/sauces');

//création et exportation du middleware pour le like ou le dislike
exports.likeSauce = (req, res, next) => {
    //on récupére le status du like l'Id de la sauce concerné et l'utilisateur qui donne son avis
    const likeStatus = req.body.like;
    const sauceId = req.params.id;
    const userId = req.body.userId;
    //utilisation de switch qui nous permet d'utilisé un code spécifique à chaque condition
    switch(likeStatus) {
        //si l'utilisateur like 
        case 1:
            //on selctionne la sauce concernée grace a son Id
            Sauce.updateOne({ _id: sauceId}, { 
                //on ajoute 1 dans le tableau à likes
                $inc: { likes: +1 }, 
                //on ajoute l'Id de l'utilisateur dans le tableau 
                $push: { usersLiked: req.body.userId }
            })
            .then(() => res.status(201).json({ message: 'Ajout du like !'}))
            .catch(error => res.status(400).json({ error }));
            //on utilise break à chaque fin de condition pour indiquer qu'il peut sortir du switch
            break;
            //si l'utilisateur dislike 
        case -1:
            //on selctionne la sauce concernée grace a son Id
            Sauce.updateOne({ _id: sauceId}, {
                //on ajoute 1 dans le tableau à dislikes
                $inc: { dislikes: +1 },
                //on ajoute l'Id de l'utilisateur dans le tableau 
                $push: { usersDisliked: req.body.userId }
            })
            .then(() => res.status(201).json({ message: "Ajout d'un dislike ! "}))
            .catch(error => res.status(400).json({ error }));
            break;
        case 0:
            //si l'utilisateur retire son like ou son dislike on récupére la sauce concernée grace a son Id
            Sauce.findOne({ _id: sauceId })
            .then(sauce => {
                //on contrôle que l'Id de l'utilisateur est dans le tableau 
                if(sauce.usersLiked.includes(userId)){
                    //si l'utilisateur est bien dans le tableau on supprime son like et son Id du tableau
                    Sauce.updateOne({ _id: sauceId},
                        {
                            $inc: { likes: -1 },
                            $pull: { usersLiked: userId}
                        })
                    .then(() => res.status(201).json({ message: "Suppression du like !"}))
                    .catch((error) => res.status(400).json({ error }));
                    //on contrôle que l'Id de l'utilisateur est dans le tableau 
                } else if(sauce.usersDisliked.includes(userId)) {
                    //si l'utilisateur est bien dans le tableau on supprime son dislike et son Id du tableau
                    Sauce.updateOne({_id: sauceId},
                        {
                            $inc: { dislikes: -1},
                            $pull: { usersDisliked: userId}
                        })
                    .then(() => res.status(201).json({ message: "Suppression du dislike ! "}))
                    .catch((error) => res.status(400).json({ error }));
                } else {
                    res.status(403).json({ message: "requête impossible !"})
                }
            })
            .catch(() => res.status(404).json({ message: "Sauce introuvable !"}));
            break;
    }
};