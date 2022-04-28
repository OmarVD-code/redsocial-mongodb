const helpers = {};

helpers.randomNumber = () => {
	const possible = 'abcdefghijklmnopqrstuvwxyz1234567890';
	let randomNumber = 0;
	for(let i=0;i<6;i++){
		randomNumber += possible.charAt(Math.floor(Math.random()*possible.length)); // Genera caracteres aleatorios para nombrar las imágenes subidas con Multer
	}
	return randomNumber;
}

module.exports = helpers;