/**
 * A camera used to allow rendering of
 * a perspective rather than everything.
 *
 * @param x {number} x position
 * @param y {number} y position
 * @param width {number} The width
 * @param height {number} The height
 * @constructor
 */
function Camera(x, y, width, height) {
    this.x             = x || 0;
    this.y             = y || 0;
    this.initialWidth  = width;
    this.initialHeight = height;
    this.width         = width || 1920;
    this.height        = height || 1080;
    this.halfWidth     = width / 2;
    this.halfHeight    = height / 2;
    this.mapSize = {
        width: 0,
        height: 0
    };
}

/**
 * The prototype of the camera.
 * @type {object}
 */
Camera.prototype = {

    /**
     * Cache the total width and total height
     * for the given map for faster calculations.
     *
     * @param map {Map} The Map instance
     * @returns void
     */
    cacheMapSize: function(map) {
        this.mapSize.width = map.width * map.tileWidth;
        this.mapSize.height = map.height * map.tileHeight;
    },

    setDimensions: function(width, height) {
        this.width      = width;
        this.halfWidth  = width / 2;
        this.height     = height;
        this.halfHeight = height / 2;
    },

    /**
     * Update the camera.
     *
     * @param player {Player} The Player instance
     * @returns void
     */
    update: function (player) {

        if (this.mapSize === null) throw new ReferenceError("Camera didnt cache the map dimensions yet.");

        //Cache half width and half height for faster calculation
        //let this.halfWidth = this.width / 2;
        //let this.halfHeight = this.height / 2;

        /**
         * Adjust the camera horizontally, if the player loads a
         * position close to the maps x axis edges.
         */
        if (player.x <= this.halfWidth) {
            this.x = 0;
        }

        //See above
        if (player.x >= this.mapSize.width - this.halfWidth) {
            this.x = this.mapSize.width - this.width;
        }

        /**
         * Adjusts the camera vertically, if the player loads a
         * position close to the map y axis edges.
         */

        if (player.y <= this.halfHeight) {
            this.y = 0;
        }

        //See above
        if (player.y >= this.mapSize.height - this.halfHeight) {
            this.y = this.mapSize.height - this.height;
        }


        /**
         * Only update the camera's x position if
         * the player is at least half of the camera width
         * away from the map's edges (stored in mapSize)
         */
        if (player.x > this.halfWidth && player.x < this.mapSize.width - this.halfWidth) {
            this.x = player.x - this.halfWidth;
        }

        /**
         * Only update the camera's y position if
         * the player is at least half of the camera's
         * height away from the map's edges (stored in mapSize)
         */
        if (player.y > this.halfHeight && player.y < this.mapSize.height - this.halfHeight) {
            this.y = player.y - this.halfHeight;
        }

    },

    /**
     * Draw the camera's bounding.
     * This has no effect if the Map
     * does not draw everything.
     *
     * Because the bounding will move with
     * the camera perspective and be out
     * of sight permanently.
     *
     * @returns void
     */
    draw: function (context) {
        context.strokeStyle = "red";
        context.strokeRect(this.x, this.y, this.width, this.height);
    }

};