let paso = 1;
const pasoInicial = 1;
const pasoFinal = 3;

// Cuando todo el DOM este cargado, se va ejecutar esta función
document.addEventListener('DOMContentLoaded', function() {
    iniciarApp();
});

function iniciarApp() {
    // Muestra y oculta las secciones
    mostrarSeccion();
    //Cambia la sessión cuando se presionen los tabs
    tabs();
    // Agrega o quita los botones del paginador
    botonesPaginador();

    paginaAnterior();
    paginaSiguiente();
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

    // Quita la clase actual al tab anterior
    const tabAnterior = document.querySelector('.actual');

    if (tabAnterior) {
        tabAnterior.classList.remove('actual');
    }

    // Resalta el TAB actual
    const tab = document.querySelector(`[data-paso="${paso}"]`);
    tab.classList.add('actual');
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

            mostrarSeccion();

            botonesPaginador();
        });
    });
}

function botonesPaginador() {
    const paginaAnterior = document.querySelector('#anterior');
    const paginaSiguiente = document.querySelector('#siguiente');

    if (paso === 1) {
        paginaAnterior.classList.add('ocultar');
        paginaSiguiente.classList.remove('ocultar');
    } else if (paso === 3) {
        paginaAnterior.classList.remove('ocultar');
        paginaSiguiente.classList.add('ocultar');
    } else {
        paginaAnterior.classList.remove('ocultar');
        paginaSiguiente.classList.remove('ocultar');
    }

    mostrarSeccion();
}

function paginaAnterior() {
    const paginaAnterior = document.querySelector('#anterior');
    paginaAnterior.addEventListener('click', function() {
        if (paso <= pasoInicial) {
            return;
        }

        paso --;

        // console.log(paso);
        botonesPaginador();
    });
}

function paginaSiguiente() {
    const paginaSiguiente = document.querySelector('#siguiente');
    paginaSiguiente.addEventListener('click', function() {
        if (paso >= pasoFinal) {
            return;
        }

        paso ++;

        // console.log(paso);
        botonesPaginador();
    });
}