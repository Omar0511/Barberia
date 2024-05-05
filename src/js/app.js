let paso = 1;
const pasoInicial = 1;
const pasoFinal = 3;

const cita = {
    nombre: '',
    fecha: '',
    hora: '',
    servicios: []
};

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

    consultarAPI();

    // Añade el nombre del cliente al OBJETO de cita
    nombreCliente();
    // Añade la fecha de la cita en el OBJETO
    seleccionarFecha();
    // Añade la hora de la cita en el OBJETO
    seleccionarHora();
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

async function consultarAPI() {
    try {
        const url = 'http://localhost:3000/api/servicios';
        const resultado = await fetch(url);
        const servicios = await resultado.json();

        // console.log(servicios);
        mostrarServicios(servicios);
    } catch (error) {
        console.log(error);
    }
}

function mostrarServicios(servicios) {
    servicios.forEach( servicio => {
        // Destructuración
        const { id, nombre, precio } = servicio;

        // Creamos un parráfo
        const nombreServicio = document.createElement('P');
        nombreServicio.classList.add('nombre-servicio');
        nombreServicio.textContent = nombre;

        const precioServicio = document.createElement('P');
        precioServicio.classList.add('precio-servicio');
        precioServicio.textContent = `$${precio}`;

        const servicioDiv = document.createElement('DIV');
        servicioDiv.classList.add('servicio');
        servicioDiv.dataset.idServicio = id;
        // SE va ejecutar cuando demos click
        // servicioDiv.onclick = seleccionarServicio;
        servicioDiv.onclick = function() {
            seleccionarServicio(servicio);
        };

        // Agregando SERVICIOS al DIV
        servicioDiv.appendChild(nombreServicio);
        servicioDiv.appendChild(precioServicio);

        // Agregamos al div con el id="servicios" que tenemos que: view/cita/index.php
        document.querySelector('#servicios').appendChild(servicioDiv);
    });
}

function seleccionarServicio(servicio) {
    const { id } = servicio;
    // console.log("Desde seleccionar", servicio);
    const { servicios } = cita;

    // Identificar el elemento al que se le da CLICK
    const divServicio = document.querySelector(`[data-id-servicio="${id}"]`);
    
    // Comprobar si un servicio ya fue agregado
    if ( servicios.some( agregado => agregado.id === id ) ) {
        // Eliminarlo
        cita.servicios = servicios.filter( agregado => agregado.id !== id );
        divServicio.classList.remove('seleccionado');
    } else {
        // ... = toma una copia de servicios y le agrega servicio
        // Agregarlo
        cita.servicios= [...servicios, servicio];
        divServicio.classList.add('seleccionado');
    }
    console.log(cita);
}

function nombreCliente() {
    cita.nombre = document.querySelector('#nombre').value;
}

function seleccionarFecha() {
    const inputFecha = document.querySelector('#fecha');
    inputFecha.addEventListener('input', function(e) {
        const dia = new Date(e.target.value).getUTCDay();

        if ( [6, 0].includes(dia) ) {
            e.target.value = '';

            mostrarAlerta('Fines de semana no permitidos', 'error');
        } else {
            cita.fecha = e.target.value;
        }

    });
}

function seleccionarHora() {
    const inputHora = document.querySelector('#hora');
    inputHora.addEventListener('input', function(e) {
        const horaCita = e.target.value;
        const hora = horaCita.split(":")[0];

        if (hora < 10 || hora > 18) {
            e.target.value = '';
            mostrarAlerta('Horario NO válido', 'error');
        } else {
            cita.hora = e.target.value;
        }

    });
}

function mostrarAlerta(mensaje, tipo) {
    // Previene que se genere más de 1 alerta
    const alertaPrevia = document.querySelector('.alerta');

    if (alertaPrevia) {
        return;
    }

    // Scripting para crear la ALERTA
    const alerta = document.createElement('DIV');
    alerta.textContent = mensaje;
    alerta.classList.add('alerta');
    alerta.classList.add(tipo);

    const formulario = document.querySelector('.formulario');
    formulario.appendChild(alerta);

    // ELIMINAR la alerta
    setTimeout(() => {
        alerta.remove();
    }, 3000);
}