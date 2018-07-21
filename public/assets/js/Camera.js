/**
 * Created by Midi on 19.05.2018.
 */


function Camera(x, y, width, height) {
    this.x       = x || 0;
    this.y       = y || 0;
    this.width   = width || 1920;
    this.height  = height || 1080;
    this.mapSize = {
        width: 0,
        height: 0
    }
}


Camera.prototype = {

    cacheMapSize: function(map) {
        this.mapSize.width = map.width * map.tileWidth;
        this.mapSize.height = map.height * map.tileHeight;
    },

    update: function (player) {

        if (this.mapSize === null) throw new ReferenceError("Camera didnt cache the map dimensions yet.");

        //Cache half width and half height for faster calculation
        let halfWidth = this.width / 2;
        let halfHeight = this.height / 2;

        /**
         * Adjust the camera horizontally, if the player loads a
         * position close to the maps x axis edges.
         */
        if (player.x < halfWidth) {
            this.x = 0;
        }

        //See above
        if (player.x > this.mapSize.width - halfWidth) {
            this.x = this.mapSize.width - this.width;
        }

        /**
         * Adjusts the camera vertically, if the player loads a
         * position close to the map y axis edges.
         */
        if (player.y < halfHeight) {
            this.y = 0;
        }

        //See above
        if (player.y > this.mapSize.height - halfHeight) {
            this.y = this.mapSize.height - this.height;
        }


        /**
         * Only update the camera's x position if
         * the player is at least half of the camera width
         * away from the map's edges (stored in mapSize)
         */
        if (player.x > halfWidth && player.x < this.mapSize.width - halfWidth) {
            this.x = player.x - halfWidth;
        }

        /**
         * Only update the camera's y position if
         * the player is at least half of the camera's
         * height away from the map's edges (stored in mapSize)
         */
        if (player.y > halfHeight && player.y < this.mapSize.height - halfHeight) {
            this.y =player.y - halfHeight;
        }

    },

    draw: function (context) {
        context.strokeStyle = "red";
        context.strokeRect(this.x, this.y, this.width, this.height);
    }

};