/**
 * Created by Midi on 26.04.2018.
 */


const UIController = UI = (function() {

    let config = {
        canvasWidth: 1920,
        canvasHeight: 1080
    };

    let canvas = document.getElementById("canvas");
    let context = canvas.getContext("2d");
    canvas.width = config.canvasWidth;
    canvas.height = config.canvasHeight;

    let loaderDiv = document.querySelector(".loading-info");
    let progressDiv = document.querySelector(".progress");


    let getCanvas = function() {
        return canvas;
    };

    let getContext = function() {
        return canvas.getContext("2d", {alpha: false});
    };

    let getCanvasDimensions = function() {
        return {
            width: canvas.width,
            height: canvas.height
        }
    };

    let resetCanvas = function() {
        context.clearRect(0, 0, canvas.width, canvas.height);
    };

    let showLoader = function() {
        loaderDiv.classList.remove("hidden");
    };

    let hideLoader = function() {
        loaderDiv.classList.add("hidden");
    };

    let setProgress = function(percent) {
        progressDiv.style.width = percent + "%";
    };

    let setCanvasWidth = function(width) {
        canvas.width = width;
    };

    let setCanvasHeight = function(height) {
        canvas.height = height;
    };


    return {
        canvas: {
            get: getCanvas,
            getContext: getContext,
            getDimensions: getCanvasDimensions,
            reset: resetCanvas
        },
        loader: {
            show: showLoader,
            hide: hideLoader
        },

        progress: {
            set: setProgress
        }
    }


})();