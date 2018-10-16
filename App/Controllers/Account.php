<?php


namespace App\Controllers;

use \App\Models\User;

class Account extends \Core\Controller {

    /**
     * Validate if the email sent is
     * not already in use.
     * Ajax Routine for signing up.
     *
     * @return void
     */
    public function validateEmailAction() {
        $emailValid = !User::emailExists($_GET["email"]);
        header("Content-Type: application/json");
        echo json_encode($emailValid);
    }

    /**
     * Validate if the name sent is
     * not already in use.
     * Ajax routine for signing up.
     *
     * @return void
     */
    public function validateName() {
        $validName = !User::nameExists($_GET["name"]);
        header("Content-Type: application/json");
        echo json_encode($validName);
    }
}