<?php
/**
 * Created by PhpStorm.
 * User: Midi
 * Date: 23.07.2018
 * Time: 23:31
 */

namespace App\Controllers;

abstract class Authenticated extends \Core\Controller {

    /**
     * Action filter that runs before every method
     * of every class that extends this class.
     * Thus only making them available after being
     * authenticated.
     */
    protected function before() {
        $this->requireLogin();
    }

}