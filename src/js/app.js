let paso = 1;
// Cuando todo el DOM este cargado, se va ejecutar esta función
document.addEventListener('DOMContentLoaded', function() {
    iniciarApp();
});

function iniciarApp() {
    //Cambia la sessión cuando se presionen los tabs
    tabs();
}

function tabs() {
    const botones = document.querySelectorAll('.tabs button');

    /*
        console.log(botones);
        addEventListener: no se puede aplicar a un elemento, es decir;
        cuando tenemos: querySelectorAll, esta seleccionando todos los elementos...
    */

    // También podría ser a tráves se un MAP()
    botones.forEach( boton => {
        boton.addEventListener('click', function(e) {
            // console.log('Diste Click', e.target.dataset.paso);
            paso = parseInt(e.target.dataset.paso);
        });
    });
}