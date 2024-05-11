<?php

    namespace Controllers;

    use Classes\Email;
    use Model\Usuario;
    use MVC\Router;

    class LoginController {
        public static function login(Router $router) {
            $alertas = [];

            $auth = new Usuario;

            if ($_SERVER['REQUEST_METHOD'] === 'POST') {
                $auth = new Usuario($_POST);

                $alertas = $auth->validarLogin();

                if ( empty($alertas) ) {
                    // Comprobar que exista el usuario
                    $usuario = Usuario::where('email', $auth->email);

                    if ($usuario) {
                        // Verificar el Password
                        if ( $usuario->comprobarPasswordAndVerificado($auth->password) ) {
                            // Autenticar Usuario
                            session_start();
                            // Una vez que inicias sesión, tenemos acceso a la SUPER GLOBAL: $_SESSION
                            $_SESSION['id'] = $usuario->id;
                            $_SESSION['nombre'] = $usuario->nombre . " " . $usuario->apellido;
                            $_SESSION['email'] = $usuario->email;
                            $_SESSION['login'] = true;

                            // Redirrecionamiento
                            // debuguear($usuario->admin);
                            if ($usuario->admin === "1") {
                                $_SESSION['admin'] = $usuario->admin ?? null;

                                header('Location: /admin');
                            } else {
                                header('Location: /cita');
                            }

                            // debuguear($_SESSION);
                        }
                        // debuguear($usuario);
                    } else {
                        Usuario::setAlerta('error', 'Usuario no encontrado');
                    }

                }

            }
            
            $alertas = Usuario::getAlertas();

            $router->render('auth/login', [
                'alertas' => $alertas,
                'auth' => $auth,
            ]);
        }

        public static function logout() {
            session_start();

            $_SESSION = [];

            header('Location: /');
        }

        public static function olvide(Router $router) {
            $alertas = [];

            if ($_SERVER['REQUEST_METHOD'] === 'POST') {
                $auth = new Usuario($_POST);
                $alertas = $auth->validarEmail();

                if ( empty($alertas) ) {
                    $usuario = Usuario::where('email', $auth->email);

                    if ($usuario && $usuario->confirmado === "1") {
                        // Generar Token
                        $usuario->crearToken();

                        $usuario->guardar();

                        // Enviar E-mail
                        $email = new Email($usuario->email, $usuario->nombre, $usuario->token);

                        $email->enviarInstrucciones();

                        Usuario::setAlerta('exito', 'Revisa tu E-mail');
                    } else {
                        Usuario::setAlerta('error', 'El Usuario no existe oh no esta confirmado');
                    }

                }

            }

            $alertas = Usuario::getAlertas();

            $router->render('auth/olvide-password', [
                'alertas' => $alertas,
            ]);
        }

        public static function recuperar(Router $router) {
            $alertas = [];
            $error = false;

            $token = s($_GET['token']);

            // Buscar usuario por su TOKEN
            $usuario = Usuario::where('token', $token);

            if ( empty($usuario) ) {
                Usuario::setAlerta('error', 'Token No Válido');
                $error = true;
            }

            if ($_SERVER['REQUEST_METHOD'] === 'POST') {
                // Leer el nuevo Password y Guardar
                $password = new Usuario($_POST);

                $alertas = $password->validarPassword();

                if ( empty($alertas) ) {
                    $usuario->password = null;

                    $usuario->password = $password->password;

                    $usuario->hashPassword();

                    $usuario->token = null;

                    $resultado = $usuario->guardar();

                    if ($resultado) {
                        header('Location: /');
                    }

                }

            }

            $router->render('auth/recuperar-password', [
                'alertas' => $alertas,
                'error' => $error,
            ]);
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

                        // Enviar E-mail
                        $email = new Email($usuario->email, $usuario->nombre, $usuario->token);

                        $email->enviarConfirmacion();

                        // Crear el Usuario
                        $resultado = $usuario->guardar();

                        if ($resultado) {
                            header('Location: /mensaje');
                        }

                        // debuguear($usuario);
                    }

                }

            }
            
            $router->render('auth/crear-cuenta', [
                'usuario' => $usuario,
                'alertas' => $alertas,
            ]);
        }

        public static function mensaje(Router $router) {

            $router->render('auth/mensaje', [

            ]);
        }

        public static function confirmar(Router $router) {
            $alertas = [];

            $token = s($_GET['token']);

            $usuario = Usuario::where('token', $token);

            if ( empty($usuario) ) {
                // Mostrar mensaje de error
                Usuario::setAlerta('error', 'Token No Válido');
            } else {
                // Modificar a usuario confirmado
                // debuguear($usuario);
                $usuario->confirmado = "1";
                // $usuario->token = null;
                $usuario->token = "";
                $usuario->guardar();

                Usuario::setAlerta('exito', 'Cuenta Comprobada Correctamente');
            }

            $alertas = Usuario::getAlertas();

            $router->render('auth/confirmar-cuenta', [
                'alertas' => $alertas,
            ]);
        }
        
    }