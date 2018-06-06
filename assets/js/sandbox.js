/**
 * Created by Midi on 27.04.2018.
 */


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



