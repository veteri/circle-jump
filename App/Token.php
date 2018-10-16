<?php

namespace App;

use \App\Config;

class Token {

    /**
     * How many bits the
     * random_bytes will use.
     *
     * @var int
     */
    private $bit = 128;

    /**
     * The token value.
     *
     * @var array
     */
    protected $token;

    public function __construct($token = null) {

        if ($token) {
            $this->token = $token;
        } else {
            //Generate 16 bytes and convert to hex, so 32 hexadecimal characters
            $this->token = bin2hex(random_bytes($this->bit / 8));
        }

    }

    /**
     * Get the token value
     *
     * @return string the token
     */
    public function getValue() {
        return $this->token;
    }

    /**
     * Get a hash of the token value
     *
     * @return string the hashed token
     */
    public function getHash() {
        return hash_hmac("sha256", $this->token, Config::SECRET_KEY);
    }
}