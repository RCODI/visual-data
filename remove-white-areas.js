'use strict';

// Just in case we get an Error thrown from somewhere, catch it here
process.on("uncaughtException", function (e) {
    console.log("Error", e.stack);
});

// Dependencies
const readTree = require("fs-file-tree")
    , bindy = require("bindy")
    , sameTimeLimit = require("same-time-limit")
    , util = require("./util")
    , iterateObject = require("iterate-object")
    ;

// Use the ./screenshots path as input
const PATH_SCREENSHOTS = "./screenshots";

// Read all the screenshots
const ALL_SCREENSHOTS = readTree.sync(PATH_SCREENSHOTS);

// Get the list names
const LIST_NAMES = Object.keys(ALL_SCREENSHOTS);

let paths = [];

iterateObject(ALL_SCREENSHOTS, cList => {
    iterateObject(cList, cType => {
        iterateObject(cType, cFile => {
            paths.push(cFile.path);
        });
    });
});

sameTimeLimit(bindy(paths, function (currentPath, done) {
    util.removeWhiteArea(currentPath, err => done());
}), 50, () => console.log("Done."));
