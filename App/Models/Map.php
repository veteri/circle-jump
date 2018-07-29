<?php
/**
 * Created by PhpStorm.
 * User: Midi
 * Date: 18.07.2018
 * Time: 09:58
 */

namespace App\Models;

use PDO;

class Map extends \Core\Model {

    /**
     * The id of the map.
     * @var int
     */
    public $id;

    /**
     * The author of the map
     * @var string
     */
    public $author;

    /**
     * The name of the map
     * @var string
     */
    public $name;

    /**
     * The x value of the map's spawn.
     * @var int
     */
    public $spawn_x;

    /**
     * The y value of the map's spawn.
     * @var int
     */
    public $spawn_y;

    /**
     * The key of the background scene
     * for this map.
     * @var string
     */
    public $background_scene;

    /**
     * The serialized levels array.
     * @var string
     */
    public $data;

    public static function getAll() {

        $sql = "SELECT * FROM maps";

        $db = static::getDB();
        $stmt = $db->prepare($sql);
        $stmt->execute();
        return $stmt->fetchAll();
    }

    public static function getAllSimple() {
        $sql = "SELECT id, name FROM maps";

        $db = static::getDB();
        $stmt = $db->prepare($sql);
        $stmt->execute();
        return $stmt->fetchAll();
    }

    /**
     * Finds a map by its id.
     *
     * @param $id
     * @return mixed the map if found, null otherwise
     */
    public static function findById($id) {
        $sql = "SELECT * FROM maps where id = :id";
        $db = static::getDB();

        $stmt = $db->prepare($sql);
        $stmt->bindValue("id", $id, PDO::PARAM_INT);
        $stmt->setFetchMode(PDO::FETCH_CLASS, get_called_class());
        $stmt->execute();

        return $stmt->fetch();
    }


    public function getInMapFormat() {
        return [
            "meta"   => [
                "id"              => $this->id,
                "author"          => $this->author,
                "name"            => $this->name,
                "spawn"           => [(int)$this->spawn_x, (int)$this->spawn_y],
                "backgroundScene" => $this->background_scene
            ],
            "levels" => json_decode($this->data)
        ];
    }
}