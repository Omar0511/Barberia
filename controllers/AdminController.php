<?php
    namespace Controllers;

    use Model\AdminCita;
    use MVC\Router;

    class AdminController {
        public static function index(Router $router) {
            // session_start();
            $fecha = $_GET['fecha'] ?? date('Y-m-d');;
            
            $fechas = explode('-', $fecha);

            if ( !checkdate( $fechas[1], $fechas[2], $fechas[0] ) ) {
                header('Location: /404');
            }

            // debuguear($fecha);

            // Consultar la BD
            $consulta = "SELECT c.id, c.hora, ";
            $consulta .= "CONCAT( u.nombre, ' ', u.apellido ) AS cliente, ";
            $consulta .= "u.email, u.telefono, ";
            $consulta .= "s.nombre AS servicio, s.precio ";
            $consulta .= "FROM citas c ";
            $consulta .= "INNER JOIN usuarios u ";
            $consulta .= "ON u.id = c.usuarioId ";
            $consulta .= "INNER JOIN citasservicios cs ";
            $consulta .= "ON cs.citaId = c.id ";
            $consulta .= "INNER JOIN servicios s ";
            $consulta .= " ON s.id = cs.servicioId ";
            $consulta .= "WHERE fecha = '${fecha}' ";

            $citas = AdminCita::SQL($consulta);
            // debuguear($citas);

            $router->render('admin/index', [
                'nombre' => $_SESSION['nombre'],
                'citas' => $citas,
                'fecha' => $fecha
            ]);
        }
    }