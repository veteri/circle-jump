<?php
/**
 * Created by PhpStorm.
 * User: Midi
 * Date: 06.07.2018
 * Time: 17:38
 */

/**
 * Composer, autoload all vendor autoloaders and framework classes
 * Framework specific class are defined in composer.json with their
 * namespace and path (which is identical).
 */

require_once dirname(__DIR__) . "/vendor/autoload.php";


/*spl_autoload_register(function($class) {
   $root = dirname(__DIR__);
   $file = $root . "/" . str_replace("\\", "/", $class) . ".php";
   if (is_readable($file)) {
       require $file;
   }
});*/

/**
 * Error and Exception handling
 */

error_reporting(E_ALL);
set_error_handler("Core\Error::errorHandler");
set_exception_handler("Core\Error::exceptionHandler");


/**
 * Start or resume sessions
 */

session_start();

/**
 * Routing
 */

$router = new Core\Router();

//Adding routes
$router->add("", ["controller" => "Home", "action" => "index"]);

$router->add("signup", ["controller" => "Signup", "action" => "new"]);
$router->add("login", ["controller" => "Login", "action" => "new"]);
$router->add("logout", ["controller" => "Login", "action" => "destroy"]);
$router->add("password/reset/{token:[\da-f]+}", ["controller" => "Password", "action" => "reset"]);
$router->add("signup/activate/{token:[\da-f]+}", ["controller" => "Signup", "action" => "activate"]);

$router->add("play", ["controller" => "Game", "action" => "play"]);

$router->add("privacy-policy", ["controller" => "Signup", "action" => "info"]);
$router->add("terms-of-use", ["controller" => "Signup", "action" => "info2"]);

$router->add("{controller}/{action}");
$router->add("{controller}/{action}/{id:\d+}");
$router->add("admin/{controller}/{action}", ["namespace" => "Admin"]);

$router->dispatch($_SERVER["QUERY_STRING"]);
