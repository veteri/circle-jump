<?php

namespace App\Controllers;
use Core\View;

class Home extends \Core\Controller {

    protected function before() {
    }

    protected function after() {
    }

    public function indexAction() {
        View::render("Home/index.php", [
            "maps" => ["galaxy", "palm", "mystic"]
        ]);
    }

    public function editAction() {

        echo "Edit";
        var_dump($this->route_params);
    }
}