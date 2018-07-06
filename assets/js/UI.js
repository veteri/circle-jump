/**
 * Created by Midi on 26.04.2018.
 */


const UIController = UI = (function () {

    let config = {
        canvasWidth : 1920,
        canvasHeight: 1080
    };

    let gameCanvas = {

        canvas: document.getElementById("canvas"),
        context: document.getElementById("canvas").getContext("2d"),

        get: function() {
            return this.canvas;
        },
        getContext: function() {
            return this.context
        },
        getDimensions: function() {
            return {
                width : this.canvas.width,
                height: this.canvas.height
            }
        },
        show: function() {
            $(this.canvas).show();
        },
        hide: function() {
            $(this.canvas).hide();
        },
        reset: function() {
            this.context.clearRect(0, 0, canvas.width, canvas.height);
        },
        init: function() {
            this.canvas.width  = config.canvasWidth;
            this.canvas.height = config.canvasHeight;
        }
    };

    let gameLoader = {

        container: $(".game .loading-info"),
        progress: $(".loading-info .progress"),

        show: function() {
            this.container.show();
        },
        hide: function() {
            this.container.fadeOut(300);
        },
        setProgress: function(percent) {
            this.progress.css("width", percent + "%");
        }
    };

    let mainMenu = {

        container  : $(".main.menu"),
        play       : $(".main.menu div[data-button=play]"),
        leaderboard: $(".main.menu div[data-button=leaderboard]"),
        settings   : $(".main.menu div[data-button=settings]"),

        show: function () {
            if (this.container.is(":hidden")) {
                this.container.fadeIn(300);
            }
        },

        hide: function () {
            this.container.fadeOut(300);
        }

    };

    let mapChoice = {

        container: $(".map-selection.menu"),
        pick     : $(".map-selection.menu .selection .map"),
        maps     : $(".map-selection.menu .list"),
        notice   : $(".map-selection.menu .notice"),
        confirm  : $(".map-selection.menu .confirm"),

        show: function() {
            if (this.container.is(":hidden")) {
                this.container.fadeIn(300);
            }
        },

        hide: function() {
            this.container.fadeOut(300);
        },

        select: function(map) {
            map.addClass("selected");
            this.pick.text(map.attr("data-map"));
        },

        deselect: function() {
            this.maps.children(".item.selected").removeClass("selected");
        },

        informUserOfMissingMap: function() {
            this.notice.css('visibility', 'visible');
        },

        hideNotice: function() {
            this.notice.fadeOut(300, function() {
                $(this).css({display: "block", visibility: "hidden"});
            });
        },

        getMap: function() {
            return this.pick.text();
        }

    };

    let leaderboard = {

        container: $(".leaderboard.menu"),
        maps     : $(".leaderboard.menu .maps .list"),
        subtitle : $(".leaderboard.menu .map-leaderboard .subtitle"),
        loader   : $(".leaderboard.menu .map-leaderboard .loader"),
        notice   : $(".leaderboard.menu .map-leaderboard .no-selection"),
        mapLabel : $(".leaderboard.menu .map-leaderboard .map"),
        trophies : $(".leaderboard.menu .map-leaderboard .trophies"),
        rank1    : $(".leaderboard.menu .map-leaderboard .first .player"),
        rank2    : $(".leaderboard.menu .map-leaderboard .second .player"),
        rank3    : $(".leaderboard.menu .map-leaderboard .third .player"),
        rankings : $(".leaderboard.menu .map-leaderboard .rankings"),

        show: function() {
            this.container.fadeIn(300);
        },

        hide: function() {
            this.container.fadeOut(300);
        },

        showMapScore: function() {
            this.subtitle.fadeIn(300);
            this.trophies.fadeIn(300);
            this.rankings.fadeIn(300);
        },

        hideMapScore: function() {
            this.subtitle.fadeOut(300);
            this.trophies.fadeOut(300);
            this.rankings.fadeOut(300);
        },

        select: function(map) {
            map.addClass("selected");
            this.mapLabel.text(map.attr("data-map"));
            this.notice.hide();
        },

        deselect: function() {
            this.maps.children(".item.selected").removeClass("selected");
        },

        getMap: function() {
            return this.mapLabel.text();
        },

        showLoader: function() {
            this.loader.fadeIn(300);
        },

        hideLoader: function() {
            this.loader.fadeOut(300);
        }

    };

    let mapComplete = {
        container  : $(".menu.map-complete"),
        loader     : $(".menu.map-complete .submit-score"),
        statistics : $(".menu.map-complete .statistics"),
        mapLabel   : $(".menu.map-complete .statistics .map"),
        timeLabel  : $(".menu.map-complete .statistics .time"),
        rankingBody: $(".menu.map-complete .rankings .body"),
        retry      : $(".menu.map-complete .button.retry"),
        quit       : $(".menu.map-complete .button.quit"),

        show: function() {
            this.statistics.hide();
            this.loader.show();
            this.container.fadeIn(300);
        },

        hide: function() {
            this.container.fadeOut(300);
        }
    };

    let menus = {

        container: $(".game-menus"),
        _menus: [mainMenu, mapChoice, leaderboard, mapComplete],

        switchTo: function(menu, options) {

            if (options.noBg) {
                this.container.css("background", "none");
            } else {
                this.container.css("background", "url('/assets/images/menu/menu_bg.png')");
            }

            this.container.show();

            if (options.hideGame) {
                gameCanvas.hide();
            }

            this.hide();
            menu.show();
        },

        hideAll: function() {
            this.container.hide();
            this.hide();
        },

        hide: function() {
            this._menus.forEach(function(menu) {
                menu.hide();
            });
        }
    };

    return {

        //Game related
        gameCanvas: gameCanvas,
        gameLoader: gameLoader,

        //Menu related
        menus      : menus,
        mainMenu   : mainMenu,
        mapChoice  : mapChoice,
        leaderboard: leaderboard,
        mapComplete: mapComplete
    }


})();