<?php

namespace Core;

class View {
    public static function render($view, $args = []) {

        extract($args, EXTR_SKIP);
        $file = "../App/Views/$view";

        if (is_readable($file)) {
            require $file;
        } else {
            throw new \Exception("$file not found.");
        }
    }

    public static function renderTemplate($template, $args = []) {
        echo static::getTemplate($template, $args);
    }

    public static function getTemplate($template, $args = []) {
        static $twig = null;
        if ($twig === null) {
            $loader = new \Twig_Loader_Filesystem(dirname(__DIR__) . '/App/Views');

            //remove the 2nd options parameter for production
            $twig = new \Twig_Environment($loader);  //, ["debug" => true]


            $twig->addGlobal("current_user", \App\Auth::getUser());
            $twig->addGlobal("flash_messages", \App\Flash::getMessages());
            //only for debugging by using twigs dump() function
            $twig->addExtension(new \Twig_Extension_Debug());
        }

        $template = "$template.html.twig";
        return $twig->render($template, $args);
    }
}