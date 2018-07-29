<?php
/**
 * Created by PhpStorm.
 * User: Midi
 * Date: 25.07.2018
 * Time: 09:19
 */

namespace App\Controllers;
use \Core\View;
use \App\Models\User;

class Password extends \Core\Controller {

    /**
     * Display the forgotten password view
     *
     * @return void
     */
    public function forgotAction() {
        View::renderTemplate("Password/forgot");
    }

    /**
     * Sends the password reset link
     * to the given e-mail.
     *
     * @return void
     */
    public function requestResetAction() {
        User::sendPasswordReset($_POST["email"]);
        View::renderTemplate("Password/reset_requested");
    }

    /**
     * Show the reset password form
     */
    public function resetAction() {

        $token = $this->route_params["token"];

        $user = $this->getUserOrExit($token);

        View::renderTemplate("Password/reset", [
            "token" => $token
        ]);

    }

    /**
     * Reset the user's password.
     */
    public function resetPasswordAction() {

        $token = $_POST["token"];

        $user = $this->getUserOrExit($token);


        if ($user->resetPassword($_POST["password"], $_POST["password_confirmation"])) {

            View::renderTemplate("Password/reset_success");

        } else {

            View::renderTemplate("Password/reset", [
                "token" => $token,
                "user" => $user
            ]);

        }
    }

    protected function getUserOrExit($token) {
        $user = User::findByPasswordReset($token);

        if ($user) {
            return $user;
        } else {

            View::renderTemplate("Password/token_expired");
            exit;
        }

    }
}