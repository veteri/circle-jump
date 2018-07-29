<?php
/**
 * Created by PhpStorm.
 * User: Midi
 * Date: 23.07.2018
 * Time: 16:47
 */

namespace App\Controllers;

use \Core\View;
use \App\Models\User;
use \App\Auth;
use \App\Flash;

class Login extends \Core\Controller {

    /**
     * Display login view
     *
     * @return void
     */
    public function newAction() {
        View::renderTemplate("Login/new");
    }

    /**
     * Perform a log in.
     *
     * @return void
     */
    public function performAction() {
        $user = User::authenticate($_POST["email"], $_POST["password"]);
        $remember_me = isset($_POST["remember_me"]);

        if ($user) {

            Auth::login($user, $remember_me);

            $this->redirect(Auth::getReturnToRoute());

        } else {

            Flash::addMessage("badCredentials", "Bad credentials or your account is inactive.", Flash::WARNING);

            View::renderTemplate("Login/new", [
                "email" => $_POST["email"],
                "remember_me" => $remember_me
            ]);

        }

    }

    /**
     * Performs a logout
     *
     * @return void
     */
    public function destroyAction() {
        Auth::logout();
        $this->redirect("/login/show-logout-message");
    }

    /**
     * Used to display a logged out flash message.
     * As we destroy the session in Auth::logout,
     * this has to be done with a new route.
     *
     * @return void
     */
    public function showLogoutMessageAction() {
        Flash::addMessage("logout", "You have been logged out.", Flash::SUCCESS);
        $this->redirect("/");
    }

}