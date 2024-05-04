let paso = 1;
// Cuando todo el DOM este cargado, se va ejecutar esta función
document.addEventListener('DOMContentLoaded', function() {
    iniciarApp();
});

function iniciarApp() {
    //Cambia la sessión cuando se presionen los tabs
    tabs();
}

function mostrarSeccion() {
    // Ocultar la seccion que tenga la clase MOSTRAR
    const seccionAnterior = document.querySelector('.mostrar');
    
    if (seccionAnterior) {
        seccionAnterior.classList.remove('mostrar');
    }

    // Seleccionar la sección con el paso...
    const pasoSelector = `#paso-${paso}`;
    const seccion = document.querySelector(pasoSelector);
    seccion.classList.add('mostrar');
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

            mostrarSeccion(paso);
        });
    });
}