let paso = 1;
const pasoInicial = 1;
const pasoFinal = 3;

const cita = {
    id: '',
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

    idCliente();
    // Añade el nombre del cliente al OBJETO de cita
    nombreCliente();
    // Añade la fecha de la cita en el OBJETO
    seleccionarFecha();
    // Añade la hora de la cita en el OBJETO
    seleccionarHora();
    // Muestra el RESUMEN de la CITA
    mostrarResumen();
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
        mostrarResumen();
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

function idCliente() {
    cita.id = document.querySelector('#id').value;
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

            mostrarAlerta('Fines de semana no permitidos', 'error', '.formulario');
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
            mostrarAlerta('Horario NO válido', 'error', '.formulario');
        } else {
            cita.hora = e.target.value;
        }

    });
}

function mostrarAlerta(mensaje, tipo, elemento, desaparece = true) {
    // Previene que se genere más de 1 alerta
    const alertaPrevia = document.querySelector('.alerta');

    if (alertaPrevia) {
        // return;
        alertaPrevia.remove();
    }

    // Scripting para crear la ALERTA
    const alerta = document.createElement('DIV');
    alerta.textContent = mensaje;
    alerta.classList.add('alerta');
    alerta.classList.add(tipo);

    const referencia = document.querySelector(elemento);
    referencia.appendChild(alerta);

    if (desaparece) {
        // ELIMINAR la alerta
        setTimeout(() => {
            alerta.remove();
        }, 3000);
    }

}

function mostrarResumen() {
    const resumen = document.querySelector('.contenido-resumen');

    // Limpiar el contenido de resumen
    while (resumen.firstChild) {
        resumen.removeChild(resumen.firstChild);
    }

    if ( Object.values(cita).includes('') || cita.servicios.length === 0 ) {
        mostrarAlerta('Faltan datos de Servicio, Fecha u Hora', 'error', '.contenido-resumen', false);

        return;
    }

    // Formatear el DIV de resumen
    const { nombre, fecha, hora, servicios } = cita;

    // Heading para servicios en resumen
    const headingServicios = document.createElement('H3');
    headingServicios.textContent = 'Resumen de Servicios';
    resumen.appendChild(headingServicios);

    servicios.forEach( servicio => {
        const { id, precio, nombre } = servicio;

        const contenedorServicio = document.createElement('DIV');
        contenedorServicio.classList.add('contenedor-servicio');

        const textoServicio = document.createElement('P');
        textoServicio.textContent = nombre;

        const precioServicio = document.createElement('P');
        precioServicio.innerHTML = `<span>Precio:</span> $${precio}`;

        contenedorServicio.appendChild(textoServicio);
        contenedorServicio.appendChild(precioServicio);

        resumen.appendChild(contenedorServicio);
    });

    // Heading para CITA en resumen
    const headingCita = document.createElement('H3');
    headingCita.textContent = 'Resumen de Cita';
    resumen.appendChild(headingServicios);

    const nombreCliente = document.createElement('P');
    nombreCliente.innerHTML = `<span>Nombre:</span> ${nombre}`;

    // Formatear la fecha en español
    const fechaObj = new Date(fecha);
    const mes = fechaObj.getMonth();
    const dia = fechaObj.getDate();
    const year = fechaObj.getFullYear();
    const fechaUTC  = new Date( Date.UTC(year, mes, dia) );
    const opciones = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const fechaFormateada = fechaUTC.toLocaleDateString('es-MX', opciones);

    const fechaCita = document.createElement('P');
    fechaCita.innerHTML = `<span>Fecha:</span> ${fechaFormateada}`;

    const horaCita = document.createElement('P');
    horaCita.innerHTML = `<span>Hora:</span> ${hora} horas`;

    // Boton para crear una cita
    const botonReservar = document.createElement('BUTTON');
    botonReservar.classList.add('boton');
    botonReservar.textContent = 'Reservar Cita';
    botonReservar.onclick = reservarCita;

    resumen.appendChild(nombreCliente);
    resumen.appendChild(fechaCita);
    resumen.appendChild(horaCita);

    resumen.appendChild(botonReservar);
}

async function reservarCita() {
    const { id, nombre, fecha, hora, servicios } = cita;

    const idServicios = servicios.map( servicio => servicio.id );
    // Es como el SUBMIT, pero lo creamos con JS
    const datos = new FormData();
    // Agregar datos = append
    datos.append('fecha', fecha); 
    datos.append('hora', hora);
    datos.append('usuarioId', id);
    datos.append('servicios', idServicios);
    // Peticiones hacia la API
    const url = 'http://localhost:3000/api/citas';

    const respuesta = await fetch(url, {
        method: 'POST',
        boyd: datos
    });

    const resultado = await respuesta.json();
    console.log(resultado);
}