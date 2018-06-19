/**
 * Created by Midi on 26.04.2018.
 */

function Tile(x, y, width, height, type) {
    this.x      = x;
    this.y      = y;
    this.width  = width;
    this.height = height;
    this.type   = type;
}

Tile.prototype = {

    simpleMode: false,

    /**
     * WARNING: This will get removed and only has been placed
     * in order to demonstrate a visual representation of the
     * players collision detection for debugging purposes.
     *
     * Do not use.
     */
    context: UIController.canvas.getContext(),

    COLOR: {
        "0": "#000",
        "1": "#4074b9",
        "2": "orange",
        "3": "green",
        "4": "red",
        "44": "orange"
    },

    assets: {
        sprites: {
            1: ["assets/images/tiles/connect_topgrass.png"],
            2: ["assets/images/tiles/lo_topgrass.png"],
            3: ["assets/images/tiles/ro_topgrass.png"],
            4: ["assets/images/tiles/connect_dirt.png"],
            5: ["assets/images/tiles/lo_dirt.png"],
            6: ["assets/images/tiles/ro_dirt.png"],
            7: ["assets/images/tiles/lb_dirt.png"],
            8: ["assets/images/tiles/rb_dirt.png"],
            9: ["assets/images/tiles/bot_connect_dirt.png"],
            10: ["assets/images/tiles/left_connect_dirt.png"],
            11: ["assets/images/tiles/right_connect_dirt.png"],
            12: ["assets/images/tiles/left_connect_grass.png"],
            13: ["assets/images/tiles/right_connect_grass.png"],
            14: ["assets/images/tiles/left_island.png"],
            15: ["assets/images/tiles/middle_island.png"],
            16: ["assets/images/tiles/right_island.png"],
            43: ["assets/images/tiles/finish_flag.png"]
        }
    },

    TYPE: {
        EMPTY: 0,
        C_TOPGRASS: 1,
        LO_TOPGRASS: 2,
        RO_TOPGRASS: 3,
        C_DIRT: 4,
        LO_DIRT: 5,
        RO_DIRT: 6,
        LB_DIRT: 7,
        RB_DIRT: 8,
        C_BOT_DIRT: 9,
        C_LFT_DIRT: 10,
        C_RT_DIRT: 11,
        C_LFT_GRASS: 12,
        C_RT_GRASS: 13,
        LEFT_ISLAND: 14,
        MID_ISLAND: 15,
        RIGHT_ISLAND: 16,
        TREE_2: 17,
        SPAWN: 42,
        FINISH: 43,
        BOUNCE: 44
    },

    sprites: {
        "1": null,
        "2": null,
        "3": null,
        "4": null,
        "5": null,
        "6": null,
        "7": null,
        "8": null,
        "9": null,
        "10": null,
        "11": null,
        "12": null,
        "13": null,
        "14": null,
        "15": null,
        "16": null,
        "43": null
    },

    getX: function () {
        return this.x;
    },

    getY: function () {
        return this.y;
    },

    getPosition: function () {
        return {x: this.x, y: this.y};
    },

    setType: function(type) {
        this.type = type;
    },

    getType: function () {
        return this.type;
    },

    incrementType: function () {
        if (++this.type === Object.keys(this.TYPE).length) {
            this.type = 0;
        }
    },

    decrementType: function () {
        if (--this.type < 0) {
            this.type = Object.keys(this.TYPE).length - 1;
        }
    },

    getColor: function () {
        return this.isBounce() ? "orange" : (this.type === 0 ? "#000" : "#4074b9") ;
    },

    isBounce: function () {
        return this.type === this.TYPE.BOUNCE;
    },

    isObstacle: function () {
        return this.type >= 1 && this.type <= 16;
    },

    isFlag: function() {
        return this.type === 43;
    },

    debugDraw: function(camera) {
        this.context.lineWidth = 3;
        this.context.strokeStyle = "red";
        this.context.strokeRect(this.x * this.width - camera.x , this.y * this.height - camera.y, this.width, this.height)
    },

    draw: function (context, camera) {
        if (this.type === this.TYPE.BOUNCE) {
            this.drawAsBounce(context, camera);
        } else {
            this.drawAsWall(context, camera);
        }
    },

    drawAsWall: function (context, camera) {
        if (this.type === 0) return;

        if (!this.simpleMode) {
            context.drawImage(
                this.sprites[this.type],
                this.x * this.width - parseInt(camera.x),
                this.y * this.height - parseInt(camera.y),
                30,
                30
            );
        } else {
            context.fillStyle = this.getColor();
            context.fillRect(
                this.x * this.width - camera.x,
                this.y * this.height - camera.y,
                this.width,
                this.height
            );

            context.strokeStyle = "#000";
            context.strokeRect(
                this.x * this.width - camera.x,
                this.y * this.height - camera.y,
                this.width,
                this.height
            );
        }

        /*if (!this.simpleMode) {

            let sprite = this.sprites[this.type];
            let dimensions = {x: 30, y: 30};
            let actualX = this.x * this.width - parseInt(camera.x);
            let actualY = this.y * this.height - parseInt(camera.y);

            if (sprite === null || sprite === undefined) return;

          /!*  if (this.type === this.TYPE.TREE_2) {
                dimensions.x = sprite.width;
                dimensions.y = sprite.height;
                actualX -= (sprite.width / 2) - this.width;
                actualY -= sprite.height - this.height;
            }*!/

            context.drawImage(sprite, actualX , actualY, dimensions.x, dimensions.y);
            //context.strokeRect(actualX, actualY, dimensions.x, dimensions.y);

            return;

        }*/
    },

    drawAsBounce: function (context, camera) {

        let x = this.x * this.width;
        let y = this.y * this.height;

        context.fillStyle = this.getColor();
        context.beginPath();
        context.moveTo(
            (x + this.width / 2)  - camera.x,
            (y + this.height / 2) - camera.y
        );
        context.arc(
            (x + this.width / 2)  - camera.x,
            (y + this.height / 2) - camera.y,
            this.width / 2,
            0,
            Math.PI * 2,
            false
        );
        context.fill();

    }
};