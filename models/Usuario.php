<?php
    namespace Model;

    class Usuario extends ActiveRecord {
        // Base de datos
        protected static $tabla = 'usuarios';

        protected static $columnasDB = [
            'id',
            'nombre',
            'apellido',
            'email',
            'password',
            'telefono',
            'admin',
            'confirmado',
            'token'
        ];

        public $id;
        public $nombre;
        public $apellido;
        public $email;
        public $password;
        public $telefono;
        public $admin;
        public $confirmado;
        public $token;

        public function __construct($args = [])
        {
            $this->id = $args['id'] ?? null;
            $this->nombre = $args['nombre'] ?? '';
            $this->apellido = $args['apellido'] ?? '';
            $this->email = $args['email'] ?? '';
            $this->password = $args['password'] ?? '';
            $this->telefono = $args['telefono'] ?? '';
            $this->admin = $args['admin'] ?? '0';
            $this->confirmado = $args['confirmado'] ?? '0';
            $this->token = $args['token'] ?? '';
        }

        // Mensajes de validación para creación de cuenta
        public function validarNuevaCuenta() {
            if (!$this->nombre) {
                self::$alertas['error'][] = 'El Nombre del Cliente es obligatorio';
            }

            if (!$this->apellido) {
                self::$alertas['error'][] = 'El Apellido del Cliente es obligatorio';
            }

            if (!$this->email) {
                self::$alertas['error'][] = 'ElE-mail es obligatorio';
            }

            if (!$this->password) {
                self::$alertas['error'][] = 'El Password es obligatorio';
            } else if ($this->password < 6) {
                self::$alertas['error'][] = 'El Password debe contener al menos 6 carácteres';
            }

            return self::$alertas;
        }

        public function validarLogin() {
            if (!$this->email) {
                self::$alertas['error'][] = 'El E-mail es obligatorio';
            }

            if (!$this->password) {
                self::$alertas['error'][] = 'El Password es obligatorio';
            }

            return self::$alertas;
        }

        // Revisa si el usuario existe
        public function existeUsuario() {
            $query = "SELECT * FROM " . self::$tabla . " WHERE email = '" . $this->email . "' LIMIT 1";
            
            $resultado = self::$db->query($query);

            if ($resultado->num_rows) {
                self::$alertas['error'][] = 'El Usuario ya esta registrado';
            }

            return $resultado;
        }

        public function hashPassword() {
            $this->password = password_hash($this->password, PASSWORD_BCRYPT);
        }

        public function crearToken() {
            $this->token = uniqid();
        }

        public function comprobarPasswordAndVerificado($password) {
            $resultado = password_verify($password, $this->password);
            // debuguear($resultado); o ah: debuguear($this);
            if (!$resultado || !$this->confirmado) {
                self::$alertas['error'][] = 'Password Incorrecto o tu cuenta no ha sido confirmada';
            } else {
                return true;
            }

        }

    }