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

    const init = function () {

        //alert("Make sure your browser has hardware acceleration turned on.");


        //If we click on the play button in the main menu
        UI.mainMenu.play.on("click", function() {
            //Hide the main menu
           UI.mainMenu.hide();
           //Show the map selection
           UI.mapChoice.show();
        });

        UI.mainMenu.leaderboard.on("click", function() {
            UI.mainMenu.hide();
            UI.leaderboard.show();
        });


        //If we click on a map in the map selection
        UI.mapChoice.maps.on("click", ".item.map", function() {

            let map = $(this);
            //Deselect any previous map
            UI.mapChoice.deselect();
            //Show orange highlight on map and add map name to selected map span
            UI.mapChoice.select(map);
            //Hide any eventual visible notices
            UI.mapChoice.hideNotice();

        });

        //If we click on the play button in the map selection
        UI.mapChoice.confirm.on("click", function() {

            //Get the map that was selected
            let mapName = UI.mapChoice.getMap();

            //If there is a map
            if (mapName !== "none") {

                //Hide all menus
                UI.hideMenus();

                //Show the game canvas
                UI.showCanvas();

                //Load the map and once its loaded, start the game
                game.loadMap(mapName)
                    .then(function() {
                        game.init();
                    });

            } else {
                //if there is no map selected, inform user
                UI.mapChoice.informUserOfMissingMap();
            }
        });

        UI.leaderboard.maps.on("click", ".item.map", function() {
            let map = $(this);

            UI.leaderboard.hideMapScore();
            UI.leaderboard.deselect();

            UI.leaderboard.select(map);
            UI.leaderboard.showLoader();

            setTimeout(function() {
                UI.leaderboard.hideLoader();
                UI.leaderboard.showMapScore();
            }, 1500);

        });


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
