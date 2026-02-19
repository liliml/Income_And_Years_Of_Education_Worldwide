// CODE HERE

// 1. Declare the maps, script panels, and different thematic layers.
    let map, scriptPanel = scrollama(), countiesLayer, cellTowersLayer;
    // 2. Initialize the layout.
    //TODO: PUT CODE HERE

    // 3. Define Generic window resize listener event
    function adjustStoryboardlSize() {
    }

    // 4. Initialize the mapbox
    //TODO PUT CODE HERE

    // 5. define the asynchronous function to load geojson data and then performs the dependent actions.
    async function geojsonFetch() {
    
    // 6 wait till the data of washington counties and celltowers are fully loaded.
    //TODO: PUT CODE HERE

      // 7. Trigger operations inside of the the ()=> {} funciton while loading the map.
      map.on('load', () => {
        // 8. add map source and declare layers.
        //TODO: PUT CODE HERE
        
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

            //***TEXT HERE
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
                //TODO: PUT CODE HERE
            } else if (index === 2) {
                //TODO: PUT CODE HERE
            } else if (index === 3) {
                //TODO: PUT CODE HERE
            } else if (index === 6) {
                //TODO: PUT CODE HERE
            };
            
            //***TEXT HERE
            
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
                //TODO: PUT CODE HERE
            } else if (index === 3) {
                //exit to Portland
                map.setStyle('mapbox://styles/mapbox/light-v10');
            } 
        }
      });

    };

    // 5 call the data loading function.
    geojsonFetch();