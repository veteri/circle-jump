/**
 * Handles everything that happens in the UI.
 * Also provides a few helper utility objects.
 *
 * @type {object}
 */
const UIController = UI = (function () {

    /**
     * Handles time to time string conversion.
     * @type {{fromMs: fromMs}}
     */
    let timeUtil = {

        /**
         * Returns a time string from millisecond.
         * Examples:
         *      fromMs(120000)  => "02:00.000"    (M:S.MS)
         *      fromMs(3812356) => "01:03:32.356" (H:M:S.MS)
         *
         * @param ms {number} The milliseconds
         * @returns {string}  The time string.
         */
        fromMs: function(ms) {

            let hours,
                minutes,
                seconds,
                miliseconds,
                timeString = "";

            /**
             * Math.round is required here, in case a small
             * number like 1 is inserted as "ms".
             * Javascript will convert ( 1 / 3600000)
             * to  2.7777777777777776e-7 notation and parseInt will return 2.
             * Essentially giving us 2 hours for 1 millisecond time.
             */
            hours       = parseInt(Math.floor(ms / 3600000));

            minutes     =   parseInt((ms % 3600000) / 60000);
            seconds     =  parseInt(((ms % 3600000) % 60000) / 1000);
            miliseconds = parseInt((((ms % 3600000) % 60000) % 1000));

            hours       = String(hours).padStart(2, "0");
            minutes     = String(minutes).padStart(2, "0");
            seconds     = String(seconds).padStart(2, "0");
            miliseconds = String(miliseconds).padStart(3, "0");

            timeString += parseInt(hours) ? `${hours}:`      : "";
            timeString += minutes         ? `${minutes}:`    : "";
            timeString += seconds         ? `${seconds}.`    : "";
            timeString += miliseconds     ? `${miliseconds}` : "";

            return timeString;
        },
    };

    /**
     * Manages the music used in the game
     * menu and in game.
     *
     * @type {object}
     */
    let musicManager = {

        /**
         * The menu audio element.
         * @type {Element}
         */
        menu       : document.querySelector("audio.menu"),

        /**
         * The game first audio element.
         * @type {Element}
         */
        vega       : document.querySelector("audio.vega"),

        /**
         * The game second audio element.
         * @type {Element}
         */
        bd         : document.querySelector("audio.blackdiamond"),

        /**
         * The game third audio element.
         * @type {Element}
         */
        aludra     : document.querySelector("audio.aludra"),

        /**
         * The game third audio element.
         * @type {Element}
         */
        sphinx     : document.querySelector("audio.sphinx"),

        /**
         * The game third audio element.
         * @type {Element}
         */
        djin     : document.querySelector("audio.djin"),

        /**
         * An array holding all the songs
         * @type {Array}
         */
        songs      : null,

        /**
         * The active and now playing song.
         * @type {Element}
         */
        active     : null,

        /**
         * The index of the active song.
         * @type {number}
         */
        activeIndex: 0,

        /**
         * The volume of the music. Applies to all songs.
         * @type {number}
         */
        volume: 0.1,

        /**
         * Sets the given element as the active song.
         * @param element {Element} The audio element.
         */
        setActive: function(element) {
            this.active = element;
        },

        /**
         * Plays the active song.
         * @returns void
         */
        play: function() {

            if (this.active === null) this.active = this.menu;

            this.active.volume      = this.volume;
            this.active.currentTime = 0;
            this.active.play();
        },

        /**
         * Fades the active song to 0 volume
         * and then executes the given callback.
         *
         * @param callback The function to call after fading.
         * @returns void
         */
        fade: function(callback) {
            let self = this;
            let newVolume = this.active.volume;

            let fadeOutID = setInterval(function() {
                newVolume = newVolume - 0.001;

                if (newVolume >= 0) {
                    self.active.volume = newVolume;
                } else {
                    callback();
                    clearInterval(fadeOutID);
                }

            }, 2000 * (0.001 / this.volume));
        },

        /**
         * Fades the active song out and pauses.
         * @returns void
         */
        fadeOut: function() {
            let self = this;
            this.fade(function() {
                self.active.pause();
            });
        },

        /**
         * Fades to the given songs audio element.
         * @param element {Element}
         */
        fadeToTrack: function(element) {
            let self = this;
            this.fade(function() {
                self.active.pause();
                self.setActive(element);
                self.play();
            });
        },

        /**
         * Fades to a random track of the songs array.
         * @returns void
         */
        fadeToRandomTrack: function() {
            let randomIndex = Math.floor(Math.random() * 5);
            this.fadeToTrack(this.songs[randomIndex]);
        },

        /**
         * Change the volume that each song uses
         * to the given volume.
         *
         * @param volume {number}
         */
        changeVolume: function(volume) {
            this.volume = volume;
            this.active.volume = volume;
        },

        /**
         * Initializes the music manager for use.
         * This must be called before any other methods
         * can be called.
         *
         * @returns void
         */
        init: function() {

            let self = this;
            let cookieVolume = Cookies.get("cj_music_volume");

            if (cookieVolume !== undefined) {
                this.volume = parseFloat(cookieVolume);
            }

            settingsMenu.volumeSlider.val(this.volume * 100);

            this.songs = [this.vega, this.bd, this.aludra, this.sphinx, this.djin];

            this.songs.forEach(function(song) {
                song.addEventListener("ended", function() {

                    if (++self.activeIndex > self.songs.length - 1) {
                        self.activeIndex = 0;
                    }

                    self.setActive(self.songs[self.activeIndex]);
                    self.play();
                });
            })
        }

    };

    /**
     * Builds the ranking table as seen in the
     * leader board menu or in the map completion menu.
     *
     * @type {object}
     */
    let rankingUtil = {

        /**
         * Build the ranking table for the passed
         * ranking array (of objects).
         *
         * @param rankings {Array} The rankings
         */
        build: function(rankings) {

            let html = "";

            rankings.forEach(function(ranking, index) {
                html += `
                     <div class="score ${ranking.player ? "player-time" : ""} clearfix">
                        <div class="rank">${index + 1}</div>
                        <div class="name">${ranking.name}</div>
                        <div class="time">${timeUtil.fromMs(ranking.time)}</div>
                    </div>
                `;
            });

            return html;
        }
    };


    /**
     * Handles everything ui related to the canvas
     * the game is rendered on.
     *
     * @type {object}
     */
    let gameCanvas = {

        /**
         * The configuration of the canvas
         * @type {object}
         */
        config: {

            /**
             * The width of the canvas
             * @type {number}
             */
            width : 1920,

            /**
             * The height of the canvas
             * @type {number}
             */
            height: 1080
        },

        /**
         * Indicates whether or not the canvas is rendered
         * full screen at this point in time.
         * @type {boolean}
         */
        isFullscreen: false,

        /**
         * The canvas DOMElement.
         * @type {Element}
         */
        canvas: document.getElementById("canvas"),

        /**
         * The 2D context of the canvas,
         * that we will render on.
         * @type {CanvasRenderingContext2D}
         */
        context: document.getElementById("canvas").getContext("2d"),

        /**
         * Displays a notification for exiting the game canvas.
         * @returns void
         */
        displayEscapeNotification: function() {
            M.toast({html: "Press tab to switch to main menu."});
        },

        /**
         * Displays a map-complete notification.
         * @returns void
         */
        congratulations: function() {
            M.toast({html: 'Map completed. Respawning...'});
        },

        /**
         * Opens the entire page in fullscreen.
         * @returns {*}
         */
        openFullscreen: function() {
            let root = document.documentElement;
            this.isFullScreen = true;

            return root.requestFullscreen       && root.requestFullscreen()
                || root.mozRequestFullScreen    && root.mozRequestFullScreen()
                || root.webkitRequestFullscreen && root.webkitRequestFullscreen()
                || root.msRequestFullscreen     && root.msRequestFullscreen();
        },

        /**
         * Close the fullscreen mode.
         * @returns {*}
         */
        closeFullscreen: function() {
            let root = document;
            this.isFullScreen = false;

            return root.exitFullscreen       && root.exitFullscreen()
                || root.mozCancelFullScreen  && root.mozCancelFullScreen()
                || root.webkitExitFullscreen && root.webkitExitFullscreen()
                || root.msExitFullscreen     && root.msExitFullscreen();

        },

        /**
         * Toggle fullscreen. Opens fullscreen if we're not
         * in fullscreen and vice versa.
         * @returns void
         */
        toggleFullscreen: function() {
            if (!this.isFullScreen) {
                this.openFullscreen();
            } else {
                this.closeFullscreen();
            }
        },

        /**
         * Get the position of the mouse for the game canvas.
         *
         * @param event {MouseEvent} The event
         * @returns {{x: number, y: number}} The position
         */
        getMousePosition: function(event) {
            let rect   = this.canvas.getBoundingClientRect();
            let scaleX = this.canvas.width  / rect.width;
            let scaleY = this.canvas.height / rect.height;

            return {
                x: (event.clientX - rect.left) * scaleX,
                y: (event.clientY - rect.top ) * scaleY
            }
        },

        /**
         * Get the position of the mouse for the game canvas
         * but also accounting the game camera.
         *
         * @param event {MouseEvent} The event
         * @param camera {Camera}    The camera
         * @returns {{x: *, y: *}}   The position
         */
        getCameraMousePosition: function(event, camera) {
            let position = this.getMousePosition(event);
            return {
                x: position.x + camera.x,
                y: position.y + camera.y
            }
        },

        /**
         * Get the canvas element.
         * @returns {Element}
         */
        get: function() {
            return this.canvas;
        },

        /**
         * Get the 2D context of the canvas.
         * @returns {CanvasRenderingContext2D}
         */
        getContext: function() {
            return this.context
        },

        /**
         * Get the dimensions of the canvas.
         * @returns {{width, height}}
         */
        getDimensions: function() {
            return {
                width : this.canvas.width,
                height: this.canvas.height
            }
        },

        /**
         * Set the dimensions of the canvas.
         *
         * @param width  The width you want.
         * @param height The height you want.
         */
        setDimensions: function(width, height) {
            this.canvas.width = width;
            this.canvas.height = height;
        },

        /**
         * Show the canvas element (if it was hidden).
         * @returns void
         */
        show: function() {
            $(this.canvas).fadeIn(2000);
        },

        /**
         * Hide the canvas element (if it was visible)
         * @returns void
         */
        hide: function() {
            $(this.canvas).hide();
        },

        /**
         * Reset the canvas by clearing every pixel on it.
         * @returns void
         */
        reset: function() {
            this.context.clearRect(0, 0, canvas.width, canvas.height);
        },

        /**
         * Initializes the game canvas for use.
         * @returns void
         */
        init: function() {
            this.canvas.width  = this.config.width;
            this.canvas.height = this.config.height;
        }
    };

    /**
     * Manages the loading indicator for the game.
     * @type {object}
     */
    let gameLoader = {

        /**
         * The HTML container in which the loader sits.
         * @type {jQuery}
         */
        container : $(".loading-info"),

        /**
         * The progress bar
         * @type {jQuery}
         */
        progress  : $(".loading-info .progress > .determinate"),

        /**
         * The label to indicate what is being loaded.
         * @type {jQuery}
         */
        loadLabel : $(".loading-info > .label"),

        /**
         * The label to indicate what specific
         * asset is being loaded at the time.
         *
         * @type {jQuery}
         */
        assetLabel: $(".loading-info > .asset"),

        /**
         * Show the loader.
         * @returns void
         */
        show: function() {
            this.reset();
            this.container.show();
        },

        /**
         * Hides the loader. Duration 1 second.
         * @returns void
         */
        hide: function() {
            this.container.fadeOut(1000);
        },

        /**
         * Resets the progress bar to 0.
         * @returns void
         */
        reset: function() {
            this.progress.width(0);
        },

        /**
         * Sets the progress to the given percent.
         *
         * @param percent {number} The progress in percent
         * @returns void
         */
        setProgress: function(percent) {
            this.progress.css("width", percent + "%");
        },

        /**
         * Set the loading label to the given string.
         *
         * @param label {string} The label
         * @returns void
         */
        setLabel: function(label) {
            if (label !== null) {
                this.label.text(label);
            }
        },

        /**
         * Set the asset that is being loaded
         * to the given string.
         *
         * @param asset {string} The asset
         * @returns void
         */
        setAsset: function(asset) {
            this.assetLabel.text(asset);
        }

    };

    /**
     * The game's main menu.
     * @type {object}
     */
    let mainMenu = {

        /**
         * The container in which the menu sits in.
         * @type {jQuery}
         */
        container   : $(".main.menu"),

        /**
         * The "Play" button in the menu.
         * @type {jQuery}
         */
        play        : $(".main.menu div[data-button=play]"),

        /**
         * The "Leaderboard" button in the menu.
         * @type {jQuery}
         */
        leaderboard : $(".main.menu div[data-button=leaderboard]"),

        /**
         * The "How to play?" button in the menu.
         * @type {jQuery}
         */
        howToPlay   : $(".main.menu div[data-button=how2play]"),

        /**
         * The "Settings" button in the menu.
         */
        settings    : $(".main.menu div[data-button=settings]"),

        /**
         * The "Home" button for the menu.
         */

        home        : $(".game .home"),

        /**
         * Show the main menu.
         * @returns void
         */
        show: function () {
            if (this.container.is(":hidden")) {
                this.container.fadeIn(300);
            }
            this.home.fadeIn(300);
        },

        /**
         * Hides the main menu.
         * @returns void
         */
        hide: function () {
            //this.container.fadeOut(300);
            this.container.hide();
        },

        /**
         * Hide the home button.
         * @returns void
         */
        hideHome: function() {
            this.home.fadeOut(300);
        }

    };

    /**
     * The leaderboard menu.
     * @type {object}
     */
    let leaderboard = {

        /**
         * The container in which the leaderboard menu sits in.
         * @type {jQuery}
         */
        container   : $(".leaderboard.menu"),

        /**
         * The "Back" button at the top left of the menu.
         * @type {jQuery}
         */
        back        : $(".leaderboard.menu .back"),

        /**
         * The container for the available maps.
         * @type {jQuery}
         */
        maps        : $(".leaderboard.menu .maps .list"),

        /**
         * The subtitle which indicates what map
         * is being looked at.
         * @type {jQuery}
         */
        subtitle    : $(".leaderboard.menu .map-leaderboard .subtitle"),

        /**
         * The visual loader indicating that
         * rankings are being loaded.
         * @type {jQuery}
         */
        loader      : $(".leaderboard.menu .map-leaderboard .loader"),

        /**
         * The notice that prompts the user
         * to select a map.
         * @type {jQuery}
         */
        notice      : $(".leaderboard.menu .map-leaderboard .no-selection"),

        /**
         * The label indicating the map name.
         * @type {jQuery}
         */
        mapLabel    : $(".leaderboard.menu .map-leaderboard .map"),

        /**
         * The container for the three trophies.
         * @type {jQuery}
         */
        trophies    : $(".leaderboard.menu .map-leaderboard .trophies"),

        /**
         * The element for the player name on rank 1.
         * @type {jQuery}
         */
        rank1       : $(".leaderboard.menu .map-leaderboard .first .player"),

        /**
         * The element for the player name on rank 2.
         * @type {jQuery}
         */
        rank2       : $(".leaderboard.menu .map-leaderboard .second .player"),

        /**
         * The element for the player name on rank 3.
         * @type {jQuery}
         */
        rank3       : $(".leaderboard.menu .map-leaderboard .third .player"),

        /**
         * The container for the rankings.
         * @type {jQuery}
         */
        rankings    : $(".leaderboard.menu .map-leaderboard .rankings"),

        /**
         * The list that contains all rankings
         * @type {jQuery}
         */
        rankingsBody: $(".leaderboard.menu .map-leaderboard .rankings .body"),

        /**
         * Show the leaderboard.
         * @returns void.
         */
        show: function() {
            this.container.show();
        },

        /**
         * Hide the leaderboard.
         * @returns void
         */
        hide: function() {
            this.container.fadeOut(300);
        },

        /**
         * Resets the trophies player names to <unclaimed>
         * @returns void
         */
        resetTrophies: function() {
            [this.rank1, this.rank2, this.rank3].forEach(function(rank) {
                rank.text("<unclaimed>");
            });
        },

        /**
         * Builds the map score.
         * Includes both trophies and rankings.
         *
         * @param rankings {Array} The rankings
         * @param map {jQuery} The map element
         * @returns void
         */
        buildMapScore: function(rankings, map) {

            this.resetTrophies();

            if (rankings[0] !== undefined) {
                this.rank1.text(rankings[0].name);
            }

            if (rankings[1] !== undefined) {
                this.rank2.text(rankings[1].name);
            }

            if (rankings[2] !== undefined) {
                this.rank3.text(rankings[2].name);
            }

            this.rankingsBody.html(
                rankingUtil.build(rankings)
            );

            this.mapLabel.text(map.attr("data-name"));

        },

        /**
         * Show the statistics for the map.
         * @returns void
         */
        showMapScore: function() {
            this.subtitle.fadeIn(300);
            this.trophies.fadeIn(300);
            this.rankings.fadeIn(300);
        },

        /**
         * Hide the statistics for the map
         * @returns void
         */
        hideMapScore: function() {
            this.subtitle.fadeOut(300);
            this.trophies.fadeOut(300);
            this.rankings.fadeOut(300);
        },

        /**
         * Select and highlight the
         * given map element.
         *
         * @param map {jQuery}
         * @returns void
         */
        select: function(map) {
            map.addClass("selected");
            this.mapLabel.text(map.data("name"));
            this.notice.hide();
        },

        /**
         * Deselect all maps in the list.
         * @returns void
         */
        deselect: function() {
            this.maps.children(".item.selected").removeClass("selected");
        },

        /**
         * Get the map name of the
         * currently selected map.
         *
         * @returns {string}
         */
        getMap: function() {
            return this.mapLabel.text();
        },

        /**
         * Show the loader of the leaderboard.
         * @returns void
         */
        showLoader: function() {
            this.loader.fadeIn(300);
        },

        /**
         * Hide the loader of the leaderboard.
         * @returns void
         */
        hideLoader: function() {
            this.loader.fadeOut(300);
        }

    };

    /**
     * The "How to play?" menu.
     * @type {object}
     */
    let howToPlay = {

        /**
         * The container in which the menu sits in.
         * @type {jQuery}
         */
        container: $(".how2play.menu"),

        /**
         * The "Back" button at the top
         * left corner of the menu.
         * @type {jQuery}
         */
        back     : $(".how2play.menu .back"),

        /**
         * A collection of chapters.
         * @type {jQuery}
         */
        chapters : $(".how2play.menu > .explanations > .chapter"),

        /**
         * Show the container and each chapter
         * one after the other.
         *
         * @returns void
         */
        show: function() {
            this.chapters.each(function() {
                $(this).hide();
            });
            this.container.show();
            this.chapters.each(function(index) {
                $(this).delay(500 * index).slideDown(300);
            });
        },

        /**
         * Hide the menu.
         * @returns void
         */
        hide: function() {
            this.container.fadeOut(300);
        }

    };

    /**
     * The settings menu.
     * @type {object}
     */
    let settingsMenu = {

        /**
         * The container in which the menu sits in.
         * @type {jQuery}
         */
        container    : $(".menu.settings"),

        /**
         * The "Back" button at the top left of the menu.
         * @type {jQuery}
         */
        back         : $(".menu.settings .back"),

        /**
         * The volume slider.
         * @type {jQuery}
         */
        volumeSlider : $(".menu.settings input[type=range]"),

        /**
         * The container for the perspective options
         * @type {jQuery}
         */
        options      : $(".menu.settings .options"),

        /**
         * Show the menu.
         * @returns void
         */
        show: function() {
            this.container.show();
        },

        /**
         * Hide the menu.
         * @returns void
         */
        hide: function() {
            this.container.fadeOut(300);
        },

        init: function(game) {
            let perspective = Cookies.get("cj_camera_perspective");

            if (perspective !== undefined) {
                this.options.find("input").attr("checked", false);
                this.options.find("input[value=" + perspective + "]").attr("checked", true);
                game.changePerspective(perspective);
            }
        }
    };

    /**
     * The map selection menu.
     * @type {object}
     */
    let mapChoice = {

        /**
         * The container in which the menu sits in.
         * @type {jQuery}
         */
        container: $(".map-selection.menu"),

        /**
         * The "Back" button at the top left of the menu.
         * @type {jQuery}
         */
        back     : $(".map-selection.menu .back"),

        /**
         * The selection (pick).
         * @type {jQuery}
         */
        pick     : $(".map-selection.menu .selection .map"),

        /**
         * The list container for the available maps.
         * @type {jQuery}
         */
        maps     : $(".map-selection.menu .list"),

        /**
         * The notice for when the user
         * performs some illegal action.
         *
         * @type {jQuery}
         */
        notice   : $(".map-selection.menu .notice"),

        /**
         * The "Play" button at the bottom to confirm.
         * @type {jQuery}
         */
        confirm  : $(".map-selection.menu .confirm"),

        /**
         * Show the menu.
         * @returns void
         */
        show: function() {

            //We always want to start with no selection.
            this.deselect();
            this.pick.text("none");
            this.pick.attr("data-selected", "");

            this.container.show();
        },

        /**
         * Hide the menu.
         * @returns void
         */
        hide: function() {
            this.container.fadeOut(300);
        },

        /**
         * Select and highlight the given map element.
         *
         * @param map {jQuery} The map element.
         * @returns void
         */
        select: function(map) {
            map.addClass("selected");
            this.pick.text(map.attr("data-name"));
            this.pick.attr("data-selected", map.attr("data-id"));
        },

        /**
         * Deselects all maps.
         * @return void
         */
        deselect: function() {
            this.maps.children(".item.selected").removeClass("selected");
        },

        /**
         * Get the next map in the list
         * based on the given map id.
         *
         * @param id The id of the map.
         * @returns {jQuery} The next map element
         */
        getNextMap: function(id) {
            let nextMap = this.maps.find(".map[data-id=" + id + "]").next();
            let result = null;

            if (nextMap.length > 0) {
                result = nextMap;
            }

            return result;
        },

        /**
         * Displays a notice that a map
         * has to be selected.
         *
         * @returns void
         */
        informUserOfMissingMap: function() {
            this.notice.css('visibility', 'visible');
        },

        /**
         * Hide the notice.
         * @returns void
         */
        hideNotice: function() {
            this.notice.fadeOut(300, function() {
                $(this).css({display: "block", visibility: "hidden"});
            });
        },

        /**
         * Get the id of the currently selected map.
         * @returns {number}
         */
        getMap: function() {
            return this.pick.attr("data-selected");
        }

    };

    /**
     * The map completion menu.
     * @type {object}
     */
    let mapComplete = {

        /**
         * The container in which the menu sits in.
         * @type {jQuery}
         */
        container  : $(".menu.map-complete"),

        /**
         * The loader
         * @type {jQuery}
         */
        loader     : $(".menu.map-complete .submit-score"),

        /**
         * The statistics container.
         * @type {jQuery}
         */
        statistics : $(".menu.map-complete .statistics"),

        /**
         * The label for the map that just has been completed.
         * @type {jQuery}
         */
        mapLabel   : $(".menu.map-complete .statistics .map"),

        /**
         * The label for the time that was required
         * to finish the map.
         *
         * @type {jQuery}
         */
        timeLabel  : $(".menu.map-complete .statistics span.time"),

        /**
         * A rating for the player time.
         * Can be one the 3 following.
         *
         *      -World Record (Best time globally)
         *      -Personal best (New personal best time)
         *      -(+X) A time worse than the personal best
         *
         * @type {jQuery}
         */
        timeRating : $(".menu.map-complete .statistics span.time-rating"),

        /**
         * The container of the map rankings.
         * @type {jQuery}
         */
        rankingBody: $(".menu.map-complete .rankings .body"),

        /**
         * The "Retry" button.
         * @type {jQuery}
         */
        retry      : $(".menu.map-complete .button.retry"),

        /**
         * The "Next map" button.
         * @type {jQuery}
         */
        nextMap    : $(".menu.map-complete .button.next-map"),

        /**
         * The "Quit" button.
         * @type {jQuery}
         */
        quit       : $(".menu.map-complete .button.quit"),

        /**
         * Show the menu. This will show the loader only.
         * In order to show the statistics once they're
         * available, a call to "showStats" is required.
         *
         * @returns void
         */
        show: function() {
            this.statistics.hide();
            this.loader.show();
            this.container.fadeIn(300);
        },

        /**
         * Shows the statistics and hides the loader.
         * @returns void
         */
        showStats: function() {
            this.loader.fadeOut(300);
            this.statistics.fadeIn(300);
        },

        /**
         * Build all of the statistics for this map
         * and the run the player just performed.
         *
         * @param rankings {Array} The rankings of the map
         * @param map {string} The map name
         * @param time {number} The time in miliseconds
         * @returns void
         */
        buildStatistics: function(rankings, map, time) {

            //Table
            this.rankingBody.html(
                rankingUtil.build(rankings)
            );

            //Map name
            this.mapLabel.text(map);

            //Player time
            this.timeLabel.text(timeUtil.fromMs(time));

            /**
             * Display personal best notification
             * or show how much slower the run was
             * compared to an earlier run the player
             * has performed.
             */

            //Get the players ranking
            let playerRanking = rankings.filter(ranking => ranking.player)[0];

            //Check if player time is a record
            let isWorldRecord = time === parseInt(rankings[0].time);

            //Reset timeRating (no regress nor personal best)
            this.timeRating.attr("class", "time-rating");

            if (isWorldRecord) {

                this.timeRating.addClass("world-record");
                this.timeRating.text("World record!");

            } else if (time === parseInt(playerRanking.time)) {

                this.timeRating.addClass("personal-best");
                this.timeRating.text("Personal best!");

            } else {

                this.timeRating.addClass("regress");
                this.timeRating.text("+" + timeUtil.fromMs(time - playerRanking.time));

            }

        },

        /**
         * Hide the menu.
         * @returns void
         */
        hide: function() {
            this.container.fadeOut(300);
        }
    };

    /**
     * Convenience Manager for all menus.
     * @type {object}
     */
    let menus = {

        /**
         * The container where all menus sit in.
         * @type {jQuery}
         */
        container: $(".game-menus"),

        /**
         * All menus.
         * @type {Array}
         */
        _menus: [mainMenu, howToPlay, mapChoice, leaderboard, mapComplete, settingsMenu],

        /**
         * Switch to the given menu with the
         * given options.
         *
         * @param menu The menu object
         * @param options The options to use
         */
        switchTo: function(menu, options) {

            //If no options were passed, we assign it an empty object
            options = options || {};

            //Hide background based on options
            if (options.noBg) {
                this.container.css("background", "none");
            } else {
                this.container.css("background", "url('/assets/images/menu/menu_bg.png')");
            }

            this.container.show();

            //Hide game based on options
            if (options.hideGame) {
                gameCanvas.hide();
            }

            //Hide all menus
            this.hide();

            //Show the given menu
            menu.show();
        },

        /**
         * Hides all menus and the container.
         * @returns void
         */
        hideAll: function() {
            this.container.hide();
            this.hide();
        },

        /**
         * Hides all menus.
         * @returns void
         */
        hide: function() {
            this._menus.forEach(function(menu) {
                menu.hide();
            });
        }
    };

    /**
     * The controls of the editor.
     * @type {object}
     */
    let editorControls = {

        /**
         * The container which holds all maps
         * the user has created so far.
         *
         * @type {jQuery}
         */
        userMapList     : $(".editor .user-map-list"),


        /**
         * The difficulty of the map.
         * @type {jQuery}
         */
        difficulty      : $(".editor .difficulty img"),

        /**
         * The input for the map name.
         * @type {jQuery}
         */
        name            : $(".editor #map-name"),

        /**
         * The select for the background scenes.
         * @type {jQuery}
         */
        backgroundScenes: $(".editor #backgroundScenes"),

        /**
         * The select for the ground.
         * @type {jQuery}
         */
        ground          : $(".editor #ground"),

        /**
         * The "Remove Ground" button.
         * @type {jQuery}
         */
        removeGround    : $(".editor .remove-ground"),

        /**
         * The "Add level" button.
         * @type {jQuery}
         */
        addLevel        : $(".editor .add-level"),

        /**
         * The "Remove level" button.
         * @type {jQuery}
         */
        removeLevel     : $(".editor .remove-level"),

        /**
         * The "Reset level" button.
         * @type {jQuery}
         */
        resetLevel      : $(".editor .reset-level"),

        /**
         * The "Previous level" button.
         * @type {jQuery}
         */
        prevLevel       : $(".editor .previous-level"),

        /**
         * The "Next level" button.
         * @type {jQuery}
         */
        nextLevel       : $(".editor .next-level"),

        /**
         * The container for the textures.
         * @type {jQuery}
         */
        textures        : $(".editor .textures > .body"),

        /**
         * The active texture.
         * @type {jQuery}
         */
        active          : $(".editor .textures > .active"),

        /**
         * The "Run" Button.
         * @type {jQuery}
         */
        run             : $(".editor button.run"),

        /**
         * The "Publish" button.
         * @type {jQuery}
         */
        save            : $(".editor button.save"),

        /**
         * Set the map name to the given name.
         *
         * @param name {string} The name to set.
         * @returns void
         */
        setMapName: function(name) {
            this.name.val(name);
        },

        /**
         * Get the map name.
         * @returns {string}
         */
        getMapName: function() {
            return this.name.val();
        },

        /**
         * Lock the map name to read only.
         * @returns void
         */
        lockMapName: function() {
            this.name.attr("disabled", true);
        },

        setMapDifficulty: function(difficulty) {
            this.difficulty.attr(
                "src",
                "/assets/images/menu/" + difficulty + ".png"
            );
            this.difficulty.attr("data-difficulty", difficulty);
        },

        /**
         * Set the active texture to
         * the given texture element.
         *
         * @param textureElement {jQuery} The texture to activate
         * @returns void
         */
        setActive: function(textureElement) {
            let img = this.active.find("img");
            img.attr("src", textureElement.attr("src"));
            img.attr("data-tile-type", textureElement.attr("data-tile-type"));
        },

        /**
         * Get the tile type of the active texture.
         * @returns {Number} The tile type
         */
        getActiveType: function() {
            return parseInt(this.active.find("img").attr("data-tile-type"));
        },

        /**
         * Builds the select for the background scenes
         * for the given game instance.
         *
         * @param game {Game} The game instance
         */
        buildBackgroundScenes: function(game) {

            let html = "";
            for (let background in game.map.backgrounds) {
                if (game.map.backgrounds.hasOwnProperty(background)) {
                    let label = background.split(/(?=[A-Z])/).join(" ");
                    html += `<option value="${background}">${label}</option>`;
                }
            }

            this.backgroundScenes.append(html);
        },

        /**
         * Builds all the textures that a user
         * can select.
         *
         * @returns void
         */
        buildTextures: function() {

            let sprites = Tile.prototype.assets.sprites;
            let textureClass = "";
            let html = "";

            for (let theme in sprites) {

                if (sprites.hasOwnProperty(theme)) {
                    let themeObject = sprites[theme];

                    for (let textureKey in themeObject) {

                        if (themeObject.hasOwnProperty(textureKey)) {

                            textureClass = theme === "objects" ? "non-collide" : "collide";
                            html += `<img class="${textureClass}" data-tile-type=${textureKey} src=${themeObject[textureKey]}>`
                        }
                    }
                }
            }

            this.textures.append(html);

        },

        /**
         * Add a published map to the list
         * of the users maps
         *
         * @param map {object} Object filled with map info
         * @returns void
         */
        addPublishedMapToList: function(map) {

            /**
             * If the user publishes his first map,
             * remove the notice that he does not
             * have any maps.
             */
            let noMapsNotice = this.userMapList.children(".no-maps-notice");
            if (noMapsNotice.length > 0) {
                noMapsNotice.remove();
            }

            this.userMapList.append(`
                 <div class="col s4">
                    <div class="card" data-map-id="${map.id}">
                        <div class="card-image">
                            <img src="/assets/images/landing-slider/parallax03_preview-01.png">
                            <span class="card-title">${map.name}</span>
                            <a class="select btn-floating halfway-fab waves-effect waves-light green"><i class="material-icons">add</i></a>
                        </div>
                        <div class="card-content">
                            <p>Created ${map.created_at}</p>
                        </div>
                    </div>
                </div>
            `);
        },

        /**
         * Initializes the editor controls
         * for the given game instance.
         *
         * @param game {Game} The game instance
         */
        init: function(game) {
            this.buildBackgroundScenes(game);
            this.buildTextures();
        }

    };

    return {

        //Util
        timeUtil     : timeUtil,
        musicManager : musicManager,

        //Editor
        editorControls: editorControls,

        //Game
        gameCanvas: gameCanvas,
        gameLoader: gameLoader,

        //Menu
        menus       : menus,
        mainMenu    : mainMenu,
        howToPlay   : howToPlay,
        settingsMenu: settingsMenu,
        mapChoice   : mapChoice,
        leaderboard : leaderboard,
        mapComplete : mapComplete
    }


})();