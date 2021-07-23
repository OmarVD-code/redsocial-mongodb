const ctrl = {};
const { Image } = require('../models');
const sidebar = require('../helpers/sidebar');

ctrl.index = async (req, res) => {
	let viewModel = {images: []};
    const images = await Image.find().sort({timestamp: -1}) // .lean({virtuals: true})
		.then((images) => {
			const context = {
				images: images.map(image => {
					return {
						_id: image._id,
                        filename: image.filename,
                        uniqueId: image.uniqueId
					}
				})
			}            
            viewModel.images = context.images;
		});
        viewModel = await sidebar(viewModel);
        console.log(viewModel.images);
        console.log(viewModel.sidebar);
        res.render('index', viewModel);
}

module.exports = ctrl;

