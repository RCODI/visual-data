
 'use strict';

// Dependencies
const readTree = require("fs-file-tree")
    , oneByOne = require("one-by-one")
    , json2md = require("json2md")
    , fs = require("fs")
    , readJson = require("r-json")
    , bindy = require("bindy")
    , mkdirp = require("mkdirp")
    , wJson = require("w-json")
    , getUsernameLink = require("./util").getUsernameLink
    ;

/**
 * getDistanceFromLatLonInKm
 * Computes the distance in killometers between two coordinates
 *
 * @name getDistanceFromLatLonInKm
 * @function
 * @param {Number} lat1 The latitude of the first point.
 * @param {Number} lon1 The longitude of the first point.
 * @param {Number} lat2 The latitude of the second point.
 * @param {Number} lon2 The longitude of the second point.
 * @returns {Number} The distance in km.
 */
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    function deg2rad(deg) {
        return deg * (Math.PI/180)
    }

    let R = 6371; // Radius of the earth in km
    let dLat = deg2rad(lat2 - lat1); // deg2rad below
    let dLon = deg2rad(lon2 - lon1);
    let a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    let d = R * c; // Distance in km
    return d;
}

// In the ./info directory we will take the markers from
const PATH_MARKERS = "info";

// Get all the markers
const ALL_MARKERS = readTree.sync(PATH_MARKERS);

// Get the list names
const LIST_NAMES = Object.keys(ALL_MARKERS);

// In the results directory we will save the markers similarities
const PATH_RESULTS = "./results";

// Get the selected list
const SELECTED_LIST = process.argv[2];

// Get the source and target lists
const SOURCE_LIST = SELECTED_LIST;
const TARGET_LIST = process.argv[3];

// Check if we have a cross list comparison
const CROSS_LIST = !!(SOURCE_LIST && TARGET_LIST && ~LIST_NAMES.indexOf(SOURCE_LIST) && ~LIST_NAMES.indexOf(TARGET_LIST));

// Show an error if the list is invalid
if (SELECTED_LIST && !~LIST_NAMES.indexOf(SELECTED_LIST)) {
    console.error(`The list ${SELECTED_LIST} is not available. Please use one of the following names:\n - ${LIST_NAMES.join("\n - ")}.`);
    return process.exit(1);
}

// Show output
if (CROSS_LIST) {
    console.log(`Comparing ${SOURCE_LIST} with ${TARGET_LIST}.`);
}

// Get the selected lists
const SELECTED_LISTS = SELECTED_LIST ? [SELECTED_LIST] : LIST_NAMES;

// This is the compared cache: we won't compare two urls which were compared already
let __compared = {};

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
function comparedAlready (a, b) {
    if (__compared[a + "->" + b] || __compared[b + "->" + a]) {
        return true;
    }
    __compared[a + "->" + b] = true;
    return false;
}

// Start comparing
oneByOne(bindy(CROSS_LIST ? [{ source: SOURCE_LIST, target: TARGET_LIST }] : SELECTED_LISTS, function (currentName, next) {

    // Prepare the source list and the target list
    let sourceList = {};
    let targetList = {};

    /**
     * getListInfo
     *
     * @name getListInfo
     * @function
     * @param {String} name The list name.
     * @returns {Object} An object containing:
     *  - markerFiles: currentList
     *  - urls: urls
     *  - contents: contents
     */
    function getListInfo (name) {

        // Take the current list markers
        let currentList = ALL_MARKERS[name].markers;

        // Get the urls
        let urls = Object.keys(currentList);

        // Normalize the urls
        let contents = urls.map(function (c) {

            // Split by the domain
            let splits = c.replace("|||.json", "").split("herokuapp.com");

            // Add the herokuapp.com domain back
            splits[0] += "herokuapp.com";

            // Replace ||| with /
            splits[1] = splits[1] || "";
            splits[1] = splits[1].replace(/\|\|\|/g, "/");

            // Get the path
            let path = currentList[c].path;

            // Prepare to save here the json data
            let json = [];

            // Read the JSON file
            try {
                json = readJson(path);
            } catch (e) {
                console.error(path);
                console.log(e.message);
            }

            // Return the content
            return {
                url: splits.join(""),
                content: json
            }
        });

        return {
            markerFiles: currentList
          , urls: urls
          , contents: contents
        };
    }

    // If we have an object, that means we have a comparison between two lists
    if (typeof currentName === "object") {
        // Get the source list
        sourceList = getListInfo(currentName.source);
        // Get the target list
        targetList = getListInfo(currentName.target);
    } else {
        // Get the source and target lists (they will be identical)
        sourceList = targetList = getListInfo(currentName);
    }

    // Create an array of distances
    let distances = [];

    // Iterate the source markers
    sourceList.contents.forEach(cSource => {

        // Iterate the target markers
        targetList.contents.forEach(cTarget => {

            // If already compared, we don't have to compute the distances
            if (comparedAlready(cSource.url, cTarget.url)) {
                return;
            }

            let sum = 0;
            let count = 0;

            // Create the source and target average coordinates
            let sPoint = {
                lat: 0,
                lng: 0
            };
            let tPoint = {
                lat: 0,
                lng: 0
            };

            // Sum the lat and lng values
            cTarget.content.forEach(cTargetMarker => {
                tPoint.lat += cTargetMarker.lat;
                tPoint.lng += cTargetMarker.lng;
            });

            // Compute the distances
            cSource.content.forEach(cSourceMarker => {
                sPoint.lat += cSourceMarker.lat;
                sPoint.lng += cSourceMarker.lng;
                cTarget.content.forEach(cTargetMarker => {
                    sum += getDistanceFromLatLonInKm(cSourceMarker.lat, cSourceMarker.lng, cTargetMarker.lat, cTargetMarker.lng);
                    count++;
                });
            });

            // Get the average coordinates
            sPoint.lat /= cSource.content.length;
            sPoint.lng /= cSource.content.length;
            tPoint.lat /= cTarget.content.length;
            tPoint.lng /= cTarget.content.length;

            // Get the average distance
            let average = sum / count;

            // Push the new distance object
            distances.push({
                urls: [cSource.url, cTarget.url],
                source: cSource,
                target: cTarget,
                distance: average,
                average_distance: getDistanceFromLatLonInKm(sPoint.lat, sPoint.lng, tPoint.lat, tPoint.lng)
            });
        });
    });

    next(null, {
        listName: CROSS_LIST ? [currentName.source, currentName.target].join("->") : currentName
      , results: distances
    });
}), function (err, data) {

    // Prepare the table headers
    let headers = [
        "First url"
      , "Second url"
      , "Average Distance (km, all points)"
      , "Distance (km, average coordinates)"
    ];

    // Get the json data we want to convert into Markdown
    let jsonToConvert = data.map(currentList => {
        return {
            listName: currentList.listName
          , data: [
                { h2: currentList.listName },
                { h3: "Markers" },
                {
                    table: {
                        headers: headers,
                        rows: getRows(currentList.results)
                    }
                },
            ]
        };
    });

    /**
     * getRows
     * Get the table rows.
     *
     * @name getRows
     * @function
     * @param {Array} input The distances array.
     * @returns {Array} The table rows.
     */
    function getRows(input) {
        return input.map(c => [
            getUsernameLink(c.urls[0]),
            getUsernameLink(c.urls[1]),
            c.distance,
            c.average_distance
        ]);
    }

    // Create the output files
    jsonToConvert.forEach(c => {
        const DIR_RESULTS = `${PATH_RESULTS}/${c.listName}`;
        const DIR_JSON = `${DIR_RESULTS}/json`;
        mkdirp.sync(DIR_RESULTS);
        mkdirp.sync(DIR_JSON);
        wJson(`${DIR_JSON}/markers.json`, jsonToConvert);
        fs.writeFileSync(`${DIR_RESULTS}/MARKERS.md`, json2md(c.data));
        console.log(`Saved data in ${DIR_RESULTS}`);
    });
});
