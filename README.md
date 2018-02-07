# Image Similarity

Get the image similarities between websites.

## Notes

You'll have to use the `Terminal` application to run the commands.

Open the terminal, by pressing <kbd>Cmd</kbd> + <kbd>Space</kbd>. Then, write `Terminal` and press <kbd>Enter</kbd>.

## Mandatory Software

 - Compile and install OpenCV 2.4.13.

   ```
   mkdir build
   cd build
   cmake -G "Unix Makefiles" ..
   make -j8
   sudo make install
   ```

 - Download and install Node.js
 - Make sure you have installed `git`

## Installation

```sh
# Clone the repository
git clone https://github.com/RCODI/visual-data.git

# Enter in the downloaded directory
cd visual-similarity-ssim

# Install the dependencies (run once)
npm install
```

## Usage

Follow the steps below.

### 1. Download the screenshots

This script will download the screenshots from the input JSON files.

```sh
node nightmare lists/BlackIronHack-Phase1.json
node nightmare lists/BlackIronHack-Phase2.json
node nightmare lists/BlackIronHack-Phase3.json
node nightmare lists/BlackIronHack-Phase4.json

# ...and so on for GoldIronHack and GreenIronHack
```

A more convenient way would be to run the `download-screenshots.sh` script to download the screenshots from *all* the lists:

```sh
sh download-screenshots.sh
```

### 2. Remove the white areas

Some images may have big white areas, therefore we want to remove them. You can do it by running this script:

```sh
node remove-white-areas
```

### 3. Generate the Canny Edge Borders images

This will generate the screenshots without colors, storing them in the `nocolor-screenshots` folder.

```sh
node create-edge-borders
```

### 4. Get the results

To compare the screenshots with the colors:

```sh
node compare BlackIronhack-Phase4
```

To compare the screenshots without colors:

```sh
node compare BlackIronhack-Phase4 --no-colors
```

To compare two lists, do:

```sh
node compare BlackIronhack-Phase3 BlackIronhack-Phase4
```

A convenient way is to run the `compare-all.sh` script to compare all the screenshots:

```sh
sh compare-all.sh
```

### 5. Push the changes (optional) :octocat:

Push on GitHub (where we're going to see the nicely formatted tables):

```sh
git add .
git commit -m 'Update results.'
git push
```

### 6. Check the results

The results will appear in the [`results`](https://github.com/jialincheoh/visual-similarity-ssim/tree/master/results) directory.

### 7. Generate the CSV files

Run:

```sh
node generate-csv
```

### 8. Generate the PDF files

Install `electron-pdf`:

```sh
npm i -g electron-pdf
```

Then, use the `to-pdf.sh` script:

```sh
. to-pdf.sh
```

## Examples

```sh
node nightmare lists/BlackIronHack-Phase4.json

## Optionally, use the --dev option to open the developer tools
node nightmare lists/GreenIronHack-Phase1.json --dev

# Create Canny edge images
node create-edge-borders.js

# Run the compare script which generates the results
node compare BlackIronHack-Phase4
node compare BlackIronHack-Phase4 BlackIronHack-Phase3

# Without colors
node compare BlackIronHack-Phase4 BlackIronHack-Phase3 --no-colors
node compare BlackIronHack-Phase4 --no-colors

node compare BlackIronHack-Phase4
```

Then check the `results` directory.

## How it works?

The code is powered by the Node.js platform and the `npm` package manager (where we download the dependencies from).

### Why Node.js & JavaScript?

These days, with JavaScript we can build pretty much anything: amazing applications in the browser (desktop and mobile), native applications for iOS and Android devices. With the power of Node.js we can handle the server side with JavaScript, and also creating command line applications.

Its flexibility allows us to easily build applications, in our case small scripts––we can call them robots––which will simulate the human behavior on different pages.

Another reason is that we can write the same piece of code that will be executed on the server and client, building izomorphic modules (literaly the same code running on server and client). In our case, most of the websites are powered by JavaScript, so that makes it even easier to work with.

#### Dependencies

##### [`bindy`](https://npmjs.com/bindy)
Combined with `one-by-one` and `same-time` it makes it easier to create flow behaviors by passing an array of elements.

##### [`daty`](https://npmjs.com/daty)
Work with Date objects.

##### [`cli-table`](https://npmjs.com/cli-table)
Creates tables in the command line interface. Used in the test files.

##### [`fast-csv`](https://npmjs.com/fast-csv)
Generates the CSV files.

##### [`fs-file-tree`](https://npmjs.com/fs-file-tree)
Reads the directories and the files and creates an object easy to work with.

##### [`idy`](https://npmjs.com/idy)
This generates random ids.

##### [`image-parser`](https://npmjs.com/image-parser)
Parses the image files into a programmatic format, JavaScript friendly.

##### [`img-ssim`](https://npmjs.com/img-ssim)
Used to get the SSIM similarity values between two images.

##### [`is-there`](https://npmjs.com/is-there)
Used to check if a directory or a file exists or not on the hard disk.

##### [`iterate-object`](https://npmjs.com/iterate-object)
Iterates the keys and values in a specified object.

##### [`jquery`](https://npmjs.com/jquery)
Enables a friendly syntax to select DOM elements from the page. We inject `jQuery` in the `nightmare` pages to hide all the elements except one.

##### [`json2md`](https://npmjs.com/json2md)
Converts JSON code into MarkDown.

##### [`mkdirp`](https://npmjs.com/mkdirp)
Creates directories.

##### [`nightmare`](https://npmjs.com/nightmare)
Used to load the pages, using Electron in the background.

##### [`one-by-one`](https://npmjs.com/one-by-one)
Runs tasks (functions), one after another (when one is finished, the next one is called).

##### [`opencv`](https://npmjs.com/opencv)
Used to generate Canny Edge Borders images and get the Feature Matching similarities.

##### [`parse-url`](https://npmjs.com/parse-url)
We parse the urls so we can use the friendly domain names in the file names.

##### [`r-json`](https://npmjs.com/r-json)
Reads JSON files (outputs the JavaScript objects in scripts).

##### [`read-utf8`](https://npmjs.com/read-utf8)
Read text files from the hard disk.

##### [`same-time`](https://npmjs.com/same-time)
Runs tasks (functions), in parallel (they start in the same moment, but since they finishes in different moments of time, the `same-time` module will catch these events and will call another function when all the tasks are complete).

##### [`same-time-limit`](https://npmjs.com/same-time-limit)
Runs tasks (functions), in parallel, but with a sepcific limit (not more than `<x>` in parallel).

##### [`streamp`](https://npmjs.com/streamp)
Creates readable and writable streams after making sure that the directory structure.

##### [`w-json`](https://npmjs.com/w-json)
Write JSON files (outputs the JavaScript objects into files).

----

The are several scripts doing different tasks: downloading images, removing the white areas, creating Canny edge images, comparing markers, comparing images etc etc.

### `nightmare.js`

It creates screenshots of the pages, after clicking on a potential Google Maps marker (if it exists).
The script requires a mandatory JSON file as input (second argument) containing the list of urls to screenshot.

To run the script you have to:

```sh
node nightmare list.json
```

This will load in the background each URL in the Electron browser (powered by Chromium--the open-source version of Google Chrome) using the Nightmare module. After loading the page, it will intercept the `addListener` method from the Google Maps markers and will start collecting the markers when they are adding the click listeners.

This way, we can simulate the human behavior on the page, by triggering the click on the first marker. This will make the chart visible on the page.

Then the script will save the screenshots:

 - the complete page
 - the map
 - the charts (split in different images)
 - the simple pages (without maps and charts)

The screenshots are saved in the `screenshots` directory under the following structure:

```
-+ screenshots
   + <list-name>
     + maps
     + charts
     + complete
     + simple
```

The screenshots are taken by loading the urls in parallel instances of Nightmare (that means multiple Electron processes in the background) to provide an as fast as possible result. 20 pages are loaded in parallel.
After all the pages are loaded and the screenshots are taken, the script finishes its task and closes the process.

:bulb: **Pro Tip**: For debugging we can use the `--dev` option to open the Electron browser in the GUI (graphical user interface) and also the Developer Tools:

```sh
node nightmare list.json --dev
```

By default the screenshots are cached: if the screenshot already exists, the script will skip that url to be loaded.
We can turn this off by running the script using the `--no-cache` option:

```sh
node nightmare list.json --no-cache
```

Before saving the map screenshot, we check if there is a map on the page. If there is no map, we don't save it (no image will be created in that case).
Something similar happens in case of charts: the chart is not saved if there is no chart available. In case there are more charts on the page, the script screenshots each individual chart into a different image.

This is done in two steps:

 1. Check how many charts we have on the page

    We send the chart selector to the Electron browser and run on the page a piece of JavaScript code which tells us how many charts are in there:

    ```js
    // For example, this will give us the count of <svg> elements on the page
    // (supposing they are charts)
    $("svg").length
    ```

    By using `$(selector).length` we can find how many elements are on the page, matched by a specific selector.

    The charts count is sent back to the main nightmare process.

 2. After knowing how many charts we have on the page, the script will hide all the other elements except the current chart to screenshot (by the index of the element).

The chart index appears in the file name of the screenshot.

---

#### Markers

The script also saves the positions of the markers in the `info/<list-name>/markers` directory by calling a function inject in the page: `getMarkers`.
This function returns back a list of markers in this format:


```js
[
    { "lat": ..., "lng": ... }
]
```

### `create-edge-borders.js`

This script generates the `nocolor-screenshots` directory containing the same images like the `screenshots` directory, but without colors, specifically using the Canny Edge Borders algorithm from OpenCV.

```sh
node create-edge-borders.js
```

The `nocolor-screenshots` directory will have the same structure like the `screenshots` folder.

### `compare-markers.js`

This script compares the markers by using two different algorithms:

 1. The average of the distances between each marker and all the others (from other pages), and

    Example:

    ```
    This happens when both pages have the same number of markers.

    A                              B
    ========                       ========
    Marker 1                       Marker X
    Marker 2                       Marker Y
    Marker 3                       Marker Z

    1 -> X = 1X < The distance between 1 and X
    1 -> Y = 1Y < The distance between 1 and Y
    1 -> Z = 1Z ...

    2 -> X = 2X
    2 -> Y = 2Y
    2 -> Z = 2Z

    3 -> X = 3X
    3 -> Y = 3Y
    3 -> Z = 3Z
             ====
             1X + 1Y + 1Z
           + 2X + 2Y + 2Z
           + 3X + 3Y + 3Z = total

    The final result: total / (number of distances: 9)
                      total / 9
                      average of distances

             * * *

    This happens when both pages have different numbers of markers.

    A                              B
    ========                       ========
    Marker 1                       Marker X
    Marker 2                       Marker Y
    Marker 3

    1 -> X = 1X < The distance between 1 and X
    1 -> Y = 1Y < The distance between 1 and Y

    2 -> X = 2X
    2 -> Y = 2Y

    3 -> X = 3X
    3 -> Y = 3Y
             ====
             1X + 1Y
           + 2X + 2Y
           + 3X + 3Y = total

    The final result: total / (number of distances: 6) <<<< This can be computed by multiplying
                      total / 6                           | the number of markers from the first
                      average of distances                | page with the number of markers from
                                                          | the second page (2 x 3 => 6)
    ```

 2. The distance between the average coordinates of the markers.

    Example:

    ```
    A                              B
    ========                       ========
    Marker 1 (lat, lng)            Marker X (lat, lng)
    Marker 2 (lat, lng)            Marker Y (lat, lng)
    Marker 3 (lat, lng)            Marker Z (lat, lng)
    Marker 4 (lat, lng)
    Marker 5 (lat, lng)
    Marker 6 (lat, lng)

    ---------------------------------------- < Average coordinates
    * = (                          # = (
        average(lat)                   average(lat)
        average(lng)                   average(lng)
    )                              )


    Map A:                         Map B:

                        Final value (distance)
                    ______________________
                   |                      |
    +--------------|----+          +------|------------+
    | 1            V 5   |         |  X   #  Z         |
    |              *    |          |                   |
    | 6               4 |          |      Y            |
    |              3    |          |                   |
    |                   |          |                   |
    |                 2 |          |                   |
    +-------------------+          +-------------------+

    Average A   <--- Distance ---> Average B

    The final result: the distance between the average
    coordinate of point from page A (*) and from page B (#)

             ,__                                                  _,
     \~\|  ~~---___              ,                          | \
      | Wash./ |   ~~~~~~~|~~~~~| ~~---,                VT_/,ME>
     /~-_--__| |  Montana |N Dak\ Minn/ ~\~~/Mich.     /~| ||,'
     |Oregon /  \         |------|   { WI / /~)     __-NY',|_\,NH
    /       |Ida.|~~~~~~~~|S Dak.\    \   | | '~\  |_____,|~,-'Mass.
    |~~--__ |    | Wyoming|____  |~~~~~|--| |__ /_-'Penn.{,~Conn (RI)
    |   |  ~~~|~~|        |    ~~\ Iowa/  `-' |`~ |~_____{/NJ
    |   |     |  '---------, Nebr.\----| IL|IN|OH,' ~/~\,|`MD (DE)
    ',  \ Nev.|Utah| Colo. |~~~~~~~|    \  | ,'~~\WV/ VA | Y <--------------+
    X|Cal\    |    |       | Kansas| MO  \_-~ KY /`~___--\                  |
    ^',   \  ,-----|-------+-------'_____/__----~~/N Car./                  |
    | '_   '\|     |      |~~~|Okla.|    | Tenn._/-,~~-,/                   |
    |   \    |Ariz.| New  |   |_    |Ark./~~|~~\    \,/S Car.               |
    |    ~~~-'     | Mex. |     `~~~\___|MS |AL | GA /                      |
    |        '-,_  | _____|          |  /   | ,-'---~\                      |
    |            `~'~  \    Texas    |LA`--,~~~~-~~,FL\                     |
    |                   \/~\      /~~~`---`         |  \                    |
    |                       \    /                   \  |                   |
    |                        \  |                     '\'                   |
    |                                                                       |
    |                                                                       |
    |                                                                       |
    *                                                                       |
    X (x1, y1): San Francisco                                               |
    Y (x2, y2): Philadelphia *----------------------------------------------+

    Distance between averages:
    ==========================
    M = [(x1 + x2) / 2, (y1 + y2) / 2]

    X (37.766886, -122.439776)
    Y (40.009006, -75.178410)

    M = [(37 + 40) / 2, (-122 + -75) / 2]
    M = [38.5, -98.5]

    Average of distances:
    =======================
    Chicago -> SF => 2000 M
    Chicago -> PH => 759 M
    ---------------------
    Average: 1.3k M
    ```

Executed without any arguments, it will generate the `./results/<list-name>/MARKERS.md`.

To compare the markers across two lists, simply pass two arguments:

```sh
node compare-markers List1 List2
```

### `remove-white-areas.js`

Since we screenshot big pages, sometimes big white areas will appear, because of the page design. To prevent the white areas to affect our statistics, we decided to crop the images using an algorithm which detects the white areas.

The algorithm scans each image and removes potential transparent/white areas from the margins:

 - from the top to the bottom
 - from the bottom to the top
 - from the left to right, and
 - from the right to the left

### `compare.js`

This uses the SSIM and Feature Matching algorithms to find the similarities between the images inside of the same list. It uses the `screenshots/<list-name>` directory, generating `results/<list-name>RESULTS.md`, but by adding the `--no-colors` options, we can generate the results for `nocolor-screenshots` directory (generating `results/<list-name>/NO_COLOR_RESULTS.md`).

This compares each image with all the others, inside of the same directory (for example, it doesn't compare the maps from one list with the maps from another list or a map with a chart).

You can run it like this:

```sh
# Use the screenshots directory
node compare <list-name>

# Use the nocolor-screenshots directory
node compare <list-name> --no-colors

# Compare two lists
node compare <list1> <list2> [--no-colors]
```

It supports comparing two different lists by passing two list names. In that case, we will see in the `results` folder a directory called `<list1>→<list2>`

### How do intercept the markers?

Because Google APIs do not give us access to the map or markers in a friendly way, way need to *override* specific functions from the Google APIs library, redirecting all the calls to these functions through our code. To do that, we should be fast enough to catch the moment when the Google Maps library is loaded on the page, but *before* rendering the maps in the page.

To catch the load event of the Google Maps, we reverse-engineered the library code to find out how they define the public variables on the page. We were lucky because they set a global variable in the `window` object.

We opened the Google Maps library file in the browser and looked at the beautified code (which by default is minified, therefore not human understandable).

We opened the `https://maps.googleapis.com/maps/api/js?key=<key>` url and, beatified the code, and looked where the `google` global variable is defined in the `window` object. By searching for `window.google = ` we found this:

```js
window.google = window.google || {};
google.maps = google.maps || {};
```

**Note** :joy:: The `window` object stores the global variables. Since the `window` object *is* a global variable, there is a reference in the `window` object to itself. That means we can access `window.window` and `window.window.window.window...`.

It's clear that this is setting a global variable, therefore we can intercept it and see when it's actually set.


````
Timeline:
       Google Loaded                       Add the markers
|------------|*---------|-------------------------|---->
Page          ^      Init the map
load          |
started       |
              |
              \ This is the moment of time we
                are interested in: after Google
                Maps library was loaded, but
                before rendering the maps and the
                markers.
````

Using a small trick—specifically using the `Object.defineProperty` method—we can see when this variable is defined, and call a custom function which overrides the functions:

```js
// Catch the google event
var ___google = null;

// Define the "google" property
Object.defineProperty(window, "google", {
  set: function (google) {
    ___google = google;
    // Asynchronously call the `googleLoaded` function
    setTimeout(function() { googleLoaded(); }, 0);
  },
  get: function () {
    return ___google;
  }
});
```

Then, we override the `addListener` methods: in the `prototype` of the `Marker` class and also in the `google.maps.event.addListener`. This way we can run a piece of custom stuff, such as adding the marker objects into a list.

Here is the specific code snippet that does that.

```js
// Save in two variables the original methods
// We're going to call them later
var oldAddEventListener = google.maps.event.addListener;
var oldAddEventListenerProto = google.maps.Marker.prototype.addListener;

// Click the first marker after one second after the
// last marker was added
function prepareToClickMarker() {
    clearTimeout(timeout);
    timeout = setTimeout(function() {
        setTimeout(function() {
            window.__mapMarkerClicked = true;
        }, 10);
        new google.maps.event.trigger(_markers[0], 'click')
    }, 1000);
}

// Here we're going to store all the markers
// And then click on the first of them
var _markers = [];

//// Override the addListener (google.maps)
google.maps.Marker.prototype.addListener = function () {
    _markers.push(this);
    prepareToClickMarker();
    return oldAddEventListenerProto.apply(this, arguments);
};

var timeout = null;
// Some of the urls use the addListener on
// the google.maps.event object, so we should override it as well
google.maps.event.addListener  = function (marker, ev) {
    if (marker.setIcon && ev === "click") {
        _markers.push(marker);
        prepareToClickMarker();
    }
    return oldAddEventListener.apply(google.maps.event, arguments);
};
```
Using the `trigger` method we call the click handler programatically:

```js
new google.maps.event.trigger(_markers[0], 'click')
```

Then, after 10 milliseconds, we tell the nightmare script that we clicked on the marker:

```js
setTimeout(function() {
   window.__mapMarkerClicked = true;
}, 10);
```

### Taking the screenshots

Using the `nightmare` module, we can screenshot the page using the `screenshot` method.

We make these screenshots:

 - the complete page
 - the map
 - the charts
 - the simple pages (no maps and no charts)

Since the Nightmare module does *not* allow us to screenshot a specific element, we had to build that. By looking in the Google Maps code we found out they add the `gm-style` class on the map element. By hidding,  all the elements, except the `.gm-style` elements, we get only the maps on the page, and then make the screenshot.

In an analog way, we do it for the charts: we hide everything except the `svg` elements.

This is the specific code which extends Nightmare with this method:

```js
// This extends Nightmare with a new method which makes all the
// elements selected by a specific jQuery selector visible on the page
Nightmare.action('hideEverythingExcept', function(selector, done) {
    var self = this;

    // Run a script in the page
    self.evaluate_now(function(selector) {
        // Make the background white by default,
        // so we don't get transparent screenshots
        $("head").append($("<style>", { html: "body { background-color: #fff; }" }));

        // Take the main element(s)
        var $elm = $(selector);

        // Select all the parent and descendant elements, including the main element
        var $elementsToShow = $elm.add($elm.parents()).add($elm.find("*"));

        // Hide everything except the elements to show
        $("*").not($elementsToShow).hide();
    }, function(err, result) {
        if (err) {
            return done(err);
        }
        done();
    }, selector);
    return this;
});
```

Then, to show the map we do:

```js
nightmare.hideEverythingExcept(".gm-style");
```

### Google Maps Markers

#### Client side (`preload.js`)

 - Load the page (intercept the Google APIs): override the `addListener` method
 - Collect the markers
 - Once the marker was clicked, the set a boolean variable on the client as `true`.

#### Nightmare Script (`nightmare.js`)

 - Check every 2s if the any marker was clicked for maximum 10 times.

After 10 tries, it declares there are not any markers on the page.

Then it goes to the next url.

## What is Nighmare?

Nightmare is a module based on Electron.

Electron is a platform which is powered by Chromium and you can manipulate the pages inside of the Electron browser using JavaScript.

Chromium is the open-source version of Google Chrome (Chrome has some components which are proprietary).

PhantomJS is another browser, but it's better to use Electron because it contains the latest features in the browser.

## SSIM Algorithm

The SSIM (Structural Similarity) algorithm gets two images and then it splits both in small areas (squares), and compare the average color of each small area with the one from the other image.

```
Happy Face (Image 1)                       Sad Face (Image 2)
+----------------------------------------+ +----------------------------------------+
|                                        | |                                        |
|              OOOOOOOOOO                | |              OOOOOOOOOO                |
|          OOOOOOOOOOOOOOOOOO            | |          OOOOOOOOOOOOOOOOOO            |
|        OOOOO  OOOOOOOO  OOOOO          | |        OOOOO  OOOOOOOO  OOOOO          |
|      OOOOO      OOOO      OOOOO        | |      OOOOO      OOOO      OOOOO        |
|    OOOOOOO  #   OOOO  #   OOOOOOO      | |    OOOOOOO  #   OOOO  #   OOOOOOO      |
|   OOOOOOOOO    OOOOOO    OOOOOOOOO     | |   OOOOOOOOO    OOOOOO    OOOOOOOOO     |
|  OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO    | |  OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO    |
|  OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO    | |  OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO    |
|  OOOO  OOOOOOOOOOOOOOOOOOOOOO  OOOO    | |  OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO    |
|   OOOO OOOOOOOOOOOOOOOOOOOOOO OOOO     | |   OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO     |
|    OOOO   OOOOOOOOOOOOOOOOOO  OOO      | |    OOOOO                    OOOOO      |
|      OOOO   OOOOOOOOOOOOOO   OOO       | |      OOOOOOOOOOOOOOOOOOOOOOOOOOO       |
|        OOOOO   OOOOOOOO   OOOOO        | |        OOOOOOOOOOOOOOOOOOOOOOOO        |
|          OOOOOO        OOOOOO          | |          OOOOOOOOOOOOOOOOOOOO          |
|              OOOOOOOOOOO               | |              OOOOOOOOOOO               |
|                                        | |                                        |
+----------------------------------------+ +----------------------------------------+
```

For example, the SSIM algorithm will split the both images in 90 squares (10 horizontally, 9 vertically) / image.

```
   1    2    3    4    5    6    7    8    9    10         1    2    3    4    5    6    7    8    9    10
  +----|----|----|----|----|----|----|----|----|----+    +----|----|----|----|----|----|----|----|----|----+
 A|    |    |    |    |    |    |    |    |    |    |    |    |    |    |    |    |    |    |    |    |    |
  |    |    |    |  OO|OOOO|OOOO|    |    |    |    |    |    |    |    |  OO|OOOO|OOOO|    |    |    |    |
  ---------------------------------------------------    ---------------------------------------------------
 B|    |    |  OO|OOOO|OOOO|OOOO|OOOO|    |    |    |    |    |    |  OO|OOOO|OOOO|OOOO|OOOO|    |    |    |
  |    |    |OOOO|O  O|OOOO|OOO | OOO|OO  |    |    |    |    |    |OOOO|O  O|OOOO|OOO | OOO|OO  |    |    |
  ---------------------------------------------------    ---------------------------------------------------
 C|    |  OO|OOO |    | OOO|O   |   O|OOOO|    |    |    |    |  OO|OOO |    | OOO|O   |   O|OOOO|    |    |
  |    |OOOO|OOO | #  | OOO|O  #|   O|OOOO|OO  |    |    |    |OOOO|OOO | #  | OOO|O  #|   O|OOOO|OO  |    |
  ---------------------------------------------------    ---------------------------------------------------
 D|   O|OOOO|OOOO|    |OOOO|OO  |  OO|OOOO|OOO |    |    |   O|OOOO|OOOO|    |OOOO|OO  |  OO|OOOO|OOO |    |
  |  OO|OOOO|OOOO|OOOO|OOOO|OOOO|OOOO|OOOO|OOOO|    |    |  OO|OOOO|OOOO|OOOO|OOOO|OOOO|OOOO|OOOO|OOOO|    |
  ---------------------------------------------------    ---------------------------------------------------
 E|  OO|OOOO|OOOO|OOOO|OOOO|OOOO|OOOO|OOOO|OOOO|    |    |  OO|OOOO|OOOO|OOOO|OOOO|OOOO|OOOO|OOOO|OOOO|    |
  |  OO|OO  |OOOO|OOOO|OOOO|OOOO|OOOO|OO  |OOOO|    |    |  OO|OOOO|OOOO|OOOO|OOOO|OOOO|OOOO|OOOO|OOOO|    |
  ---------------------------------------------------    ---------------------------------------------------
 F|   O|OOO |OOOO|OOOO|OOOO|OOOO|OOOO|OO O|OOO |    |    |   O|OOOO|OOOO|OOOO|OOOO|OOOO|OOOO|OOOO|OOO |    |
  |    |OOOO|   O|OOOO|OOOO|OOOO|OOOO|O  O|OO  |    |    |    |OOOO|O   |    |    |    |    | OOO|OO  |    |
  ---------------------------------------------------    ---------------------------------------------------
 G|    |  OO|OO  | OOO|OOOO|OOOO|OOO |  OO|O   |    |    |    |  OO|OOOO|OOOO|OOOO|OOOO|OOOO|OOOO|O   |    |
  |    |    |OOOO|O   |OOOO|OOOO|   O|OOOO|    |    |    |    |    |OOOO|OOOO|OOOO|OOOO|OOOO|OOOO|    |    |
  ---------------------------------------------------    ---------------------------------------------------
 H|    |    |  OO|OOOO|    |    |OOOO|OO  |    |    |    |    |    |  OO|OOOO|OOOO|OOOO|OOOO|OO  |    |    |
  |    |    |    |  OO|OOOO|OOOO|O   |    |    |    |    |    |    |    |  OO|OOOO|OOOO|O   |    |    |    |
  ---------------------------------------------------    ---------------------------------------------------
 I|    |    |    |    |    |    |    |    |    |    |    |    |    |    |    |    |    |    |    |    |    |
  +----|----|----|----|----|----|----|----|----|----+    +----|----|----|----|----|----|----|----|----|----+
```

Then, it's going to compare each square from the first image with the one having the same coordinates in the second image. For instance, it will start comparing:

 - A1 (from the first image), with the A1 (from the second image). Being both, black, they will be identical: so the score will be pretty high.
 - It will continue with A2, A3, A4, ..., A10, B1, B2, ..., B10, all until now being identical.
 - The first different square is: E2, looking like this:

   ```
   First image  Second image
   +----+       +----+
   |OOOO|       |OOOO|
   |OO  |       |OOOO|
   +----+       +----+
   ```

   Since the algorithm compares the average color, in this case: we have `O` in the second image and *almost* `O` in the first image, but a little bit darker.
   Still, they will be pretty similar, but not identical.

 - Then we have another 5 identical squares (E3-E7).
 - E8 is interpreted in the same way like E2.
 - E9-F1 are identical.
 - F2 has a space, while the second image doesn't. So, they are no identical.
 - F3 is a special case which will be seen identical by the algorithm, but the areas are not the same. That's because the algorithm compares the *average* color. In this case we have:

   ```
   First image  Second image
   +----+       +----+
   |OOOO|       |OOOO|
   |   O|       |O   |
   +----+       +----+
   ```

   The squares are different, but the average color will be the same (because we have the same number of white and black pixels), therefore, the SSIM algorithm will say: they are identical.

 - F4-F8 are not identical. They will low down the final resul of SSIM.
 - F9-G2 are identical.
 - G3, G4, G7 and G8 are different.
 - G5, G6 and G9-H4 are identical.
 - H5 and H6 are different.
 - H7-I10 are identical.

Finally, we should get a high similarity because there are a lot of identical areas (for instance, the top half of the face is identical) and there are just a few very different squares.

In the `img-ssim` module, we extended the SSIM algorithm to accept different sizes. We reorder the images by the width: if the height first image is higher than the second image height, the second one will become the first and the first will be the second.

```
Happy Face (Image 1)                       Sad Face (Image 2)
+----------------------------------------+ +----------------------------------------+
|                                        | |                                        |
|              OOOOOOOOOO                | |              OOOOOOOOOO                |
|          OOOOOOOOOOOOOOOOOO            | |          OOOOOOOOOOOOOOOOOO            |
|        OOOOO  OOOOOOOO  OOOOO          | |        OOOOO  OOOOOOOO  OOOOO          |
|      OOOOO      OOOO      OOOOO        | |      OOOOO      OOOO      OOOOO        |
|    OOOOOOO  #   OOOO  #   OOOOOOO      | |    OOOOOOO  #   OOOO  #   OOOOOOO      |
|   OOOOOOOOO    OOOOOO    OOOOOOOOO     | |   OOOOOOOOO    OOOOOO    OOOOOOOOO     |
|  OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO    | |  OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO    |
|  OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO    | |  OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO    |
|  OOOO  OOOOOOOOOOOOOOOOOOOOOO  OOOO    | |  OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO    |
|   OOOO OOOOOOOOOOOOOOOOOOOOOO OOOO     | |   OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO     |
|    OOOO  OOOOOOOOOOOOOOOOOOO OOOO      | |    OOOOO                    OOOOO      |
|      OOOO   OOOOOOOOOOOOOO   OOO       | |      OOOOOOOOOOOOOOOOOOOOOOOOOOO       |
|        OOOOO   OOOOOOOO   OOOOO        | |        OOOOOOOOOOOOOOOOOOOOOOOO        |
|          OOOOOO        OOOOOO          | |          OOOOOOOOOOOOOOOOOOOO          |
|              OOOOOOOOOOO               | |              OOOOOOOOOOO               |
|  ______           O                    | |                                        |
|  |Stop|           O                    | +----------------------------------------+
|  |____|           O                    |
|     |OOOOOOOOOOOOOOOOOOOOOOOOOOOO      |
|     |             O                    |
|     |             O                    |
|                   O                    |
|                   O                    |
|                  O O                   |
|                 O   O                  |
|                O     O                 |
|                O     O                 |
|                O     O                 |
|                O     O                 |
|                O     O                 |
|              OOO     OOO               |
+----------------------------------------+
```

Then, these two images will be split in the same way:


```
   1   2   3   4   5   6   7   8   9   10  11  12  13  14    1   2   3   4   5   6   7   8   9   10  11  12  13  14
  +---|---|---|---|---|---|---|---|---|---|---|---|---|-+   +---|---|---|---|---|---|---|---|---|---|---|---|---|-+
 A|   |   |   |   |   |   |   |   |   |   |   |   |   | |   |   |   |   |   |   |   |   |   |   |   |   |   |   | |
  |   |   |   |   |  O|OOO|OOO|OOO|   |   |   |   |   | |   |   |   |   |   |  O|OOO|OOO|OOO|   |   |   |   |   | |
  -------------------------------------------------------   -------------------------------------------------------
 B|   |   |   | OO|OOO|OOO|OOO|OOO|OOO|O  |   |   |   | |   |   |   |   | OO|OOO|OOO|OOO|OOO|OOO|O  |   |   |   | |
  |   |   |  O|OOO|O  |OOO|OOO|OO | OO|OOO|   |   |   | |   |   |   |  O|OOO|O  |OOO|OOO|OO | OO|OOO|   |   |   | |
  -------------------------------------------------------   -------------------------------------------------------
 C|   |   |OOO|OO |   |  O|OOO|   |   |OOO|OO |   |   | |   |   |   |OOO|OO |   |  O|OOO|   |   |OOO|OO |   |   | |
  |   | OO|OOO|OO | # |  O|OOO|  #|   |OOO|OOO|O  |   | |   |   | OO|OOO|OO | # |  O|OOO|  #|   |OOO|OOO|O  |   | |
  -------------------------------------------------------   -------------------------------------------------------
 D|   |OOO|OOO|OOO|   | OO|OOO|O  |  O|OOO|OOO|OO |   | |   |   |OOO|OOO|OOO|   | OO|OOO|O  |  O|OOO|OOO|OO |   | |
  |  O|OOO|OOO|OOO|OOO|OOO|OOO|OOO|OOO|OOO|OOO|OOO|   | |   |  O|OOO|OOO|OOO|OOO|OOO|OOO|OOO|OOO|OOO|OOO|OOO|   | |
  -------------------------------------------------------   -------------------------------------------------------
 E|  O|OOO|OOO|OOO|OOO|OOO|OOO|OOO|OOO|OOO|OOO|OOO|   | |   |  O|OOO|OOO|OOO|OOO|OOO|OOO|OOO|OOO|OOO|OOO|OOO|   | |
  |  O|OOO|  O|OOO|OOO|OOO|OOO|OOO|OOO|OOO|  O|OOO|   | |   |  O|OOO|OOO|OOO|OOO|OOO|OOO|OOO|OOO|OOO|OOO|OOO|   | |
  -------------------------------------------------------   -------------------------------------------------------
 F|   |OOO|O O|OOO|OOO|OOO|OOO|OOO|OOO|OOO| OO|OO |   | |   |   |OOO|OOO|OOO|OOO|OOO|OOO|OOO|OOO|OOO|OOO|OO |   | |
  |   | OO|OO | OO|OOO|OOO|OOO|OOO|OOO|OO |OOO|O  |   | |   |   | OO|OOO|   |   |   |   |   |   |  O|OOO|O  |   | |
  -------------------------------------------------------   -------------------------------------------------------
 G|   |   |OOO|O  | OO|OOO|OOO|OOO|OOO|   |OOO|   |   | |   |   |   |OOO|OOO|OOO|OOO|OOO|OOO|OOO|OOO|OOO|   |   | |
  |   |   |  O|OOO|O  | OO|OOO|OOO|   |OOO|OO |   |   | |   |   |   |  O|OOO|OOO|OOO|OOO|OOO|OOO|OOO|OO |   |   | |
  -------------------------------------------------------   -------------------------------------------------------
 H|   |   |   | OO|OOO|O  |   |   |OOO|OOO|   |   |   | |   |   |   |   | OO|OOO|OOO|OOO|OOO|OOO|OOO|   |   |   | |
  |   |   |   |   |  O|OOO|OOO|OOO|O  |   |   |   |   | |   |   |   |   |   |  O|OOO|OOO|OOO|O  |   |   |   |   | |
  -------------------------------------------------------   -------------------------------------------------------
 I|  _|___|__ |   |   |   | O |   |   |   |   |   |   | |   |   |   |   |   |   |   |   |   |   |   |   |   |   | |
  |  ||Sto|p| |   |   |   | O |   |   |   |   |   |   | |   |   |   |   |   |   |   |   |   |   |   |   |   |   | |
  -------------------------------------------------------   -------------------------------------------------------
 J|  ||___|_| |   |   |   | O |   |   |   |   |   |   | |
  |   |  ||OOO|OOO|OOO|OOO|OOO|OOO|OOO|OOO|OOO|O  |   | |
  -------------------------------------------------------   -----------------------------------------------------
 K|   |  ||   |   |   |   | O |   |   |   |   |   |   | |
  |   |  ||   |   |   |   | O |   |   |   |   |   |   | |
  -------------------------------------------------------   -----------------------------------------------------
 L|   |   |   |   |   |   | O |   |   |   |   |   |   | |
  |   |   |   |   |   |   | O |   |   |   |   |   |   | |
  -------------------------------------------------------   -----------------------------------------------------
 M|   |   |   |   |   |   |O O|   |   |   |   |   |   | |
  |   |   |   |   |   |  O|   |O  |   |   |   |   |   | |
  -------------------------------------------------------   -----------------------------------------------------
 N|   |   |   |   |   | O |   | O |   |   |   |   |   | |
  |   |   |   |   |   | O |   | O |   |   |   |   |   | |
  -------------------------------------------------------   -----------------------------------------------------
 O|   |   |   |   |   | O |   | O |   |   |   |   |   | |
  |   |   |   |   |   | O |   | O |   |   |   |   |   | |
  -------------------------------------------------------   -----------------------------------------------------
 P|   |   |   |   |   | O |   | O |   |   |   |   |   | |
  |   |   |   |   |  O|OO |   | OO|O  |   |   |   |   | |
  -------------------------------------------------------   -----------------------------------------------------
 Q +---|---|---|---|---|---|---|---|---|---|---|---|---|-+
```

The algorithm will compare the first part (the image), in the same way like we explained above, but it will also consider the missing part from the second image totally different than the part from the left image.

So, starting with the J1 square, the areas will be considered totally different, therefore the SSIM result will be lower.

### `img-ssim` vs `image-ssim`

The main difference between `img-ssim` (the new module) and `image-ssim` is that the `img-ssim` has an option for not enforcing that the images should have the same size. In case they have different sizes, some areas from the second image will be missing. In these cases, the similarity will be totally different, as explained above.

Another option that `img-ssim` has is that we can opt for resizing the images, making them the same size.

#### Taking a look at the code

 1. Parsing the images

    The images are parsed using `image-parser`. This is useful to get the size (width and height) and the pixel colors at specific coordinates (red, green, blue, transparency).

    ```js
    // Create the ImageParser instances
    source = new ImageParser(source);
    target = new ImageParser(target);

    // Parse the two images in parallel
    sameTime([
        done => source.parse(done)
      , done => target.parse(done)
    ], err => {
        // Check if there is an error
        // And continue with the SSIM algorithm after parsing
    });
    ```
 2. Optionally, resize the images (currently skipped)

    In case the `resize` option is `true`, then the images will be resized to the same size. Specifically, the second image will be resized to have the same size with the first.

    ```js
    target.resize(source.width(), source.height(), (err, target) => {
        if (err) { return cb(err); }
        // Then continue to SSIM comparison
    });
    ```

    Currently, we do *not* use this feature, therefore this step will be skipped.

 3. Image iteration

    The both images will be iterated, by two loops: iterating each `N×N` area (where `N` is configurable, by default `8` pixels).

    ```js
    let width = image1.width()
      , height = image1.height()
      ;

    for (let y = 0; y < height; y += windowSize) {
        for (let x = 0; x < width; x += windowSize) {
            // ...
        }
    }
    ```

    Then we get the Luma values for both current areas (from the first and second images). The Luma values represent a list of numbers built from the luminance and chrominance of each pixel from the current area.


    ```js
    // The initialization of the luma values list
    let lumaValues = new Float32Array(new ArrayBuffer(width * height * 4))
    ```

    A luma value is computed by summing the RGB values and multiplying them with the Alpha value (transparency). In case the area doesn't exist (that happens when the images have different sizes), the luma value will be `0`. Therefore, more `0` luma values, will give us a lower average and lower SSIM value in the end.

    The RGB values are taken using the `getPixel` method of the `image-parser` module which outputs an object containing the RGBA values:

    ```js
    // A white pixel would look like this:
    {
        // Red
        r: 255,

        // Green
        g: 255,

        // Blue
        b: 255,

        // Alpha
        a: 1
    }
    ```

    The code snippet below shows how the values are added in the list.

    ```js
    // Pushing new values in the list
    for (let cY = y; cY < maxY; ++cY) {
        for (let cX = x; cX < maxX; ++cX) {
            let cPixel = image.getPixel(cX, cY)
              , res = (
                    cPixel.r * lumVals.r
                  + cPixel.g * lumVals.g
                  + cPixel.b * lumVals.b
                ) * (cPixel.a)
              ;

            // If the `res` value is not a number, that means one of the areas
            // is missing, therefore we will push a `0` value
            lumaValues[counter++] = res === res ? res : 0;
        }
    }
    ```

    After having two lists of Luma values, we will get the average Luma value for both of them. That's simply the arithmetic average of the values from the list. At this point we will have one average Luma value for each area (one for the first image and another one for the second image).

    ```js
    function _averageLuma(lumaValues) {
        let sumLuma = 0.0;
        for (let i = 0; i < lumaValues.length; i++) {
            sumLuma += lumaValues[i];
        }
        return sumLuma / lumaValues.length;
    }
    ```

    The next step receives 4 parameters:

     - the Luma values from the *first* square;
     - the Luma values from the *second* square;
     - the Luma average from the *first* square, and
     - the Luma average from the *second* square

    Based on these values, we calculate the variance and covariance of the values:

    ```js
    // Covariance of X and Y
    let sigxy = 0
        // The variance of X
      , sigsqx = 0
        // The variance of Y
      , sigsqy = 0
      ;

    // Iterate the values
    for (let i = 0; i < lumaValues1.length; i++) {
        // Prepare to calculate the variance
        sigsqx += Math.pow((lumaValues1[i] - averageLumaValue1), 2);
        sigsqy += Math.pow((lumaValues2[i] - averageLumaValue2), 2);

        // Prepare to calculate the covariance
        sigxy += (lumaValues1[i] - averageLumaValue1) * (lumaValues2[i] - averageLumaValue2);
    }

    // Take the averages which will represent the (co)variance values
    let numPixelsInWin = lumaValues1.length - 1;
    sigsqx /= numPixelsInWin;
    sigsqy /= numPixelsInWin;
    sigxy /= numPixelsInWin;
    ```

    Then the [classical formula](https://en.wikipedia.org/wiki/Structural_similarity) for `SSIM(x, y)` is used:

    ```js
    let numerator = (2 * averageLumaValue1 * averageLumaValue2 + c1) * (2 * sigxy + c2);
    let denominator = (
        Math.pow(averageLumaValue1, 2)
      + Math.pow(averageLumaValue2, 2)
      + c1
    ) * (sigsqx + sigsqy + c2);
    ```

    Then, we add the fraction value to the global SSIM value (which at this point is the sum of the SSIM comparisons between each two squares).

    ```js
    mssim += numerator / denominator;
    ```

    Then, the script will continue iterating to the next square and repeat these steps until the end.

 4. Getting the final result

    At this point we have the SSIM sum (sum of the SSIM values for each comparison of square pairs) and the total number of square pairs.

    The final SSIM value will be obained from the average of the SSIM values, therefore we just have to divide the sum to the number of squares.

    ```js
    mssim / numWindows
    ```

    This is the value which is exposed outside of the module, being sent to the script which is using the module.
