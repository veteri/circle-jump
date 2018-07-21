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
 * Routing
 */

$router = new Core\Router();

//Adding routes
$router->add("", ["controller" => "Home", "action" => "index"]);
$router->add("register", ["controller" => "Home", "action" => "register"]);
$router->add("login", ["controller" => "Home", "action" => "login"]);
$router->add("play", ["controller" => "Game", "action" => "play"]);

$router->add("{controller}/{action}");
$router->add("{controller}/{action}/{id:\d+}");
$router->add("admin/{controller}/{action}", ["namespace" => "Admin"]);

$router->dispatch($_SERVER["QUERY_STRING"]);
