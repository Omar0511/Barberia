<?php

    namespace Controllers;

    use Classes\Email;
    use Model\Usuario;
    use MVC\Router;

    class LoginController {
        public static function login(Router $router) {
            
            $router->render('auth/login', [

            ]);
        }

        public static function logout() {
            echo "ADIÓS";
        }

        public static function olvide(Router $router) {
            $router->render('auth/olvide-password', [

            ]);
        }

        public static function recuperar() {
            echo "RECUPERAR";
        }

        public static function crear(Router $router) {
            $usuario = new Usuario;
            // debuguear($usuario);

            // Alertas vacías
            $alertas = [];

            if ($_SERVER['REQUEST_METHOD'] === 'POST') {
                // Sincronizar los datos que tenemos en POST
                $usuario->sincronizar($_POST);

                $alertas = $usuario->validarNuevaCuenta();
                // debuguear($alertas);

                // Revisar que alerta este vacía
                if ( empty($alertas) ) {
                    $resultado = $usuario->existeUsuario();

                    if ($resultado->num_rows) {
                        $alertas = Usuario::getAlertas();
                    } else {
                        // Hashear Password
                        $usuario->hashPassword();

                        // Generar un token único
                        $usuario->crearToken();

                        $email = new Email($usuario->nombre, $usuario->email, $usuario->token);
                    }

                }

            }
            
            $router->render('auth/crear-cuenta', [
                'usuario' => $usuario,
                'alertas' => $alertas,
            ]);
        }
    }