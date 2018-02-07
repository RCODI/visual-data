'use strict';

// Just in case we get an Error thrown from somewhere, catch it here
process.on("uncaughtException", function (e) {
    console.log("Error", e);
});

// Dependencies
const readTree = require("fs-file-tree")
    , bindy = require("bindy")
    , oneByOne = require("one-by-one")
    , sameTime = require("same-time")
    , opencv = require("opencv")
    , mkdirp = require("mkdirp")
    , cv = require("opencv")
    ;

// Use the "no-color-" prefix to prefix the screenshots without colors
const PREFIX = "nocolor-";

// Use the ./screenshots path as input
const PATH_SCREENSHOTS = "./screenshots";

// And save the results in ./nocolor-screenshots directory
const PATH_SCREENSHOTS_OUTPUT = `${PREFIX}screenshots`;

// Read all the screenshots
const ALL_SCREENSHOTS = readTree.sync(PATH_SCREENSHOTS);

// Get the list names
const LIST_NAMES = Object.keys(ALL_SCREENSHOTS);

function saveImages(dirObj, cb) {
    // Get the paths
    let paths = Object.keys(dirObj);

    // Get the image full paths
    const images = paths.map(c => dirObj[c].path);

    // Go through each one
    sameTime(bindy(images, function (currentPath, done) {
        // Read the image
        cv.readImage(currentPath, function(err, im){

            // If there is an error, show it.
            if (err) {
                console.error("There was an error reading " + currentPath);
                console.error(err);
            } else {
                // Prepare the new path
                let newPath = PREFIX + currentPath;

                // Show output
                console.log("Saving " + newPath);

                // Use the Canny algorithm to change the image
                im.canny(0, 800)

                // Save the image
                im.save(newPath);
            }
            done();
        })
    }), cb);
}

// Go through each list
oneByOne(bindy(LIST_NAMES, function (currentName, next) {

    // Create the directories
    mkdirp.sync(`${PATH_SCREENSHOTS_OUTPUT}/${currentName}/maps`)
    mkdirp.sync(`${PATH_SCREENSHOTS_OUTPUT}/${currentName}/charts`)
    mkdirp.sync(`${PATH_SCREENSHOTS_OUTPUT}/${currentName}/complete`)
    mkdirp.sync(`${PATH_SCREENSHOTS_OUTPUT}/${currentName}/simple`)

    // Get the current list
    var currentList = ALL_SCREENSHOTS[currentName];

    // Asynchronously, start converting the images
    sameTime([
        // Maps
        n => saveImages(currentList.maps, n),

        // Complete pages
        n => saveImages(currentList.complete, n),

        // Charts
        n => saveImages(currentList.charts, n),

        // Simple
        n => saveImages(currentList.simple, n)
    ], next);
}));
