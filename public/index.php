<?php
/**
 * Created by PhpStorm.
 * User: Midi
 * Date: 06.07.2018
 * Time: 17:38
 */

spl_autoload_register(function($class) {
   $root = dirname(__DIR__);
   $file = $root . "/" . str_replace("\\", "/", $class) . ".php";
   if (is_readable($file)) {
       require $file;
   }
});

$router = new Core\Router();

$router->add("", ["controller" => "Home", "action" => "index"]);
$router->add("register", ["controller" => "User", "action" => "register"]);
$router->add("{controller}/{action}");
$router->add("{controller}/{action}/{id:\d+}");
$router->add("admin/{controller}/{action}", ["namespace" => "Admin"]);


$router->dispatch($_SERVER["QUERY_STRING"]);
