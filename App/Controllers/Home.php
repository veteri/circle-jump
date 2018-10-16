<?php

namespace App\Controllers;
use \Core\View;
use App\Models\Map;

class Home extends \Core\Controller {

    public function indexAction() {

        $mapCount = Map::getCount();

        View::renderTemplate("Home/index", [
            "mapCount" => $mapCount
        ]);
    }

}