const { Comment, Image, User } = require('../models');

module.exports = {
	async newest(){
		const comments = await Comment.find().limit(5).sort({date: -1});

		for (const comment of comments){
			// Obtenemos la imagen y el nombre del autor del comentario a partir de virtual
			const image = await Image.findOne({_id: comment.image_id});
			const author = await User.findOne({_id: comment.user_id});
			comment.image = image;
			comment.author = author;
		}

		return comments;
	}
};
