// CODE HERE

// 1. Declare the maps, script panels, and different thematic layers.
let map, scriptPanel = scrollama(), countiesLayer, cellTowersLayer;

// 2. Initialize the layout.
history.scrollRestoration = "manual"; // make sure the geo-narrative will be scrolled to the cover page even after a page refresh.
window.scrollTo(0, 0); // scroll the geo-narrative to the coverpage
adjustStoryboardlSize(); // force a browser window resize.
window.addEventListener("resize", adjustStoryboardlSize); // ask the browser window listen to the resize event, thereby force a viewport resize whenever adjusting the window size.

// 3. Define Generic window resize listener event
function adjustStoryboardlSize() {

    const scenes = document.getElementsByClassName("scene");
    const storyboard = document.getElementById("storyboard");

    // 3.1 determine the height of each scene element
    let sceneH = Math.floor(window.innerHeight * 0.75);
    for (const scene of scenes) {
        scene.style.height = sceneH + "px";
    }
    
    // 3.2 determin the height of the storyboard.
    let storyboardHeight = window.innerHeight;
    let storyboardMarginTop = (window.innerHeight - storyboardHeight) / 2;

    storyboard.style.height = storyboardHeight + "px";
    storyboard.style.top = storyboardMarginTop + "px"

    // 3.3 tell scrollama/script panel to update new element dimensions
    scriptPanel.resize();
}

// 4. Initialize the mapbox
mapboxgl.accessToken = '.....'; // Assign the access token

map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/light-v10',
    zoom: 7, // starting zoom
    minZoom: 3,
    maxZoom: 10,
    center: [-121.93, 47.33], // starting center
    scrollZoom: false,
    boxZoom: false,
    doubleClickZoom: false
});  // Declare the map object

// 5. define the asynchronous function to load geojson data and then performs the dependent actions.
async function geojsonFetch() {

    // 6 wait till the data of washington counties and celltowers are fully loaded.
    let response, counties, celltowers;
    response = await fetch("assets/wacountydata.geojson");
    counties = await response.json();
    response = await fetch("assets/celltowers.geojson");
    celltowers = await response.json();

    // 7. Trigger operations inside of the the ()=> {} funciton while loading the map.
    map.on('load', () => {
        // 8. add map source and declare layers.
        map.addSource('celltowers-src', {
            type: 'geojson',
            data: celltowers
        });

        map.addSource('counties-src', {
            type: 'geojson',
            data: counties
        });

        countiesLayer = {
            'id': 'counties-polygons',
            'type': 'fill',
            'source': 'counties-src',
            'minzoom': 5,
            'paint': {
            'fill-color': '#0080ff',
            'fill-opacity': 0.5
            }
        };

        cellTowersLayer = {
            'id': 'celltowers-points',
            'type': 'circle',
            'source': 'celltowers-src',
            'minzoom': 5,
            'paint': {
            'circle-color': 'red',
            'circle-radius': 4,
            'circle-opacity': 0.8,
            }
        };

        // 9. Initialize the script panel
        scriptPanel
            .setup({
            step: ".scene", // all the scenes.
            offset: 0.33, // the location of the enter and exit trigger
            debug: false // toggler on or off the debug mode.
            })
            .onStepEnter(handleSceneEnter)
            .onStepExit(handleSceneExit);
        
        // 10. This function performs when a scene enters the storyboard
        function handleSceneEnter(response) {
            var index = response.index; // capture the id of the current scene. 
            if (index === 0) { // When enter the first scene
                map.flyTo({
                    center: [-121.93, 47.33],
                    zoom: 8,
                    pitch: 0,
                    speed: 0.5
                }); // fly to a new location
                
                if (typeof (map.getSource('counties-src')) == 'undefined') { //if the map source 'counties-src' does not exist
                    map.addSource('counties-src', {
                        type: 'geojson',
                        data: counties
                    }); // reload the map source of 'counties-src'
                } else {
                    map.getSource('counties-src').setData(counties); // if the map source does not exist, relaod the data counties to the pre-defined map source 'counties-src'.
                }

                if (!map.getLayer("counties-polygons")) { // if the map layer 'counties-polygons' does not exit
                    map.addLayer(countiesLayer);
                }
                document.getElementById("cover").style.visibility = "hidden"; // Hide the cover page
            } else if (index === 1) { // When enter the second scene.
                map.flyTo({
                center: [-121.93, 47.33],
                zoom: 8,
                pitch: 60,
                speed: 0.5

                });
                if (typeof (map.getSource('celltowers-src')) == 'undefined') {
                    map.addSource('celltowers-src', {
                        type: 'geojson',
                        data: celltowers
                    });
                } else {
                    map.getSource('celltowers-src').setData(celltowers);
                }

                if (!map.getLayer("celltowers-points")) {
                    map.addLayer(cellTowersLayer);
                }
            } else if (index === 2) {
                //Relocate to Seattle
                map.flyTo({
                    center: [-122.4121036, 47.6131229],
                    zoom: 12,
                    pitch: 0,
                    speed: 0.5
                });
            } else if (index === 3) {
                //Relocate to Portland
                map.flyTo({
                    center: [-122.724366, 45.5428119],
                    zoom: 12,
                    pitch: 60,
                    speed: 0.5

                });
                map.setStyle('mapbox://styles/mapbox/satellite-streets-v10'); // change the base map
            } else if (index === 6) {
                map.flyTo({
                    center: [-122.4121036, 47.6131229],
                    zoom: 12,
                    pitch: 0,
                    speed: 0.5
                });
            }
        }

        // 11. This function performs when a scene exists the storyboard
        function handleSceneExit(response) {
            var index = response.index;

            if (index === 0) {
                if (map.getLayer("counties-polygons")) {
                map.removeLayer('counties-polygons');
                }
                if (response.direction == 'down') { 
                document.getElementById("cover").style.visibility = "hidden"; // when you scroll down, the cover page will be hided.
                } else {
                document.getElementById("cover").style.visibility = "visible"; // when you scroll up, the cover page will be shown.
                }
            } else if (index === 1) {
                if (map.getLayer("celltowers-points")) {
                    map.removeLayer('celltowers-points');
                }
            } else if (index === 3) {
                //exit to Portland
                map.setStyle('mapbox://styles/mapbox/light-v10');
            } 
        }
    });
};

// 5 call the data loading function.
geojsonFetch();