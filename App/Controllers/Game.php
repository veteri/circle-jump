<?php

namespace App\Controllers;
use \Core\View;
use \App\Models\Map;

class Game extends Authenticated {

    public function playAction() {

        $maps = Map::getAllSimple();

        View::renderTemplate("Game/play", [
            "maps" => $maps
        ]);
    }

    public function editAction() {

        $maps = Map::getAllByUserId($_SESSION["user_id"]);

        View::renderTemplate("Game/editor", [
            "maps" => $maps
        ]);
    }


}