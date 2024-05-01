<?php
    namespace Classes;

    use PHPMailer\PHPMailer\PHPMailer;

    class Email {
        public $email;
        public $nombre;
        public $token;

        public function __construct($email, $nombre, $token)
        {
            $this->email = $email;
            $this->nombre = $nombre;
            $this->token = $token;
        }

        public function enviarConfirmacion() {
            // Crear OBJETO de E-mail
            $mail = new PHPMailer();
            $mail->isSMTP();
            $mail->Host = 'sandbox.smtp.mailtrap.io';
            $mail->SMTPAuth = true;
            $mail->Port = 2525;
            $mail->Username = '87373b70d870ab';
            $mail->Password = '823e7a985473ae';

            $mail->setFrom('cuenta@rudeboys.com');
            $mail->addAddress('cuenta@rudeboys.com', 'RudeBoyds.com');
            $mail->Subject = 'Confirma tu cuenta';

            // Set HTML
            $mail->isHTML(TRUE);
            $mail->CharSet = 'UTF-8';

            $contenido = "<html>";
            $contenido .= "<p> Hola <strong> " . $this->email . " </strong> Has creado tu cuenta en RudeBoys Barber, solo debes confirmarla presionando el siguiente enlace: </p>";
            $contenido .= "<p>Presiona aquí -> <a href='http://localhost:3000/confirmar-cuenta?token=" . $this->token . "'>Confirmar Cuenta</a> <-</p>";
            $contenido .= "<p>Si tu no solicitaste esta cuenta, puedes ignorar el mensaje</p>";
            $contenido .= "</html>";

            $mail->Body = $contenido;

            // Enviar E-mail
            $mail->send();
        }
        
    }