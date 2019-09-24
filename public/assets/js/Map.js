/**
 * A playable map.
 *
 * @param author {string} The author
 * @param name   {string} The name
 * @constructor
 */
function Map(author = null, name = null) {
	/**
	 * The id.
	 * @type {null}
	 */
	this.id = null;

	/**
	 * The author who created this map.
	 * @type {string}
	 */
	this.author = author;

	/**
	 * The name
	 * @type {string}
	 */
	this.name = name;

	/**
	 * The difficulty from 1 to 5.
	 * 5 being the hardest.
	 * @type {number}
	 */
	this.difficulty = 1;

	/**
	 * The width (in tiles)
	 * @type {number}
	 */
	this.width = 128; //64;

	/**
	 * The height (in tiles)
	 * @type {number}
	 */
	this.height = 72; //36;

	/**
	 * The state of the map.
	 * @type {number}
	 */
	this.state = this.STATE.PLAY;

	/**
	 * The array of levels making up the map world.
	 * @type {Array}
	 */
	this.levels = [];

	/**
	 * The active level index.
	 * @type {number}
	 */
	this.activeLevel = 0;

	/**
	 * The width of tiles on this map.
	 * @type {number}
	 */
	this.tileWidth = 30;

	/**
	 * The height of tiles on this map.
	 * @type {number}
	 */
	this.tileHeight = 30;

	/**
	 * The gravitational force.
	 * @type {number}
	 */
	this.gravity = this.config.DEFAULT_GRAVITY;

	/**
	 * The spawns for each level.
	 * @type {Array}
	 */
	this.spawns = [];

	/**
	 * The array of background scenes
	 * this map uses.
	 * @type {Array}
	 */
	this.backgroundScenes = [];

	/**
	 * The images for the background of the
	 * current level.
	 * @type {Array}
	 */
	this.background = null;

	/**
	 * The container that holds all backgrounds.
	 * However they will only be filled on demand.
	 *
	 * @type {object}
	 */
	this.backgrounds = {
		/* Each will be filled by Game.loadAssets with image objects on demand */
		NightForest: [],
		MountainLake: [],
		CloudyMountains: [],
		NightAquaForest: [],
		MistyForest: [],
		QuackCity: [],
		QuackCityNight: [],
		BlueNebula: [],
		RedNebula: [],
		RGNebula: [],
		Saturn: [],
		ShootingStar: [],
		CandyCloudKingdom: [],
		SaharaDesert: [],
		BalmoralMountains: [],
		DesolateMountains: [],
		TundraDawn: [],
		CrystalDesert: [],
		CrystalValley: [],
		DragonForest: [],
		FourKingsForest: [],
		IceNebula: [],
		NorthernLight: [],
		PurpleNebula: [],
		Sphinx: [],
		SnowOwl: [],
	};

	/**
	 * @deprecated
	 * The events for this map.
	 * @type {{bounceEvent: null}}
	 */
	this.scripts = {
		bounceEvent: null,
	};

	let canvas = UIController.gameCanvas.get();

	/**
	 * The offset that the camera will render on the X axis.
	 * @type {number}
	 */
	this.cameraXRenderOffset = parseInt(canvas.width / this.tileHeight / 2) + 4;

	/**
	 * The offset that the camera will render on the Y axis.
	 * @type {number}
	 */
	this.cameraYRenderOffset = parseInt(canvas.width / this.tileHeight / 2) + 4;
}

/**
 * The map prototype
 * @type {object}
 */
Map.prototype = {
	/**
	 * Configuration object
	 * @type {object}
	 */
	config: {
		ALLOW_CUSTOM_GRAVITY: false,
		DEFAULT_GRAVITY: 8,
		showLog: true,
	},

	/**
	 * States that the map can have
	 * @type {object}
	 */
	STATE: {
		PLAY: 0,
		EDITOR: 1,
	},

	/**
	 * Contains all assets for the map.
	 * @type {object}
	 */
	assets: {
		/**
		 * Contains backgrounds.
		 * @type {object}
		 */
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
		},
	},

	dump: function() {
		console.log(this);
	},

	/**
	 * Utility collection
	 * @type {object}
	 */
	util: {
		/**
		 * Logs a message based on its type and args.
		 * @param type {string} The type
		 * @param args {object} The arguments
		 */
		logMessage: function(type, args) {
			switch (type) {
				case "import_success":
					console.log(
						"%c Map '" +
							args.id +
							"' has been successfully imported.",
						"color: green",
					);
					break;
			}
		},
	},

	updateCameraOffsets: function(camera) {
		this.cameraXRenderOffset =
			parseInt(camera.width / this.tileWidth / 2) + 4; //2 additional on each side
		this.cameraYRenderOffset =
			parseInt(camera.height / this.tileHeight / 2) + 4;
	},

	/**
	 * Get the map levels in the save format,
	 * which only contains the type of the tile.
	 *
	 * @returns {Array} The save format
	 */
	getInSaveFormat: function() {
		return this.levels.map(function(level) {
			return level.map(function(row) {
				return row.map(function(tile) {
					return tile.getType();
				});
			});
		});
	},

	/**
	 * Finds the last tile by the given type in the given level.
	 *
	 * @param level {Array} The level to search through
	 * @param tileType {number} What type to search for
	 * @returns {Tile} The tile
	 */
	find: function(level, tileType) {
		let tile = null;

		for (let y = 0; y < this.height; y++) {
			for (let x = 0; x < this.width; x++) {
				if (level[y][x].getType() === tileType) {
					tile = level[y][x];
				}
			}
		}

		return tile;
	},

	/**
	 * Get the spawns of this map.
	 *
	 * @returns {Array} The spawns
	 */
	getSpawn: function() {
		return this.spawn;
	},

	/**
	 * Finds and returns the spawn
	 * in the given level.
	 *
	 * @param level {Array} The level to search through
	 * @returns {*|Tile}
	 */
	findSpawn: function(level) {
		return this.find(level, Tile.prototype.TYPES.SPAWN);
	},

	/**
	 * Remove the spawn tile from the active level.
	 * @returns void
	 */
	removeLevelSpawn: function() {
		let level = this.levels[this.activeLevel];
		let spawnTile = this.findSpawn(level);

		if (spawnTile !== null) {
			spawnTile.setType(0);
		}
	},

	/**
	 * Checks if the given level contains
	 * a spawn tile.
	 *
	 * @param level {Array} The level to check
	 * @returns {boolean} True if contains spawn, false otherwise
	 */
	hasSpawn: function(level) {
		return this.findSpawn(level) !== null;
	},

	/**
	 * Check if each level contains a spawn.
	 *
	 * @returns {boolean} True if all levels contain spawn,
	 * false otherwise
	 */
	hasSpawns: function() {
		let self = this;
		return this.levels.reduce(
			(result, level) => result && self.hasSpawn(level),
			true,
		);
	},

	hasLevelSpawn: function() {
		let level = this.levels[this.activeLevel];
		return this.findSpawn(level) !== null;
	},

	/**
	 * Update the spawn array of the instance,
	 * based on the spawn tiles.
	 * This is used in the map editor.
	 *
	 * @returns void
	 */
	updateSpawns: function() {
		let self = this;
		this.levels.forEach(function(level, index) {
			let spawn = self.findSpawn(level);
			self.spawns[index] = [
				self.tileToCoordinate(spawn.x, "x"),
				self.tileToCoordinate(spawn.y, "y"),
			];
		});
	},

	/**
	 * Find the finish tile in the given level.
	 *
	 * @param level {Array} The level to search through
	 * @returns {*|Tile} The finish tile if there is any
	 */
	findFinish: function(level) {
		return this.find(level, Tile.prototype.TYPES.FINISH);
	},

	/**
	 * Check if the given level
	 * has a finish tile.
	 *
	 * @param level {Array} The level to check.
	 * @returns {boolean} True if level has a finish, false otherwise.
	 */
	hasFinish: function(level) {
		return this.findFinish(level) !== null;
	},

	/**
	 * Remove the finish tile from the active level.
	 * @returns void
	 */
	removeFinish: function() {
		let level = this.levels[this.activeLevel];
		let finishTile = this.findFinish(level);

		if (finishTile !== null) {
			spawnTile.setType(0);
		}
	},

	/**
	 * Check if the active level is the last level.
	 * @returns {boolean} True if last, false otherwise
	 */
	isLastLevel: function() {
		return this.activeLevel + 1 === this.levels.length;
	},

	/**
	 * Adds a new empty level to the levels array.
	 * The map bounding will be added as well.
	 *
	 * @returns void
	 */
	newLevel: function() {
		let level, row, type;

		level = [];
		this.activeLevel = this.levels.length === 0 ? 0 : this.levels.length;

		for (let y = 0; y < this.height; y++) {
			row = [];

			for (let x = 0; x < this.width; x++) {
				type = 0;

				if (
					y === 0 ||
					x === 0 ||
					x === this.width - 1 ||
					y === this.height - 1
				) {
					type = 999;
				}

				row.push(new Tile(x, y, this.tileWidth, this.tileHeight, type));
			}

			level.push(row);
		}

		this.levels.push(level);
		console.log(this.levels);
	},

	/**
	 * Remove the level at the given index
	 * or the active level.
	 *
	 * @param levelIndex {number} The index of the level
	 * @returns void
	 */
	removeLevel: function(levelIndex = null) {
		//Either passed level or activeLevel
		levelIndex = levelIndex || this.activeLevel;

		//Remove the level itself
		this.levels.splice(levelIndex, 1);

		//Remove the spawn for the level
		this.spawns.splice(levelIndex, 1);

		//Remove the background scene for the level
		this.backgroundScenes.splice(levelIndex, 1);

		//this.activeLevel = 0;
	},

	/**
	 * Switch to the previous level.
	 *
	 * @param player {Player} Optional player to spawn.
	 * @returns void
	 */
	previousLevel: function(player = null) {
		if (--this.activeLevel === -1) {
			this.activeLevel = this.levels.length - 1;
		}

		this.background = this.backgrounds[
			this.backgroundScenes[this.activeLevel]
		];

		if (player !== null) {
			player.spawn(this);
			player.resetPhysics();
			player.resetControls();
			player.levelComplete = false;
		}
	},

	/**
	 * Switch to the next level.
	 *
	 * @param player {Player} Optional player to spawn.
	 * @returns void
	 */
	nextLevel: function(player = null) {
		if (++this.activeLevel === this.levels.length) {
			this.activeLevel = this.levels.length - 1;
		}

		this.background = this.backgrounds[
			this.backgroundScenes[this.activeLevel]
		];

		if (player !== null) {
			player.spawn(this);
			player.resetPhysics();
			player.resetControls();
			player.levelComplete = false;
			player.savePosition(true);
		}
	},

	/**
	 * Change the ground row to the given theme.
	 *
	 * @param theme {string} The theme.
	 * @returns void
	 */
	changeGroundTo: function(theme) {
		let themeMapping = {
			spring: 1,
			desert: 21,
			factory: 39,
			graveyard: 69,
			scifi: 85,
			winter: 108,
			invis: 999,
		};

		this.levels[this.activeLevel][this.height - 1].forEach(tile => {
			tile.setType(themeMapping[theme]);
		});
	},

	/**
	 * "Remove" the ground row.
	 * This actually sets it back
	 * to the level bounding type (999).
	 *
	 * @returns void
	 */
	removeGround: function() {
		this.changeGroundTo("invis");
	},

	/**
	 * Completely remove everything from the level
	 * and reset the level bounding.
	 *
	 * @returns void
	 */
	removeEverythingInLevel: function() {
		let level = this.levels[this.activeLevel];

		for (let y = 0; y < level.length; y++) {
			for (let x = 0; x < level[y].length; x++) {
				level[y][x].setType(
					y === 0 ||
						x === 0 ||
						x === this.width - 1 ||
						y === this.height - 1
						? 999
						: 0,
				);
			}
		}
	},

	/**
	 * Convert a physical coordinate to a tile coordinate.
	 *
	 * @param coord {object} The coordinate: {x: 529}
	 * @returns {number} The tile coordinate on the given axis
	 */
	coordinateToTile: function(coord) {
		let isX = coord.hasOwnProperty("x");
		let dividend = isX ? "x" : "y";
		let divider = isX ? this.tileWidth : this.tileHeight;

		if (isNaN(divider)) {
			throw new TypeError("Map tile dimensions are not set.");
		}

		if (isNaN(Math.floor(coord[dividend] / divider))) {
			throw new TypeError(dividend + ": " + coord[dividend]);
			//throw new TypeError(Map.prototype.coordinateToTile.caller);
		}

		return Math.floor(coord[dividend] / divider);
	},

	/**
	 * Convert a tile coordinate to a physical coordinate.
	 *
	 * @param tile {number} The tile coordinate
	 * @param axis {string} The axis
	 * @returns {number} The physical coordinate
	 */
	tileToCoordinate: function(tile, axis) {
		return tile * (axis === "x" ? this.tileWidth : this.tileHeight);
	},

	/**
	 * Get a tile by physical coordinates.
	 *
	 * @param x {number} x position
	 * @param y {number} y position
	 * @returns {Tile} The tile
	 */
	getTileByCoordinates: function(x, y) {
		return this.getTileAt(
			this.coordinateToTile({x: x}),
			this.coordinateToTile({y: y}),
		);
	},

	/**
	 * Get a tile by tile coordinates.
	 *
	 * @param tx {number} tile x position
	 * @param ty {number} tile y position
	 * @returns {Tile} The tile
	 */
	getTileAt: function(tx, ty) {
		let tile = null;

		//Invalid position
		if (tx > this.width - 1 || tx < 0 || ty > this.height - 1 || ty < 0) {
			throw new RangeError(
				"Tried to access tile out of bounds with tx: " +
					tx +
					" ty: " +
					ty,
			);

			//no level for activeLevel
		} else if (this.levels[this.activeLevel] === undefined) {
			throw new Error("Active level is not defined.");

			//no row for active level
		} else if (this.levels[this.activeLevel][ty] === undefined) {
			throw new Error("No row for active level found under ty: " + ty);

			//get actual tile
		} else {
			tile = this.levels[this.activeLevel][ty][tx];
		}

		return tile;
	},

	/**
	 * Draw the portion of the map
	 * that the given camera is pointed at.
	 *
	 * @param context {CanvasRenderingContext2D} Rendering context.
	 * @param camera {Camera} The camera instance
	 * @returns void
	 */
	draw: function(context, camera) {
		let active = this.activeLevel;

		if (this.levels[active] === undefined)
			throw new ReferenceError("Map doesn't contain any levels.");

		let totalWidth = this.width * this.tileWidth;
		let totalHeight = this.height * this.tileHeight;

		let slowScale = this.background.length <= 5 ? 0.1 : 0.05;
		let speed = 1 - this.background.length * slowScale;

		for (let layer = 0; layer < this.background.length; layer++) {
			context.drawImage(
				this.background[layer],
				0 - camera.x * speed,
				0 - camera.y * speed,
				totalWidth,
				totalHeight,
			);
			speed += slowScale;
		}

		let tx = Math.floor((camera.x + camera.halfWidth) / this.tileWidth);
		let ty = Math.floor((camera.y + camera.halfHeight) / this.tileHeight);

		for (
			let y = ty - this.cameraYRenderOffset;
			y < ty + this.cameraYRenderOffset;
			y++
		) {
			for (
				let x = tx - this.cameraXRenderOffset;
				x < tx + this.cameraXRenderOffset;
				x++
			) {
				if (
					y >= 0 &&
					x >= 0 &&
					y < this.levels[active].length &&
					x < this.levels[active][y].length
				) {
					let tile = this.getTileAt(x, y);
					tile.draw(context, camera, this.state);
				}
			}
		}
	},

	prerenderAll: function() {
		Object.keys(this.backgrounds)
			.filter(bgKey => {
				return this.backgrounds[bgKey].length > 0;
			})
			.forEach(bgKey => {
				this.backgrounds[bgKey] = this.backgrounds[bgKey].map(
					backgroundImg => {
						//Skip prerendered backgrounds
						if (backgroundImg instanceof HTMLCanvasElement) {
							console.info(`Already prerendered ${bgKey}`);
							return backgroundImg;
						}

						const offCanvas = document.createElement("canvas");
						offCanvas.width = backgroundImg.width;
						offCanvas.height = backgroundImg.height;
						offCanvas
							.getContext("2d")
							.drawImage(backgroundImg, 0, 0);
						return offCanvas;
					},
				);
			});
	},

	/**
	 * @deprecated
	 * Process the given custom scripts for the map.
	 *
	 * @param scripts
	 * @returns void
	 */
	processCustomScripts: function(scripts) {
		for (let key in scripts) {
			if (scripts.hasOwnProperty(key)) {
				if (this.scripts.hasOwnProperty(key)) {
					this.scripts[key] = new Function(
						"return " + scripts[key],
					)();
				} else {
					console.warn(
						"Map '" +
							this.name +
							"' tried to set the custom event '" +
							key +
							"' which does not exist.",
					);
				}
			}
		}
	},

	/**
	 * Convert a map array from the save format
	 * to an actual array of tile objects.
	 *
	 * @param intArr {Array} The 3D save format array.
	 * @returns {Array} The level array.
	 */
	convertIntToLevelArray: function(intArr) {
		let levels = [];

		for (let level = 0; level < intArr.length; level++) {
			let tileArr = [];
			for (let y = 0; y < intArr[level].length; y++) {
				let row = [];
				for (let x = 0; x < intArr[level][y].length; x++) {
					let type = intArr[level][y][x];
					row.push(
						new Tile(x, y, this.tileWidth, this.tileHeight, type),
					);
				}
				tileArr.push(row);
			}

			levels.push(tileArr);
		}

		return levels;
	},

	/**
	 * Import a map by its save format
	 * and reset the active level.
	 *
	 * @param intArr {Array} the maps levels in the save format.
	 */
	importByIntArr: function(intArr) {
		this.levels = this.convertIntToLevelArray(intArr);
		this.activeLevel = 0;
	},

	/**
	 * Load a map by its id.
	 *
	 * @param id {number} The id of the map.
	 * @returns {Promise} A promise that can be .then'ed
	 */
	loadById: function(id) {
		let self = this;

		return new Promise(function(resolve, reject) {
			if (id === "") {
				reject("Map ID missing");
			}

			let xhr = new XMLHttpRequest();

			xhr.addEventListener("readystatechange", function() {
				if (this.readyState === 4) {
					if (this.status === 200) {
						let response = JSON.parse(this.responseText);
						console.log(response);

						let meta = response.meta;

						self.id = meta.id;
						self.author = meta.author;
						self.name = meta.name;
						self.spawns = meta.spawns;
						self.difficulty = meta.difficulty;
						self.backgroundScenes = meta.backgroundScenes;

						console.log(self.backgroundScenes);

						for (let i = 0; i < meta.backgroundScenes.length; i++) {
							if (
								!self.backgrounds.hasOwnProperty(
									meta.backgroundScenes[i],
								)
							) {
								reject(
									"Map prototype doesn't define " +
										meta.backgroundScenes[i] +
										" on it.",
								);
							}
						}

						self.background =
							self.backgrounds[meta.backgroundScenes[0]];
						self.gravity = self.config.ALLOW_CUSTOM_GRAVITY
							? meta.gravity
							: self.config.DEFAULT_GRAVITY;
						self.importByIntArr(response.levels);
						self.processCustomScripts(meta.scripts);

						if (self.config.showLog) {
							self.util.logMessage("import_success", {id: id});
						}

						resolve();
					} else {
						reject(id);
					}
				}
			});

			xhr.open("GET", "/map/get?id=" + id, true);
			xhr.send();
		});
	},

	/**
	 * Toggle the state to editor
	 * and vice versa.
	 *
	 * @returns void
	 */
	toggleEditorMode: function() {
		if (--this.state < 0) {
			this.state = this.STATE.EDITOR;
		}
	},
};
