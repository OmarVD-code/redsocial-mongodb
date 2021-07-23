const mongoose = require('mongoose');
const { Schema } = mongoose;
// const mongooseLeanVirtuals = require('mongoose-lean-virtuals');
const path = require('path');

const ImageSchema = new Schema({
	title: {type: String},
	description: {type: String},
	filename: {type: String},
	views: {type: Number, default: 0},
	likes: {type: Number, default: 0},
	timestamp: {type: Date, default: Date.now}
});

// Quitar la extensión del filename cuando el usuario lo solicite
ImageSchema.virtual('uniqueId').get(function () {
	return this.filename.replace(path.extname(this.filename), '')
});

// ImageSchema.plugin(mongooseLeanVirtuals);

module.exports = mongoose.model('Image', ImageSchema);