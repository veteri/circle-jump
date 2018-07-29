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

    public function submitScoreAction() {
        echo "Game controller submitScore method";
    }


}