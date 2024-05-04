<h1 class="nombre-pagina">Crear Nueva Cita</h1>
<p class="descripcion-pagina">Elige tus servicios y coloca tus datos</p>

<div id="app">
    <nav class="tabs">
        <button type="button" data-paso="1">Servicios</button>
        <button type="button" data-paso="2">Información Cita</button>
        <button type="button" data-paso="3">Resumen</button>
    </nav>

    <div id="paso-1" class="seccion">
        <h2>Servicios</h2>
        <p class="text-center">Elige tus servicios a continuacion</p>
    </div>

    <div id="paso-2" class="seccion">
        <h2>Tus Datos y Cita</h2>
        <p class="text-center">Coloca tus datos y fecha de tu cita</p>

        <form class="formulario">
            <div class="campo">
                <label for="nombre">Nombre</label>
                <input type="text" name="nombre" id="nombre" placeholder="Ingresa tu Nombre" value="<?php echo $nombre; ?>" disabled>
            </div>

            <div class="campo">
                <label for="fecha">Fecha</label>
                <input type="date" name="fecha" id="fecha">
            </div>

            <div class="campo">
                <label for="hora">Hora</label>
                <input type="time" name="hora" id="hora">
            </div>
        </form>
    </div>

    <div id="paso-3" class="seccion">
        <h2>Resumen</h2>
        <p class="text-center">Verifica que la información sea correcta</p>
    </div>

</div>