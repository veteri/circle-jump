<?php


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
            $map->incrementPlayAmount();
            $response = $map->getInMapFormat();
            $_SESSION["map_id"] = $map->id;
        }

        $this->respondWithJson(json_encode($response));
    }

    /**
     * AJAX Routine to get the scores for
     * a specific map by id.
     *
     * @return void
     */
    public function getHighscores() {
        $highscores = Highscore::getScoresByMapId($_POST["id"]);
        $highscores = Highscore::markUser($highscores, $_SESSION["user_id"]);
        $this->respondWithJson(json_encode($highscores));
    }

    /**
     * AJAX Routine to save a speedrun time,
     * referred to as "highscore".
     *
     * @return void
     */
    public function submitTimeAction() {

        $rightShift    = $_POST["a"] ?? null;
        $addendIndex   = $_POST["b"] ?? null;
        $time          = $_POST["c"] ?? null;
        $shiftedTime   = $_POST["d"] ?? null;

        $user_id = $_SESSION["user_id"];
        $map_id  = $_SESSION["map_id"];

        if ($time) {

            if (Highscore::isLegitimate($time, $rightShift, $addendIndex, $shiftedTime)) {

                $time = Highscore::getDecodedTime($time, $rightShift, $addendIndex);
                Highscore::submit($map_id, $time);

            }

        }

        $highscores = Highscore::getScoresByMapId($map_id);
        $highscores = Highscore::markUser($highscores, $user_id);

        $this->respondWithJson(json_encode([
           "rankings" => $highscores,
           "time"     => $time
        ]));


    }

    public function publishAction() {

        $data = [
            "id"                => $_POST["id"],
            "author"            => $_SESSION["user_id"],
            "name"              => $_POST["name"],
            "difficulty"        => $_POST["diff"],
            "background_scenes" => $_POST["scenes"],
            "spawns"            => $_POST["spawns"],
            "data"              => $_POST["levels"]
        ];

        $message = MapModel::submit($data);
        $map = MapModel::findByName($data["name"]);

        $this->respondWithJson(json_encode([
            "msg" => $message,
            "map" => $map
        ]));

    }

    public function isLegitAction() {
        $rightShift    = $_GET["a"] ?? null;
        $addendIndex   = $_GET["b"] ?? null;
        $time          = $_GET["c"] ?? null;
        $shiftedTime   = $_GET["d"] ?? null;

        echo Highscore::isLegitimate($time, $rightShift, $addendIndex, $shiftedTime);

    }
}