const mongoose = require('mongoose');
const { Schema } = mongoose; // Para crear el esquema de un dato
// const mongooseLeanVirtuals = require('mongoose-lean-virtuals');
const path = require('path');
const { ObjectId } = Schema; 
const User = require('./User.js');

const ImageSchema = new Schema({
	user_id: {type: ObjectId},
	title: {type: String},
	description: {type: String},
	filename: {type: String},
	views: {type: Number, default: 0},
	likes: {type: Number, default: 0},
	timestamp: {type: Date, default: Date.now}
});

// Quitar la extensión del filename cuando el usuario lo solicite
// Variable virtual que no se almacena en la base de datos
ImageSchema.virtual('uniqueId').get(function () {
	return this.filename.replace(path.extname(this.filename), '')
});

// ImageSchema.plugin(mongooseLeanVirtuals);

module.exports = mongoose.model('Image', ImageSchema); // El modelo Image toma el esquema creado