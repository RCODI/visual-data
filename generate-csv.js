 'use strict';

// Dependencies
const readTree = require("fs-file-tree")
    , oneByOne = require("one-by-one")
    , sameTime = require("same-time")
    , json2md = require("json2md")
    , fs = require("fs")
    , readJson = require("r-json")
    , bindy = require("bindy")
    , wJson = require("w-json")
    , getUsernameLink = require("./util").getUsernameLink
    , iterateObject = require("iterate-object")
    , fastCsv = require("fast-csv")
    , streamp = require("streamp")
    , util = require("./util")
    ;

const PATH_CSV = __dirname + "/csv";
const ALL_RESULTS = readTree.sync("./results");
const LIST_NAMES = Object.keys(ALL_RESULTS);

oneByOne(bindy(LIST_NAMES, (cList, cb) => {
    let currentList = ALL_RESULTS[cList].json;
    let tasks = [];

    iterateObject(currentList, (cFile, name) => {
        name = name.split(".")[0];
        tasks.push(cb => {
            let cPath = `${PATH_CSV}/${cList}/${cList}–${name}.csv`;

            readJson(cFile.path, (err, jsonData) => {

                if (err) {
                    cb();
                    return console.error(err);
                }

                var data = [];

                function getUrlInfo(url) {
                    let match = url.match(/\[(.*)\]\((.*)\)/);
                    return {
                        text: match[1]
                      , url: match[2]
                    };
                }

                switch (name) {
                    case "markers":
                        data = jsonData[0].data[2].table.rows.map(c => {
                            let obj = {};
                            let url1 = getUrlInfo(c[0]);
                            let url2 = getUrlInfo(c[1]);
                            obj.username1 = util.getUsernameLink(url1.url, true);
                            obj.username2 = util.getUsernameLink(url2.url, true);
                            obj.link1 = url1.url;
                            obj.link2 = url2.url;
                            obj.average_distance = c[2];
                            obj.distance_between_averages = c[3];
                            return obj;
                        });
                        break;
                    case "no-color-raw-results":
                    case "raw-results":
                        let types = ["maps", "charts", "complete", "simple"];
                        jsonData[0].results.forEach((cGroup, groupIndex) => {
                            data = data.concat(cGroup.map(c => {
                                let obj = {};
                                c.urls = c.urls.map(c => "http://" + c.replace(/\|\|\|/g, "/"));
                                obj.username1 = util.getUsernameLink(c.urls[0], true);
                                obj.username2 = util.getUsernameLink(c.urls[1], true);
                                obj.link1 = c.urls[0];
                                obj.link2 = c.urls[1];
                                obj.comparison_type = types[groupIndex];
                                obj.ssim = c.ssim;
                                obj.features2d = c.features2d;
                                return obj;
                            }));
                        });
                        break;
                }

                let writableStream = new streamp.writable(cPath)
                let csvStream = fastCsv.createWriteStream({
                    headers: true
                });

                writableStream.on("finish", function(){
                    console.log(`Written ${cPath}`);
                    cb();
                });

                csvStream.pipe(writableStream);
                data.forEach(c => csvStream.write(c));

                csvStream.end();
            });
        });
    });
    sameTime(tasks, cb);
}), err => {
    console.log(err || "Done.");
});
