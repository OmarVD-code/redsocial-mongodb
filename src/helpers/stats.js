const { Image, Comment } = require('../models'); 

async function imageCounter(){
	return await Image.countDocuments();
}

async function commentsCounter(){
	return await Comment.countDocuments();
}

async function imageTotalViewsCounter(){
	const result = await Image.aggregate([{
		$group: {
			_id: 1,
			viewsTotal: {$sum: '$views'}
		}
	}]);

	return result[0].viewsTotal;
	// return 0;
}

async function imageTotalLikesCounter(){
	const result = await Image.aggregate([{
		$group: {
			_id: 1,
			likesTotal: {$sum: '$likes'}
		}
	}]);

	return result[0].likesTotal;
	// return 0;
}

module.exports = async () => {
	const result = await Promise.all([ // Promise.all ejecuta las funciones en paralelo
			imageCounter(),
			commentsCounter(),
			imageTotalViewsCounter(),
			imageTotalLikesCounter()
		]);

	return {
		images: result[0],
		comments: result[1],
		views: result[2],
		likes: result[3]
	}
};