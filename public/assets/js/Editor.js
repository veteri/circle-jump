/**
 * Created by Midi on 05.08.2018.
 */

const Editor = (function() {

    UI.gameCanvas.init();

    let game = new Game(
        60,
        new Map(),
        new Player()
    );

    let currentTile = null;
    let lastSave = [];
    let mouse = {
        down: false,
        key: null,
    };


    const updateTileDrag = function(event) {
        let position = UI.gameCanvas.getCameraMousePosition(event, game.camera);

        if (mouse.down) {
            if (mouse.key === 0) {
                changeTile(position);
            }
            if (mouse.key === 2) {
                resetTile(position);
            }
        }

        currentTile = game.map.getTileByCoordinates(position.x, position.y);

    };

    /**
     * Iterate through all levels
     * and determine if they have
     * a spawn point and a finish.
     *
     * @returns {boolean} True if map is valid, false otherwise
     */
    const validateMap = function() {

        let hasSpawnsAndFinishes = game.map.levels.reduce((result, level) => {
            return result && (game.map.hasSpawn(level) && game.map.hasFinish(level))
        }, true);

        let name = UI.editorControls.getMapName();
        let hasName = name !== "";
        let validName = name.length > 3 && name.length <= 20;

        if (!hasName) {
            M.toast({html: "ERROR: A name is required."});
        }

        if (hasName && !validName) {
            M.toast({html: "ERROR: Name must be at least 3 chars (max 20)."})
        }

        if (!hasSpawnsAndFinishes) {
            M.toast({html: "ERROR: Spawns and/or finishes are missing."});
        }

        return hasSpawnsAndFinishes && hasName && validName;

    };

    const validatePosition = function(position) {
        let tx = game.map.coordinateToTile({x: position.x});
        let ty = game.map.coordinateToTile({y: position.y});

        return  (ty !== 0 && ty !== (game.map.height - 1))
             && (tx !== 0 && tx !== (game.map.width  - 1));
    };

    const canChangeTileAt = function(position, tile) {
        let tx = game.map.coordinateToTile({x: position.x});
        let ty = game.map.coordinateToTile({y: position.y});

        return ((tx !== 0 && tx !== game.map.width  - 1)
            && (ty !== 0 && ty !== game.map.height - 1))
            || tile.isObstacle();
    };

    const canRemoveTileAt = function(position) {
        let tx = game.map.coordinateToTile({x: position.x});
        let ty = game.map.coordinateToTile({y: position.y});

        return (tx !== 0 && tx !== game.map.width  - 1)
            && (ty !== 0 && ty !== game.map.height - 1);
    };


    const changeTile = function(position) {

        let type, tile;

        type = UI.editorControls.getActiveType();
        tile = new Tile(-1, -1, -1, -1, type);

        if (canChangeTileAt(position, tile)) {

            tile = game.map.getTileByCoordinates(position.x, position.y);

            if (type === Tile.prototype.TYPES.SPAWN) {
                game.map.removeLevelSpawn();
                tile.setType(type);
                game.map.updateSpawns();
            } else {
                tile.setType(type);
            }

        } else {
            M.toast({html: 'ERROR: Cant set non-colliding here.'});
        }

    };


    const resetTile = function(position) {

        let tile = game.map.getTileByCoordinates(position.x, position.y);

        if (canRemoveTileAt(position)) {
            tile.setType(0);
        } else if (tile.isObstacle() && tile.getType() !== 999) {
            tile.setType(999);
        } else {
            M.toast({html: "ERROR: Cant remove level bounding."})
        }
    };

    const changeTileType = function(position) {
        let tile = game.map.getTileByCoordinates(position.x, position.y);
        UI.editorControls.setActive(
            UI.editorControls.textures.find(
                "img[data-tile-type=" + tile.getType() + "]"
            )
        );
    };

    const updateTile = function(event) {

        let position = UI.gameCanvas.getCameraMousePosition(event, game.camera);

        console.log(event);

        if (event.button === 0) {
            changeTile(position);
        } else if (event.button === 1) {
            changeTileType(position);
        } else if (event.button === 2) {
            resetTile(position);
        }

    };

    const mouseDown = function(event) {
        mouse.down = true;
        mouse.key  = event.button;
        updateTile(event);
    };

    const mouseUp = function(event) {
        mouse.down = false;
        mouse.key  = null;
    };

    const moveView = function(event) {

        //Don't interfere if user is typing something into inputs
        if ($("input:focus").length > 0) {
            return;
        }

        let speed = 4 * game.map.tileWidth;
        let camHalfWidth = game.camera.width / 2;
        let camHalfHeight = game.camera.height / 2;

        if (event.keyCode === 65 && game.player.x > camHalfWidth) {
            game.player.x -= speed;
        }

        if (event.keyCode === 68 && game.player.x < (game.camera.mapSize.width - camHalfWidth)) {
            game.player.x += speed;
        }

        if (event.keyCode === 87 && game.player.y > camHalfHeight) {
            game.player.y -= speed;
        }

        if (event.keyCode === 83 && game.player.y < (game.camera.mapSize.height - camHalfHeight)) {
            game.player.y += speed;
        }

    };

    const fixCanvasOnResize = function() {
        let canvas = $(UI.gameCanvas.get());
        let heightDifference = canvas.parent().height() - canvas.height();
        canvas.css({top: heightDifference / 2});
    };


    const bindCanvasEvents = function() {
        console.log("binding canvas events");
        game.canvas.addEventListener("mousemove", updateTileDrag);
        game.canvas.addEventListener("mousedown", mouseDown);
        game.canvas.addEventListener("mouseup",  mouseUp);
        document.addEventListener("keydown", moveView);
    };

    const unbindCanvasEvents = function() {
        game.canvas.removeEventListener("mousemove", updateTileDrag);
        game.canvas.removeEventListener("mousedown", mouseDown);
        game.canvas.removeEventListener("mouseup", mouseUp);
        document.removeEventListener("keydown", moveView);
    };

    const bindEvents = function() {

        //Initially bind canvas events
        bindCanvasEvents();

        //Disable context menu
        game.canvas.addEventListener("contextmenu", function (event) {
            event.preventDefault();
            return false;
        });

        $(window).on("resize", fixCanvasOnResize);

        //Change back to edit view with Escape key
        document.addEventListener("keyup", function(event) {

            if (event.keyCode === 27 && game.state === game.states.editorSandbox) {
                lastSave = game.player.save;
                game.toggleEditorMode();
                game.addRenderCallback("highlightTile", function() {
                    if (currentTile !== null) {
                        currentTile.debugDraw(game.camera);
                    }
                });
                bindCanvasEvents();
                M.toast({html: "Switched to editor view."});
            }

        });

        UI.editorControls.difficulty.on("click", function(event) {

            let rect, posX, difficulty;

            rect       = this.getBoundingClientRect();
            posX       = event.clientX - rect.left;

            //Image is 200px wide, 5 stars = 40px each star
            difficulty = Math.ceil(posX / 40);

            game.map.difficulty = difficulty;
            UI.editorControls.setMapDifficulty(game.map.difficulty);
        });

        //Update map name
        UI.editorControls.name.on("keyup", function() {
            console.log($(this));
            game.map.name = $(this).val();
        });

        //Load selected map background and set it
        UI.editorControls.backgroundScenes.on("change", function() {

            let backgroundScene  = $(this).val();
            let backgroundAssets = Map.prototype.assets.backgrounds;
            let mapBackgrounds   = game.map.backgrounds;

            UI.gameCanvas.hide();

            game.loadAssets(
                backgroundAssets[backgroundScene],
                mapBackgrounds[backgroundScene]
            ).then(function() {
                UI.gameCanvas.show();
                g.map.background = g.map.backgrounds[backgroundScene];
                g.map.backgroundScenes[g.map.activeLevel] = backgroundScene;
            }).catch(function(error) {
                alert(error);
            });

        });

        //Update the ground row to the selected tile type
        UI.editorControls.ground.on("change", function() {
            let theme = $(this).val();
            game.map.changeGroundTo(theme);
        });


        //Add a new level to the map
        UI.editorControls.addLevel.on("click", function() {
            game.map.newLevel();
            game.map.backgroundScenes[game.map.activeLevel] = "NightForest";
            game.map.nextLevel();
        });

        //Remove the current (map.activeLevel) level
        UI.editorControls.removeLevel.on("click", function() {

            if (game.map.levels.length > 1) {
                game.map.removeLevel();
                game.map.previousLevel();
            } else {
                M.toast({html: "ERROR: Requires at least one level."});
            }

        });

        //Remove everything from the current level
        UI.editorControls.resetLevel.on("click", function() {
            game.map.removeEverythingInLevel();
        });

        //Remove the ground row from the map (keep it colliding with 999 tho)
        UI.editorControls.removeGround.on("click", function() {
            game.map.removeGround();
        });

        //Switch to previous level
        UI.editorControls.prevLevel.on("click", function() {
            let player = game.state === game.states.editorSandbox ? game.player : null;
            game.map.previousLevel(player);
        });

        //Switch to next level
        UI.editorControls.nextLevel.on("click", function() {
            let player = game.state === game.states.editorSandbox ? game.player : null;
            game.map.nextLevel(player);
        });

        //Update the active texture
        UI.editorControls.textures.on("click", function(event) {
            UI.editorControls.setActive($(event.target));
        });

        //Change from edit-view to editor sandbox (playable)
        UI.editorControls.run.on("click", function() {

            if (game.map.hasSpawns()) {

                if (game.state !== game.states.editor) return;

                game.toggleEditorMode();
                game.removeRenderCallback("highlightTile");

                if (lastSave.length > 0) {
                    game.player.save = lastSave;
                }

                M.toast({html: 'Switched to sandbox (escape to quit).'});
                unbindCanvasEvents();

            } else {
                M.toast({html: 'ERROR: Missing spawn(s).'});
            }

        });

        //Save a map and publish it for everyone
        UI.editorControls.save.on("click", function() {

            if (validateMap()) {

                M.toast({html: "Submitting..."});
                let xhr = new XMLHttpRequest();

                console.log(game.map.getInSaveFormat());

                let requestBody =
                        "id="      + game.map.id +
                        "&name="   + game.map.name +
                        "&spawns=" + JSON.stringify(game.map.spawns) +
                        "&diff="   + game.map.difficulty +
                        "&scenes=" + JSON.stringify(game.map.backgroundScenes) +
                        "&levels=" + JSON.stringify(game.map.getInSaveFormat());

                xhr.addEventListener("readystatechange", function() {

                    if (this.readyState === 4) {
                        if (this.status === 200) {

                            let response = JSON.parse(this.responseText);

                            game.map.id = response.map.id;

                            if (!/update/.test(response.msg)) {
                                UI.editorControls.addPublishedMapToList(response.map);
                            }

                            M.toast({html: response.msg});
                        }
                    }

                });

                xhr.open("POST", "/map/publish", true);
                xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                xhr.send(requestBody);

            }
        });

        UI.editorControls.userMapList.on("click", ".select", function() {
            let mapId = $(this).parents(".card").attr("data-map-id");
            let modal = $(this).parents(".modal");
            console.log(mapId);
            game.loadMap(mapId)
                .then(function() {

                    unbindCanvasEvents();
                    bindCanvasEvents();

                    game.start(game.states.editor);
                    game.map.state = game.map.STATE.EDITOR;

                    UI.editorControls.setMapDifficulty(game.map.difficulty);
                    UI.editorControls.setMapName(game.map.name);
                    UI.editorControls.name.focus();
                    UI.editorControls.lockMapName();

                    modal.modal("close");
                });
        });

    };

    const init = function() {

        UI.editorControls.init(game);

        $("#modal-explanation").modal("open");

        game.init()
        .then(function() {

             console.log("game init");
             let backgroundAssets = Map.prototype.assets.backgrounds;
             let mapBackgrounds   = game.map.backgrounds;

             game.loadAssets(
                 backgroundAssets["NightForest"],
                 mapBackgrounds["NightForest"]
             ).then(function() {
                 UI.gameCanvas.show();
                 game.map.background = game.map.backgrounds["NightForest"];
                 game.map.backgroundScenes[game.map.activeLevel] = "NightForest";
                 UI.gameCanvas.show();
                 game.prepareEditor();
                 bindEvents();

             }).catch(function(error) {
                 console.log(error);
             });
        }).catch(function(error) {
            console.log(error);
        });

        game.addRenderCallback("highlightTile", function() {
            if (currentTile !== null) {
                currentTile.debugDraw(game.camera);
            }
        });

        fixCanvasOnResize();

    };

    return {
        init: init,
        g: game
    }

})();

$(document).ready(function() {

    Editor.init();

    /**
     * We update the selects once again
     * because we filled the background-scene
     * select with all the background scenes.
     */
    M.FormSelect.init(
        document.querySelectorAll('select')
    );
});


var g = Editor.g;