<?php


namespace App;

class Config {

    /**
     * Database host
     * @var string
     */
    const DB_HOST = "116.203.100.242";

    /**
     * Database name
     * @var string
     */
    const DB_NAME = "circlejump";

    /**
     * Database user
     * @var string
     */
    const DB_USER = "tyyr";

    /**
     * Database password
     * @var string
     */
    const DB_PASSWORD = 'yesbigpassword';

    /**
     * Show or hide error messages
     * @var boolean
     */

    const SHOW_ERRORS = true;

    /**
     * Key for hashing
     * @var string
     */
    const SECRET_KEY = "secretkey";

    /**
     * The SMTP host.
     * @var string
     */
    const SMTP_HOST = "smtphost";

    /**
     * The SMTP username
     * @var string
     */
    const SMTP_USER = "smtpuser";

    /**
     * The password for the SMTP user.
     * @var string
     */
    const SMTP_PASSWORD = "smptpassword";

    /**
     * The TCP port for SMTP.
     * @var int
     */
    const SMTP_PORT = 2525;
}
