<?php
    namespace Controllers;

    use MVC\Router;

    class ServicioController {
        public static function index(Router $router) {
            $router->render('servicios/index', [

            ]);
        }

        public static function crear(Router $router) {
            echo "Servicios";
        }

        public static function actualizar(Router $router) {
            echo "Servicios";
        }

        public static function eliminar(Router $router) {
            echo "Servicios";
        }
    }