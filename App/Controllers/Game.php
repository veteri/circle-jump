<?php

namespace App\Controllers;
use Core\View;
use App\Models\Map;

class Game extends \Core\Controller {

    public function playAction() {

        $maps = Map::getAll();

        View::renderTemplate("Game/play", [
            "maps" => $maps
        ]);
    }

    public function submitScoreAction() {
        echo "Game controller submitScore method";
    }


}