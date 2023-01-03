const path = require('path');
const exphbs = require('express-handlebars');
const handlebars = require('handlebars');
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');
require('./passport');
const morgan = require('morgan');
const multer = require('multer');
const errorHandlers = require('errorhandler');
const routes = require('../routes/index.js')

require('dotenv').config()

module.exports = app => {
	// Settings
	app.set('port', process.env.PORT);
	app.set('views', path.join(__dirname, '../views'));
	app.engine('.hbs', exphbs({
		defaultLayout: 'main',
		partialsDir: path.join(app.get('views'), 'partials'),
		layoutsDir: path.join(app.get('views'), 'layouts'),
		extname: '.hbs',
		helpers: require('./helpers.js'),
		handlebars: handlebars
	}));
	app.set('view engine', '.hbs');

	// Middlewares
	app.use(morgan('dev'));
	app.use(multer({dest: path.join(__dirname, '../public/upload/temp')}).single('image'));
	app.use(express.urlencoded({extended: false})); // recibir datos desde formularios
	app.use(express.json()); // manejar los likes
	app.use(session({
		secret: 'mysecretapp',
		resave: false,
		saveUninitialized: true
	}));
	app.use(passport.initialize());
	app.use(passport.session());
	app.use(flash());

	// Global variables
	app.use((req, res, next) => {
		res.locals.login_error = req.flash('error');
		res.locals.user = req.user || null;
		next();
	})

	// Routes
	routes(app);

	// Static files
	app.use('/public', express.static(path.join(__dirname, '../public')));

	// Error handlers - manejo de errores
	if('development' === app.get('env')){
		app.use(errorHandlers);
	}

	return app;
}

