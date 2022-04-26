//importation de mongoose
const mongoose = require('mongoose');
//importation de uniqueValidator
const uniqueValidator = require('mongoose-unique-validator');
//création d'un schema avec mongoose
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});
//utilisation de unique validator pour contrôler que l'email est bien unique
userSchema.plugin(uniqueValidator);
//exportation du schema
module.exports = mongoose.model('User', userSchema);