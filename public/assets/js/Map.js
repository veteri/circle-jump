/**
 * Created by Midi on 26.04.2018.
 */


function Map(author = null, name = null) {
    this.author      = author;
    this.name        = name;
    this.width       = 128;//64;
    this.height      = 72;//36;
    this.spawn       = null;
    this.state       = this.STATE.PLAYABLE;
    this.levels      = [];
    this.activeLevel = 0;
    this.tileWidth  = 30;
    this.tileHeight = 30;

    this.background = null;

    this.backgrounds = {
        /* Each will be filled by Game.loadAssets with image objects */
        NightForest      : [],
        MountainLake     : [],
        CloudyMountains  : [],
        NightAquaForest  : [],
        MistyForest      : [],
        QuackCity        : [],
        QuackCityNight   : [],
        BlueNebula       : [],
        RedNebula        : [],
        RGNebula         : [],
        Saturn           : [],
        ShootingStar     : [],
        CandyCloudKingdom: [],
        SaharaDesert     : [],
        BalmoralMountains: [],
        DesolateMountains: [],
        TundraDawn       : [],
        CrystalDesert    : [],
        CrystalValley    : [],
        DragonForest     : [],
        FourKingsForest  : [],
        IceNebula        : [],
        NorthernLight    : [],
        PurpleNebula     : [],
        Sphinx           : [],
        SnowOwl          : [],

    };

    this.scripts = {
        bounceEvent: null
    };

    let canvas = UIController.gameCanvas.get();
    this.cameraXRenderOffset =  parseInt((canvas.width / this.tileHeight) / 2) + 4;
    this.cameraYRenderOffset =  parseInt((canvas.width / this.tileHeight) / 2) + 4;

}

Map.prototype = {

    config: {
        ALLOW_CUSTOM_GRAVITY: false,
        DEFAULT_GRAVITY: 8,
        showLog: true
    },

    STATE: {
        PLAYABLE: 0,
        EDITABLE: 1
    },

    assets: {
        backgrounds: {
            NightForest: [
                "/assets/images/background/NightForest/sky.png",
                "/assets/images/background/NightForest/clouds_2.png",
                "/assets/images/background/NightForest/clouds_1.png",
                "/assets/images/background/NightForest/rocks.png",
                "/assets/images/background/NightForest/ground_1.png",
                "/assets/images/background/NightForest/ground_2.png",
                "/assets/images/background/NightForest/ground_3.png",
                "/assets/images/background/NightForest/plant.png",
            ],
            MountainLake: [
                "/assets/images/background/MountainLake/sky.png",
                "/assets/images/background/MountainLake/clouds_1.png",
                "/assets/images/background/MountainLake/clouds_2.png",
                "/assets/images/background/MountainLake/rocks_1.png",
                "/assets/images/background/MountainLake/rocks_2.png",
                "/assets/images/background/MountainLake/clouds_3.png",
            ],
            CloudyMountains: [
                "/assets/images/background/CloudyMountains/sky.png",
                "/assets/images/background/CloudyMountains/rocks_3.png",
                "/assets/images/background/CloudyMountains/clouds_1.png",
                "/assets/images/background/CloudyMountains/clouds_2.png",
                "/assets/images/background/CloudyMountains/rocks_2.png",
                "/assets/images/background/CloudyMountains/clouds_3.png",
                "/assets/images/background/CloudyMountains/birds.png",
                "/assets/images/background/CloudyMountains/rocks_1.png",
                "/assets/images/background/CloudyMountains/pines.png",
            ],
            NightAquaForest: [
                "/assets/images/background/NightAquaForest/sky.png",
                "/assets/images/background/NightAquaForest/clouds_1.png",
                "/assets/images/background/NightAquaForest/rocks.png",
                "/assets/images/background/NightAquaForest/clouds_2.png",
                "/assets/images/background/NightAquaForest/ground.png",
            ],
            MistyForest: [
                "/assets/images/background/MistyForest/7.png",
                "/assets/images/background/MistyForest/6.png",
                "/assets/images/background/MistyForest/5.png",
                "/assets/images/background/MistyForest/4.png",
                "/assets/images/background/MistyForest/3.png",
                "/assets/images/background/MistyForest/2.png",
                "/assets/images/background/MistyForest/1.png",
            ],
            QuackCity: [
                "/assets/images/background/QuackCity/l1_background.png",
                "/assets/images/background/QuackCity/l2_clouds01.png",
                "/assets/images/background/QuackCity/l3_buildings01.png",
                "/assets/images/background/QuackCity/l4_clouds02.png",
                "/assets/images/background/QuackCity/l5_buildings02.png",
                "/assets/images/background/QuackCity/l6_ground.png",
                "/assets/images/background/QuackCity/l7_buildings03.png",
                /*"/assets/images/background/QuackCity/l8_lamps.png",*/
            ],
            QuackCityNight: [
                "/assets/images/background/QuackCityNight/l1_background.png",
                "/assets/images/background/QuackCityNight/l2_stars.png",
                "/assets/images/background/QuackCityNight/l3_moon.png",
                "/assets/images/background/QuackCityNight/l4_buildings01.png",
                "/assets/images/background/QuackCityNight/l5_ground.png",
                "/assets/images/background/QuackCityNight/l6_buildings02.png",
               /* "/assets/images/background/QuackCityNight/l7_lamps.png",*/
            ],
            BlueNebula: [
                "/assets/images/background/BlueNebula/l1_nebula-01.png",
                "/assets/images/background/BlueNebula/l2_stars-01.png",
                "/assets/images/background/BlueNebula/l3_planet02-01.png",
                "/assets/images/background/BlueNebula/l4_planet02-01.png",
            ],
            RedNebula: [
                "/assets/images/background/RedNebula/l1_nebula-01.png",
                "/assets/images/background/RedNebula/l2_stars-01.png",
                "/assets/images/background/RedNebula/l3_sun-01.png",
                "/assets/images/background/RedNebula/l4_satellite01-01.png",
                "/assets/images/background/RedNebula/l5_planet-01.png",
                "/assets/images/background/RedNebula/l6_satellite02-01.png",
            ],
            RGNebula: [
                "/assets/images/background/RGNebula/space.png",
                "/assets/images/background/RGNebula/cloud.png",
                "/assets/images/background/RGNebula/planet1.png",
                "/assets/images/background/RGNebula/planet2.png",
            ],
            Saturn: [
                "/assets/images/background/Saturn/space.png",
                "/assets/images/background/Saturn/planet.png",
                "/assets/images/background/Saturn/cloud.png",
            ],
            ShootingStar: [
                "/assets/images/background/ShootingStar/space.png",
                "/assets/images/background/ShootingStar/planet3.png",
                "/assets/images/background/ShootingStar/cloud.png",
                "/assets/images/background/ShootingStar/comet.png",
                "/assets/images/background/ShootingStar/planet2.png",
                "/assets/images/background/ShootingStar/planet1.png",
            ],
            CandyCloudKingdom: [
                "/assets/images/background/CandyCloudKingdom/layer09_Sky.png",
                "/assets/images/background/CandyCloudKingdom/layer08_Stars_1.png",
                "/assets/images/background/CandyCloudKingdom/layer07_Stars_2.png",
                "/assets/images/background/CandyCloudKingdom/layer06_Stars_3.png",
                "/assets/images/background/CandyCloudKingdom/layer05_Castle.png",
                "/assets/images/background/CandyCloudKingdom/layer04_Path.png",
                "/assets/images/background/CandyCloudKingdom/layer03_Clouds_3.png",
                "/assets/images/background/CandyCloudKingdom/layer02_Clouds_2.png",
                "/assets/images/background/CandyCloudKingdom/layer01_Clouds_1.png",
            ],
            SaharaDesert: [
                "/assets/images/background/SaharaDesert/sky.png",
                "/assets/images/background/SaharaDesert/dust.png",
                "/assets/images/background/SaharaDesert/mountainsbg.png",
                "/assets/images/background/SaharaDesert/mountainsfg.png",
                "/assets/images/background/SaharaDesert/fog.png",
                "/assets/images/background/SaharaDesert/ground.png",
                "/assets/images/background/SaharaDesert/clouds.png",
                "/assets/images/background/SaharaDesert/cactus.png",
            ],
            BalmoralMountains: [
                "/assets/images/background/BalmoralMountains/layer07_Sky.png",
                "/assets/images/background/BalmoralMountains/layer06_Rocks.png",
                "/assets/images/background/BalmoralMountains/layer05_Clouds.png",
                "/assets/images/background/BalmoralMountains/layer04_Hills_2.png",
                "/assets/images/background/BalmoralMountains/layer03_Hills_1.png",
                "/assets/images/background/BalmoralMountains/layer02_Trees.png",
                "/assets/images/background/BalmoralMountains/layer01_Ground.png",
            ],
            DesolateMountains: [
                "/assets/images/background/DesolateMountains/sky.png",
                "/assets/images/background/DesolateMountains/cloudsbg.png",
                "/assets/images/background/DesolateMountains/cloudsfg.png",
                "/assets/images/background/DesolateMountains/mountain.png",
                "/assets/images/background/DesolateMountains/forestandmountains.png",
                "/assets/images/background/DesolateMountains/forestfg.png",
                //"/assets/images/background/DesolateMountains/ground.png",
                //"/assets/images/background/DesolateMountains/tree.png",
            ],
            TundraDawn: [
                "/assets/images/background/TundraDawn/sky.png",
                "/assets/images/background/TundraDawn/air.png",
                "/assets/images/background/TundraDawn/cloudsbg.png",
                "/assets/images/background/TundraDawn/mountains.png",
                "/assets/images/background/TundraDawn/cloudsfg.png",
                "/assets/images/background/TundraDawn/mountainsbg.png",
                "/assets/images/background/TundraDawn/mountainsfg.png",
                //"/assets/images/background/TundraDawn/ground.png",
                "/assets/images/background/TundraDawn/tree.png",
            ],
            CrystalDesert: [
                "/assets/images/background/CrystalDesert/l1-background.png",
                "/assets/images/background/CrystalDesert/l2-mountains01.png",
                "/assets/images/background/CrystalDesert/l3-fog01.png",
                "/assets/images/background/CrystalDesert/l4-winds01.png",
                "/assets/images/background/CrystalDesert/l5-mountains02.png",
                "/assets/images/background/CrystalDesert/l6-fog02.png",
                "/assets/images/background/CrystalDesert/l7-winds02.png",
                "/assets/images/background/CrystalDesert/l8-ground.png",
                "/assets/images/background/CrystalDesert/l9-block.png",
            ],
            CrystalValley: [
                "/assets/images/background/CrystalValley/l1_wall.png",
                "/assets/images/background/CrystalValley/l2_prop01.png",
                "/assets/images/background/CrystalValley/l3_prop02.png",
                "/assets/images/background/CrystalValley/l4_stones.png",
                //"/assets/images/background/CrystalValley/l5_crystals.png",
                //"/assets/images/background/CrystalValley/l6_ground.png",
            ],
            DragonForest: [
                "/assets/images/background/DragonForest/background.png",
                "/assets/images/background/DragonForest/7.png",
                "/assets/images/background/DragonForest/6.png",
                "/assets/images/background/DragonForest/5.png",
                "/assets/images/background/DragonForest/4.png",
                "/assets/images/background/DragonForest/3.png",
                "/assets/images/background/DragonForest/2.png",
                //"/assets/images/background/DragonForest/1.png",
            ],
            FourKingsForest: [
                "/assets/images/background/FourKingsForest/background.png",
                "/assets/images/background/FourKingsForest/7.png",
                "/assets/images/background/FourKingsForest/6.png",
                "/assets/images/background/FourKingsForest/5.png",
                "/assets/images/background/FourKingsForest/4.png",
                "/assets/images/background/FourKingsForest/3.png",
                "/assets/images/background/FourKingsForest/2.png",
                "/assets/images/background/FourKingsForest/1.png",
            ],
            IceNebula: [
                "/assets/images/background/IceNebula/l1_nebula-01.png",
                "/assets/images/background/IceNebula/l2_stars-01.png",
                "/assets/images/background/IceNebula/l3_planet-01.png",
                "/assets/images/background/IceNebula/l4_sun-01.png",
            ],
            NorthernLight: [
                "/assets/images/background/NorthernLight/l1-background.png",
                "/assets/images/background/NorthernLight/l2-northern-lights01.png",
                "/assets/images/background/NorthernLight/l3-fog.png",
                "/assets/images/background/NorthernLight/l4-stars.png",
                "/assets/images/background/NorthernLight/l5-northern-lights02.png",
                "/assets/images/background/NorthernLight/l6-moon.png",
                "/assets/images/background/NorthernLight/l7-mountains01.png",
                "/assets/images/background/NorthernLight/l8-mountains02.png",
                //"/assets/images/background/NorthernLight/l9-ground.png",
                //"/assets/images/background/NorthernLight/l10-block.png",
            ],
            PurpleNebula: [
                "/assets/images/background/PurpleNebula/l1_nebula-01.png",
                "/assets/images/background/PurpleNebula/l2_stars-01.png",
                "/assets/images/background/PurpleNebula/l3_planet-01.png",
            ],
            Sphinx: [
                "/assets/images/background/Sphinx/l1_sky.png",
                "/assets/images/background/Sphinx/l2_clouds.png",
                "/assets/images/background/Sphinx/l3_pyramid.png",
                "/assets/images/background/Sphinx/l4_bg-ground01.png",
                "/assets/images/background/Sphinx/l5_bg-ground02.png",
                "/assets/images/background/Sphinx/l6_bg-ground03.png",
                //"/assets/images/background/Sphinx/l7_ground.png",
            ],
            SnowOwl: [
                "/assets/images/background/SnowOwl/l1-background.png",
                "/assets/images/background/SnowOwl/l2-mountains01.png",
                "/assets/images/background/SnowOwl/l3-clouds.png",
                "/assets/images/background/SnowOwl/l4-forest.png",
                "/assets/images/background/SnowOwl/l5-houses.png",
                "/assets/images/background/SnowOwl/l6-ground.png",
                "/assets/images/background/SnowOwl/l7-block.png",
            ],

        }
    },

    dump: function () {
        console.log(this);
    },

    util: {

        logMessage: function (type, args) {
            switch (type) {
                case "import_success":
                    console.log("%c Map '" + args.name + "' has been successfully imported.",
                        "color: green");
                    break;
            }
        }
    },

    getSpawn: function() {
        return this.spawn;
    },

    coordinateToTile: function (coord) {


        let isX      = coord.hasOwnProperty("x");
        let dividend = isX ? "x" : "y";
        let divider  = isX ? this.tileWidth : this.tileHeight;

        if (isNaN(divider)) {
            throw new TypeError("Map tile dimensions are not set.");
        }

        return Math.floor(coord[dividend] / divider);
    },

    tileToCoordinate: function(tile, axis) {
        return tile * (axis === "x" ? this.tileWidth : this.tileHeight);
    },

    getTileByCoordinates: function (x, y) {
        return this.getTileAt(
            this.coordinateToTile({x: x}),
            this.coordinateToTile({y: y})
        );
    },

    getTileAt: function (tx, ty) {

        if (tx > this.width - 1 || tx < 0 || ty > this.height - 1 || ty < 0) {
            throw new RangeError("Tried to access tile out of bounds with tx: " + tx + " ty: " + ty);
        }

        return this.levels[this.activeLevel][ty][tx];
    },

    draw: function (context, camera) {

        let active = this.activeLevel;

        if (this.levels[active] === undefined) throw new ReferenceError("Map doesn't contain any levels.");


        //this draws entire map
        /*for (let y = 0; y < this.levels[active].length; y++) {
            for (let x = 0; x < this.levels[active][y].length; x++) {
                let tile = this.getTileAt(x, y);
                tile.draw(context);
            }
        }*/

        let totalWidth = this.width * this.tileWidth;
        let totalHeight = this.height * this.tileHeight;
        let slowScale = this.backgrounds.length <= 5 ? 0.1 : 0.05;
        let speed = 1 - (this.background.length * slowScale);

        for (let layer = 0; layer < this.background.length; layer++) {
            context.drawImage(
                this.background[layer],
                parseInt(0 - camera.x * speed),
                parseInt(0 - camera.y * speed),
                totalWidth,
                totalHeight
            );
            speed += slowScale;
        }

        let tx = Math.floor((camera.x + (camera.width / 2)) / this.tileWidth);
        let ty = Math.floor((camera.y + (camera.height / 2)) / this.tileHeight);

        for (let y = ty - this.cameraYRenderOffset; y < ty + this.cameraYRenderOffset; y++) {

            for (let x = tx - this.cameraXRenderOffset; x < tx + this.cameraXRenderOffset; x++) {

                if (y >= 0 && x >= 0
                    && y < this.levels[active].length
                    && x < this.levels[active][y].length) {

                    let tile = this.getTileAt(x, y);
                    tile.draw(context, camera);
                }
            }

        }

    },

    processCustomScripts: function(scripts) {

        for (let key in scripts) {
            if (scripts.hasOwnProperty(key)) {
                if (this.scripts.hasOwnProperty(key)) {
                    this.scripts[key] = new Function('return ' + scripts[key])();
                } else {
                    console.warn("Map '" + this.name + "' tried to set the custom event '" + key + "' which does not exist.");
                }
            }
        }

    },

    calculateCameraRenderOffset: function() {
        let canvas = UIController.canvas.get();
        this.cameraXOffset =  parseInt((canvas.width / this.tileHeight) / 2);
        this.cameraYOffset =  parseInt((canvas.width / this.tileHeight) / 2);
    },

    convertIntToLevelArray: function (intArr) {

        let levels = [];

        for (let level = 0; level < intArr.length; level++) {

            let tileArr = [];
            for (let y = 0; y < intArr[level].length; y++) {

                let row = [];
                for (let x = 0; x < intArr[level][y].length; x++) {

                    let type = intArr[level][y][x];
                    row.push(new Tile(x, y, this.tileWidth, this.tileHeight, type));
                }
                tileArr.push(row);
            }

            levels.push(tileArr);
        }

        return levels;
    },

    importByIntArr: function (intArr) {
        this.levels      = this.convertIntToLevelArray(intArr);
        this.activeLevel = 0;
    },

    importByName: function (name) {

        let self = this;

        return new Promise(function (resolve, reject) {

            if (name === "") {
                reject("Map name missing");
            }

            let xhr = new XMLHttpRequest();

            xhr.addEventListener("readystatechange", function () {

                if (this.readyState === 4) {

                    if (this.status === 200) {
                        let response = JSON.parse(this.responseText);
                        let meta     = response.meta;

                        self.author  = meta.author;
                        self.name    = meta.name;
                        self.spawn   = meta.spawn;

                        if (self.backgrounds.hasOwnProperty(meta.backgroundScene)) {
                            self.background = self.backgrounds[meta.backgroundScene];
                        } else {
                            self.background = "NightForest";
                        }

                        self.gravity = self.config.ALLOW_CUSTOM_GRAVITY ? meta.gravity : self.config.DEFAULT_GRAVITY;
                        self.importByIntArr(response.levels);
                        self.processCustomScripts(meta.scripts);

                        if (self.config.showLog) {
                            self.util.logMessage("import_success", {name: name});
                        }

                        resolve();
                    } else {
                        reject(name);
                    }
                }
            });

            xhr.open("GET", "/assets/maps/" + name + ".json?" + new Date().getTime(), true);
            xhr.send();

        });

    },

    toggleEditorMode: function () {
        if (--this.state < 0) {
            this.state = this.STATE.EDITOR;
        }
    },

};