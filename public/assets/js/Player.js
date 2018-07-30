/**
 * Created by Midi on 26.04.2018.
 */

function Player(x = 150, y = 150) {
    this.x           = x;
    this.y           = y;
    this.vx          = 0;
    this.vy          = 0;
    this.width       = 15;
    this.height      = 30;
    this.fillColor   = "#fff";
    this.strokeColor = "";
    this.sprites      = {
        static: null
    };

    this.save        = [x, y];
    this.canGoRight  = true;
    this.canGoLeft   = true;
    this.controls    = {
        left: false,
        right: false,
        jump: false
    };
    //https://opengameart.org/content/cat-fighter-sprite-sheet for animations

    this.physicMode = 1;
    this.maxdx = 30 * 6;
    this.maxdy = Number.MAX_SAFE_INTEGER;
    this.accel = this.maxdx / 2;
    this.friction = this.maxdx / (1/6);

}

Player.prototype = {

    DEFAULT_VX: 200,
    JUMP_HEIGHT: 280,

    SHOW_COLLISION: false,

    KEY: {
        ARROW_LEFT: 37,
        ARROW_UP: 38,
        ARROW_RIGHT: 39,
        SPACE: 32,
        LEFT: 65,
        RIGHT: 68,
        V: 86,
        F: 70
    },

    assets: {
        sprites: {
            static: ["/assets/images/player/static-cat-test.png"],
            running: [

            ]

        }
    },

    getInfo: function () {
        return {
            x: this.x,
            y: this.y,
            vx: this.vx,
            vy: this.vy,
            cl: this.canGoLeft,
            cr: this.canGoRight
        }
    },

    setWidth: function (width) {
        this.width = width;
    },

    setHeight: function (height) {
        this.height = height;
    },

    setSize: function (width, height) {
        this.width  = width;
        this.height = height;
    },

    setPosition: function (x, y) {
        this.x = x;
        this.y = y;
    },

    resetControls: function() {
        this.controls    = {
            left: false,
            right: false,
            jump: false
        };
    },

    resetPhysics: function() {
        this.vx = 0;
        this.vy = 0;
    },


    bounce: function(tileWidth) {

        console.log(`Bounce: ${this.vy}`);

        let hitScale;
        let overlapX;

        if (this.vx >= 0) {
            overlapX = (this.x + this.width) % tileWidth;
        }
        else if (this.vx < 0) {
            overlapX = tileWidth - (this.x % tileWidth);
        }

        //console.log(`x: ${this.x}, tileW: ${tileWidth}, overX: ${overlapX}`);

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


        overlapX += 1;
        hitScale = -0.2 / 29 * overlapX + 6 / 29;
        this.vy *= -0.95 - hitScale + modeScale.vy;
        this.vx *= modeScale.vx;
    },

    drawCollision: function(map, camera) {

        let tx        = map.coordinateToTile({x: this.x});
        let ty        = map.coordinateToTile({y: this.y});

        let tiles = [
            map.getTileAt(tx    , ty),     //player tile
            map.getTileAt(tx + 1, ty),     //right tile
            map.getTileAt(tx    , ty + 1), //down tile
            map.getTileAt(tx + 1, ty + 1)  //diagonal tile
        ];

        tiles.forEach(tile => tile.debugDraw(camera));

    },

    drawMode: function(context) {
        context.fillStyle = "rgba(0,0,0,0.8)";
        context.fillRect(240, 20, 150, 50);
        context.fillStyle = "#64dd17";
        context.fillText("Mode: " + this.physicMode, 270, 55);
    },

    handleCollision: function (map) {

        let tx        = map.coordinateToTile({x: this.x});
        let ty        = map.coordinateToTile({y: this.y});
        let overX     = this.x % map.tileWidth;
        let overY     = this.y % map.tileHeight;
        let tile      = map.getTileAt(tx, ty);
        let tileRight = map.getTileAt(tx + 1, ty);
        let tileDown  = map.getTileAt(tx, ty + 1);
        let tileDiag  = map.getTileAt(tx + 1, ty + 1);
        let lbCorner = map.getTileByCoordinates(this.x, this.y + this.height);
        let rbCorner = map.getTileByCoordinates(this.x + this.width - 1, this.y + this.height);


        //Check for bounce
        if (this.vy > 0 && (lbCorner.isBounce() || rbCorner.isBounce())) {
            let bounceTile = lbCorner.isBounce() ? lbCorner : rbCorner;
            this.bounce(map.tileWidth);

            if (map.scripts.bounceEvent) {
                map.scripts.bounceEvent(map, this, bounceTile);
            }

        }

        //Check for finish
        this.levelComplete =  !this.levelComplete && tile.isFlag() || tileRight.isFlag() || tileDown.isFlag() || tileDiag.isFlag(); //lbCorner.isFlag() || rbCorner.isFlag();


        //Vertical Collision
        if (this.vy > 0) {

            if ((tileDown.isObstacle() && !tile.isObstacle())
                || (tileDiag.isObstacle() && !tileRight.isObstacle() && overX > (map.tileWidth - this.width) && !overY)) {

                //console.log("hit ground");

                this.y = map.tileToCoordinate(ty, "y");
                this.vy = 0;
                overY = 0;
            }
        } else if (this.vy < 0) {
            if ((tile.isObstacle() && !tileDown.isObstacle())
                || tileRight.isObstacle() && !tileDiag.isObstacle() && overX && !overY) {

                //console.log("hit head");

                this.y = map.tileToCoordinate(ty + 1, "y");
                this.vy = 0;
                tile = tileDown;
                tileRight = tileDiag;
                overY = 0;
            }
        }

        if (this.vx > 0 || !this.canGoRight) {

            if (( overX > map.tileWidth - this.width) &&
                    ((tileRight.isObstacle() && !tile.isObstacle())
                    || (tileDiag.isObstacle() && !tileDown.isObstacle() && overY))) {

                //console.log("hit right");

                this.x = map.tileToCoordinate(tx, "x") + map.tileWidth - this.width;
                this.vx = 0;
                this.canGoRight = false;

            } else {
                this.canGoRight = true;
            }

        }

        if (this.vx < 0 || !this.canGoLeft) {
            if (tile.isObstacle() && !tileRight.isObstacle()
                || tileDown.isObstacle() && !tileDiag.isObstacle() && overY) {

                //console.log("hit left");

                this.x = map.tileToCoordinate(tx + 1, "x");
                this.vx = 0;
                this.canGoLeft = false;

            } else {
                this.canGoLeft = true;
            }
        }

        lbCorner = map.getTileByCoordinates(this.x, this.y + this.height);
        rbCorner = map.getTileByCoordinates(this.x + this.width - 1, this.y + this.height);

        this.onGround = lbCorner.isObstacle() || rbCorner.isObstacle();
    },

    update: function (delta, map) {

        if (this.controls.jump && this.onGround) {
            this.vy = -this.JUMP_HEIGHT;
            this.y -= 1;
        }

        if (!this.onGround) {
            this.y += this.vy * delta;
            this.vy += map.gravity;
        }

        if (this.controls.left && this.canGoLeft) {
            this.vx = -220;
            this.x += this.vx * delta;
        }


        if (this.controls.right && this.canGoRight) {
            this.vx = 220;
            this.x += this.vx * delta;
        }

        this.handleCollision(map);
    },

    bound: function(number, minimum, maximum) {
        return Math.max(minimum, Math.min(maximum, number));
    },

    update2: function(delta, map) {

        let wasleft = this.vx < 0,
            wasright = this.vx > 0,
            onGround = this.onGround,
            friction = this.friction * (onGround ? 10 : 0.04),
            accel = this.accel * (onGround ? 1 : 0.2);

        this.ddx = 0;

        let gravityScale;

        switch (this.physicMode) {
            case 1: gravityScale = 1; break;
            case 2: gravityScale = 0.95; break;
            case 3: gravityScale = 0.85; break;
        }

        this.ddy = map.gravity * gravityScale;


        if (this.controls.left) {
            this.ddx = this.ddx - accel;
        } else if (wasleft) {
            this.ddx = this.ddx + friction;
        }

        if (this.controls.right) {
            this.ddx = this.ddx + accel;
        } else if (wasright) {
            this.ddx = this.ddx - friction;
        }

        if (this.controls.jump && this.onGround) {
            this.ddy = this.ddy - 120;
        }


        switch (this.physicMode) {
            case 1:
                this.maxdx = 30 * (this.onGround ? 7 : 9);
                break;
            case 2:
                this.maxdx = 30 * 7;
                break;
            case 3:
                this.maxdx = 30 * 6;
                break;
        }

        this.x = this.x + (delta * this.vx);
        this.y = this.y + (delta * this.vy);


        this.vx = this.bound(this.vx + this.ddx, -this.maxdx, this.maxdx);
        this.vy = this.bound(this.vy + this.ddy, -this.maxdy, this.maxdy);

        if ((wasleft && (this.vx > 0))
            || (wasright && (this.vx < 0))) {

            this.vx = 0;
        }


        this.handleCollision(map);

    },

    draw: function (context, camera, frameCount) {
        context.drawImage(this.sprites.static, parseInt(this.x - camera.x), parseInt(this.y - camera.y), this.width, this.height);
    },

    savePosition: function (force = false) {
        if (this.onGround || force) {
            this.save = [this.x, this.y];
        }
    },

    loadPosition: function () {
        this.x = this.save[0];
        this.y = this.save[1];
        this.vy = 0;
    },

    handleButtonEvent: function (event, key, isKeyDown) {
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
                event.preventDefault();
                break;
            case this.KEY.V:
                this.savePosition();
                break;
            case this.KEY.F:
                this.loadPosition();
                break;
        }

        return false;
    }
};