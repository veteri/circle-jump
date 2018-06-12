/**
 * Created by Midi on 05.05.2018.
 */

var AppController = (function () {

    var developerMode = true;

    var game = new Game(
        60,
        new Map(),
        new Player()
    );

    var menuContainer = $(".game-menus");

    var menus = {
        main: {
            element: $(".game-menus .main.menu"),
            playBtn: $(".game-menus .main.menu .button[data-button=play]"),
            leaderboardBtn: $(".game-menus .main.menu .button[data-button=leaderboard]"),
            settingsBtn: $(".game-menus .main.menu .button[data-button=settings]")
        },
        mapSelection: {
            element: $(".game-menus .map-selection.menu"),
            selection: $(".game-menus .map-selection.menu .selection .map"),
            list: $(".game-menus .map-selection.menu .list"),
            notice: $(".game-menus .map-selection.menu .notice"),
            confirmPlay: $(".game-menus .map-selection .confirm")
        }
    };

    const init = function () {

        //alert("Make sure your browser has hardware acceleration turned on.");


        //If we click on play in the main menu
        menus.main.playBtn.on("click", function() {

            //Hide the main menu
            menus.main.element.fadeOut(250);

            //And show the map selection
            menus.mapSelection.element.fadeIn(300);
        });

        //If we click on a map in the map selection list
        menus.mapSelection.list.on("click", ".item.map", function() {

            let item = $(this);
            //Unflag any previously selected map
            menus.mapSelection.list.children(".item.selected").removeClass("selected");

            //Select currently clicked map
            item.addClass("selected");

            //Add the name to the top selection
            menus.mapSelection.selection.text(item.attr("data-map"));

            //Hide any error notice that was previously visible
            menus.mapSelection.notice.fadeOut(300);
            menus.mapSelection.notice.addClass("invisible");
        });

        menus.mapSelection.confirmPlay.on("click", function() {
            let mapName = menus.mapSelection.selection.text();

            if (mapName !== "none") {
                menuContainer.hide();
                $("canvas").show();
                game.loadMap(mapName)
                    .then(function() {
                        game.init();
                });
            } else {
                menus.mapSelection.notice.fadeIn(300);
            }
        });


        /*game.loadMap("tutorial").then(function () {
            game.init();
        });*/

    };

    return {
        init: init,
        game: developerMode ? game : null
    }

})();

AppController.init();

if (AppController.game !== null) {
    var g     = AppController.game;
    let style =
            "color: #a94442;" +
            "font-weight: bold;" +
            "background-color: #f2dede;" +
            "border-radius: 3px;" +
            "border: 1px solid #ebcccc;" +
            "font-size: 18px;";

    console.log("%c Developer mode enabled. Access the game by referencing 'g'.", style);
}
