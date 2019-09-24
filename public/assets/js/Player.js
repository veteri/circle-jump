/**
 * A player that can be placed on a map.
 *
 * @param x {number} x position
 * @param y {number} y position
 * @constructor
 */
function Player(x = 1920, y = 1080) {
	/**
	 * The x position.
	 * @type {number}
	 */
	this.x = x;

	/**
	 * The y position.
	 * @type {number}
	 */
	this.y = y;

	/**
	 * The x velocity.
	 * @type {number}
	 */
	this.vx = 0;

	/**
	 * The y velocity.
	 * @type {number}
	 */
	this.vy = 0;

	/**
	 * The width.
	 * @type {number}
	 */
	this.width = 15;

	/**
	 * The height.
	 * @type {number}
	 */
	this.height = 30;

	/**
	 * The saved position.
	 * @type {[*]}
	 */
	this.save = [x, y];

	/**
	 * Indicates whether player is
	 * currently bouncing.
	 *
	 * @type {boolean} True if bouncing, false otherwise
	 */
	this.isBouncing = false;

	/**
	 * Indicates whether the player is
	 * currently jumping.
	 *
	 * @type {boolean} True if jumping, false otherwise
	 */
	this.isJumping = false;

	/*this.canGoRight  = true;
    this.canGoLeft   = true;*/

	/**
	 * The state of the controls
	 * @type {object}
	 */
	this.controls = {
		left: false,
		right: false,
		jump: false,
	};

	/**
	 * The last animation state the player has.
	 * @type {string}
	 */
	this.lastAnimationState = "idle";

	/**
	 * The last direction the player was moving.
	 * @type {string}
	 */
	this.lastDirection = "right";

	/**
	 * The index of the frame of the
	 * current animation.
	 * @type {number}
	 */
	this.frameIndex = 0;

	/**
	 * The amount of frames it takes to
	 * get to the next animation frame.
	 * @type {number}
	 */
	this.animationDelay = 6;

	/**
	 * The image of the current animation frame.
	 * https://opengameart.org/content/cat-fighter-sprite-sheet for animations
	 * @type {null}
	 */
	this.currentFrame = null;

	/**
	 * The tile of the last bounce.
	 * @type {null}
	 */
	this.lastBounce = null;

	/**
	 * Indicates whether the player
	 * completed the level or not.
	 * @type {boolean} True if completed, false otherwise.
	 */
	this.levelComplete = false;

	/**
	 * The physics mode.
	 * @type {number}
	 */
	this.physicMode = 1;

	/**
	 * The maximum x velocity.
	 * @type {number}
	 */
	this.maxvx = 30 * 6;

	/**
	 * The maximum y velocity.
	 * @type {number}
	 */
	this.maxvy = Number.MAX_SAFE_INTEGER;

	/**
	 * The acceleration.
	 * @type {number}
	 */
	this.acceleration = this.maxvx / 2;

	/**
	 * The friction
	 * @type {number}
	 */
	this.friction = this.maxvx / (1 / 6);

	/**
	 * The scale of gravity
	 * applied on to the player.
	 * @type {number}
	 */
	this.gravityScale = 1;
}

/**
 * The player prototypes
 * @type {object}
 */
Player.prototype = {
	/**
	 * The default x velocity.
	 * @type {number}
	 */
	DEFAULT_VX: 200,

	/**
	 * The jump height
	 * @type {number}
	 */
	JUMP_HEIGHT: 240,

	/**
	 * Flag whether or not to draw
	 * the tiles used for collision.
	 * @type {boolean}
	 */
	SHOW_COLLISION: false,

	/**
	 * The keys for the controls
	 * of the player.
	 *
	 * @type {object}
	 */
	KEY: {
		ARROW_LEFT: 37,
		ARROW_UP: 38,
		ARROW_RIGHT: 39,
		SPACE: 32,
		LEFT: 65,
		RIGHT: 68,
		V: 86,
		F: 70,
	},

	/**
	 * Contains all the assets for the player
	 * @type {object}
	 */
	assets: {
		/**
		 * Contains the sprites for the player animation.
		 * @type {object}
		 */
		sprites: {
			/**
			 * Idle animation left.
			 * @type {Array}
			 */
			idleLeft: [
				"/assets/images/player/idle/left/idle_1.png",
				"/assets/images/player/idle/left/idle_2.png",
				"/assets/images/player/idle/left/idle_3.png",
				"/assets/images/player/idle/left/idle_4.png",
			],

			/**
			 * Idle animation right.
			 * @type {Array}
			 */
			idleRight: [
				"/assets/images/player/idle/right/idle_1.png",
				"/assets/images/player/idle/right/idle_2.png",
				"/assets/images/player/idle/right/idle_3.png",
				"/assets/images/player/idle/right/idle_4.png",
			],

			/**
			 * Walk animation left.
			 * @type {Array}
			 */
			walkLeft: [
				"/assets/images/player/walk/left/walk_1.png",
				"/assets/images/player/walk/left/walk_2.png",
				"/assets/images/player/walk/left/walk_3.png",
				"/assets/images/player/walk/left/walk_4.png",
				"/assets/images/player/walk/left/walk_5.png",
				"/assets/images/player/walk/left/walk_6.png",
				"/assets/images/player/walk/left/walk_7.png",
				"/assets/images/player/walk/left/walk_8.png",
			],

			/**
			 * Walk animation right.
			 * @type {Array}
			 */
			walkRight: [
				"/assets/images/player/walk/right/walk_1.png",
				"/assets/images/player/walk/right/walk_2.png",
				"/assets/images/player/walk/right/walk_3.png",
				"/assets/images/player/walk/right/walk_4.png",
				"/assets/images/player/walk/right/walk_5.png",
				"/assets/images/player/walk/right/walk_6.png",
				"/assets/images/player/walk/right/walk_7.png",
				"/assets/images/player/walk/right/walk_8.png",
			],

			/**
			 * Jump animation left.
			 * @type {Array}
			 */
			jumpLeft: [
				//"/assets/images/player/jump/left/jump_1.png",
				//"/assets/images/player/jump/left/jump_2.png",
				"/assets/images/player/jump/left/jump_3.png",
				"/assets/images/player/jump/left/jump_4.png",
				//"/assets/images/player/jump/left/jump_5.png",
				//"/assets/images/player/jump/left/jump_6.png",
				//"/assets/images/player/jump/left/jump_7.png",
				//"/assets/images/player/jump/left/jump_8.png",
			],

			/**
			 * Jump animation right.
			 * @type {Array}
			 */
			jumpRight: [
				//"/assets/images/player/jump/right/jump_1.png",
				//"/assets/images/player/jump/right/jump_2.png",
				"/assets/images/player/jump/right/jump_3.png",
				"/assets/images/player/jump/right/jump_4.png",
				//"/assets/images/player/jump/right/jump_5.png",
				//"/assets/images/player/jump/right/jump_6.png",
				//"/assets/images/player/jump/right/jump_7.png",
				//"/assets/images/player/jump/right/jump_8.png",
			],

			/**
			 * Bounce animation left.
			 * @type {Array}
			 */
			bounceLeft: [
				"/assets/images/player/jump2/left/jump_1.png",
				"/assets/images/player/jump2/left/jump_2.png",
				"/assets/images/player/jump2/left/jump_3.png",
				"/assets/images/player/jump2/left/jump_4.png",
			],

			/**
			 * Bounce animation right.
			 * @type {Array}
			 */
			bounceRight: [
				"/assets/images/player/jump2/right/jump_1.png",
				"/assets/images/player/jump2/right/jump_2.png",
				"/assets/images/player/jump2/right/jump_3.png",
				"/assets/images/player/jump2/right/jump_4.png",
			],
		},
	},

	/**
	 * Will contain the Image objects after
	 * loading all the sprites for each animation.
	 *
	 * @type {object}
	 */
	sprites: {
		idleLeft: [],
		idleRight: [],
		walkLeft: [],
		walkRight: [],
		jumpLeft: [],
		jumpRight: [],
		bounceLeft: [],
		bounceRight: [],
	},

	prerenderAll: function() {
		Object.keys(this.sprites).forEach(animationKey => {
			this.sprites[animationKey] = this.sprites[animationKey].map(
				animationImg => {
					const offCanvas = document.createElement("canvas");
					offCanvas.width = animationImg.width;
					offCanvas.height = animationImg.height;
					offCanvas.getContext("2d").drawImage(animationImg, 0, 0);
					return offCanvas;
				},
			);
		});
	},

	/**
	 * Get information about the current
	 * state of the player.
	 *
	 * @returns {object} The information
	 */
	getInfo: function() {
		return {
			x: this.x,
			y: this.y,
			vx: this.vx,
			vy: this.vy,
			cl: this.canGoLeft,
			cr: this.canGoRight,
		};
	},

	/**
	 * Set the width of the player.
	 * @param width {number} The width.
	 * @return void
	 */
	setWidth: function(width) {
		this.width = width;
	},

	/**
	 * Set the height of the player.
	 *
	 * @param height {number} The Height.
	 * @return void
	 */
	setHeight: function(height) {
		this.height = height;
	},

	/**
	 * Set the size of the player
	 *
	 * @param width {number} The width.
	 * @param height {height} The height.
	 * @returns void
	 */
	setSize: function(width, height) {
		this.width = width;
		this.height = height;
	},

	/**
	 * Set the position of the player.
	 *
	 * @param x {number} The x position.
	 * @param y {number} The y position.
	 * @returns void
	 */
	setPosition: function(x, y) {
		this.x = x;
		this.y = y;
	},

	/**
	 * Reset the state for all controls.
	 * @returns void
	 */
	resetControls: function() {
		this.controls = {
			left: false,
			right: false,
			jump: false,
		};
	},

	/**
	 * Resets the state for the jump control.
	 * @returns void
	 */
	resetJumpControl: function() {
		this.controls.jump = false;
	},

	/**
	 * Reset the x and y velocity force.
	 * @returns void
	 */
	resetPhysics: function() {
		this.vx = 0;
		this.vy = 0;
	},

	/**
	 * Spawn the player on the given map.
	 *
	 * @param map {Map} The map instance.
	 * @returns void
	 */
	spawn: function(map) {
		//Get the spawn of the current map level
		let spawn = [
			map.spawns[map.activeLevel][0],
			map.spawns[map.activeLevel][1],
		];

		//If the spawn happens to be a obstacle move the player up until its not.
		while (map.getTileByCoordinates(spawn[0], spawn[1]).isObstacle()) {
			spawn[1] -= map.tileHeight;
		}

		this.setPosition(spawn[0], spawn[1]);
	},

	/**
	 * Bounce the player with the
	 * given tileWidth.
	 * A good analogy is a trampoline.
	 *
	 * @param tileWidth {number} The tile width.
	 * @returns void
	 */
	bounce: function(tileWidth) {
		let hitScale;
		let overlapX;

		if (this.vx >= 0) {
			overlapX = (this.x + this.width) % tileWidth;
		} else if (this.vx < 0) {
			overlapX = tileWidth - (this.x % tileWidth);
		}

		//Change forces based on physic mode
		let modeScale;
		switch (this.physicMode) {
			case 1:
				modeScale = {vx: 1.8, vy: 0};
				break;
			case 2:
				modeScale = {vx: 1.5, vy: -0.01};
				break;
			case 3:
				modeScale = {vx: 1.1, vy: -0.02};
				break;
		}

		//Calculate a scale for the force based on the hit position
		overlapX += 1;
		hitScale = (-0.2 / 29) * overlapX + 6 / 29;

		//Apply the forces
		this.vy *= -0.95 - hitScale + modeScale.vy;
		this.vx *= modeScale.vx;
	},

	/**
	 * Draw the tiles used for collision for the player.
	 *
	 * @param map {Map} The map instance.
	 * @param camera {Camera} The camera instance.
	 * @returns void
	 */
	drawCollision: function(map, camera) {
		//Get the player position in tile coordinates
		let tx = map.coordinateToTile({x: this.x});
		let ty = map.coordinateToTile({y: this.y});

		//Collect all tiles
		let tiles = [
			map.getTileAt(tx, ty), //player tile
			map.getTileAt(tx + 1, ty), //right tile
			map.getTileAt(tx, ty + 1), //down tile
			map.getTileAt(tx + 1, ty + 1), //diagonal tile
		];

		//Debug draw each of those tiles
		tiles.forEach(tile => tile.debugDraw(camera));
	},

	/**
	 * Draw the physics mode of the player
	 *
	 * @param context {CanvasRenderingContext2D}
	 * @returns void
	 */
	drawMode: function(context) {
		context.fillStyle = "rgba(0,0,0,0.8)";
		context.fillRect(240, 20, 150, 50);
		context.fillStyle = "#64dd17";
		context.fillText("Mode: " + this.physicMode, 270, 55);
	},

	/**
	 * Handle the collision of the
	 * player with the world.
	 *
	 * @param map {Map} The map instance
	 * @returns void
	 */
	handleCollision: function(map) {
		let tx = map.coordinateToTile({x: this.x});
		let ty = map.coordinateToTile({y: this.y});
		let overX = this.x % map.tileWidth;
		let overY = this.y % map.tileHeight;
		let tile = map.getTileAt(tx, ty);
		let tileRight = map.getTileAt(tx + 1, ty);
		let tileDown = map.getTileAt(tx, ty + 1);
		let tileDiag = map.getTileAt(tx + 1, ty + 1);
		let lbCorner = map.getTileByCoordinates(this.x, this.y + this.height);
		let rbCorner = map.getTileByCoordinates(
			this.x + this.width - 1,
			this.y + this.height,
		);

		//Check for bounce
		if (this.vy > 0 && (lbCorner.isBounce() || rbCorner.isBounce())) {
			let bounceTile = lbCorner.isBounce() ? lbCorner : rbCorner;

			if (
				this.lastBounce === null ||
				this.lastBounce.x !== bounceTile.x ||
				this.lastBounce.y !== bounceTile.y
			) {
				this.bounce(map.tileWidth);
				this.isBouncing = true;
			}

			this.lastBounce = bounceTile;
		}

		//Check for finish
		this.levelComplete =
			(!this.levelComplete && tile.isFlag()) ||
			tileRight.isFlag() ||
			tileDown.isFlag() ||
			tileDiag.isFlag();

		//Vertical Collision
		if (this.vy > 0) {
			if (
				(tileDown.isObstacle() && !tile.isObstacle()) ||
				(tileDiag.isObstacle() &&
					!tileRight.isObstacle() &&
					overX >= map.tileWidth - this.width)
			) {
				this.y = map.tileToCoordinate(ty, "y");
				this.vy = 0;
				overY = 0;

				this.isBouncing = false;
				this.isJumping = false;
				this.lastBounce = null;
			}
		} else if (this.vy < 0) {
			if (
				(tile.isObstacle() && !tileDown.isObstacle()) ||
				(tileRight.isObstacle() &&
					!tileDiag.isObstacle() &&
					overX >= map.tileWidth - this.width)
			) {
				this.y = map.tileToCoordinate(ty + 1, "y");
				this.vy = 0;
				tile = tileDown;
				tileRight = tileDiag;
				overY = 0;
			}
		}

		if (this.vx > 0) {
			if (
				overX >= map.tileWidth - this.width &&
				((tileRight.isObstacle() && !tile.isObstacle()) ||
					(tileDiag.isObstacle() && !tileDown.isObstacle() && overY))
			) {
				this.x =
					map.tileToCoordinate(tx, "x") + map.tileWidth - this.width;
				this.vx = 0;
			}
		} else if (this.vx <= 0) {
			if (
				(tile.isObstacle() && !tileRight.isObstacle()) ||
				(tileDown.isObstacle() && !tileDiag.isObstacle() && overY)
			) {
				this.x = map.tileToCoordinate(tx + 1, "x");
				this.vx = 0;
			}
		}

		lbCorner = map.getTileByCoordinates(this.x, this.y + this.height);
		rbCorner = map.getTileByCoordinates(
			this.x + this.width - 1,
			this.y + this.height,
		);

		this.onGround = lbCorner.isObstacle() || rbCorner.isObstacle();
	},

	/**
	 * Makes sure the given number doesn't
	 * get below the given minimum or the given
	 * maximum.
	 *
	 * @param number {number} The number to bound
	 * @param minimum {number} The minimum
	 * @param maximum {number} The maximum
	 * @returns {number} The bound number
	 */
	constrain: function(number, minimum, maximum) {
		return Math.max(minimum, Math.min(maximum, number));
	},

	/**
	 * Update the player based on the controls.
	 *
	 * @param delta {number} The fixed time step
	 * @param map {Map} The map instance
	 * @returns void
	 */
	update: function(delta, map) {
		let wasGoingLeft = this.vx < 0;
		let wasGoingRight = this.vx > 0;
		let friction = this.friction * (this.onGround ? 10 : 0.04);
		let acceleration = this.acceleration * (this.onGround ? 1 : 0.2);

		switch (this.physicMode) {
			case 1:
				this.gravityScale = 1;
				break;
			case 2:
				this.gravityScale = 0.95;
				break;
			case 3:
				this.gravityScale = 0.85;
				break;
		}

		this.cycleVY = map.gravity * this.gravityScale;
		this.cycleVX = 0;

		//Moving left
		if (this.controls.left) {
			this.cycleVX = this.cycleVX - acceleration;
			this.lastDirection = "left";
		} else if (wasGoingLeft) {
			this.cycleVX = this.cycleVX + friction;
		}

		//Moving right
		if (this.controls.right) {
			this.cycleVX = this.cycleVX + acceleration;
			this.lastDirection = "right";
		} else if (wasGoingRight) {
			this.cycleVX = this.cycleVX - friction;
		}

		//Jumping
		if (this.controls.jump && this.onGround && !this.isJumping) {
			this.cycleVY = this.cycleVY - this.JUMP_HEIGHT;
			this.isJumping = true;
		}

		//Different physics modes
		switch (this.physicMode) {
			case 1:
				this.maxvx = 30 * (this.onGround ? 7 : 9);
				break;
			case 2:
				this.maxvx = 30 * 7;
				break;
			case 3:
				this.maxvx = 30 * 6;
				break;
		}

		//Calculating new position
		this.x = this.x + delta * this.vx;
		this.y = this.y + delta * this.vy;

		//Calculating new forces
		this.vx = this.constrain(
			this.vx + this.cycleVX,
			-this.maxvx,
			this.maxvx,
		);
		this.vy = this.constrain(
			this.vy + this.cycleVY,
			-this.maxvy,
			this.maxvy,
		);

		//Stutter fix
		if ((this.vx > 0 && wasGoingLeft) || (this.vx < 0 && wasGoingRight)) {
			this.vx = 0;
		}

		//Finally handle illegal move operations
		this.handleCollision(map);
	},

	/**
	 * Get the animation state.
	 *
	 * @returns {string} The state.
	 */
	getAnimationState: function() {
		let state = "";

		if (this.onGround && !this.controls.left && !this.controls.right) {
			state = "idle";
		}

		if (!this.onGround || (this.isBouncing && this.vy > 0)) {
			state = "jump";
		}

		if (this.onGround && (this.controls.left || this.controls.right)) {
			state = "walk";
		}

		if (this.isBouncing && this.vy <= 0) {
			state = "bounce";
		}

		if (state !== this.lastAnimationState) {
			this.frameIndex = 0;
		}

		this.lastAnimationState = state;

		return state + (this.lastDirection === "left" ? "Left" : "Right");
	},

	/**
	 * Draw the player.
	 *
	 * @param context {CanvasRenderingContext2D} The context.
	 * @param camera {Camera} The Camera instance.
	 * @param frameCount {number} The amount of frames since the game start.
	 * @param gameState {number} The state of the game
	 * @returns void
	 */
	draw: function(context, camera, frameCount, gameState) {
		if (
			frameCount % this.animationDelay === 0 ||
			this.currentFrame === null
		) {
			let state, length;

			state = this.getAnimationState();
			length = Object.keys(this.sprites[state]).length;

			if (++this.frameIndex === length) {
				this.frameIndex = 0;
			}

			this.currentFrame = this.sprites[state][this.frameIndex];
		}

		if (gameState !== Game.prototype.states.editor) {
			context.drawImage(
				this.currentFrame,
				parseInt(this.x - camera.x),
				parseInt(this.y - camera.y),
				this.width,
				this.height,
			);
		}
	},

	/**
	 * Save the position of the player.
	 *
	 * @param force Will always save if true
	 */
	savePosition: function(force = false) {
		if (this.onGround || force) {
			this.save = [this.x, this.y];
		}
	},

	/**
	 * Load the position of the player.
	 * @returns void
	 */
	loadPosition: function() {
		this.x = this.save[0];
		this.y = this.save[1];
		this.vy = 0;
		this.lastBounce = null;
	},

	/**
	 * Handle button events in order to
	 * activate certain controls.
	 *
	 * @param event {Event} The button event.
	 * @param key {number} The key code.
	 * @param isKeyDown {boolean} True if the key is pressed
	 * @returns {boolean} true
	 */
	handleButtonEvent: function(event, key, isKeyDown) {
		switch (key) {
			case this.KEY.ARROW_LEFT:
				this.physicMode = 1;
				break;
			case this.KEY.ARROW_UP:
				this.physicMode = 2;
				break;
			case this.KEY.ARROW_RIGHT:
				this.physicMode = 3;
				break;
			case this.KEY.LEFT:
				this.controls.left = isKeyDown;
				break;
			case this.KEY.RIGHT:
				this.controls.right = isKeyDown;
				break;
			case this.KEY.SPACE:
				this.controls.jump = isKeyDown;
				break;
			case this.KEY.V:
				this.savePosition();
				break;
			case this.KEY.F:
				this.loadPosition();
				break;
		}

		return true;
	},
};
