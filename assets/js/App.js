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

        alert("Make sure your browser has hardware acceleration turned on.");

        game.loadMap("tutorial").then(function () {
            game.init();
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
