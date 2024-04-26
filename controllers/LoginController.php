<?php

    namespace Controllers;

    use MVC\Router;

    class LoginController {
        public static function login(Router $router) {
            
            $router->render('auth/login', [

            ]);
        }

        public static function logout() {
            echo "ADIÓS";
        }

        public static function olvide() {
            echo "OLVIDE";
        }

        public static function recuperar() {
            echo "RECUPERAR";
        }

        public static function crear(Router $router) {
            
            $router->render('auth/crear-cuenta', [

            ]);
        }
    }