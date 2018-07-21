let b = {

update: function() {},

tick: function () {

//Schedule next tick.
this.requestId = window.requestAnimationFrame(this.tick.bind(this));
this.now       = this.Utility.getTimestamp();

//Time since last tick + left over time that needs to be processed yet.
this.delta    += (this.now - this.last) / 1000;

//Resetting the update flag.
this.updated   = false;

/**
 * If the user switched tabs and our tab is running for a
 * prolonged period of time, we avoid calling the update
 * functions a large amount of time by resetting the delta time.
 */
if (this.delta >= this.config.MAX_IDLE_THRESHOLD) {
    this.delta = this.timestep;
}

/**
 * As long as the delta time fits into our time step (1 / fps),
 * we call the update function.~
 * Example: If it took the browser 0.5 seconds since the last gametick,
 * it will update the game state 30 times (30 * (1/60) = 0.5),
 * since this is what happened in that duration.
 */
while (this.delta >= this.timestep) {
    this.update(this.timestep);
    this.delta -= this.timestep;
    this.updated = true;
}

//Only render the scene if we updated
if (this.updated) {
    this.render(++this.frameCount);
}
this.timePassed += (this.now - this.last) / 1000;

this.last = this.now;

},

};
requestAnimationFrame(tick);

function update() {}
function render() {}



(function() {

    let pepo = document.getElementById("1");
    let pics = ["assets/images/1.png", "assets/images/2.png"];
    let index = 0;

    pepo.width = 50;

    document.addEventListener("mousemove", function(event) {
        pepo.style.top = (event.clientY - 25) + "px";
        pepo.style.left = (event.clientX - 25) + "px";
    });

    document.querySelector(".nier").volume = 0.1;

    function toggleFrame() {
        pepo.src = pics[index];
        index = index === 0 ? 1 : 0;
    }

    setInterval(toggleFrame, 500);


})();






