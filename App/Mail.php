<?php


namespace App;


use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

/**
 * Send Mail using
 * PHPMailer
 *
 */
class Mail {

    /**
     * Send an e-mail.
     *
     * @param $to string recipient
     * @param $subject string
     * @param $text
     * @param $html
     */
    public static function send($to, $subject, $text, $html = null) {

        $mail = new PHPMailer(true);

        try {

            //$mail->SMTPDebug  = 2;
            $mail->isSMTP();
            $mail->Host       = Config::SMTP_HOST;
            $mail->Username   = Config::SMTP_USER;
            $mail->Password   = Config::SMTP_PASSWORD;
            $mail->Port       = Config::SMTP_PORT;
            $mail->SMTPAuth   = true;
            $mail->SMTPSecure = 'tls';


            $mail->setFrom(Config::SMTP_USER, "Circle Jump Support");
            $mail->addReplyTo(Config::SMTP_USER, 'CircleJump');
            $mail->addAddress($to);

            if ($html) {
                $mail->isHTML(true);
            }

            $mail->Subject = $subject;
            $mail->Body    = $html ?? $text;
            $mail->AltBody = $text;

            $mail->send();

        } catch (Exception $e) {

            throw new \Exception("E-Mail could not be sent. \n" . $mail->ErrorInfo);

        }
    }

}