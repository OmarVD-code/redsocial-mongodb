const router = require('express').Router();
const home = require('../controllers/home.js');
const image = require('../controllers/image.js');
const user = require('../controllers/user.js');
const { isAuthenticated, isNotAuthenticated } = require('../helpers/auth');

module.exports = app => {
	// GET HOME
	router.get('/', home.index);

	// IMAGE ROUTES
	router.get('/images/:image_id', image.index);
	router.post('/images', isAuthenticated ,image.create);
	router.post('/images/:image_id/like', isAuthenticated, image.like);
	router.post('/images/:image_id/:user_id/comment', isAuthenticated, image.comment);
	router.delete('/images/:image_id', isAuthenticated, image.remove);
	router.put('/images/:image_id/:title/:description', isAuthenticated, image.edit);

	// USER ROUTES
	// Si el usuario ya se autenticó, usamos el método isNotAuthenticated y usamos el método isAuthenticated en caso de que el usuario deba estar necesariamente autenticado para realizar esa funcionalidad
	router.get('/users/signup', isNotAuthenticated, user.getSignUpForm);
	router.get('/users/signin', isNotAuthenticated, user.getSignInForm);
	router.get('/users/profile/:user_id', isAuthenticated, user.getProfile);
	router.post('/users/profile/:user_id/edit', isAuthenticated, user.editProfile);
	router.post('/users/signup', isNotAuthenticated, user.signup);
	router.post('/users/signin', isNotAuthenticated, user.signin);
	router.get('/users/logout', isAuthenticated, user.logout);


	app.use(router);
}
