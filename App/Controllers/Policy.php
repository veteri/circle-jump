<?php


namespace App\Controllers;
use Core\View;

class Policy extends \Core\Controller {

    public function termsOfUse() {
        View::renderTemplate("Policy/tos");
    }

    public function privacyPolicy() {
        View::renderTemplate("Policy/privacypolicy");
    }

}