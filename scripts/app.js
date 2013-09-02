requirejs.config({
    //By default load any module IDs from js/lib
    baseUrl: 'scripts',
    paths: {
        lib: 'lib',
        app: 'app',
    }
});

// Start the main app logic.
requirejs(['lib/d3','app/track','app/circles','app/lines', 'app/attorney', 'app/job'],
function   () {
    //jQuery, canvas and the app/sub module are all
    //loaded and can be used here now.
});