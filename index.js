const app = require('./src/index')

// Starting the server
app.listen(app.get('port'), () => {
	console.log('Server on port', app.get('port'));
}); 

