<?php
/**
 * Created by PhpStorm.
 * User: Midi
 * Date: 28.07.2018
 * Time: 10:18
 */

namespace App\Models;

use PDO;

class Highscore extends \Core\Model {

    /**
     * The id of the highscore.
     * @var int
     */
    public $id;

    /**
     * The id of the user who
     * achieved the highscore
     * @var int
     */
    public $user_id;

    /**
     * The id of the map on which
     * the highscore has been achieved
     * @var int
     */
    public $map_id;

    /**
     * The time in milli seconds in which
     * the map has been completed.
     * @var int
     */
    public $time;


    /**
     * Saves a new highscore
     * with the given time.
     *
     * @param $time int Time in ms for map completion
     * @return bool if successful, false otherwise
     */
    public static function save($time) {
        $sql = "INSERT INTO highscores (user_id, map_id, time) VALUES (:user_id, :map_id, :time)";

        $db = static::getDB();
        $stmt = $db->prepare($sql);
        $stmt->bindValue("user_id", $_SESSION["user_id"], PDO::PARAM_INT);
        $stmt->bindValue("map_id", $_SESSION["map_id"], PDO::PARAM_INT);
        $stmt->bindValue("time", $time, PDO::PARAM_INT);

        return $stmt->execute();
    }

    /**
     * Updates a users highscore
     * @param $time
     * @return bool
     */
    public function update($time) {

        if ($this->isFasterTime($time)) {

            $sql = "UPDATE highscores SET time = :time WHERE user_id = :user_id AND map_id = :map_id";

            $db = static::getDB();
            $stmt = $db->prepare($sql);
            $stmt->bindValue("time", $time, PDO::PARAM_INT);
            $stmt->bindValue("user_id", $this->user_id, PDO::PARAM_INT);
            $stmt->bindValue("map_id", $_SESSION["map_id"], PDO::PARAM_INT);

            return $stmt->execute();

        }

        return false;
    }


    public static function submit($map_id, $time) {

        $highscore = Highscore::findByUserMap($_SESSION["user_id"], $map_id);

        if ($highscore) {
            $highscore->update($time);
        } else {
            Highscore::save($time);
        }

    }

    public function isFasterTime($time) {
        return $time < $this->time;
    }

    public static function findByUserMap($user_id, $map_id) {
        $sql = "SELECT * FROM highscores WHERE user_id = :user_id AND map_id = :map_id";

        $db = static::getDB();
        $stmt = $db->prepare($sql);

        $stmt->bindValue("user_id", $user_id, PDO::PARAM_INT);
        $stmt->bindValue("map_id", $map_id, PDO::PARAM_INT);
        $stmt->setFetchMode(PDO::FETCH_CLASS, get_called_class());

        $stmt->execute();

        return $stmt->fetch();
    }

    public static function getScoresByMapId($map_id) {

        $sql = "SELECT 
                  users.id,
                  users.name, 
                  highscores.time 
                FROM users INNER JOIN highscores 
                ON users.id = highscores.user_id 
                WHERE highscores.map_id = :map_id
                ORDER BY highscores.time ASC";

        $db = static::getDB();

        $stmt = $db->prepare($sql);
        $stmt->bindValue("map_id", $map_id, PDO::PARAM_INT);
        $stmt->setFetchMode(PDO::FETCH_OBJ);
        $stmt->execute();

        return $stmt->fetchAll();

    }

}