<?php


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
     * The spawns of each level in the map.
     * @var 2D-array
     */
    public $spawns;


    /**
     * The array of the background scene keys
     * for this map.
     * @var string array
     */
    public $background_scenes;

    /**
     * The serialized levels array.
     * @var string
     */
    public $data;

    /**
     * Creation date of the map.
     * @var string
     */
    public $created_at;

    /**
     * Amount the map has been played.
     * @var int
     */
    public $play_amount;

    /**
     * The difficulty rating of this
     * map in 1 to 5. 5 being hardest.
     * @var int
     */
    public $difficulty;

    public $errors;

    public function __construct($data = []) {
        foreach($data as $key => $value) {
            if (json_decode($value)) {
                $this->$key = json_decode($value);
            } else {
                $this->$key = $value;
            }
        }
    }

    public static function submit($mapData) {

        $map = static::findById($mapData["id"]);
        $message = "";

        if ($map) {

            if ($map->canGetEditedByUser($_SESSION["user_id"]) && $map->update($mapData)) {
                $message = "Successfully updated.";
            } else {
                $message = "No permission to save map.";
            }

        } else {

            $map = new Map($mapData);

            if ($map->save()) {
                $message = "Successfully saved.";
            } else {
                $message = "Something went wrong. Map was not saved.";
            }

        }

        return $message;
    }


    public function update($mapData) {

        $this->name              = $mapData["name"];
        $this->background_scenes = $mapData["background_scenes"];
        $this->spawns            = $mapData["spawns"];
        $this->difficulty        = $mapData["difficulty"];
        $this->data              = $mapData["data"];

        $sql = "UPDATE maps
                SET name = :name,
                    background_scenes = :background_scenes,
                    spawns = :spawns,
                    data = :data,
                    difficulty = :difficulty
                WHERE author = :user_id AND id = :map_id";

        $db = static::getDB();
        $stmt = $db->prepare($sql);

        $stmt->bindValue(":name", $this->name, PDO::PARAM_STR);
        $stmt->bindValue(":background_scenes", $this->background_scenes, PDO::PARAM_STR);
        $stmt->bindValue(":spawns", $this->spawns, PDO::PARAM_STR);
        $stmt->bindValue(":data", $this->data, PDO::PARAM_STR);
        $stmt->bindValue(":difficulty", $this->difficulty, PDO::PARAM_STR);
        $stmt->bindValue(":user_id", $this->author, PDO::PARAM_INT);
        $stmt->bindValue(":map_id", $this->id, PDO::PARAM_INT);

        return $stmt->execute();

    }

    public function save() {

        $this->validate();

        if (empty($this->errors)) {

            $sql = "INSERT INTO maps
                    (name, author, background_scenes, spawns, data, difficulty)
                    VALUES
                    (:name, :author, :background_scenes, :spawns, :data, :difficulty)";

            $db   = static::getDB();
            $stmt = $db->prepare($sql);

            $stmt->bindValue(":name", $this->name, PDO::PARAM_STR);
            $stmt->bindValue(":author", $_SESSION["user_id"], PDO::PARAM_INT);
            $stmt->bindValue(":background_scenes", json_encode($this->background_scenes), PDO::PARAM_STR);
            $stmt->bindValue(":spawns", json_encode($this->spawns), PDO::PARAM_STR);
            $stmt->bindValue(":data", json_encode($this->data), PDO::PARAM_STR);
            $stmt->bindValue(":difficulty", $this->difficulty, PDO::PARAM_INT);

            return $stmt->execute();

        }

        return false;
    }

    public function validate() {

        if ($this->name === "") {
            $this->errors[] = "A map name is required.";
        }

        if (static::nameExists($this->name)) {
            $this->errors[] = "Map name already taken.";
        }
    }

    public static function getAll() {

        $sql = "SELECT * FROM maps";

        $db = static::getDB();
        $stmt = $db->prepare($sql);
        $stmt->execute();
        return $stmt->fetchAll();
    }

    public static function getAllSimple() {
        $sql = "SELECT 
                  maps.id, 
                  maps.name as name, 
                  maps.difficulty as difficulty,
                  maps.play_amount,
                  users.name as authorName
                FROM maps INNER JOIN users
                ON maps.author = users.id
                ORDER BY maps.difficulty ASC, users.id ASC";

        $db = static::getDB();
        $stmt = $db->prepare($sql);
        $stmt->execute();
        return $stmt->fetchAll();
    }

    public static function getCount() {
        $sql = "SELECT count(*) as count FROM maps";

        $db = static::getDB();
        $stmt = $db->prepare($sql);
        $stmt->execute();

        return $stmt->fetch()["count"];
    }

    public static function nameExists($name) {
        $map = static::findByName($name);
        return $map;
    }

    public static function findByName($name) {
        $sql = "SELECT * from maps WHERE name = :name";

        $db = static::getDB();
        $stmt = $db->prepare($sql);
        $stmt->bindValue(":name", $name, PDO::PARAM_STR);
        $stmt->setFetchMode(PDO::FETCH_CLASS, get_called_class());

        $stmt->execute();

        return $stmt->fetch();
    }

    /**
     * Finds a map by its id.
     *
     * @param $id
     * @return mixed the map if found, null otherwise
     */
    public static function findById($id) {

        //todo, do a join to get the name of the author, right now its only the author id
        $sql = "SELECT * FROM maps where id = :id";
        $db = static::getDB();

        $stmt = $db->prepare($sql);
        $stmt->bindValue("id", $id, PDO::PARAM_INT);
        $stmt->setFetchMode(PDO::FETCH_CLASS, get_called_class());
        $stmt->execute();

        return $stmt->fetch();
    }

    public static function findByUserId($user_id) {
        $sql = "SELECT * FROM maps WHERE author = :user_id";

        $db = static::getDB();
        $stmt = $db->prepare($sql);

        $stmt->bindValue(":user_id", $user_id, PDO::PARAM_INT);
        $stmt->setFetchMode(PDO::FETCH_CLASS, get_called_class());
        $stmt->execute();

        return $stmt->fetch();
    }

    public static function getAllByUserId($user_id) {
        $sql = "SELECT * FROM maps WHERE author = :user_id";

        $db = static::getDB();
        $stmt = $db->prepare($sql);
        $stmt->bindValue(":user_id", $user_id, PDO::PARAM_INT);
        $stmt->setFetchMode(PDO::FETCH_OBJ);
        $stmt->execute();

        return $stmt->fetchAll();
    }

    public function canGetEditedByUser($user_id) {
        return $this->author == $user_id;
    }

    public function incrementPlayAmount() {

        $newPlayAmount = $this->play_amount + 1;

        $sql = "UPDATE maps
                SET play_amount = :play_amount
                WHERE id = :map_id";

        $db = static::getDB();
        $stmt = $db->prepare($sql);

        $stmt->bindValue(":play_amount", $newPlayAmount, PDO::PARAM_INT);
        $stmt->bindValue(":map_id", $this->id, PDO::PARAM_INT);

        $stmt->execute();

    }

    public function getInMapFormat() {
        return [
            "meta"   => [
                "id"               => $this->id,
                "author"           => $this->author,
                "name"             => $this->name,
                "difficulty"       => $this->difficulty,
                "spawns"           => json_decode($this->spawns),
                "backgroundScenes" => json_decode($this->background_scenes)
            ],
            "levels" => json_decode($this->data)
        ];
    }
}