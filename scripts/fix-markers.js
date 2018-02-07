"use strict";





const readJson = require("r-json")
    , fileTree = require("fs-file-tree")
    , iterateObject = require("iterate-object")
    , writeJson = require("w-json")
    ;

let allFiles = fileTree.sync(`${__dirname}/../results`);

iterateObject(allFiles, (cObj, listName) => {
    if (listName.includes("->")) { return; }
    console.log(`Fixing ${listName}`);
    let jsonPath = cObj.json['markers.json'].path;
    let jsonData = readJson(jsonPath);
    writeJson(jsonPath, jsonData.filter(c => c.listName === listName));
});
