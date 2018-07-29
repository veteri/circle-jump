<?php
/**
 * Created by PhpStorm.
 * User: Midi
 * Date: 21.07.2018
 * Time: 10:37
 */

namespace App\Controllers;

use \Core\View;
use \App\Models\User;

class Signup extends \Core\Controller {

    /**
     * Display the register/sign up page
     *
     * @return void
     */
    public function newAction() {
        View::renderTemplate("Signup/signup");
    }

    /**
     * Register/sign up a new user
     *
     * @return void
     */
    public function createAction() {
        $user  = new User($_POST);


        if ($user->save()) {

            $user->sendActivationEmail();
            $this->redirect("/signup/success");

        } else {

            View::renderTemplate("Signup/signup", [
                "user" => $user
            ]);

        }
    }

    /**
     * Render the page of a successful
     * sign up / registration.
     *
     * @return void
     */
    public function successAction() {
        View::renderTemplate("Signup/success");
    }

    /**
     * Activate a new account
     *
     * @return void
     */
    public function activateAction() {
        User::activate($this->route_params["token"]);
        $this->redirect("/signup/activated");
    }

    /**
     * Render the activation success page.
     *
     * @return void
     */
    public function activatedAction() {
        View::renderTemplate("Signup/activated");
    }

}