"use strict";

const util = require("../util");

let path1 = process.argv[2]
  , path2 = process.argv[3]
  ;

if (!path1 || !path2) {
    return console.error("Please provide two image paths.");
}

console.log(`Comparing ${path1} and ${path2}`);
util.getSSIM(path1, path2, ssim => {
    util.getFeatures2d(path1, path2, features2d => {
        console.log(`SSIM: ${ssim}`);
        console.log(`Features 2D: ${features2d}`);
    });
});
