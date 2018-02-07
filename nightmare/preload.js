// This will get executed before anything else
(function () {

    // Create the proxy variable
    var __proxy = window.__proxy = window.proxy || { initMapName: "initMap" };
    __proxy.jqueryLoaded = function () {
        $("body,html").css({
            overflow: "hidden"
        });
    };

    // Store in the ___google variable the Google maps global
    var ___google = null;

    // Create the markers array
    var _markers = [];

    // Create the getMarkers function which will create the marker positions array
    __proxy.getMarkers = function () {
        return _markers.map(function (c) {
            var pos = c.getPosition();
            if (pos) { return null; }
            return {
                lat: pos.lat(),
                lng: pos.lng()
            };
        }).filter(Boolean);
    };

    // This function will get called before the Google maps renders the map
    // but AFTER the google library is loaded on the page
    function googleLoaded() {
        if (typeof __proxy !== "undefined") {

            // Get the old functions
            var oldAddEventListener = google.maps.event.addListener;
            var oldAddEventListenerProto = google.maps.Marker.prototype.addListener;

            // Click the markers
            function prepareToClickMarker() {
                clearTimeout(timeout);
                timeout = setTimeout(function() {
                    setTimeout(function() {
                        window.__mapMarkerClicked = true;
                    }, 10);
                    new google.maps.event.trigger(_markers[0], 'click')
                    Array.prototype.slice.call(document.querySelectorAll("svg .radar-chart-serie0")).forEach(c => c.remove())
                    Array.prototype.slice.call(document.querySelectorAll("svg text.title")).filter(c => c.innerHTML.trim().endsWith("%")).forEach(c => c.remove())
                }, 2000);
            }

            //// Override the addListener (google.maps)
            google.maps.Marker.prototype.addListener = function () {
                _markers.push(this);
                prepareToClickMarker();
                return oldAddEventListenerProto.apply(this, arguments);
            };

            var timeout = null;
            google.maps.event.addListener  = function (marker, ev) {
                if (marker.setIcon && ev === "click") {
                    _markers.push(marker);
                    prepareToClickMarker();
                }
                return oldAddEventListener.apply(google.maps.event, arguments);
            };

            if (!__proxy.disableReload) {
                setTimeout(function() {
                    if (!_markers[0]) {
                        location.reload();
                        return;
                    }
                }, 9000);
            }
        }
    }

    // Catch the google event
    Object.defineProperty(window, "google", {
        set: function (google) {
            ___google = google;
            setTimeout(function() { googleLoaded(); }, 0);
            //googleLoaded();
        },
        get: function () {
            return ___google;
        }
    });
})();





// =====================================
// = The original Nightmare preload.js =
// =====================================


window.__nightmare = {};
__nightmare.ipc = require('electron').ipcRenderer;
__nightmare.sliced = require('sliced');

// Listen for error events
window.addEventListener('error', function(e) {
  __nightmare.ipc.send('page', 'error', e.message, e.error.stack);
});

(function(){
  // listen for console.log
  var defaultLog = console.log;
  console.log = function() {
    __nightmare.ipc.send('console', 'log', __nightmare.sliced(arguments));
    return defaultLog.apply(this, arguments);
  };

  // listen for console.warn
  var defaultWarn = console.warn;
  console.warn = function() {
    __nightmare.ipc.send('console', 'warn', __nightmare.sliced(arguments));
    return defaultWarn.apply(this, arguments);
  };

  // listen for console.error
  var defaultError = console.error;
  console.error = function() {
    __nightmare.ipc.send('console', 'error', __nightmare.sliced(arguments));
    return defaultError.apply(this, arguments);
  };

  // overwrite the default alert
  window.alert = function(message){
    __nightmare.ipc.send('page', 'alert', message);
  };

  // overwrite the default prompt
  window.prompt = function(message, defaultResponse){
    __nightmare.ipc.send('page', 'prompt', message, defaultResponse);
  }

  // overwrite the default confirm
  window.confirm = function(message, defaultResponse){
    __nightmare.ipc.send('page', 'confirm', message, defaultResponse);
  }
})()
