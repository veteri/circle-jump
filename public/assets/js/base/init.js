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

    const addValidatorMethods = function() {
        $.validator.addMethod("validPassword",
            function(value, element, param) {
                return value !== ""
                    && value.match(/.*[a-z]+.*/i) !== null
                    && value.match(/.*\d.*/i) !== null;
            },
            "Must contain at least one letter & one number"
        );
    };

    document.addEventListener('DOMContentLoaded', function() {
        initMaterializeCSS();
        addValidatorMethods();
    });


})();

