<?php

namespace Core;

class Router {

    /**
     * The table that contains all routes.
     * @var array
     */
    protected $routes = [];

    /**
     * Populated by the correct controller & action,
     * after matching a route against the routing table.
     * @var array
     */
    protected $params = [];

    /**
     * Add a route.
     * @param $route string The URL
     * @param $params array The controller & action
     */
    public function add($route, $params = []) {

        //Escape forward slashes
        $route = preg_replace("/\//", "\\/", $route);

        //Convert variables inside route for example {controller}
        $route = preg_replace("/\{([a-z-]+)\}/", "(?P<$1>[a-z-]+)", $route);

        //Convert variables with custom regular expressions
        $route = preg_replace("/\{([a-z]+):([^\}]+)\}/", "(?P<$1>$2)", $route);

        //Add start and end delimiter
        $route = "/^" . $route . "$/i";

        $this->routes[$route] = $params;
    }

    /**
     * @param $url
     * @return bool
     */
    public function match($url) {

        foreach($this->routes as $route => $params) {

            if (preg_match($route, $url, $matches)) {

                foreach($matches as $key => $match) {
                    if (is_string($key)) {
                        $params[$key] = $match;
                    }
                }
                $this->params = $params;
                return true;
            }
        }
        return false;
    }

    public function dispatch($url) {

        $url = $this->removeQueryStringVariables($url);

        if ($this->match($url)) {
            $controller = $this->params["controller"];
            $controller = $this->convertToStudlyCaps($controller);
            //$controller = "App\\Controllers\\$controller";
            $controller = $this->getNamespace() . $controller;

            if (class_exists($controller)) {
                $controller_object = new $controller($this->params);

                $action = $this->params["action"];
                $action = $this->convertToCamelCase($action);

                if (preg_match("/action$/i", $action) == 0) {
                    $controller_object->$action();
                } else {
                    throw new \Exception("Method $action (in controller $controller) cannot be called.");
                }
            } else {
                throw new \Exception("Controller class '$controller' does not exist.");
            }
        } else {
            throw new \Exception("No route matched.", 404);
        }
    }

    protected function convertToStudlyCaps($string) {
        return str_replace(" ", "", ucwords(str_replace("-", " ", $string)));
    }

    protected function convertToCamelCase($string) {
        return lcfirst($this->convertToStudlyCaps($string));
    }

    protected function removeQueryStringVariables($url) {
        if ($url != '') {
            $parts = explode('&', $url, 2);

            if (strpos($parts[0], '=') === false) {
                $url = $parts[0];
            } else {
                $url = '';
            }
        }

        return $url;
    }

    protected function getNamespace() {

        $namespace = "App\Controllers\\";

        if (array_key_exists("namespace", $this->params)) {
            $namespace .= $this->params["namespace"] . "\\";
        }

        return $namespace;
    }

    /**
     * Get routing table.
     * @return array
     */
    public function getRoutes() {
        return $this->routes;
    }

    /**
     * Get the controller & action
     * if there was a route that matched.
     * @return array
     */
    public function getParams() {
        return $this->params;
    }
}