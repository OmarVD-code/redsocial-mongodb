const path = require('path');
const exphbs = require('express-handlebars');
const handlebars = require('handlebars');

const express = require('express');
const morgan = require('morgan');
const multer = require('multer');
const errorHandlers = require('errorhandler');

const routes = require('../routes/index.js')

module.exports = app => {
	// Settings
	app.set('port', process.env.PORT || 3000);
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

