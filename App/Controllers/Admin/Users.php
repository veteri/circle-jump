<?php

namespace App\Controllers\Admin;

class Users extends \Core\Controller {

    protected function before() {
        //make sure user logged in
        //return false;
    }

    public function index() {
        echo "admin user";
    }

    protected function after() {

    }
}