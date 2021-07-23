const express = require('express');

const config = require('./server/config.js');

// database
require('./database.js');

const app = config(express());

// Starting the server
app.listen(app.get('port'), () => {
	console.log('Server on port', app.get('port'));
}); 

