function activeMenu(){
	// Usamos expresiones regulares
	let currentPath = location.href; // devuelve la ruta actual
	const patternSignUp = /signup/;
	const patternSignIn = /signin/;
	if(patternSignUp.test(currentPath)){
		$('#nav-item-signup').addClass('active');
		$('#nav-item-signin').removeClass('active');
	} else if (patternSignIn.test(currentPath)){
		$('#nav-item-signup').removeClass('active');
		$('#nav-item-signin').addClass('active');
	} else {
		$('#nav-item-signup').removeClass('active');
		$('#nav-item-signin').removeClass('active');
	}
}

$('#post-comment').hide();

$('#btn-toggle-comment').click(function(e) {
	e.preventDefault();
	$('#post-comment').slideToggle();
});

$('#btn-like').click(function(e) {
	e.preventDefault();
	let imgId = $(this).data('id');
	$.post(`/images/${imgId}/like`).done(data => {
		$('.likes-count').text(data.likes); // altera la vista según los likes recibidos del servidor
		if(data.isAlreadyLiked){
			$(this).attr('title', 'Ya no me gusta');
			$(this).children().removeClass('far').addClass('fas');
		} else {
			$(this).attr('title', 'Me gusta');
			$(this).children().removeClass('fas').addClass('far');
		}
	});
});

$('#btn-edit-post').click(function(e) {
	e.preventDefault();
	let $this = $(this);
	let imgId = $this.data('id');
	form = document.forms[0]; // Obtenemos el formulario
	title = form.elements['title'].value; // Obtenemos el nuevo título
	description = form.elements['description'].value; // Obtenemos la nueva descripción
	$.ajax({
		url: `/images/${imgId}/${title}/${description}`,
		type: `PUT`,
	})
	.done(function(result) {
		location.replace(location.href); // redirige la ruta
	});
})

$('#btn-delete').click(function(e) {
	e.preventDefault();
	let $this = $(this);
	const response = confirm('Are you sure you want to delete this image?');
	if(response){
		let imgId = $this.data('id');
		$.ajax({
			url: `/images/${imgId}`,
			type: 'DELETE',
		})
		.done(function(result) {
			$this.removeClass('btn-danger').addClass('btn-success');
			$this.find('i').removeClass('fa-trash').addClass('fa-check');
			$this.find('i').text(' Deleted');
			$('#btn-edit').remove();
			alert('The image has been removed. Please reload the page');
		})
	}
})

activeMenu();
