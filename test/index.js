"use strict";

const util = require("../util")
    , readTree = require("fs-file-tree")
    , readJson = require("r-json")
    , iterateObject = require("iterate-object")
    , Table = require("cli-table")
    ;


let jsonPaths = readTree.sync(`${__dirname}/../lists`)
  , screenshotPaths = readTree.sync(`${__dirname}/../screenshots`)
  , tbl = new Table()
  ;

iterateObject(jsonPaths, (val, name) => {
    let data = readJson(val.path);
    data.forEach(c => {
        c = c.url || c;
        tbl.push([
            c, util.getUsernameLink(c, true)
        ]);
    });
});

console.log("From json");
console.log(tbl.toString());

iterateObject(screenshotPaths, (val, name) => {
    iterateObject(val, (dir, name) => {
        iterateObject(dir, (file, c) => {
            tbl.push([
                c, util.getUsernameLink(c, true)
            ]);
        });
    });
});

console.log("From screenshot file names");
console.log(tbl.toString());
