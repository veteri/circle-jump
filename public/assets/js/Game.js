/**
 * Created by Midi on 26.04.2018.
 */

function Game(fps, map, player) {

    /**
     * Used to determine if the game is running right
     * now or is suspended, most likely for some menu.
     * @type {number}
     */
    this.state = this.states.menu;

    /**
     * The fps at which the game will base its physics on.
     */
    this.fps       = fps;

    /**
     * The amount of frames the game has displayed so far.
     * @type {number}
     */
    this.frameCount = 0;

    /**
     * The time that passed since the game has started
     * rendering a map.
     * Used to determine the time a player needed to
     * finish a map.
     * @type {number}
     */
    this.timePassed = 0;

    /**
     * ???
     * @type {number}
     */
    this.timePassedOffset = 0;

    /**
     * A high resolution timestamp used to determine the
     * time of the current gametick.
     * @type {null}
     */
    this.now       = null;

    /**
     * A high resolution timestamp used to determine the
     * time of the last gametick.
     * @type {null}
     */
    this.last      = null;

    /**
     * The amount of time that passed since the last gametick in seconds.
     * Calculated using this.now and this.last. See above.
     * @type {null}
     */
    this.delta     = null;

    /**
     * The map on which the game takes place.
     */
    this.map       = map;

    /**
     * The player model that the player can control.
     */
    this.player    = player;


    /**
     * The HTML Canvas DOM Element
     */
    this.canvas    = UIController.gameCanvas.get();

    /**
     * The 2d Rendering Context of the canvas.
     * @type {*}
     */
    this.context   = this.canvas.getContext("2d");

    /**
     * Used to enable a scrolling and following camera effect.
     * It is highly recommended to set the it to the same
     * dimensions as the canvas.
     * @type {Camera}
     */
    this.camera    = new Camera(0, 0, this.canvas.width, this.canvas.height);

    /**
     * A flag to determine if a render call is necessary.
     * Only if delta exceeds our fixed time step (1 / fps).
     * @type {null}
     */
    this.updated   = null;

    /**
     * The request id of the next gametick call.
     * Used for suspending the game temporarily.
     * @type {null}
     */
    this.requestId = null;

    /**
     * The game will update everything as long as
     * the delta exceeds this value.
     * This will cause multiple update calls per rendered
     * frame if the users pc is very slow.
     * But it ensures that the physics are deterministic
     * no matter the users physical fps in the browser,
     * thus providing a fair game.
     * @type {number}
     */
    this.timestep  = 1 / fps;


    /**
     * Holds any additional render functions.
     * The map editor will use this.
     * @type {{}}
     */
    this.renderCallbacks = {};

    /**
     * The fps meter plugin instance
     * @type {FPSMeter}
     */
    this.fpsmeter = new FPSMeter({
        decimals: 0,
        graph: true,
        theme: 'transparent',
        left : "auto",
        right: '5px',
        heat: 1
    });


    //A Camera that isn't matching canvas dimensions is not supported.
    if (this.camera.width !== this.canvas.width
        || this.camera.height !== this.canvas.height) {

        console.warn(
            "%c The camera does not meet the canvas dimensions.",
            "font-weight: bold"
        );
    }

}

Game.prototype = {

    /**
     * The states that the game can have.
     * @type {object}
     */
    states: {
        play         : 0,
        menu         : 1,
        editor       : 2,
        editorSandbox: 3
    },

    /**
     * The games config object containing multiple settings
     * that will enable or disable certain features or hold
     * log string templates.
     *
     * @type {object}
     */
    config: {
        MAX_IDLE_THRESHOLD: 0.33333,
        suspensions       : {
            pause      : "Game suspended: Pause",
            loadMap    : "Game suspended: Loading map",
            changeBg   : "Game suspended: Changing background scene",
            mapComplete: "Game suspended: Map has been completed",
            resetMap   : "Game suspended: Level reset",
            retryMap   : "Game suspended: Retrying map"
        }
    },

    /**
     * Game related control key codes.
     * @type {object}
     */
    controls: {
        startLevel: 32,
        restartLevel: 40
    },

    /**
     * Contains various utility methods
     * that the game uses.
     *
     * @type {object}
     */
    Utility: {

        /**
         * Returns a high resolution timestamp.
         * @returns {*}
         */
        getTimestamp: function () {
            return window.performance && window.performance.now ? window.performance.now() : new Date().getTime();
        }
    },

    /**
     * All the event listeners the game
     * needs will be defined here.
     *
     * Some might be removed since they're
     * only for debugging.
     *
     * @returns void
     */
    bindEvents: function() {

        /**
         * Save this since 'this' references the DOM
         * Element object in event listeners.
         * @type {Game}
         */
        let self = this;

        //Delegate keydown events to the player to decide what controls are being activated.
        document.addEventListener("keydown", function (event) {
            return self.player.handleButtonEvent.bind(self.player)(event, event.keyCode, true);
        });

        //Delegate keyup events to the player to decide what controls are no longer activated.
        document.addEventListener("keyup", function (event) {

            switch(event.keyCode) {
                case self.controls.restartLevel:

                    if (self.state === self.states.play || self.state === self.states.editorSandbox) {
                        self.retry();
                    }
                    break;
                case self.controls.startLevel:
                    if (self.state === self.states.menu && !self.player.levelComplete) {
                        self.reset();
                        self.start();
                        UI.gameCanvas.displayEscapeNotification();
                    } else {
                        return self.player.handleButtonEvent.bind(self.player)(event, event.keyCode, false);
                    }
                    break;
                default:
                    return self.player.handleButtonEvent.bind(self.player)(event, event.keyCode, false);
            }

        });

    },

    changePerspective: function(perspective) {

        console.log(perspective);

        let settings = {
            default: { width: 1920, height: 1080 },
            middle : { width: 1630, height:  900 },
            close  : { width: 1200, height:  720 }
        };

        let settingToApply = settings[perspective];

        this.camera.setDimensions(
            settingToApply.width,
            settingToApply.height
        );

        this.map.updateCameraOffsets(this.camera);

        UI.gameCanvas.setDimensions(
            settingToApply.width,
            settingToApply.height
        );
    },

    /**
     * Load the given assets into the given target.
     * The label can be used to show what asset is
     * being loaded currently in the loader.
     *
     * @param assets {object|Array} The assets
     * @param target {object} The target
     * @param label {string} The label
     * @returns {Promise} A promise that can be then'ed.
     */
    loadAssets: function(assets, target = null, label = null) {

        let self = this;

        return new Promise(function(resolve, reject) {

            UIController.gameLoader.show(label);

            let totalAssetCount = 0;
            let assetCount = 0;

            const onImageLoad = function () {

                console.log("%c[AssetLoader] Successfully loaded " + this.src, "color: green");

                if (--assetCount === 0) {
                    console.log("%c[AssetLoader] All " + totalAssetCount + " requested game assets have been loaded.", "color: green");
                    UIController.gameLoader.hide();
                    resolve();
                }

                let percent = ((totalAssetCount - assetCount) / totalAssetCount) * 100;
                UIController.gameLoader.setProgress(percent);
            };

            const onImageError = function() {
                console.log("%c[AssetLoader] Failed to load " + this.src, "color: red");
                reject();
            };

            const loadImage = function(source) {
                let image = new Image();
                image.addEventListener("load", onImageLoad);
                image.addEventListener("error", onImageError);
                image.src = source;
                return image;
            };

            const loadImageFromAssetObject = function(assetObject) {
                for (let key in assetObject) {
                    if (assetObject.hasOwnProperty(key)
                        && typeof target[key] !== "object") {


                        target[key] = loadImage(assetObject[key]);

                    } else {
                        console.log("%c[AssetLoader] Resource already loaded (" + assetObject[key] + ")", "color: orange");
                        --assetCount;
                    }
                }
            };

            //Check if its an array of image paths (e.g. map background layers)
            if (Array.isArray(assets) && typeof assets[0] === "string") {

                //Check if this resource has been loaded already
                if (Array.isArray(target) && target.length > 0) {
                    UIController.gameLoader.setProgress(100);
                    console.log("%c[AssetLoader] Resources already loaded for array target", "color: orange");
                    UIController.gameLoader.hide();
                    resolve();
                    return;
                }

                //Count assets
                totalAssetCount = assets.length;
                assetCount      = assets.length;

                //Load the images
                //let images = [];
                assets.forEach(function (asset) {
                    target.push(loadImage(asset));
                });

                //Save the image objects to the given target
                //target = images;
                return;
            }

            if (typeof assets === "object") {

                //Check if its an array of assetObjects...
                if (Array.isArray(assets) && typeof assets[0] === "object") {

                    //Count the assets
                    totalAssetCount = assets.reduce(function(acc, current) {
                        return acc + Object.keys(current).length;
                    }, 0);

                    assetCount = totalAssetCount;

                    //Load all assets from every assetObject
                    assets.forEach(assetObject => loadImageFromAssetObject(assetObject));

                } else {
                    //...or a single assetObject

                    //Count assets
                    totalAssetCount = Object.keys(assets).length;
                    assetCount = Object.keys(assets).length;

                    //Load all assets from the assetObject
                    loadImageFromAssetObject(assets);
                }
            }

        });
    },

    /**
     * Get the passed time in milliseconds.
     * @returns {number} The time
     */
    getPassedTime: function() {
        return (this.timePassed - this.timePassedOffset).toFixed(3) * 1000;
    },

    /**
     * Resets the passed time by
     * updating the timePassedOffset.
     *
     * @returns void
     */
    resetPassedTime: function() {
        this.timePassedOffset = this.timePassed + (this.Utility.getTimestamp() - this.last) / 1000;
    },

    /**
     * Reset every important variables.
     * This is used when the player restarts the map.
     *
     * @param options {object} Exclude parts from reset.
     * Possible things to exclude:
     *      -Player
     *      -Game
     *      -Map
     *      -Camera
     *      -Time
     *
     * @returns void
     */
    reset: function(options = {}) {

        if (options.map === undefined) {
            //Reset map variables
            this.map.activeLevel = 0;
            this.map.background  = this.map.backgrounds[
                this.map.backgroundScenes[0]
            ];
        }

        if (options.player === undefined) {
            //Reset player variables
            this.player.levelComplete = false;
            this.player.resetPhysics();
            //Only resetting the jump feels much better than all controls
            this.player.resetJumpControl();
            this.player.spawn(this.map);
            this.player.savePosition(true);
        }

        if (options.game === undefined) {
            //Reset game variables
            this.frameCount = 0;
            this.delta = 0;
        }

        if (options.camera === undefined) {
            //Reset camera
            this.camera.update(this.player);
        }

        if (options.time === undefined) {
            //Reset time
            this.resetPassedTime();
        }

    },

    /**
     * Retries the game.
     *
     * @param state {number} The state to start the game in
     * @returns void
     */
    retry: function(state = null) {
        //this.stop(this.config.suspensions.retryMap, state);
        this.reset();
        //this.start(state);
    },

    /**
     * Loads a map by its id
     * into the game's map object.
     * Will automatically load any
     * required assets.
     *
     * @param id {number} The id of the map
     * @returns {Promise} A promise that can be then'ed.
     */
    loadMap: function(id) {
        let self = this;
        return new Promise(function(resolve, reject) {
            self.stop("loadMap");
            self.map.loadById(id).then(function() {
                self.player.savePosition(true);
                //self.camera.cacheMapSize(self.map);
                self.reset();

                let backgroundAssets = Map.prototype.assets.backgrounds;
                let mapBackgrounds   = self.map.backgrounds;

                loadMapBackgrounds = self.map.backgroundScenes.map(background => {
                    return self.loadAssets(
                        backgroundAssets[background],
                        mapBackgrounds[background]
                    );
                });

                Promise.all(loadMapBackgrounds)
                    .then(resolve);

            }).catch(function(result) {
                alert("The map with the id '" + result + "' does not exist.");
                self.start();
            });
        });
    },


    /**
     * Once the player finished a level,
     * submit the time he needed to server.
     * Unobfuscated version & explanation
     * in submitTimeSource
     *
     * @returns {Promise} A promise that can be then'ed.
     */
    submitTime: function() {

        /**
         * Notice: Hacking attempts will result
         * in an immediate account termination.
         * Play fair and keep the integrity of the leaderboards.
         */
        const _0x9ef4 = ["\x67\x65\x74\x50\x61\x73\x73\x65\x64\x54\x69\x6D\x65", "\x72\x61\x6E\x64\x6F\x6D", "\x61\x3D", "\x26\x62\x3D", "\x26\x63\x3D", "\x26\x64\x3D", "\x72\x65\x61\x64\x79\x73\x74\x61\x74\x65\x63\x68\x61\x6E\x67\x65", "\x72\x65\x61\x64\x79\x53\x74\x61\x74\x65", "\x73\x74\x61\x74\x75\x73", "\x72\x65\x73\x70\x6F\x6E\x73\x65\x54\x65\x78\x74", "\x70\x61\x72\x73\x65", "\x72\x61\x6E\x6B\x69\x6E\x67\x73", "\x74\x69\x6D\x65", "\x6C\x6F\x67", "\x61\x64\x64\x45\x76\x65\x6E\x74\x4C\x69\x73\x74\x65\x6E\x65\x72", "\x50\x4F\x53\x54", "\x2F\x6D\x61\x70\x2F\x73\x75\x62\x6D\x69\x74\x2D\x74\x69\x6D\x65", "\x6F\x70\x65\x6E", "\x43\x6F\x6E\x74\x65\x6E\x74\x2D\x54\x79\x70\x65", "\x61\x70\x70\x6C\x69\x63\x61\x74\x69\x6F\x6E\x2F\x78\x2D\x77\x77\x77\x2D\x66\x6F\x72\x6D\x2D\x75\x72\x6C\x65\x6E\x63\x6F\x64\x65\x64", "\x73\x65\x74\x52\x65\x71\x75\x65\x73\x74\x48\x65\x61\x64\x65\x72", "\x73\x65\x6E\x64", "\x58\x4d\x4c\x48\x74\x74\x70\x52\x65\x71\x75\x65\x73\x74"];
        let _0x31b6x2 = this;

        return  new Promise(function(_0x31b6x3,_0x31b6x4)
            {
                let _0x31b6x5 = new window[_0x9ef4[22]]();
                let _0x31b6x6 =_0x31b6x2[_0x9ef4[0]]();
                let _0x31b6x7,_0x31b6x8,_0x31b6x9,_0x31b6xa;

                _0x31b6x7 = parseInt(Math[_0x9ef4[1]]() * 3 + 1);
                _0x31b6x8 = parseInt(Math[_0x9ef4[1]]() * 3);
                _0x31b6x9 = [0xc79d8b,0xc7a2c4,0xc8419b][_0x31b6x8];
                _0x31b6x8 = ((0x02 << 15) - 0xfffe - _0x31b6x8) + 0xc79d8b;
                _0x31b6x6 = ((0x2a01c0d7cc & 0x7f) - 0x4c) + (_0x31b6x6 << _0x31b6x7) + _0x31b6x9 + ((0x29a << 15) - 0x14d0000);
                _0x31b6xa = (_0x31b6x6 << 3) + 0xc79d8b;
                _0x31b6x7 += 0xc79d8b;

                let _0x31b6xb =_0x9ef4[2] + _0x31b6x7 + _0x9ef4[3] + _0x31b6x8 + _0x9ef4[4] + _0x31b6x6 + _0x9ef4[5] + _0x31b6xa;

                _0x31b6x5[_0x9ef4[14]](_0x9ef4[6], function() {
                        if(this[_0x9ef4[7]] === (0x8000 >> 13)) {
                            if(this[_0x9ef4[8]] === ((0xff & 0x80) + 0x48)) {
                                let _0x31b6xc=JSON[_0x9ef4[10]](this[_0x9ef4[9]]);
                                _0x31b6x3({rankings:_0x31b6xc[_0x9ef4[11]],time:_0x31b6xc[_0x9ef4[12]]});
                            } else {
                                _0x31b6x4()
                            }
                        }
                    }
                );
                _0x31b6x5[_0x9ef4[17]](_0x9ef4[15],_0x9ef4[16],true);
                _0x31b6x5[_0x9ef4[20]](_0x9ef4[18],_0x9ef4[19]);
                _0x31b6x5[_0x9ef4[21]](_0x31b6xb);
            }
        )
    },

    /**
     * Draws the time that has passed.
     * @param time
     */
    drawTime: function(time) {
        this.context.font = "28px Luckiest Guy";
        this.context.fillStyle = "rgba(0,0,0, 0.8)";
        this.context.fillRect(20, 20, 200, 50);
        this.context.fillStyle = "#64dd17";
        this.context.fillText(UI.timeUtil.fromMs(time) , 50, 55);
    },

    /**
     * Draws the overlays of the game
     * such as the time or the mode.
     *
     * @param forceTime {number} Draw a forced time.
     * @returns void
     */
    drawOverlays: function(forceTime = null) {
        this.drawTime(
            forceTime !== null ?
                forceTime :
                this.getPassedTime()
        );
        this.player.drawMode(this.context);
    },

    /**
     * Render everything.
     *
     * @returns void
     */
    render: function (frameCount) {

        this.map.draw(this.context, this.camera);
        this.player.draw(this.context, this.camera, frameCount, this.state);

        if (this.player.SHOW_COLLISION) {
            this.player.drawCollision(this.map, this.camera);
        }

        if (this.state !== this.states.editor) {
            this.drawOverlays();
        }

        //Render any additional things (Editor)
        for (let key in this.renderCallbacks) {
            if (this.renderCallbacks.hasOwnProperty(key)) {
                this.renderCallbacks[key]();
            }
        }

    },

    /**
     * Renders 1 frame.
     *
     * @param playerTime {number} A forced player time
     * @returns void
     */
    singleRender: function(playerTime = null) {
        this.map.draw(this.context, this.camera);
        this.player.draw(this.context, this.camera, this.frameCount);
        this.drawOverlays(playerTime);
    },

    /**
     * Add a render callback under the given key.
     * That is a function that can render additional
     * things after all game rendering has been done.
     *
     * @param key {string} The name of the callback
     * @param callback {Function} the callback
     * @returns void
     */
    addRenderCallback(key, callback) {
        this.renderCallbacks[key] = callback;
    },

    /**
     * Remove a render callback by name.
     *
     * @param key {string} the name of the callback
     * @returns void
     */
    removeRenderCallback(key) {
        delete this.renderCallbacks[key];
    },

    /**
     * Updates everything.
     *
     * @param delta
     * @returns void
     */
    update: function (delta) {

        //Only update the player if we're not in editor view
        if (this.state !== this.states.editor) {
            this.player.update(delta, this.map);
        }

        //If the player completed the level
        if (this.player.levelComplete) {

            //Check if it is the last level
            if (this.map.isLastLevel()) {

                //If we're in the editor sandbox
                if (this.state === this.states.editorSandbox) {
                    //Just respawn the player
                    this.player.spawn(this.map);
                    UI.gameCanvas.congratulations();

                } else {
                    //if we're not in editor sandbox, complete the map
                    this.complete();
                }

            } else {
                //if its not last level, go to next level
                this.map.nextLevel(this.player);
            }
        }

        this.camera.update(this.player);
    },

    /**
     * The player has finished the
     * game (all levels of the current map).
     * Stop the game, submit the time and
     * show a statistics menu.
     *
     * @returns void
     */
    complete: function() {

        let self = this;

        this.stop(this.config.suspensions.mapComplete);

        UI.menus.switchTo(UI.mapComplete, {
            noBg: true
        });

        this.submitTime()
        .then(function(response) {

            UI.mapComplete.buildStatistics(
                response.rankings,
                self.map.name,
                response.time
            );

            UI.mapComplete.showStats();
        });
    },

    /**
     * Prepare the start of the map
     * by rendering once and then
     * calling showStartScreen.
     *
     * @returns void
     */
    prepareStart: function() {

        //Reset everything
        this.reset();
        //Render 1 frame
        this.singleRender(0);
        //Put the startScreen layer on top
        this.showStartScreen();

    },

    /**
     * Add a start screen, so the player
     * can decide when to start the game
     * by pressing space.
     *
     * @returns void
     */
    showStartScreen: function() {

        //Draw a black alpha rectangle over the entire canvas.
        this.context.fillStyle = "rgba(0,0,0,0.4)";
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

        //Write "Press space to start in the middle
        this.context.fillStyle = "#64dd17";
        this.context.font = "48px Luckiest Guy";
        this.context.fillText(
            "Press space to start.",
            (this.canvas.width / 2) - 250,
            this.canvas.height / 2
        );

        console.log(`[start screen end] tp: ${this.timePassed}, tpo: ${this.timePassedOffset}`);
    },

    /**
     * Prepares the editor for use.
     *
     * @returns void
     */
    prepareEditor: function() {
        this.map.newLevel();
        this.start();
        this.toggleEditorMode();
    },

    /**
     * Toggles the editor mode on the game
     * and the map instance.
     *
     * @returns void
     */
    toggleEditorMode: function() {

        if (this.state === this.states.editor) {
            this.state = this.states.editorSandbox;
            this.reset({
                map: false
            });
        } else {
            this.state = this.states.editor;
        }

        this.map.toggleEditorMode();

    },


    /**
     * Starts up the game by requesting
     * the animation frame loop for our
     * game tick.
     *
     * @returns void
     */
    start: function (state = null) {
        if (!this.requestId) {
            window.requestAnimationFrame(this.tick.bind(this));
            this.state = state === null ? this.states.play : state;
            console.info("Started game.");
        } else {
            console.warn("Game is already running.");
        }
    },

    /**
     * Cancels the next scheduled animation frame that
     * was schedules in the most recent animation frame.
     * This will suspend the game and no event listener
     * will have any effect anymore.
     *
     * @param reason The reason of the suspension.
     * @param state The state the game should be in.
     * @returns void
     */
    stop: function (reason, state = null) {
        if (this.requestId) {
            window.cancelAnimationFrame(this.requestId);
            this.state = state === null ? this.states.menu : state;
            this.requestId = null;
            console.warn(this.config.suspensions[reason]);
        }
    },

    /**
     * This method will schedule the next tick instantly
     * and decide how many times (if at all) the game
     * needs to update based on the delta time.
     * If at least one update call occurred the new
     * game state will be rendered to the canvas.
     *
     * @returns void
     */
    tick: function () {

        this.fpsmeter.tickStart();

        //Schedule next tick.
        this.requestId = window.requestAnimationFrame(this.tick.bind(this));
        this.now       = this.Utility.getTimestamp();

        //Time since last tick + left over time that needs to be processed yet.
        this.delta    += (this.now - this.last) / 1000;

        //Resetting the update flag.
        this.updated   = false;

        /**
         * If the user switched tabs and our tab is running for a
         * prolonged period of time, we avoid calling the update
         * functions a large amount of time by resetting the delta time.
         */
        if (this.delta >= this.config.MAX_IDLE_THRESHOLD) {
            this.delta = this.timestep;
        }

        /**
         * As long as the delta time fits into our time step (1 / fps),
         * we call the update function.
         * Example: If it took the browser 0.5 seconds since the last gametick,
         * it will update the game state 30 times (30 * (1/60) = 0.5),
         * since this is what happened in that duration.
         */
        while (this.delta >= this.timestep) {
            this.update(this.timestep);
            this.delta -= this.timestep;
            this.updated = true;
        }

        //Only render the scene if we updated
        if (this.updated) {
            this.render(++this.frameCount);
        }
        this.timePassed += (this.now - this.last) / 1000;

        this.last = this.now;
        this.fpsmeter.tick();

    },

    /**
     * Initializes the game.
     *
     * @returns {Promise} A promise that can be then'ed.
     */
    init: function () {

        //Keep alias reference of this.
        let self = this;

        return new Promise(function(resolve, reject) {

            //Setup all event listeners.
            self.bindEvents();

            //Setup a reference timestamp for the game tick.
            self.last = self.Utility.getTimestamp();

            self.camera.cacheMapSize(self.map);

            let loadTileAssets = self.loadAssets([
                    Tile.prototype.assets.sprites.spring,
                    Tile.prototype.assets.sprites.desert,
                    Tile.prototype.assets.sprites.factory,
                    Tile.prototype.assets.sprites.graveyard,
                    Tile.prototype.assets.sprites.scifi,
                    Tile.prototype.assets.sprites.winter,
                    Tile.prototype.assets.sprites.objects
                ],
                Tile.prototype.sprites
            );

            let loadPlayerIdleLeft =  self.loadAssets(
                Player.prototype.assets.sprites.idleLeft,
                Player.prototype.sprites.idleLeft
            );

            let loadPlayerIdleRight =  self.loadAssets(
                Player.prototype.assets.sprites.idleRight,
                Player.prototype.sprites.idleRight
            );

            let loadPlayerWalkLeft = self.loadAssets(
                Player.prototype.assets.sprites.walkLeft,
                Player.prototype.sprites.walkLeft
            );

            let loadPlayerWalkRight = self.loadAssets(
                Player.prototype.assets.sprites.walkRight,
                Player.prototype.sprites.walkRight
            );

            let loadPlayerJumpLeft = self.loadAssets(
                Player.prototype.assets.sprites.jumpLeft,
                Player.prototype.sprites.jumpLeft
            );

            let loadPlayerJumpRight = self.loadAssets(
                Player.prototype.assets.sprites.jumpRight,
                Player.prototype.sprites.jumpRight
            );

            let loadPlayerBounceLeft = self.loadAssets(
                Player.prototype.assets.sprites.bounceLeft,
                Player.prototype.sprites.bounceLeft
            );

            let loadPlayerBounceRight = self.loadAssets(
                Player.prototype.assets.sprites.bounceRight,
                Player.prototype.sprites.bounceRight
            );

            Promise.all([
                loadPlayerIdleLeft,
                loadPlayerIdleRight,
                loadPlayerWalkLeft,
                loadPlayerWalkRight,
                loadPlayerJumpLeft,
                loadPlayerJumpRight,
                loadPlayerBounceLeft,
                loadPlayerBounceRight,
                loadTileAssets
            ])
                .then(function() {
                    resolve();
                })
                .catch(function() {
                    reject();
                });

            //console.log(`[init 1] tp: ${this.timePassed}, tpo: ${this.timePassedOffset}`);

        });

    }
};







