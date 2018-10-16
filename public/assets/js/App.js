/**
 * The Game App Controller
 *
 * @type {object}
 */
var AppController = (function () {

    var developerMode = true;
    //The game instance
    var game = new Game(
        60,
        new Map(),
        new Player()
    );

    UI.gameCanvas.init();
    UI.musicManager.init();
    UI.settingsMenu.init(game);

    const init = function () {


        game.init()
            .then(function() {
                console.log("game init resolved");
                UI.menus.switchTo(UI.mainMenu);

                UI.musicManager.play();
             })
            .catch(function(error) {
                console.log(error);
                alert("Error loading game resources." +
                    "\nPlease try again by refreshing. " +
                    "\nIf the error persists please contact us."
                );
            });

        //alert("Make sure your browser has hardware acceleration turned on.");

        //If we click on the play button in the main menu
        UI.mainMenu.play.on("click", function() {
            //Hide the main menu
           UI.mainMenu.hide();
           //Show the map selection
           UI.mapChoice.show();
        });

        //If we click on the leader board button in the main menu
        UI.mainMenu.leaderboard.on("click", function() {
            //Hide the main menu
            UI.mainMenu.hide();
            //Show the leader board
            UI.leaderboard.show();
        });

        //If we click on the "How to play?" button in the main menu
        UI.mainMenu.howToPlay.on("click", function() {
            //Hide the main menu
            UI.mainMenu.hide();
            //Show the how to play menu
            UI.howToPlay.show();
        });

        UI.mainMenu.settings.on("click", function() {
            UI.mainMenu.hide();
            UI.settingsMenu.show();
        });

        UI.howToPlay.back.on("click", function() {
            UI.menus.switchTo(UI.mainMenu);
        });


        //If we click on the back button in the map choice menu
        UI.mapChoice.back.on("click", function() {
            //Go back to the main menu
            UI.menus.switchTo(UI.mainMenu);
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
            let mapId = UI.mapChoice.getMap();

            //If there is a map
            if (mapId !== "") {

                //Hide all menus
                UI.menus.hideAll();
                UI.mainMenu.hideHome();
                UI.gameLoader.show();
                game.loadMap(mapId)
                    .then(function() {
                        UI.musicManager.fadeToRandomTrack();
                        UI.gameCanvas.show();
                        game.prepareStart();
                    })
                    .catch(function(error) {
                        console.log(error);
                    });



            } else {
                //if there is no map selected, inform user
                UI.mapChoice.informUserOfMissingMap();
            }
        });

        //If we click on the back button in the leader board menu
        UI.leaderboard.back.on("click", function() {
            //Go back to the main menu
            UI.menus.switchTo(UI.mainMenu);
        });

        UI.leaderboard.maps.on("click", ".item.map", function() {

            let map = $(this);

            UI.leaderboard.hideMapScore();
            UI.leaderboard.deselect();

            UI.leaderboard.select(map);
            UI.leaderboard.showLoader();

            let xhr = new XMLHttpRequest();
            let requestBody = "id=" + map.attr("data-id");

            xhr.addEventListener("readystatechange", function() {
                if (this.readyState === 4) {
                    if (this.status === 200) {

                        let response = JSON.parse(this.responseText);

                        UI.leaderboard.buildMapScore(response, map);
                        UI.leaderboard.hideLoader();
                        UI.leaderboard.showMapScore();
                    }
                }
            });

            xhr.open("POST", "/map/get-highscores", true);
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xhr.send(requestBody);

        });

        UI.mapComplete.retry.on("click", function() {
            UI.mapComplete.hide();
            game.prepareStart();
        });

        UI.mapComplete.nextMap.on("click", function() {
            let nextMap = UI.mapChoice.getNextMap(game.map.id);

            if (nextMap !== null) {

                UI.gameCanvas.hide();
                UI.menus.hideAll();
                UI.gameLoader.show();

                game.loadMap(nextMap.attr("data-id"))
                .then(function() {
                    UI.gameCanvas.show();
                    game.prepareStart();
                })
                .catch(function(error) {
                    console.log(error);
                });

            } else {
                M.toast({html: "You have played through all maps. :("});
            }
        });

        UI.mapComplete.quit.on("click", function() {
           UI.menus.switchTo(UI.mainMenu, {
               hideGame: true
           });
           UI.musicManager.fadeToTrack(
               UI.musicManager.menu
           );
        });

        UI.settingsMenu.back.on("click", function() {
            UI.menus.switchTo(UI.mainMenu, {
                hideGame: true
            });
        });

        UI.settingsMenu.volumeSlider.on("input", function() {
            let volume = (parseInt($(this).val()) / 100).toFixed(2);
            UI.musicManager.changeVolume(volume);
            Cookies.set("cj_music_volume", volume, { expires: 365 });
        });

        UI.settingsMenu.options.on("change", "input[type=radio]", function() {
            let perspective = $(this).val();
            game.changePerspective(perspective);
            Cookies.set("cj_camera_perspective", perspective, { expires: 365 });
        });

        $(document).on("keyup", function(event) {
            if (event.keyCode === 9 && game.state === 0) {
                game.stop();
                UI.menus.switchTo(UI.mainMenu, {
                   hideGame: true
                });
                UI.musicManager.fadeToTrack(
                    UI.musicManager.menu
                );
            }
        });

        $(document).on("keyup", function(event) {
            if (event.keyCode === 49) {
                UI.gameCanvas.toggleFullscreen();
            }
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
