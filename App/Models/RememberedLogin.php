<?php


namespace App\Models;

use App\Token;
use PDO;

class RememberedLogin extends \Core\Model {

    /**
     * The hash of the remembered login token.
     * @var string
     */
    public $token_hash;

    /**
     * The id of the user associated with this
     * remembered login.
     * @var int
     */
    public $user_id;

    /**
     * The datetime when this remembered login
     * will expire and lose its permissions.
     * @var string
     */
    public $expires_at;

    /**
     * Find a remembered login model by token
     *
     * @param $token string the remembered login token
     *
     * @return mixed remembered login object if found, false otherwise
     */
    public static function findByToken($token) {
        $token = new Token($token);
        $token_hash = $token->getHash();

        $sql = "SELECT * FROM remembered_logins WHERE token_hash = :token_hash";

        $db = static::getDB();

        $stmt = $db->prepare($sql);
        $stmt->bindValue("token_hash", $token_hash, PDO::PARAM_STR);
        $stmt->setFetchMode(PDO::FETCH_CLASS, get_called_class());
        $stmt->execute();

        return $stmt->fetch();
    }

    /**
     * Get the user model associated with this remembered login
     *
     * @return User the user model
     */
    public function getUser() {
        return User::findById($this->user_id);
    }

    /**
     * Determine if the remember token has expired.
     *
     * @return boolean true if expired, false otherwise
     */
    public function hasExpired() {
        return strtotime($this->expires_at) < time();
    }

    /**
     * Delete this model
     *
     * @return void
     */
    public function delete() {
        $sql = "DELETE FROM remembered_logins WHERE token_hash = :token_hash";
        $db = static::getDB();

        $stmt = $db->prepare($sql);
        $stmt->bindValue("token_hash", $this->token_hash);

        $stmt->execute();
    }
}