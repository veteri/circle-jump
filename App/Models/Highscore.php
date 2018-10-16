<?php

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

    public static function getDecodedTime($time, $rightShift, $addendIndex) {

        if ($time === null || $rightShift === null || $addendIndex === null) {
            return false;
        }

        $rightShift  = $rightShift  - 0xc79d8b;
        $addendIndex = $addendIndex - 0xc79d8b;

        $addend = [0xc8419b, 0xc7a2c4, 0xc79d8b][$addendIndex];

        return ($time - $addend) >> $rightShift;
    }

    public static function isLegitimate($time, $rightShift, $addendIndex, $shiftedTime) {
        /*
            a = rightShift
            b = addendIndex
            c = addend
            d = shiftedTime
        */

        if ($time === null || $rightShift === null || $addendIndex === null || $shiftedTime === null) {
            return false;
        }

        $offset = 0xc79d8b;

        $rightShift  = $rightShift  - $offset;
        $addendIndex = $addendIndex - $offset;
        $shiftedTime = $shiftedTime - $offset;

        //var_dump($rightShift);
        //var_dump($addendIndex);
        //var_dump($shiftedTime);

        $addend = [0xc8419b, 0xc7a2c4, 0xc79d8b][$addendIndex];
        //var_dump($addend);
        $decodedTime = ($time - $addend) >> $rightShift;
        //var_dump($decodedTime);

        $isValidA = $rightShift >= 0 && $rightShift <= 3;
        $isValidB = $addendIndex >= 0 && $addendIndex <= 2;
        $isValidD = ($shiftedTime >> 3) == $time;
        $isValidDecodedTime = $decodedTime >= 1;

        return $isValidA && $isValidB && $isValidD && $isValidDecodedTime;

               
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
                  highscores.time,
                  highscores.map_id
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

    public static function markUser($highscores, $user_id) {
        foreach($highscores as $index => $highscore) {

            if ($highscore->id === $user_id) {
                $highscores[$index]->player = true;
            }

        }

        return $highscores;
    }

}