<?php
/**
 * Created by PhpStorm.
 * User: Midi
 * Date: 26.07.2018
 * Time: 23:43
 */

namespace App\Controllers;
use \App\Models\Map as MapModel;
use \App\Models\Highscore;

class Map extends Authenticated {

    /**
     * AJAX Routine to get a specific map
     * by its ID.
     *
     * @return void
     */
    public function getAction() {

        $id = $_GET["id"] ?? null;
        $map = MapModel::findById($id);

        $response = [];

        if ($map) {
            $response = $map->getInMapFormat();
            $_SESSION["map_id"] = $map->id;
        }

        $this->respondWithJson(json_encode($response));
    }

    /**
     * AJAX Routine to save a speedrun time,
     * referred to as "highscore".
     *
     * @return void
     */
    public function submitTimeAction() {

        $time = $_POST["time"] ?? null;
        $user_id = $_SESSION["user_id"];
        $map_id = $_SESSION["map_id"];

        if ($time) {

           Highscore::submit($map_id, $time);

            $highscores = Highscore::getScoresByMapId($map_id);

            foreach($highscores as $index => $highscore) {

                if ($highscore->id === $user_id) {
                    $highscores[$index]->player = true;
                }

            }

            $this->respondWithJson(json_encode($highscores));
        }


    }
}