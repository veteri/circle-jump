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

    this.baseURL = "cj.localhost/";

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
    this.camera    = new Camera(0, 0, canvas.width, canvas.height);

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

    states: {
        play: 0,
        menu: 1
    },

    /**
     * The games config object containing multiple settings
     * that will enable or disable certain features or hold
     * log string templates.
     */
    config: {
        MAX_IDLE_THRESHOLD: 0.33333,
        suspensions: {
            pause: "Game suspended: Pause",
            loadMap: "Game suspended: Loading map",
            changeBg: "Game suspended: Changing background scene",
            mapComplete: "Game suspended: Map has been completed",
            resetMap: "Game suspended: Level reset",
            retryMap: "Game suspended: Retrying map"
        }
    },

    controls: {
        startLevel: 32,
        restartLevel: 40
    },

    /**
     * Contains various utility methods
     * that the game uses.
     */
    Utility: {
        getTimestamp: function () {
            return window.performance && window.performance.now ? window.performance.now() : new Date().getTime();
        }
    },

    /**
     * All the eventlistener's the game
     * needs will be defined here.
     *
     * Some might be removed since they're
     * only for debugging.
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
                    if (self.state === self.states.play) {
                        self.retry();
                    }
                    break;
                case self.controls.startLevel:
                    if (self.state === self.states.menu && !self.player.levelComplete) {
                        self.reset();
                        self.start();
                    } else {
                        self.player.handleButtonEvent.bind(self.player)(event, event.keyCode, false);
                    }
                    break;
                default:
                    self.player.handleButtonEvent.bind(self.player)(event, event.keyCode, false);
            }

        });

        //@Debug Starts the game
       /* document.querySelector(".start").addEventListener("click", function (event) {
            self.start();
        });

        //@Debug Suspends the game
        document.querySelector(".stop").addEventListener("click", function (event) {
            self.stop("pause");
            self.map.dump();
        });*/

        //@Debug Toggles the rendering mode for tiles. (Simple Rect's <-> Textures)
        /*document.querySelector(".toggleMode").addEventListener("click", function(event) {
            Tile.prototype.simpleMode = !Tile.prototype.simpleMode;
        });*/

        //@Debug Toggles the visualization of the players collision mechanics.
        /*document.querySelector(".visualizeCol").addEventListener("click", function(event) {
            Player.prototype.SHOW_COLLISION = !Player.prototype.SHOW_COLLISION;
        });*/

        /*document.querySelector("#backgroundKey").addEventListener("change", function(event) {
            self.stop("changeBg");
            let bgKey = this.value;
            if (!self.map.backgrounds.hasOwnProperty(bgKey)) {
                bgKey = "NightForest";
            }
            self.map.background = self.map.backgrounds[bgKey];
            self.canvas.click();
            self.start();
        });*/

        //@Debug Loads a json file based map.
        /*document.querySelector(".load-map").addEventListener("click", function(event) {

            alert("This feature is disabled due to a lack of maps.");

            /!*let mapName = document.querySelector(".map-name").value;

            self.loadMap(mapName).then(function() {
                self.start();
            }).catch(function() {
                alert("Loading of '" + mapName + "' has failed.");
            });*!/
        });*/


        /*let bgList = document.querySelector("#backgroundKey");

        /!**
         * Adds an option to the background select for each
         * key in this.map.backgrounds
         *!/
        for (let background in this.map.backgrounds) {
            if (this.map.backgrounds.hasOwnProperty(background)) {
                let lable = background.split(/(?=[A-Z])/).join(" ");
                bgList.innerHTML += `<option value="${background}">${lable}</option>`
            }
        }*/


    },

    performOnEveryAssetList: function(assets, callbackFn) {

        /**
         * Go through all objects that have objects to load.
         * If you take a look at the asset variable you can
         * see that the first key (requester) will be map
         * and its assets.
         */
        for (let requester in assets) {

            if (assets.hasOwnProperty(requester)) {

                /**
                 * Get the object that requested asset loading.
                 * First one is map.assets.
                 */
                let requesterObject = assets[requester];

                /**
                 * Go through all assetTypes this object has.
                 * F.e. map has 'backgrounds' as an assetType.
                 */
                for (let assetType in requesterObject) {

                    if (requesterObject.hasOwnProperty(assetType)) {

                        /**
                         * Get the object that holds the assets
                         * for the current assetTypes.
                         */
                        let assetTypeObject = requesterObject[assetType];

                        /**
                         * Go through all subTypes of the current assetType object.
                         * F.e. map has different backgrounds. Thus the
                         * 'background' assetType object holds subTypes for each
                         * background.
                         */
                        for (let assetSubType in assetTypeObject) {

                            if (assetTypeObject.hasOwnProperty(assetSubType)) {

                                /**
                                 * Get the Array that holds all paths for the
                                 * current asset sub type.
                                 * F.e. map has a subtype NightForest that is part
                                 * of the backgrounds asset type.
                                 */
                                let assetPathList = assetTypeObject[assetSubType];

                                callbackFn(assetPathList, requester, assetType, assetSubType);

                            }
                        }
                    }
                }
            }
        }
    },

    loadAssets: function() {

        let self = this;
        console.log("loadAssets");

        return new Promise(function(resolve, reject) {

            console.log("loadAssets");


            UIController.gameLoader.show();

            let assets = {
                map: self.map.assets,
                Tile: Tile.prototype.assets,
                player: self.player.assets
                /* Add more here later */
            };

            let totalAssets;
            let assetCount = 0;

            self.performOnEveryAssetList(assets, function(assetList) {
                assetCount += assetList.length;
            });

            totalAssets = assetCount;

            console.log(assetCount + " assets have been flagged for loading.");

            function onImageLoad() {

                if (--assetCount === 0) {
                    console.log("%c All game assets have been loaded.", "color: green");
                    UIController.gameLoader.hide();
                    resolve();
                }

                let percent = ((totalAssets - assetCount) / totalAssets) * 100;
                UIController.gameLoader.setProgress(percent);
            }

            self.performOnEveryAssetList(assets, function(assetList, requester, assetType, assetSubType) {

                assetList.forEach(function(assetPath, index, assetList) {

                    let img = new Image();
                    img.addEventListener("load", onImageLoad);
                    img.src = assetPath;
                    console.log("Loading: " + assetPath);

                    let target = requester.charAt(0) === requester.charAt(0).toUpperCase() ?
                                window[requester].prototype[assetType]
                            :   self[requester][assetType];


                    if (assetList.length === 1) {
                        target[assetSubType] = img;
                    } else {
                        if (target[assetSubType] !== undefined) {
                            target[assetSubType].push(img);
                        } else {
                            throw new TypeError(assetSubType + " must be defined on " + requester + "." + assetType);
                        }
                    }
                });
            });
        });
    },

    getPassedTime: function() {
        return (this.timePassed - this.timePassedOffset).toFixed(3) * 1000;
    },

    reset: function(resetTime = true) {

        //Reset game variables
        this.frameCount = 0;
        this.delta = 0;

        //Reset player variables
        this.player.levelComplete = false;
        this.player.resetPhysics();
        this.player.resetControls();
        this.player.setPosition(
            this.map.spawn[0],
            this.map.spawn[1]
        );
        this.player.savePosition(true);

        //Reset time
        if (resetTime) {
            //console.log(`[reset] tp: ${this.timePassed}, tpo: ${this.timePassedOffset}`);
            this.timePassedOffset = this.timePassed + (this.Utility.getTimestamp() - this.last) / 1000;
            //console.log(`[reset] tp: ${this.timePassed}, tpo: ${this.timePassedOffset}`);
        }

    },

    retry: function() {
        this.stop("resetMap");
        this.reset();
        this.start();
    },

    /**
     * Loads a map from a json file
     * into the game's map object.
     *
     * @param id
     * @returns {Promise}
     */
    loadMap: function(id) {
        let self = this;
        return new Promise(function(resolve, reject) {
            self.stop("loadMap");
            self.map.loadById(id).then(function() {
                self.reset();
                self.player.savePosition(true);
                self.camera.cacheMapSize(self.map);
                resolve();
            }).catch(function(result) {
                alert("The map with the id '" + result + "' does not exist.");
                self.start();
            });
        });
    },

    /**
     * Once the player finished a level,
     * submit the time he needed to server.
     *
     * @returns {Promise}
     */
    submitTime: function() {
        let self = this;

        return new Promise(function(resolve, reject) {

            let xhr = new XMLHttpRequest();

            let time = self.getPassedTime();
            let requestBody = "time=" + time;

            xhr.addEventListener("readystatechange", function() {
                if (this.readyState === 4) {

                    if (this.status === 200) {

                        let response = JSON.parse(this.responseText);

                        resolve({
                            rankings: response,
                            time: time
                        });

                    } else {
                        reject();
                    }

                    console.log(this.responseText);
                }
            });

            xhr.open("POST", "/map/submit-time", true);
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xhr.send(requestBody);

        });
    },

    drawTime: function(time) {
        this.context.font = "28px Luckiest Guy";
        this.context.fillStyle = "rgba(0,0,0, 0.8)";
        this.context.fillRect(20, 20, 200, 50);
        this.context.fillStyle = "#64dd17";
        this.context.fillText(UI.timeUtil.fromMs(time) , 50, 55);
    },

    drawOverlays: function() {

        this.drawTime(this.getPassedTime());
        this.player.drawMode(this.context);
    },

    /**
     * Renders everything.
     */
    render: function (frameCount) {
        //UIController.canvas.reset();

        this.map.draw(this.context, this.camera);
        this.player.draw(this.context, this.camera, this.frameCount);

        if (this.player.SHOW_COLLISION) {
            this.player.drawCollision(this.map, this.camera);
        }

        this.drawOverlays();

        //this.camera.draw(this.context);
    },

    /**
     * Updates everything.
     * @param delta
     */
    update: function (delta) {

        let self = this;

        this.player.update2(delta, this.map);

        if (this.player.levelComplete) {

            this.stop("mapComplete");

            UI.menus.switchTo(UI.mapComplete, {
                noBg: true,
                hideGame: false
            });

            this.submitTime()
                .then(function(response) {

                    UI.mapComplete.buildRankings(
                        response.rankings,
                        self.map.name,
                        response.time
                    );

                    UI.mapComplete.showStats();
                });
        }

        this.camera.update(this.player);
    },

    /**
     * Prepare the start of the map
     * by rendering for 100ms and then
     * calling showStartScreen.
     */
    prepareStart: function() {

        let self = this;

        //Reset everything
        this.reset();

        /**
         * In order to see the map in
         * the background overlayed by
         * a black "Press space to start"
         * alpha overlay, the game is started
         * and renders for 100ms.
         */
        this.start();

        /**
         * Then after 100ms we stop the game,
         * to revoke player controls and
         * draw the startScreen on top of it.
         */
        setTimeout(function() {
            self.stop(self.config.suspensions.retryMap);
            self.showStartScreen();
        }, 100);
    },

    /**
     * Add a start screen, so the player
     * can decide when to start the game
     * by pressing space.
     */
    showStartScreen: function() {

        /**
         * Since the game has run for 100ms
         * in order for us to have a background
         * to put the startScreen over,
         * we redraw the time with 0ms passed.
         */
        this.drawTime(0);

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

        console.log(`[start screen] tp: ${this.timePassed}, tpo: ${this.timePassedOffset}`);
    },

    /**
     * Starts up the game by requesting
     * the animation frame loop for our
     * game tick.
     */
    start: function () {
        if (!this.requestId) {
            window.requestAnimationFrame(this.tick.bind(this));
            this.state = this.states.play;
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
     */
    stop: function (reason) {
        if (this.requestId) {
            window.cancelAnimationFrame(this.requestId);
            this.state = this.states.menu;
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
     */
    tick: function () {

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

    },

    init: function () {

        //Keep alias reference of this.
        let self = this;

        //Setup all event listeners.
        this.bindEvents();

        //Setup a reference timestamp for the game tick.
        this.last = this.Utility.getTimestamp();

        console.log(`[init 1] tp: ${this.timePassed}, tpo: ${this.timePassedOffset}`);

        //Load all assets.
        this.loadAssets().then(function() {

            console.log(`[init 2] tp: ${self.timePassed}, tpo: ${self.timePassedOffset}`);

            self.prepareStart();


        });


    }
};







