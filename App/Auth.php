<?php
/**
 * Created by PhpStorm.
 * User: Midi
 * Date: 23.07.2018
 * Time: 20:29
 */

namespace App;

use App\Models\RememberedLogin;
use \App\Models\User;

/**
 * Responsible for authentication.
 */
class Auth {

    /**
     * Login the given user.
     * @param $user
     */
    public static function login(User $user, $remember_me) {

        session_regenerate_id(true);
        $_SESSION["user_id"] = $user->id;

        if ($remember_me) {
            if ($user->rememberLogin()) {
                setcookie("remember_me", $user->remember_token, $user->expiry_timestamp, "/");
            }
        }
    }

    /**
     * Logout the user
     */
    public static function logout() {
        $_SESSION = [];

        if (ini_get("session.use_cookies")) {
            $params = session_get_cookie_params();

            setcookie(
                session_name(),
                "",
                time() - 42000,
                $params["path"],
                $params["domain"],
                $params["secure"],
                $params["httponly"]
            );
        }

        session_destroy();

        static::forgetLogin();
    }

    /**
     * Checks if the user is logged in.
     *
     * @return bool
     */
    public static function isLoggedIn() {
        return isset($_SESSION["user_id"]);
    }

    /**
     * Remember the login requested route that
     * the user tried to access.
     *
     * @return void
     */
    public static function rememberRequestedRoute() {
        $_SESSION["return_to"] = $_SERVER["REQUEST_URI"];
    }

    /**
     * Returns the route that the user originally
     * requested after being redirected to login.
     *
     * @return string
     */
    public static function getReturnToRoute() {
        return $_SESSION["return_to"] ?? "/";
    }

    /**
     * Get the current authenticated (logged in) user
     * from the session or the remember-me cookie.
     *
     * @return mixed User model if logged in, null otherwise
     */
    public static function getUser() {

        $user = null;

        if (isset($_SESSION["user_id"])) {
            $user = User::findById($_SESSION["user_id"]);
        } else {
            $user = static::loginFromRememberCookie();
        }

        return $user;
    }

    /**
     * Login a user from his remember me cookie.
     *
     * @return mixed the user model if a login cookie is found, null otherwise
     */
    protected static function loginFromRememberCookie() {

        $user = null;
        $cookie = $_COOKIE["remember_me"] ?? false;

        if ($cookie) {

            $remembered_login = RememberedLogin::findByToken($cookie);

            if ($remembered_login && !$remembered_login->hasExpired()) {
                $user = $remembered_login->getUser();
                static::login($user, false);
            }

        }

        return $user;
    }

    protected static function forgetLogin() {
        $cookie = $_COOKIE["remember_me"] ?? false;

        if ($cookie) {

            $remembered_login = RememberedLogin::findByToken($cookie);

            if ($remembered_login) {

                $remembered_login->delete();

            }

            setcookie("remember_me", "", time() - 3600, "/");
        }
    }


}