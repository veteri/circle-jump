/**
 * This scripts purpose is to init all vendor
 * plugins and similiar 3rd party code.
 */

(function() {

    const initMaterializeCSS = function() {
        let elements, instances;

        //Init Sidenav
        elems = document.querySelectorAll('.sidenav');
        instances = M.Sidenav.init(elems);

        //Init slider
        elems = document.querySelectorAll('.slider');
        instances = M.Slider.init(elems, {
            height: 550,
            indicators: false,
            transition: 500,
            interval: 4500
        });
    };

    document.addEventListener('DOMContentLoaded', function() {
        initMaterializeCSS();
    });

})();

