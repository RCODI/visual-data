'use strict';

// Just in case we get an Error thrown from somewhere, catch it here
//process.on("uncaughtException", function (e) {
//    console.log("Error", e.stack);
//});

// Dependencies
const readTree = require("fs-file-tree")
    , bindy = require("bindy")
    , oneByOne = require("one-by-one")
    , sameTime = require("same-time")
    , sameTimeLimit = require("same-time-limit")
    , json2md = require("json2md")
    , fs = require("fs")
    , mkdirp = require("mkdirp")
    , wJson = require("w-json")
    , util = require("./util")
    , getUsernameLink = util.getUsernameLink
    , Daty = require("daty")
    ;


// Check if we have the --no-colors flag
const NO_COLORS = ~process.argv.indexOf("--no-colors");

// Prepare the path to read the screenshots from
const PATH_SCREENSHOTS = `./${NO_COLORS ? "nocolor-" : ""}screenshots`;

// Read all the screenshots
const ALL_SCREENSHOTS = readTree.sync(PATH_SCREENSHOTS);
const LIST_NAMES = Object.keys(ALL_SCREENSHOTS);

// Get the selected list(s)
const SELECTED_LIST = process.argv[2];
const SOURCE_LIST = SELECTED_LIST;
const TARGET_LIST = process.argv[3];

// Validate the lists
function showError(name) {
    if (name === "--no-colors") { return; }
    console.error(`The list ${name} is not available. Please use one of the following names:\n - ${LIST_NAMES.join("\n - ")}.`);
    return process.exit(1);
}

if (SOURCE_LIST && !~LIST_NAMES.indexOf(SOURCE_LIST)) {
    showError(SOURCE_LIST);
}

if (TARGET_LIST && !~LIST_NAMES.indexOf(TARGET_LIST)) {
    showError(TARGET_LIST);
}

// Check if we have cross lists comparisons
const CROSS_LIST = !!(SOURCE_LIST && TARGET_LIST && ~LIST_NAMES.indexOf(SOURCE_LIST) && ~LIST_NAMES.indexOf(TARGET_LIST));

// Create the result list name
const RESULT_LIST_NAME = SELECTED_LIST;

// Prepare the paths to save the results in
const PATH_RESULTS = "./results";
const DIR_RESULTS = `${PATH_RESULTS}/${CROSS_LIST ? [SOURCE_LIST, TARGET_LIST].join("->") : RESULT_LIST_NAME}`;

// A list is mandatory
if (!SELECTED_LIST) {
    console.error(`Please provide a list name.\n`);
    console.error(`  Usage: $ node compare.js <list-name>\n`);
    console.error(`Please use one of the following names:\n - ${LIST_NAMES.join("\n - ")}.\n`);
    return process.exit(1);
}

// Show output
if (CROSS_LIST) {
    console.log(`Comparing ${SOURCE_LIST} with ${TARGET_LIST}.`);
} else {
    console.log(`Comparing ${SOURCE_LIST}`);
}
console.log(`The comparison is with${NO_COLORS ? "out" : "" } color.`);

// How many images to compare in parallel
const MAX_LIMIT = 10;

/**
 * compareInDir
 * Compares the images in the provided list.
 *
 * @name compareInDir
 * @function
 * @param {String|Object} currentName The name of the list or an object
 * containing the source and target paths.
 * @param {String} comparisonType The comparsion type.
 * @param {Function} cb The callback function.
 */
function compareInDir(currentName, comparisonType, cb) {

    // Create the similarities array
    const similarities = [];

    /**
     * getListInfo
     * Gets the list info.
     *
     * @name getListInfo
     * @function
     * @param {String} name the list name.
     * @returns {Object} An object containing the images objects.
     */
    function getListInfo (name) {
        var dirObj = ALL_SCREENSHOTS[name][comparisonType];
        var paths = Object.keys(dirObj);
        const images = paths.map(c => {
            return {
                url: c.slice(0, -4)
              , path: dirObj[c].path
            }
        });
        return {
            images: images
        };
    }

    /**
     * getId
     * Builds an unique id for specified objects.
     *
     * @name getId
     * @function
     * @param {Object} source The source object.
     * @param {Object} target The target object.
     * @returns {String} The unique id.
     */
    function getId(source, target) {
        return `${source.url}->${target.url}`;
    }

    // Create the compared cache
    var compared = {};

    /**
     * comparedAlready
     * Checks if the urls were compared already. Also sets it to
     * true in the cache if they weren't.
     *
     * @name comparedAlready
     * @function
     * @param {String} a The first path.
     * @param {String} b The second path.
     * @returns {Boolean} `true` if the urls were compared already. `false` otherwise.
     */
    function alreadyCompared(a, b) {
        if (a === b || compared[getId(a, b)] || compared[getId(b, a)]) {
            return true;
        }
        return false;
    }

    // Create the source and target lists
    let sourceList = {};
    let targetList = {};

    // If the current name is a string, they will be
    // identical otherwise they will be different.
    if (typeof currentName === "object") {
        sourceList = getListInfo(currentName.source);
        targetList = getListInfo(currentName.target);
    } else {
        sourceList = targetList = getListInfo(currentName);
    }

    // Iterate the source images
    sourceList.images.forEach(source => {

        // Iterate the target images
        targetList.images.forEach(target => {

            // If already compared, stop
            if (alreadyCompared(source, target)) { return; }

            // Push the similarity objects
            similarities.push({
                source: source
              , target: target
            });

            // Set the compared id to true in the cache
            compared[getId(source, target)] = true;
        });
    });

    // Use these variables to show the progress
    let alreadyComparedCount = 0;
    let howMany = similarities.length;

    // Start comparing
    sameTimeLimit(bindy(similarities, (current, done) => {
        sameTime([
            // Do the SSIM comparison
            done => {
                util.getSSIM(current.source.path, current.target.path, ssim => {
                    console.log(`${comparisonType} :: ${++alreadyComparedCount}/${howMany}: Comparing ${current.source.url} with ${current.target.url}`);
                    current.ssim = ssim;
                    done();
                });
            },

            // Features 2D
            done => {
                util.getFeatures2d(current.source.path, current.target.path, similarity => {
                    current.features2d = similarity;
                    done();
                });
            }
        ], function () {
            done(null, current);
        });
    }), MAX_LIMIT, (err, data) => {
        data = data || [];
        console.log(err);
        cb(err, data.map(c => {
            return {
                urls: [c.source.url, c.target.url]
              , ssim: c.ssim
              , features2d: c.features2d
            }
        }));
    });
}

// Create an array with the selected lists(s)
const SELECTED_LISTS = CROSS_LIST ? [{ source: SOURCE_LIST, target: TARGET_LIST }] : [SELECTED_LIST];

console.log(`Started at ${new Daty().format("LLLL")}`);

// Start comparing
oneByOne(bindy(SELECTED_LISTS, function (currentName, next) {
    // Do in in parallel for:
    sameTime([
        // Maps
        cb => compareInDir(currentName, "maps", cb)

        // Charts
      , cb => compareInDir(currentName, "charts", cb)

        // Complete pages
      , cb => compareInDir(currentName, "complete", cb)

        // Simple (no maps and charts)
      , cb => compareInDir(currentName, "simple", cb)
    ], function (err, results) {
        next(null, {
            listName: CROSS_LIST ? [currentName.source, currentName.target].join("->") : currentName
          , results: results
        });
    });
}), function (err, data) {

    // Show ouput
    console.log("Generating the JSON data for Markdown.");

    // Build the table headers
    var headers = [
        "First url"
      , "Second url"
      , "SSIM"
      , "Feature Matching"
    ];

    // Build the json data
    var jsonToConvert = data.map(currentList => {
        let res = [];

        let addSection = (label, data) => {
            data = getRows(data)
            if (!data.length) {
                return;
            }
            res.push([
                { h3: label },
                {
                    table: {
                        headers: headers,
                        rows: data
                    }
                }
            ]);
        };

        res.push([
            { h2: currentList.listName }
        ]);

        addSection("Maps", currentList.results[0]);
        addSection("Charts", currentList.results[1]);
        addSection("Complete", currentList.results[2]);
        addSection("Simple Pages (without maps and charts)", currentList.results[3]);

        return res;
    });

    // Get the table rows
    function getRows(input) {
        return input.map(c => [
            getUsernameLink(c.urls[0]),
            getUsernameLink(c.urls[1]),
            c.ssim,
            c.features2d
        ]);
    }

    // Create the directories
    console.log("Saving the raw results.");
    mkdirp.sync(DIR_RESULTS);
    mkdirp.sync(`${DIR_RESULTS}/json`);

    // Create the output files
    wJson(`${DIR_RESULTS}/json/${NO_COLORS ? "no-color-" : "" }raw-results.json`, data);

    // Create the markdown file
    console.log("Saving the Markdown results.");
    fs.writeFileSync(`${DIR_RESULTS}/${NO_COLORS ? "NO_COLOR_" : "" }RESULTS.md`, json2md(jsonToConvert));
    console.log(`Everything saved in the ${DIR_RESULTS} directory.`)
    console.log(`Finished at ${new Daty().format("LLLL")}`);
});
