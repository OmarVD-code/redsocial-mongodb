const path = require('path');
const { randomNumber } = require('../helpers/libs.js');
const fs = require('fs-extra');
const md5 = require('md5');
const { Image, Comment, User, Like } = require('../models');
const sidebar = require('../helpers/sidebar.js');

const ctrl = {};

ctrl.index = async (req, res) => {
	let viewModel = {image: {}, comments: {}};
	const image = await Image.findOne({filename: {$regex: req.params.image_id}}); // Usa una expresión regular para encontrar una imagen asociada al parámetro image_id
	if(image){
		// Actualiza la cantidad de vistas de la imagen
		image.views = image.views+1;
		await image.save();

		// Asigna la imagen al modelo
		viewModel.image = image;

		// Obtenemos el nombre del usuario que posteó la imagen a partir de user_id
		const image_author = await User.findOne({_id: image.user_id});
		viewModel.image_author = image_author.name;

		// Booleanos que servirán para mostrar botones según corresponda
		viewModel.isAuthor = false;
		viewModel.isAlreadyLiked = false;

		// Comprobamos si alguien inició sesión
		if(res.locals.user){
			// Comparamos el usuario autenticado con el usuario que posteó la imagen para mostrarle la opción de eliminar la imagen si corresponde
			if(JSON.stringify(res.locals.user._id) === JSON.stringify(image_author._id)){
				viewModel.isAuthor = true;
			}
			// Comprobamos si el usuario ya le dio like a la imagen para mostrar el botón que corresponde
			const like = await Like.findOne({user_id: res.locals.user._id, image_id: image._id});
			if(like){
				viewModel.isAlreadyLiked = true;
			}
		}

		// Obtiene los comentarios asociados a la imagen
		let comments = await Comment.find({image_id: image._id}).sort({date: -1});

		// Obtenemos el nombre del autor de cada comentario (virtual)
		for(const comment of comments){
			const author = await User.findOne({_id: comment.user_id});
			comment.author = author;
		}

		// Asigna los comentarios al modelo
		viewModel.comments = comments;
		// Envía los datos al sidebar
		viewModel = await sidebar(viewModel);

		// Renderiza la imagen
		res.render('image', viewModel);
	} else {
		res.redirect('/');
	}
}

ctrl.create = (req, res) => {
	const title = req.body.title;
	const description = req.body.description;

	if(title.length>0 && description.length>0){
		const saveImage = async () => {
			const imgUrl = randomNumber(); // url de la imagen
			const images = await Image.find({ // validación para evitar nombres repetidos de las imágenes
				filename: imgUrl
			});
			if (images.length > 0) {
				saveImage();
			} else {
				const user = res.locals.user;
				const ext = path.extname(req.file.originalname).toLowerCase(); // Extrae la extensión de la imagen
				const imageTempPath = req.file.path; // Almacena la dirección de la imagen
				const targetPath = path.resolve(`src/public/upload/${imgUrl}${ext}`); // Almacena la dirección de destino de la imagen

				if (ext === '.jpg' || ext === '.png' || ext === '.jpeg' || ext === 'gif') {
					await fs.rename(imageTempPath, targetPath); // Usamos fs-extra para mover un archivo de una carpeta a otra
					const newImg = new Image({
						user_id: user._id,
						title: req.body.title,
						description: req.body.description,
						filename: imgUrl + ext
					});
					const imageSaved = await newImg.save();
					res.redirect('/images/' + imgUrl);
				} else {
					await fs.unlink(imageTempPath);
					res.status(500).json({
						error: 'Only images are allowed'
					});
				}
			}
		}
		saveImage();
	} else {
		res.status(500).json({
			error: 'Please fill the form'
		})
	}
}

ctrl.like = async (req, res) => {
	// Buscamos la imagen a la que se está dando like
	const image = await Image.findOne({filename: {$regex: req.params.image_id}});
	if(image){
		// Buscamos si existe el like para evitar que un usuario lo haga repetidas veces sobre una misma imagen
		const like = await Like.findOne({user_id: res.locals.user.id, image_id: image._id});

		if(like){
			// Si el like ya existe, el usuario está quitando su like y restamos uno a la cantidad de likes de la imagen
			image.likes = image.likes-1;
			await image.save();
			// Elimiamos el like de la base de datos, ya que el usuario está quitando su like
			await like.remove();
			res.json({likes: image.likes, isAlreadyLiked: false});
		} else {
			// Si  el like no existe, actualizamos el contador y guardamos el like en la bd
			image.likes = image.likes+1;
			await image.save();
			const newLike = new Like({
				user_id: res.locals.user.id,
				image_id: image._id
			});
			await newLike.save();
			res.json({likes: image.likes, isAlreadyLiked: true}); // Data enviada a scripts.js
		}
	} else {
		res.status(500).json({error: 'Internal error'});
	}
}

ctrl.comment = async (req, res) => {
	const image = await Image.findOne({filename: {$regex: req.params.image_id}});
	if(image){
		const newComment = new Comment(req.body);
		// newComment.gravatar = md5(newComment.email);
		newComment.image_id = image._id;
		newComment.user_id = req.params.user_id;
		await newComment.save();
		res.redirect(`/images/${image.uniqueId}`);
	}
}

ctrl.edit = async(req, res) => {
	const image = await Image.findOne({filename: {$regex: req.params.image_id}});
	if(image){
		const newTitle = req.params.title;
		const newDescription = req.params.description;
		if(newTitle.length > 0){
			image.title = newTitle;
			await image.save();
		}
		if(newDescription.length > 0){
			image.description = newDescription;
			await image.save()
		}
		res.json(true);
	}
}

ctrl.remove = async (req, res) => {
	const image = await Image.findOne({filename: {$regex: req.params.image_id}});
	if(image){
		await fs.unlink(path.resolve('./src/public/upload/'+image.filename));
		await Comment.deleteMany({image_id: image._id});
		await Like.deleteMany({image_id: image._id});
		await image.remove();
		res.json(true);
	}
}

module.exports = ctrl;
