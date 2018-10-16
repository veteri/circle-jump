<?php

namespace App\Models;
use PDO;
use \Core\Model;
use \App\Token;
use \App\Mail;
use \Core\View;

class User extends Model {

    /**
     * The id of the user
     * @var string
     */
    public $id;

    /**
     * The name of the user.
     * @var string
     */
    public $name;

    /**
     * The email of the user.
     * @var string
     */
    public $email;

    /**
     * The password of the user.
     * @var string
     */
    public $password;

    /**
     * The confirmation the password.
     * (It needs to match the password)
     * @var string
     */
    public $password_confirmation;

    /**
     * The password hash of the users password.
     * Protected so all views rendered by twig
     * wont have access to this.
     * @var string
     */

    protected $password_hash;

    /**
     * The value of the remember token
     * used to remember user login.
     * @var string
     */
    public $remember_token;

    /**
     * The expiry date of the remember token
     * for this user.
     * @var string
     */
    public $expiry_timestamp;


    /**
     * The value of the password reset token.
     * The related hash is stored in the users table.
     * @var string
     */
    public $password_reset_token;

    /**
     * The value of the account activation token.
     * The related hash is stored in the users table.
     * @var string
     */
    public $activation_token;

    /**
     * Error messages when properties
     * don't pass validate method.
     * @var array
     */
    public $errors = [];

    /**
     * User constructor.
     *
     * @param $data array
     *      Must contain:
     *          name,
     *          email,
     *          password,
     *          password_confirm.
     *
     * @return void
     */
    public function __construct($data = []) {
        foreach($data as $key => $value) {
            $this->$key = $value;
        }
    }

    /**
     * Get all users
     *
     * @return mixed
     */
    public function getAll() {
        $db = static::getDB();
        $stmt = $db->prepare("SELECT id, name FROM users");
        return $stmt->fetchAll(PDO::FETCH_OBJ);
    }

    /**
     * Save a new user to the users table.
     */
    public function save() {

        $this->validate();

        if (empty($this->errors)) {

            $password_hash = password_hash($this->password, PASSWORD_DEFAULT);
            $token = new Token();
            $hashed_token = $token->getHash();
            $this->activation_token = $token->getValue();

            $sql = "INSERT INTO users 
                    (name, email, password_hash, activation_hash) 
                    VALUES 
                    (:name, :email, :password_hash, :activation_hash)";

            $db = static::getDB();
            $stmt = $db->prepare($sql);

            $stmt->bindValue(":name", $this->name, PDO::PARAM_STR);
            $stmt->bindValue(":email", $this->email, PDO::PARAM_STR);
            $stmt->bindValue(":password_hash", $password_hash, PDO::PARAM_STR);
            $stmt->bindValue(":activation_hash", $hashed_token, PDO::PARAM_STR);

            return $stmt->execute();

        }

        return false;
    }

    /**
     * Validate the properties.
     * Adds errors if there are any
     * to error property array.
     */
    public function validate() {

        //Validate the name of the user
        if ($this->name == "") {
            $this->errors["emptyName"] = "A user name is required.";
        }

        //Validate that the username is not already taken
        if (static::nameExists($this->name, $this->id ?? null)) {
            $this->errors["nameTaken"] = "User name already taken.";
        }

        //Validate the email of the user
        if (filter_var($this->email, FILTER_VALIDATE_EMAIL) === false) {
            $this->errors["invalidEmail"] = "Please type in a valid e-mail address.";
        }

        //Validate that the email is not already taken
        if (static::emailExists($this->email, $this->id ?? null)) {
            $this->errors["emailTaken"] = "E-mail already in use.";
        }

        //Validate if passwords match
        if ($this->password != $this->password_confirmation) {
            $this->errors["passwordNoMatch"] = "Your passwords do not match.";
        }

        //Validate if password contains atleast one letter
        if (preg_match("/.*[a-z]+.*/i", $this->password) === 0) {
            $this->errors["passwordNoLetter"] = "Passwords need atleast one letter.";
        }

        //Validate if password contains atleast one number
        if (preg_match("/.*\d+.*/i", $this->password) === 0) {
            $this->errors["passwordNoNumber"] = "Passwords need atleast one number.";
        }

    }

    /**
     * Check if an e-mail is already in use.
     * ~
     * @param $email
     * @return bool
     */
    public static function emailExists($email, $ignore_id = null) {

        $user = static::findByEmail($email);
        return $user && $user->id !== $ignore_id;
    }

    public static function findByEmail($email) {
        $sql = "SELECT * FROM users where email = :email";
        $db = static::getDB();

        $stmt = $db->prepare($sql);
        $stmt->bindValue("email", $email, PDO::PARAM_STR);
        $stmt->setFetchMode(PDO::FETCH_CLASS, get_called_class());

        $stmt->execute();

        return $stmt->fetch();
    }

    public static function nameExists($name, $ignore_id = null) {
        $user = static::findByName($name);
        return $user && $user->id !== $ignore_id;
    }

    public static function findByName($name) {
        $sql = "SELECT * FROM users WHERE name = :name";

        $db = static::getDB();
        $stmt = $db->prepare($sql);
        $stmt->bindValue(":name", $name, PDO::PARAM_STR);
        $stmt->setFetchMode(PDO::FETCH_CLASS, get_called_class());

        $stmt->execute();

        return $stmt->fetch();
    }

    public static function authenticate($email, $password) {
        $user = static::findByEmail($email);

        if ($user && $user->is_active) {
            if (password_verify($password, $user->password_hash)) {
                return $user;
            }
        }

        return false;
    }

    public static function findById($id) {
        $sql = "SELECT * FROM users where id = :id";

        $db = static::getDB();
        $stmt = $db->prepare($sql);
        $stmt->bindValue("id", $id, PDO::PARAM_INT);

        /** @noinspection PhpMethodParametersCountMismatchInspection
         *  PHPStorm has a bug that doesn't properly inspect setFetchMode
         */
        $stmt->setFetchMode(PDO::FETCH_CLASS, get_called_Class());
        $stmt->execute();

        return $stmt->fetch();
    }

    /**
     * Remember a logged in user by a unique token
     * related to this user in 'remembered_logins' table.
     *
     * @return boolean True if the login was remembered, false otherwise
     */
    public function rememberLogin() {
        $token = new Token();
        $hashed_token = $token->getHash();
        $this->remember_token = $token->getValue();

        $this->expiry_timestamp = time() + 60 * 60 * 24 * 7; //1 week from now

        $sql = "INSERT INTO remembered_logins (token_hash, user_id, expires_at) VALUES (:token_hash, :user_id, :expires_at)";
        $db = static::getDB();
        $stmt = $db->prepare($sql);

        $stmt->bindValue("token_hash", $hashed_token, PDO::PARAM_STR);
        $stmt->bindValue("user_id", $this->id, PDO::PARAM_INT);
        $stmt->bindValue("expires_at", date("Y-m-d H:i:s", $this->expiry_timestamp), PDO::PARAM_STR);

        return $stmt->execute();
    }

    /**
     * Send password reset instruction to the user specified
     * by the given e-mail.
     *
     * @param $email string the email to send the instructions to
     */
    public static function sendPasswordReset($email) {

        $user = static::findByEmail($email);

        if ($user) {

            if ($user->startPasswordReset()) {

                $user->sendPasswordResetEmail();

            }
        }

    }

    /**
     * Start the password reset process by generating a new token and expiry
     *
     * @return boolean
     */
    protected function startPasswordReset() {
        $token = new Token();
        $hashed_token = $token->getHash();
        $this->password_reset_token = $token->getValue();

        $expiry_timestamp = time() + 60 * 60 * 2;

        $sql = "UPDATE users
                SET password_reset_hash = :token_hash,
                    password_reset_expires_at = :expires_at
                WHERE id = :id";

        $db = static::getDB();

        $stmt = $db->prepare($sql);
        $stmt->bindValue("token_hash", $hashed_token, PDO::PARAM_STR);
        $stmt->bindValue("expires_at", date("Y-m-d H:i:s", $expiry_timestamp), PDO::PARAM_STR);
        $stmt->bindValue("id", $this->id, PDO::PARAM_INT);

        return $stmt->execute();
    }

    /**
     * Send password reset instructions in an email
     * to the user.
     *
     * @return void
     */
    protected function sendPasswordResetEmail() {
        $url = "http://" . $_SERVER["HTTP_HOST"] . "/password/reset/" . $this->password_reset_token;

        $data = [
            "url" => $url,
            "user" => $this
        ];

        $text = View::getTemplate("Password/reset_email_plain", $data);
        $html = View::getTemplate("Password/reset_email", $data);

        Mail::send($this->email, "Password Reset", $text, $html);
    }


    /**
     * Find a user model by password reset token and expiry.
     *
     * @param $token string Password reset token sent to user by email.
     *
     * @return mixed User object if found and the token hasn't expired, null otherwise.
     */
    public static function findByPasswordReset($token) {
        $token = new Token($token);
        $hashed_token = $token->getHash();

        $sql = "SELECT * FROM users
                WHERE password_reset_hash = :token_hash";

        $db = static::getDB();
        $stmt = $db->prepare($sql);

        $stmt->bindValue("token_hash", $hashed_token, PDO::PARAM_STR);
        $stmt->setFetchMode(PDO::FETCH_CLASS, get_called_class());
        $stmt->execute();

        $user = $stmt->fetch();

        if ($user) {

            if (strtotime($user->password_reset_expires_at) > time()) {

                return $user;

            }

        }

        return null;

    }

    /**
     * Reset a users password
     * @param $password
     */
    public function resetPassword($password, $password_confirmation) {
        $this->password = $password;
        $this->password_confirmation = $password_confirmation;
        $this->validate();

        if (empty($this->errors)) {

            $password_hash = password_hash($this->password, PASSWORD_DEFAULT);

            $sql = "UPDATE users
                    SET password_hash = :password_hash,
                        password_reset_hash = NULL,
                        password_reset_expires_at = NULL 
                    WHERE id = :id";

            $db = static::getDB();
            $stmt = $db->prepare($sql);

            $stmt->bindValue("id", $this->id, PDO::PARAM_INT);
            $stmt->bindValue("password_hash", $password_hash, PDO::PARAM_STR);

            return $stmt->execute();

        }

        return false;
    }

    /**
     * Send activation email to the user.
     *
     * @return void
     */
    public function sendActivationEmail() {
        $url = "http://" . $_SERVER["HTTP_HOST"] . "/signup/activate/" . $this->activation_token;

        $data = [
            "url" => $url,
            "user" => $this
        ];

        $text = View::getTemplate("Signup/activation_email_plain", $data);
        $html = View::getTemplate("Signup/activation_email", $data);

        Mail::send($this->email, "Account activation", $text, $html);
    }

    /**
     * Activate the user account with the specified activation token
     *
     * @param $value
     * @return void
     */
    public static function activate($value) {
        $token = new Token($value);
        $hashed_token = $token->getHash();

        $sql = "UPDATE users
                SET is_active = 1,
                    activation_hash = NULL
                WHERE activation_hash = :activation_hash";

        $db = static::getDB();
        $stmt = $db->prepare($sql);

        $stmt->bindValue("activation_hash", $hashed_token, PDO::PARAM_STR);
        $stmt->execute();
    }
}