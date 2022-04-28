const { Schema, model } = require('mongoose');
const { ObjectId } = Schema;

const CommentSchema = new Schema({
	image_id: {type: ObjectId},
	user_id: {type: ObjectId},
	comment: {type: String},
	date: {type: Date, default: Date.now}
});

CommentSchema.virtual('image')
	.set(function(image) {
		this._image = image;
	})
	.get(function() {
		return this._image;
	});

CommentSchema.virtual('author')
	.set(function(author) {
		this._author = author;
	})
	.get(function() {
		return this._author;
	});

module.exports = model('Comment', CommentSchema);
