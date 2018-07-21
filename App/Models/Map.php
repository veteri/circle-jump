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

    public static function getAll() {

        try {
            $db = static::getDB();
            $stmt = $db->query("select * from maps");
            $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
            return $result;
        } catch (\PDOException $e) {
            $e->getMessage();
        }

    }
}