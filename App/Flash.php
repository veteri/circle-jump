<?php

namespace App;

/**
 * Flash notifications.
 * Displays a flash message for the next request only.
 */

class Flash {

    /**
     * Used to indicate a successful message.
     * @var string
     */
    const SUCCESS = "success";

    /**
     * Used to indicate a warning message.
     * @var string
     */
    const WARNING = "warning";

    /**
     * Used to indicate an informative message.
     * @var string
     */
    const INFO = "info";

    /**
     * Add a flash message.
     *
     * @param $message string The flash message
     * @return void
     */
    public static function addMessage($key, $message, $type = Flash::SUCCESS) {

        //Create flash message array in session if it doesn't exist
        if (! isset($_SESSION["flash_notifications"])) {
            $_SESSION["flash_notifications"] = [];
        }

        //Append the given message to it
        $_SESSION["flash_notifications"][$key] = [
            "type" => $type,
            "content" => $message
        ];
    }

    /**
     * Get all flash messages stored in the session.
     *
     * @return array The flash messages
     */
    public static function getMessages() {
        $messages = [];

        if (isset($_SESSION["flash_notifications"])) {
            $messages =  $_SESSION["flash_notifications"];
            unset($_SESSION["flash_notifications"]);
        }

        return $messages;
    }
}