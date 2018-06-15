/**
 * Created by Midi on 26.04.2018.
 */


const UIController = UI = (function () {

    let config = {
        canvasWidth : 1920,
        canvasHeight: 1080
    };

    let canvas    = document.getElementById("canvas");
    let context   = canvas.getContext("2d");
    canvas.width  = config.canvasWidth;
    canvas.height = config.canvasHeight;

    let loaderDiv   = document.querySelector(".loading-info");
    let progressDiv = document.querySelector(".progress");
    let menuContainer = $(".game-menus");

    let mainMenu = {

        container  : $(".main.menu"),
        play       : $(".main.menu div[data-button=play]"),
        leaderboard: $(".main.menu div[data-button=leaderboard]"),
        settings   : $("main.menu div[data-button=settings]"),

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

    let hideMenus = function() {
        menuContainer.hide();
    };

    let getCanvas = function () {
        return canvas;
    };

    let showCanvas = function() {
        $(canvas).show();
    };

    let getContext = function () {
        return canvas.getContext("2d", {alpha: false});
    };

    let getCanvasDimensions = function () {
        return {
            width : canvas.width,
            height: canvas.height
        }
    };

    let resetCanvas = function () {
        context.clearRect(0, 0, canvas.width, canvas.height);
    };

    let showLoader = function () {
        loaderDiv.classList.remove("hidden");
    };

    let hideLoader = function () {
        loaderDiv.classList.add("hidden");
    };

    let setProgress = function (percent) {
        progressDiv.style.width = percent + "%";
    };

    let setCanvasWidth = function (width) {
        canvas.width = width;
    };

    let setCanvasHeight = function (height) {
        canvas.height = height;
    };


    return {
        canvas: {
            get          : getCanvas,
            getContext   : getContext,
            getDimensions: getCanvasDimensions,
            reset        : resetCanvas
        },
        gameLoader: {
            show: showLoader,
            hide: hideLoader
        },

        progress: {
            set: setProgress
        },

        hideMenus: hideMenus,
        showCanvas: showCanvas,

        mainMenu: mainMenu,
        mapChoice: mapChoice,
        leaderboard: leaderboard
    }


})();