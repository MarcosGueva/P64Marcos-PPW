document.getElementById('btn-cargar').addEventListener('click', function() {
    var img = document.getElementById('imagen');
    img.src = 'https://thumbs.dreamstime.com/z/smiley-cara-feliz-del-vector-94248929.jpg'; // Asegúrate de que esta ruta sea correcta
    img.style.display = 'block';
});

document.getElementById('btn-eliminar').addEventListener('click', function() {
    var img = document.getElementById('imagen');
    img.src = '';
    img.style.display = 'none';
});
