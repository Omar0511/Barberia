<?php
    namespace Controllers;

    use Model\Cita;
    use Model\CitaServicio;
    use Model\Servicio;
    
    class APIController {
        public static function index() {
            $servicios = Servicio::all();
            echo json_encode($servicios);
        }

        public static function guardar() {
            // Almacena la CITA y devuleve el ID
            $cita = new Cita($_POST);

            $resultado = $cita->guardar();

            $id = $resultado['id'];

            // Almacena la Cita y el Servicio
            // EXPLODE = Separador
            // Almacena los Servicio con el ID de la CITA
            $idServicios = explode(",", $_POST['servicios']);

            foreach($idServicios as $idServicio) {
                $args = [
                    'citaId' => $id,
                    'servicioId' => $idServicio
                ];

                $citaServicio = new CitaServicio($args);
                $citaServicio->guardar();
            }
            
            echo json_encode( [ 'resultado' => $resultado ] );
        }

        public static function eliminar() {
            $id = $_POST['id'];

            $cita = Cita::find($id);

            $cita->eliminar();
            // Nos redirecciona a la página de donde veniamos el: HTTP_REFERER
            header('Location:' . $_SERVER['HTTP_REFERER'] );
        }

    }