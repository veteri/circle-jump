/**
 * A tile that can be rendered.
 *
 * @param x {number} x position (Notice: x as in tile X, not physical x}
 * @param y {number} y position (Notice: y as in tile Y, not physical y}
 * @param width {number} The width
 * @param height {number} The height
 * @param type {number} The type
 * @constructor
 */
function Tile(x, y, width, height, type) {

    /**
     * The x position.
     * @type {number}
     */
    this.x      = x;

    /**
     * The y position.
     * @type {number}
     */
    this.y      = y;

    /**
     * The width.
     * @type {number}
     */
    this.width  = width;

    /**
     * The height.
     * @type {number}
     */
    this.height = height;

    /**
     * The type.
     * @type {number}
     */
    this.type   = type;
}

/**
 * The tile prototype.
 * @type {object}
 */
Tile.prototype = {

    simpleMode: false,

    /**
     * WARNING: This will get removed and only has been placed
     * in order to demonstrate a visual representation of the
     * players collision detection for debugging purposes.
     *
     * Do not use.
     */
    context: UIController.gameCanvas.getContext(),

    COLOR: {
        "0": "#000",
        "1": "#4074b9",
        "2": "orange",
        "3": "green",
        "4": "red",
        "44": "orange"
    },

    /**
     * Contains all assets for the tiles.
     * @type {object}
     */
    assets: {

        /**
         * Contains all sprites.
         * @type {object}
         */
        sprites: {

            /**
             * Spring sprites.
             * @type {object}
             */
            spring: {
                1: "/assets/images/tiles/spring/top_connect_grass_spring.png",
                2: "/assets/images/tiles/spring/lt_grass_spring.png",
                3: "/assets/images/tiles/spring/rt_grass_spring.png",
                4: "/assets/images/tiles/spring/connect_spring.png",
                5: "/assets/images/tiles/spring/lo_spring.png",
                6: "/assets/images/tiles/spring/ro_spring.png",
                7: "/assets/images/tiles/spring/lb_spring.png",
                8: "/assets/images/tiles/spring/rb_spring.png",
                9: "/assets/images/tiles/spring/bot_connect_spring.png",
                10: "/assets/images/tiles/spring/left_connect_spring.png",
                11: "/assets/images/tiles/spring/right_connect_spring.png",
                12: "/assets/images/tiles/spring/left_connect_grass_spring.png",
                13: "/assets/images/tiles/spring/right_connect_grass_spring.png",
                14: "/assets/images/tiles/spring/left_island_spring.png",
                15: "/assets/images/tiles/spring/middle_island_spring.png",
                16: "/assets/images/tiles/spring/right_island_spring.png",
                17: "/assets/images/tiles/spring/mush1_spring.png",
                18: "/assets/images/tiles/spring/mush2_spring.png",
                19: "/assets/images/tiles/spring/right_island_spring.png",
                20: "/assets/images/tiles/spring/crate_spring.png",
            },

            /**
             * Desert sprites.
             * @type {object}
             */
            desert: {
                21: "/assets/images/tiles/desert/top_connect_sand_desert.png",
                22: "/assets/images/tiles/desert/lt_sand_desert.png",
                23: "/assets/images/tiles/desert/rt_sand_desert.png",
                24: "/assets/images/tiles/desert/connect_desert.png",
                25: "/assets/images/tiles/desert/lo_desert.png",
                26: "/assets/images/tiles/desert/ro_desert.png",
                27: "/assets/images/tiles/desert/lb_desert.png",
                28: "/assets/images/tiles/desert/rb_desert.png",
                29: "/assets/images/tiles/desert/bot_connect_desert.png",
                30: "/assets/images/tiles/desert/left_connect_desert.png",
                31: "/assets/images/tiles/desert/right_connect_desert.png",
                32: "/assets/images/tiles/desert/left_connect_sand_desert.png",
                33: "/assets/images/tiles/desert/right_connect_sand_desert.png",
                34: "/assets/images/tiles/desert/left_island_desert.png",
                35: "/assets/images/tiles/desert/middle_island_desert.png",
                36: "/assets/images/tiles/desert/right_island_desert.png",
                37: "/assets/images/tiles/desert/stone_desert.png",
                38: "/assets/images/tiles/desert/crate_desert.png",
            },

            /**
             * Factory sprites.
             * @type {object}
             */
            factory: {
                39: "/assets/images/tiles/factory/top_connect_stripe_factory.png",
                40: "/assets/images/tiles/factory/lt_stripe_factory.png",
                41: "/assets/images/tiles/factory/rt_stripe_factory.png",
                42: "/assets/images/tiles/factory/connect_factory.png",
                43: "/assets/images/tiles/factory/lo_factory.png",
                44: "/assets/images/tiles/factory/ro_factory.png",
                45: "/assets/images/tiles/factory/lb_factory.png",
                46: "/assets/images/tiles/factory/rb_factory.png",
                47: "/assets/images/tiles/factory/bot_connect_factory.png",
                48: "/assets/images/tiles/factory/left_island_factory.png",
                49: "/assets/images/tiles/factory/middle_island_factory.png",
                50: "/assets/images/tiles/factory/right_island_factory.png",
                51: "/assets/images/tiles/factory/left_simple_island_factory.png",
                52: "/assets/images/tiles/factory/middle_simple_island_factory.png",
                53: "/assets/images/tiles/factory/right_simple_island_factory.png",
                54: "/assets/images/tiles/factory/left_mini_island_factory.png",
                55: "/assets/images/tiles/factory/right_mini_island_factory.png",
                56: "/assets/images/tiles/factory/black_plate_left_factory.png",
                57: "/assets/images/tiles/factory/black_plate_middle_factory.png",
                58: "/assets/images/tiles/factory/black_plate_right_factory.png",
                59: "/assets/images/tiles/factory/black_connect_factory.png",
                60: "/assets/images/tiles/factory/black_vent_factory.png",
                61: "/assets/images/tiles/factory/left_stripe_factory.png",
                62: "/assets/images/tiles/factory/middle_stripe_factory.png",
                63: "/assets/images/tiles/factory/right_stripe_factory.png",
                64: "/assets/images/tiles/factory/crate_factory.png",
                65: "/assets/images/tiles/factory/iron_crate_factory.png",
                66: "/assets/images/tiles/factory/packet_factory.png",
                67: "/assets/images/tiles/factory/red_barrel_factory.png",
                68: "/assets/images/tiles/factory/yellow_barrel_factory.png",
            },

            /**
             * Factory sprites.
             * @type {object}
             */
            graveyard: {
                69: "/assets/images/tiles/graveyard/top_connect_grass_graveyard.png",
                70: "/assets/images/tiles/graveyard/lt_grass_graveyard.png",
                71: "/assets/images/tiles/graveyard/rt_grass_graveyard.png",
                72: "/assets/images/tiles/graveyard/connect_graveyard.png",
                73: "/assets/images/tiles/graveyard/lo_graveyard.png",
                74: "/assets/images/tiles/graveyard/ro_graveyard.png",
                75: "/assets/images/tiles/graveyard/lb_graveyard.png",
                76: "/assets/images/tiles/graveyard/rb_graveyard.png",
                77: "/assets/images/tiles/graveyard/bot_connect_graveyard.png",
                78: "/assets/images/tiles/graveyard/left_connect_graveyard.png",
                79: "/assets/images/tiles/graveyard/right_connect_graveyard.png",
                80: "/assets/images/tiles/graveyard/left_connect_grass_graveyard.png",
                81: "/assets/images/tiles/graveyard/right_connect_grass_graveyard.png",
                82: "/assets/images/tiles/graveyard/left_island_graveyard.png",
                83: "/assets/images/tiles/graveyard/middle_island_graveyard.png",
                84: "/assets/images/tiles/graveyard/right_island_graveyard.png",
            },

            /**
             * Scifi sprites.
             * @type {object}
             */
            scifi: {
                85: "/assets/images/tiles/scifi/top_connect_metal_scifi.png",
                86: "/assets/images/tiles/scifi/lt_metal_scifi.png",
                87: "/assets/images/tiles/scifi/rt_metal_scifi.png",
                88: "/assets/images/tiles/scifi/connect_scifi.png",
                89: "/assets/images/tiles/scifi/lb_scifi.png",
                90: "/assets/images/tiles/scifi/rb_scifi.png",
                91: "/assets/images/tiles/scifi/left_island_scifi.png",
                92: "/assets/images/tiles/scifi/middle_island_scifi.png",
                93: "/assets/images/tiles/scifi/right_island_scifi.png",
                94: "/assets/images/tiles/scifi/left_island2_scifi.png",
                95: "/assets/images/tiles/scifi/middle_island2_scifi.png",
                96: "/assets/images/tiles/scifi/right_island2_scifi.png",
                97: "/assets/images/tiles/scifi/mini_island_scifi.png",
                98: "/assets/images/tiles/scifi/lt_angled_scifi.png",
                99: "/assets/images/tiles/scifi/rt_angled_scifi.png",
                100: "/assets/images/tiles/scifi/rb_angled_scifi.png",
                101: "/assets/images/tiles/scifi/lb_angled_scifi.png",
                102: "/assets/images/tiles/scifi/light_row_scifi.png",
                103: "/assets/images/tiles/scifi/light_row_spacer_scifi.png",
                104: "/assets/images/tiles/scifi/light_row_bottom_extend_scifi.png",
                105: "/assets/images/tiles/scifi/box_scifi.png",
                106: "/assets/images/tiles/scifi/green_barrel_scifi.png",
                107: "/assets/images/tiles/scifi/red_barrel_scifi.png"
            },

            /**
             * Winter sprites.
             * @type {object}
             */
            winter: {
                108: "/assets/images/tiles/winter/top_connect_snow_winter.png",
                109: "/assets/images/tiles/winter/lt_snow_winter.png",
                110: "/assets/images/tiles/winter/rt_snow_winter.png",
                111: "/assets/images/tiles/winter/connect_winter.png",
                112: "/assets/images/tiles/winter/lo_winter.png",
                113: "/assets/images/tiles/winter/ro_winter.png",
                114: "/assets/images/tiles/winter/lb_winter.png",
                115: "/assets/images/tiles/winter/rb_winter.png",
                116: "/assets/images/tiles/winter/bot_connect_winter.png",
                117: "/assets/images/tiles/winter/left_connect_winter.png",
                118: "/assets/images/tiles/winter/right_connect_winter.png",
                119: "/assets/images/tiles/winter/left_connect_snow_winter.png",
                120: "/assets/images/tiles/winter/right_connect_snow_winter.png",
                121: "/assets/images/tiles/winter/left_island_winter.png",
                122: "/assets/images/tiles/winter/middle_island_winter.png",
                123: "/assets/images/tiles/winter/right_island_winter.png",
                124: "/assets/images/tiles/winter/iceblock_winter.png",
            },

            /**
             * Object sprites.
             * @type {object}
             */
            objects: {

                //Desert
                125: "/assets/images/tiles/objects/desert/obj_cactus1_desert.png",
                126: "/assets/images/tiles/objects/desert/obj_cactus2_desert.png",
                127: "/assets/images/tiles/objects/desert/obj_cactus3_desert.png",
                128: "/assets/images/tiles/objects/desert/obj_darkgrass_desert.png",
                129: "/assets/images/tiles/objects/desert/obj_grass_desert.png",
                130: "/assets/images/tiles/objects/desert/obj_sign_desert.png",

                //Factory
                131: "/assets/images/tiles/objects/factory/obj_top_arrow_factory.png",
                132: "/assets/images/tiles/objects/factory/obj_right_arrow_factory.png",
                133: "/assets/images/tiles/objects/factory/obj_down_arrow_factory.png",
                134: "/assets/images/tiles/objects/factory/obj_left_arrow_factory.png",
                135: "/assets/images/tiles/objects/factory/obj_left_exit_factory.png",
                136: "/assets/images/tiles/objects/factory/obj_right_exit_factory.png",

                //Graveyard
                137: "/assets/images/tiles/objects/graveyard/obj_bigbush_graveyard.png",
                138: "/assets/images/tiles/objects/graveyard/obj_deadbush_graveyard.png",
                139: "/assets/images/tiles/objects/graveyard/obj_sign_graveyard.png",
                140: "/assets/images/tiles/objects/graveyard/obj_skeleton_graveyard.png",
                141: "/assets/images/tiles/objects/graveyard/obj_smallbush_graveyard.png",
                142: "/assets/images/tiles/objects/graveyard/obj_tombstone1_graveyard.png",
                143: "/assets/images/tiles/objects/graveyard/obj_tombstone2_graveyard.png",

                //Spring
                144: "/assets/images/tiles/objects/spring/obj_bigbush_spring.png",
                145: "/assets/images/tiles/objects/spring/obj_sign_spring.png",
                146: "/assets/images/tiles/objects/spring/obj_smallbush_spring.png",
                147: "/assets/images/tiles/objects/spring/obj_stone_spring.png",

                //Winter
                148: "/assets/images/tiles/objects/winter/obj_crystal_winter.png",
                149: "/assets/images/tiles/objects/winter/obj_sign_winter.png",
                150: "/assets/images/tiles/objects/winter/obj_snowman_winter.png",
                151: "/assets/images/tiles/objects/winter/obj_stone_winter.png",
                152: "/assets/images/tiles/objects/winter/obj_tree_winter.png",
                153: "/assets/images/tiles/objects/winter/obj_trees_winter.png",

                //MISC
                421: "/assets/images/tiles/finish_flag.png"

            },
        }
    },

    /**
     * Important types of sprites
     * @type {object}
     */
    TYPES: {
        EMPTY     : 0,
        SPAWN     : 420,
        FINISH    : 421,
        BOUNCE    : 777,
        INVIS_WALL: 999,
    },

    /**
     * This will be filled with the
     * sprites from the assets sprites above.
     * Keys will be identical to the key of each
     * sprite. E.g. => 1 will be a spring tile.
     *
     * @type {object}
     */
    sprites: {

    },

    /**
     * Returns the x position of the tile.
     * @returns {number|*} The x position
     */
    getX: function () {
        return this.x;
    },

    /**
     * Returns the y position of the tile.
     * @returns {number|*} The y position
     */
    getY: function () {
        return this.y;
    },

    /**
     * Returns the position of the tile.
     * @returns {object} The position
     */
    getPosition: function () {
        return {x: this.x, y: this.y};
    },

    /**
     * Set the dimensions of the tile.
     *
     * @param width {number} The width.
     * @param height {number} The height.
     */
    setDimensions: function(width, height) {
        this.width = width;
        this.height = height;
    },

    /**
     * Set the type of the tile
     * to the given type.
     * @param type {number} The type to set.
     */
    setType: function(type) {

        //Check if valid type
        type = parseInt(type);
        if (isNaN(type)) {
            throw new TypeError("Tile type cant be converted to integer.");
        }

        this.type = type;
    },

    /**
     * Get the type of the tile.
     * @returns {number|*} The type
     */
    getType: function () {
        return this.type;
    },

    /**
     * Get the color of the tile.
     * @returns {string} The color
     */
    getColor: function () {
        return this.isBounce() ? "orange" : (this.type === 0 ? "#000" : "#4074b9") ;
    },

    /**
     * Check if the tile is a bounce (circle).
     * @returns {boolean} True if it is, false otherwise
     */
    isBounce: function () {
        return this.type === this.TYPES.BOUNCE;
    },

    /**
     * Check if the tile is an obstacle.
     * @returns {boolean} True if it is, false otherwise.
     */
    isObstacle: function () {
        return (this.type >= 1 && this.type <= 124) || this.type === 999;
    },

    /**
     * Check if the tile is the finish flag.
     * @returns {boolean} True if it is, false otherwise.
     */
    isFlag: function() {
        return this.type === this.TYPES.FINISH;
    },

    /**
     * Debug draw the tile.
     * This will add a green border around
     * the tile.
     *
     * @param camera {Camera} The camera
     * @returns void
     */
    debugDraw: function(camera) {
        this.context.lineWidth = 3;
        this.context.strokeStyle = "green";
        this.context.strokeRect(this.x * this.width - camera.x , this.y * this.height - camera.y, this.width, this.height)
    },

    /**
     * Draw the tile based on its type.
     *
     * @param context {CanvasRenderingContext2D} The canvas rendering context.
     * @param camera  {Camera} The Camera instance
     * @param mapState {number} The state of the map
     * @returns void
     */
    draw: function (context, camera, mapState) {

        //Choose how to draw the tile
        if (this.type === this.TYPES.BOUNCE) {
            this.drawAsBounce(context, camera);
        } else if (this.type === this.TYPES.SPAWN) {
            this.drawAsSpawn(context, camera, mapState);
        } else {
            this.drawAsSprite(context, camera);
        }

        //Add a border around each tile when we're in editor
        if (mapState === Map.prototype.STATE.EDITOR) {

            context.strokeStyle = "#000";
            context.lineWidth = 1;
            context.strokeRect(
                this.x * this.width - parseInt(camera.x),
                this.y * this.height - parseInt(camera.y),
                this.width,
                this.height
            );
        }
    },

    /**
     * Draw the tile as a spawn type.
     *
     * @param context {CanvasRenderingContext2D} The canvas rendering context.
     * @param camera  {Camera} The Camera instance
     * @param mapState {number} The state of the map
     * @returns void
     */
    drawAsSpawn: function(context, camera, mapState) {

        //Only draw if the map is in editor state
        if (mapState === Map.prototype.STATE.EDITOR) {
            context.fillStyle = "lawngreen";
            context.fillRect(
                this.x * this.width - parseInt(camera.x),
                this.y * this.height - parseInt(camera.y),
                this.width,
                this.height
            );
        }
    },

    /**
     * Draw the tile as a sprite.
     *
     * @param context {CanvasRenderingContext2D} The canvas rendering context.
     * @param camera {Camera} The Camera instance
     * @returns void
     */
    drawAsSprite: function (context, camera) {


        //Don't draw empty or bounding walls
        if (this.type === this.TYPES.EMPTY
            || this.type === this.TYPES.INVIS_WALL) {

            return;
        }

        //Draw sprite
        if (!this.simpleMode) {

            context.drawImage(
                this.sprites[this.type],
                Math.round(this.x * this.width - camera.x),
                Math.round(this.y * this.height - camera.y),
                this.width,
                this.height
            );

            //30, 30


            //Draw simple mode (only color)
        } else {

            context.fillStyle = this.getColor();
            context.fillRect(
                this.x * this.width - camera.x,
                this.y * this.height - camera.y,
                this.width,
                this.height
            );

            //Add black border
            context.strokeStyle = "#000";
            context.strokeRect(
                this.x * this.width - camera.x,
                this.y * this.height - camera.y,
                this.width,
                this.height
            );
        }

    },

    /**
     * Draw the tile as a bounce (circle).
     *
     * @param context {CanvasRenderingContext2D} The canvas rendering context.
     * @param camera  {Camera} The Camera instance
     * @returns void
     */
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