const { Image, Comment, User } = require('../models');
const passport = require('passport');
const fs = require('fs-extra');
const path = require('path');
const { randomNumber } = require('../helpers/libs.js');

const ctrl = {};

ctrl.getSignUpForm = (req, res) => {
    res.render('users/signup');
}

ctrl.getSignInForm = (req, res) => {
    res.render('users/signin')
}

ctrl.getProfile = async (req, res) => {
  let viewModel = {user: {}, images: {}, comments: {}};

  // Obtenemos al usuario dueño del perfil a partir de su id pasado como parámetro
  const user = await User.findOne({_id: req.params.user_id});
  viewModel.user = user;

  // Obtenemos las imágenes que ha posteado el usuario
  let images = await Image.find({user_id: req.params.user_id});
  viewModel.images = images;

  // Obtenemos los comentarios realizados por el usuario y después obtenemos la foto a la que se realizó el comentario para mostrar una miniatura
  let comments = await Comment.find({user_id: req.params.user_id});
  for(const comment of comments){
    const image = await Image.findOne({_id: comment.image_id});
    comment.image = image;
  }

  viewModel.comments = comments;

  res.render('users/profile', viewModel);
}

ctrl.editProfile = async(req, res) => {
  const user = await User.findOne({_id: req.params.user_id});

  if(req.body.name.length>0 && req.body.email.length>0){
    // Asignamos los nuevos datos al usuario encontrado en la base de datos
    user.name = req.body.name;
    user.email = req.body.email;
    // Guarda cambios
    await user.save();

    // Obtenemos la foto del perfil solo si el usuario la ha subido ya que no es obligatoria en el formulario
    if(req.file){
      const saveImage = async () => {
        const imgUrl = randomNumber();
        const images = await Image.find({ // validación para evitar nombres repetidos de las imágenes
    			filename: imgUrl
    		});
        if (images.length > 0) {
    			saveImage();
    		} else {
    	     // Almacenar nueva foto de perfil
           const ext = path.extname(req.file.originalname).toLowerCase(); // Extrae la extensión de la imagen
           const imageTempPath = req.file.path; // Almacena la dirección de la imagen
           const targetPath = path.resolve(`src/public/upload/${imgUrl}${ext}`); // Almacena la dirección de destino de la imagen
           if (ext === '.jpg' || ext === '.png' || ext === '.jpeg') {
     				await fs.rename(imageTempPath, targetPath); // Usamos fs-extra para mover un archivo de una carpeta a otra
     				user.avatar = imgUrl + ext;
            await user.save();
     			} else {
    				await fs.unlink(imageTempPath);
    				res.status(500).json({
    					error: 'Only images are allowed'
    				});
    			}
    		}
      }
      saveImage();
    }
    res.redirect(`/users/profile/${user._id}`);
  } else {
    res.status(500).json({
      error: 'Please fill the form'
    });
  }
}

ctrl.signup = async (req, res) => { // POST
    const {name, email, password, confirm_password} = req.body;
    const errors = [];
    let success_signup_msg = '';

    // Validamos que el email no sea repetido
    const emailUser = await User.findOne({email: email});
    if(emailUser){
        errors.push({'text': 'The email is already in use'});
    }

    if(password != confirm_password){
        errors.push({'text': 'Passwords do not match'});
    }

    if(password.length < 4){
        errors.push({'text': 'Password must be at least 4 characters'});
    }

    if(errors.length > 0){
        res.render('users/signup', {errors, name, email, password, confirm_password});
    } else {
        const newUser = new User({name, email, password});
        newUser.password = await newUser.encryptPassword(password);
        await newUser.save();
        success_signup_msg = 'You have been successfully registered. Now you can login';
        res.render('users/signin', {success_signup_msg});
    }
}

ctrl.signin = passport.authenticate('local', { // POST
    successRedirect: '/',
    failureRedirect: '/users/signin',
    failureFlash: true
});

ctrl.logout = (req, res) => {
    req.logout();
    res.redirect('/users/signin');
}

module.exports = ctrl;
