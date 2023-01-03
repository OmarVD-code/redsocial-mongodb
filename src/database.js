const mongoose = require('mongoose');
// const { database } = require('./keys.js');

mongoose.connect("mongodb+srv://omarvillarreal2000:mymongopass@cluster0.bu0gh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority")
	.then(db => console.log('DB is connected'))
	.catch(err => console.error(err));

