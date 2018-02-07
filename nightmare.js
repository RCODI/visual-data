"use strict";

// Dependencies
const Nightmare = require('nightmare')
    , parseUrl = require("parse-url")
    , oneByOne = require("one-by-one")
    , sameTimeLimit = require("same-time-limit")
    , bindy = require("bindy")
    , Path = require("path")
    , mkdirp = require("mkdirp")
    , readJson = require("r-json")
    , writeJson = require("w-json")
    , isThere = require("is-there")
    , idy = require("idy")
    , fs = require("fs")
    , readFile = require("read-utf8")
    , writeFile = fs.writeFileSync
    ;

const PRELOAD_CODE = readFile("nightmare/preload.js");

// Take the source file (it's the path to a JSON file)
// node nightmare lists/BlackIronHack-Phase1.json
//                ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
const SOURCE_FILE = process.argv[2];

// The source file is mandatory, if not provided, show an error
if (SOURCE_FILE === "--dev" || !SOURCE_FILE) {
    console.error("Please provide a source file.");
    console.error(" Usage: node nightmare <source.json> [--dev]");
    return process.exit(1);
}

// Get the URLs list from the source file
const URL_LIST = readJson(SOURCE_FILE);

// Prepare the path where we're going to save the images
// For example, if the source file is lists/BlackIronHack-Phase1.json
// we will save the screenshots in:
//
//  screenshots/BlackIronHack-Phase1/
//      - maps
//      - complete
//      - charts
const SCREENSHOTS_DIR = Path.basename(SOURCE_FILE).slice(0, -5);

// Check if the --dev option was provided
const IS_DEV = !!~process.argv.indexOf("--dev");

// Check if the --no-cache option was provided
const CACHE_ENABLED = !~process.argv.indexOf("--no-cache");

// Build the paths:
//  - In the info directory we will save the markers
const PATH_INFO = `${__dirname}/info/${SCREENSHOTS_DIR}`;
const PATH_MARKERS = `${__dirname}/info/${SCREENSHOTS_DIR}/markers`;

// - In the screenshots directory we will save the screenshots
const PATH_SCREENSHOTS = `${__dirname}/screenshots/${SCREENSHOTS_DIR}`;
const PATH_SCREENSHOTS_MAPS = `${PATH_SCREENSHOTS}/maps`;
const PATH_SCREENSHOTS_CHARTS = `${PATH_SCREENSHOTS}/charts`;
const PATH_SCREENSHOTS_COMPLETE = `${PATH_SCREENSHOTS}/complete`;
const PATH_SCREENSHOTS_SIMPLE = `${PATH_SCREENSHOTS}/simple`;

// This constant sets the maximum number of pages to be loaded in
// parallel in the Nightmare browser (Electron)
//
// If we are running in dev mode, set the max limit to 1.
const MAX_LIMIT = IS_DEV ? 1 : 1;

// Synchronously create the directories
mkdirp.sync(PATH_SCREENSHOTS_MAPS);
mkdirp.sync(PATH_SCREENSHOTS_CHARTS);
mkdirp.sync(PATH_SCREENSHOTS_COMPLETE);
mkdirp.sync(PATH_SCREENSHOTS_SIMPLE);
mkdirp.sync(PATH_MARKERS);

// Use these variables to show the progress
let loadedCount = 0;
let howMany = URL_LIST.length;

// Start taking the screenshots in parallel, with a specific limit
sameTimeLimit(bindy(URL_LIST, (c, next) => {

    // If the url is a string, convert it into an object
    // This will be the common use case
    if (typeof c === "string") {
        c = {
            url: c
        };
    }

    // Show some output
    console.log(`> Loading (${++loadedCount}/${howMany}): ${c.url}`);

    // By default, we identify the chart by the <svg> tag, so we use the `svg` selector
    // In some cases we override this value by providing an object. For instance,
    // if the chart appears in specific images, we can do:
    //
    //   { url: ..., chart: ["svg", "img.chart-image"] }
    c.chart = c.chart || "svg";
    if (Array.isArray(c.chart)) {
        c.chart = c.chart.join(",");
    }

    // Similar to the chart case, allow setting a custom map selector
    c.map = c.map || ".gm-style";

    var id = idy();
    var preloadPath = `${__dirname}/tmp/${id}.js`;
    var jqueryPath = require.resolve("jquery");
    let preloadCode = PRELOAD_CODE;
    var customCode = "";
    if (c.js) {
        customCode = readFile(c.js) + "\n\n";
    }
    var docLoadCode = `
        (function () {
            // After the page is loaded, load jQuery for convenience
            document.addEventListener("DOMContentLoaded", function () {
                var script = document.createElement("SCRIPT");
                script.type = 'text/javascript';
                script.src = "file://${jqueryPath}";
                script.onload = function () {
                    ${customCode}
                    __proxy.jqueryLoaded();
                };
                if (typeof $ === "function") { script.onload(); }
                document.getElementsByTagName("head")[0].appendChild(script);
            });
        })();
    `;

    preloadCode = docLoadCode + preloadCode;

    writeFile(preloadPath, preloadCode);

    // Create the nightmare options
    var nightmareOptions = {
        waitTimeout: 3 * 60 * 1000,
        switches: {
            "disable-http-cache": true,
        },
        webPreferences: {
            preload: preloadPath,
            webSecurity: false
        }
    };

    // If we are in the dev mode, open the developer tools and
    // show the Electron window.
    if (IS_DEV) {
        nightmareOptions.openDevTools = {
            mode: 'detach'
        };
        nightmareOptions.show = true;
    }

    // Define the ensureLoad action which ensures that the map was loaded
    // and the marker was clicked.
    Nightmare.action('ensureLoad', function(done) {

        // Get the current instance of Nightmare
        var self = this;

        // Do not try more than 7 times
        var attempt = 1;
        var maxAttempts = 7;

        // If the attempt takes more than 5 seconds, timeout it
        var timeout = setTimeout(() => {
            done(null, true);
        }, 5000);

        function doEval() {
            // If the attempt takes more than 5 seconds, timeout it
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                done(null, true);
            }, 5000);

            // Show some output
            console.log("Checking load: (" + attempt + "/" + maxAttempts + ")");

            // Evaluate the script
            //
            //  - if jQuery is not loaded yet on the page, always return false, then
            //  - check the `__mapMarkerClicked` variable
            self.evaluate_now(function() {
                if (typeof window.jQuery !== "function") {
                    return false;
                }
                return window.__mapMarkerClicked;
            }, function(err, result) {

                // Check the results
                console.log("Result", result);
                clearTimeout(timeout);

                // If we have the markers loaded and clicked, stop here
                if (result === true) {
                    done(null, true);
                } else {
                    // Otherwise, try again if the attempt is not yet 7
                    if (++attempt < 7) {
                        setTimeout(doEval, 5000);
                    } else {
                        done(null, true);
                    }
                }
            });
        }

        // Run the check
        doEval();

        // Return the Nightmare instance
        return this;
    });

    Nightmare.action('whiteBg', function (done) {
        this.evaluate_now(function() {
            try {
                $("body,html").css({
                    background: "white"
                });
            } catch (e) {}
        }, done);
    });

    Nightmare.action('ensureCustomJs', done => {

        // Get the current instance of Nightmare
        var self = this;

        // Do not try more than 7 times
        var attempt = 1;
        var maxAttempts = 7;

        // If the attempt takes more than 5 seconds, timeout it
        var timeout = setTimeout(() => {
            done(null, true);
        }, 5000);

        function doEval() {
            // If the attempt takes more than 5 seconds, timeout it
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                done(null, true);
            }, 15000);

            // Show some output
            console.log("Checking js exec: (" + attempt + "/" + maxAttempts + ")");

            // Evaluate the script
            //
            //  - if jQuery is not loaded yet on the page, always return false, then
            //  - check the `__mapMarkerClicked` variable
            self.evaluate_now(function() {
                return window.__customJSExecuted;
            }, function(err, result) {

                // Check the results
                console.log("Result", result);
                clearTimeout(timeout);

                // If we have the markers loaded and clicked, stop here
                if (result === true) {
                    done(null, true);
                } else {
                    // Otherwise, try again if the attempt is not yet 7
                    if (++attempt < 7) {
                        setTimeout(doEval, 5000);
                    } else {
                        done(null, true);
                    }
                }
            });
        }

        // Run the check
        doEval();

        // Return the Nightmare instance
        return this;
    });

    // `hideSelector` hides the selector
    Nightmare.action('hideSelector', function(selector, done) {
        var self = this;

        // Evaluate the script which uses jQuery to hide the elements
        self.evaluate_now(function(selector) {

            // Map selector
            var $map = $(selector[0]);
            if (selector[0] === ".gm-style") {
                $map = $map.parent();
            }
            $map.css("opacity", 0);

            // Chart selector
            $(selector[1]).css("opacity", 0)
        }, function(err, result) {
            if (err) {
                console.log("Failed to show the map: ", err)
                return done(err);
            }
            done();
        }, selector);

        // Return the nightmare instance
        return this;
    });

    // `hideEverythingExcept` action will hide all the elements on the page,
    // except the parents of the selected element and its descendants
    Nightmare.action('hideEverythingExcept', function(selector, index, done) {

        // Take the current Nightmare instance
        var self = this;

        if (typeof index === "function") {
            done = index;
            index = null;
        }

        // Evaluate the script which uses jQuery to hide the elements
        self.evaluate_now(function(selector, eq) {
            $("head").append($("<style>", { html: "body { background-color: #fff; }" }));

	    var bgColor = window
			    .getComputedStyle(document.body)
			    .getPropertyValue("background-color")
                            ;

	    if (!bgColor || bgColor === "rgba(0, 0, 0, 0)") {
		document.body.style.backgroundColor = "#fff";
	    }

            var $elm = $(selector);

            if (typeof eq === "number") {
                $elm = $elm.eq(eq);
            }

            var $elementsToShow = $elm.add($elm.parents()).add($elm.find("*"));
            $("*").not($elementsToShow).hide()
        }, function(err, result) {
            if (err) {
                console.log("Failed to show the map: ", err)
                return done(err);
            }
            done();
        }, selector, index);

        // Return the nightmare instance
        return this;
    });

    // The `saveMarkers` action saves the markers in the JSON file
    Nightmare.action('saveMarkers', function(filePath, done) {

        // Take the current Nightmare instance
        var self = this;

        // Call the getMarkers() method from the client side
        self.evaluate_now(function() {
            return __proxy.getMarkers();
        }, function(err, result) {
            result = result || [];
            if (err) { console.error(err); }

            // Then write in the result file the JSON array.
            writeJson(filePath, result, done);
        });

        // Return the nightmare instance
        return this;
    });

    // Count how many elements are matched by a selector
    Nightmare.action('selectorCount', function(selector, done) {
        var self = this;

        self.evaluate_now(function(selector) {
            return $(selector).length;
        }, function(err, result) {
            done(null, result || 0);
        }, selector);

        // Return the nightmare instance
        return this;
    });


    /**
     * startNightmare
     * Starts a new Nightmare instance with the current url.
     *
     * @name startNightmare
     * @function
     * @returns {Nightmare} The Nightmare instance.
     */
    function startNightmare() {
        var newNightmare = new Nightmare(nightmareOptions)
                              .viewport(1350, 2500)
                              .goto(c.url)
                              .ensureLoad()
                              ;

        if (c.js) {
            newNightmare = newNightmare.ensureCustomJs();
        }

        return newNightmare;
    }


    /**
     * getName
     * Creates the image filename (without extension), being unique for
     * the current url.
     * It uses the domain and path.
     *
     * @name getName
     * @function
     * @returns {String} The name to be used in the image filenames.
     */
    function getName () {
        var parsedUrl = parseUrl(c.url);
        return parsedUrl.resource + parsedUrl.pathname.replace(/\//g, "|||");
    }

    /**
     * saveMap
     * Saves the map in the file.
     *
     * @name saveMap
     * @function
     * @param {Function} cb The callback function.
     * @returns {Nightmare} The Nightmare instance.
     */
    function saveMap (cb) {

        // Show output
        console.log("    * Saving the map");

        // Prepare the image path.
        var imgPath = `${PATH_SCREENSHOTS_MAPS}/${getName()}.png`;

        // If the cache is enabled and the image is already
        // there, don't even start the Nightmare process.
        if (CACHE_ENABLED && isThere(imgPath)) {
            return cb();
        }

        startNightmare()
          .screenshot(`${PATH_SCREENSHOTS_COMPLETE}/${getName()}.png`)
          .saveMarkers(`${PATH_MARKERS}/${getName()}.json`)
          .selectorCount(c.map)
          .end()
          .then(result => {
              if (result === 0) {
                  console.log(`No map detected on ${c.url}`);
                  return cb();
              }

              startNightmare()
                .hideEverythingExcept(c.map)
                .whiteBg()
                .screenshot(imgPath)
                .end()
                .then(result => {
                  console.log(result)
                  cb();
                })
                .catch(error => {
                  console.error('Map failed:', error);
                  cb();
                });
          })
          .catch(error => {
            console.error('Map failed:', error);
            cb();
          });
    }

    function savePageOnly (cb) {

        // Show output
        console.log("    * Saving the page without maps and charts");

        // Prepare the image path.
        var imgPath = `${PATH_SCREENSHOTS_SIMPLE}/${getName()}.png`;

        // If the cache is enabled and the image is already
        // there, don't even start the Nightmare process.
        if (CACHE_ENABLED && isThere(imgPath)) {
            return cb();
        }

        // Save the map and the markers
        return startNightmare()
          .hideSelector([c.map, c.chart])
          .screenshot(imgPath)
          .end()
          .then(result => {
            console.log(result)
            cb();
          })
          .catch(error => {
            console.error('Map failed:', error);
            cb();
          });
    }

    /**
     * saveChart
     * Saves the charts in the output files.
     *
     * @name saveChart
     * @function
     * @param {Function} cb The callback function.
     * @returns {Nightmare} The Nightmare instance.
     */
    function saveChart (cb) {

        // Show output
        console.log("    * Saving the chart");

        startNightmare()
          .selectorCount(c.chart)
          .end()
          .then(result => {
              let tasks = [];

              console.log(`Found ${result} charts on the page.`);

              for (let i = 0; i < result; ++i) {
                  tasks.push(next => {
                      console.log(`Saving chart with index: ${i}`);

                      // Prepare the image path.
                      let imgPath = `${PATH_SCREENSHOTS_CHARTS}/${getName()}#${i + 1}.png`;

                      // Save the chart
                      startNightmare()
                        .hideEverythingExcept(c.chart, i)
                        .whiteBg()
                        .screenshot(imgPath)
                        .end()
                        .then(result => {
                            console.log(this);
                            console.log(result)
                            next();
                        })
                        .catch(error => {
                            console.error('Chart failed:', error);
                            next();
                        });
                  });
              }

              oneByOne(tasks, cb);
          })
          .catch(error => {
            console.error('Chart failed:', error);
            cb();
          });
    }

    // Set a timeout of 60 seconds after which we will always
    // go to the next page
    //
    // Using this `called` flag, we can know if the function was already called or not.
    var called = false;

    let _next = () => {
        // Then, go to the next url
        if (called) { return; }
        called = true;
        next();
    };

    // Set the timeout
    let waitTimeout = setTimeout(function() {
        // Show the timeout output
        console.log("> Timeout.");
        _next();
    }, 2 * 60 * 1000);

    //// First, save the map
    saveMap(() => {
        savePageOnly(() => {
            // Then, save the chart
            saveChart(() => {
                _next();
            });
        });
    });
}), MAX_LIMIT, () => {

    // When all the screenshots were saved, stop the process...
    console.log("Done.");

    // ...after one second
    setTimeout(() => {
        process.exit();
    }, 1000);
});
