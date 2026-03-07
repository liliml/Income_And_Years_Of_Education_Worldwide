//slider years array variable (called "yearsRange") from 2000 to 2021 for dataset select to show data for that year. Will use indexing to show what year for instance
//for 2014: yearsRange[14] will show 2014 data.
let yearsRange = [2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021];

//currentYear variable to be used for indexing the selectedYear array and showing the data for that year. Will start with 2000 data.
//This variable will change as the user moves the slider to select different years and show the data for that year.
let currentYear = yearsRange[0]; //default is show data for year 2000 when the page is loaded: yearsRange[0] so year is 2000.


//Referenced this source for time slider: https://docs.mapbox.com/mapbox-gl-js/example/timeline-animation/
//Function for year selected on time slider
function filterBy(yearPassedIn) { //NOTE: yearPassedIn is a parameter, and is a year, can be currentYear, 
//but can change, later see filterBy function call and updating the slider and such in the code
    console.log("current year parameter passed in:", yearPassedIn);
    
    //const filters = ['==', 'currentYear', currentYear];
    //map.setFilter('earthquake-circles', filters);
    //map.setFilter('earthquake-labels', filters);

    //ORGINAL BELOW
    // // Set the label to show current selected year for title for slider (see largeTextSliderValue id in index.html in the slider div)
    // document.getElementById('largeTextSliderValue').textContent = yearsRange[yearPassedIn];
    // // Set the label to show current selected year (see yearSliderValue id in index.html in the slider div)
    // document.getElementById('yearSliderValue').textContent = yearsRange[yearPassedIn];

    //TEST VERSION:
    // Set the label to show current selected year for title for slider (see largeTextSliderValue id in index.html in the slider div)
    // document.getElementById('largeTextSliderValue').innerHTML = yearPassedIn;
    // Set the label to show current selected year (see yearSliderValue id in index.html in the slider div)
    document.getElementById('yearSliderValue').innerHTML = yearPassedIn;

    document.getElementById('title').innerHTML = `Global Income & Schooling (${yearPassedIn})`; //update title in side panel to show textoftitle + (current year here)

}


// 1. Declare the maps, script panels, and different thematic layers.
// ORGINAL: let map, scriptPanel = scrollama(), countiesLayer, cellTowersLayer;
let scriptPanel = scrollama();

// 2. Initialize the layout.
history.scrollRestoration = "manual"; // make sure the geo-narrative will be scrolled to the cover page even after a page refresh.
window.scrollTo(0, 0); // scroll the geo-narrative to the coverpage
adjustStoryboardlSize(); // force a browser window resize.
window.addEventListener("resize", adjustStoryboardlSize); // ask the browser window listen to the resize event, thereby force a viewport resize whenever adjusting the window size.


// 3. Define Generic window resize listener event
function adjustStoryboardlSize() {

    const scenes = document.getElementsByClassName("scene");
    //AM NOT USING STORYBOARD SECTION OR ID SO COMMENTED THIS OUT!: const storyboard = document.getElementById("storyboard");

    // 3.1 determine the height of each scene element
    let sceneH = Math.floor(window.innerHeight * 0.75);
    for (const scene of scenes) {
        scene.style.height = sceneH + "px";
    }
    
    //NOTE: THIS HAS TO BE COMMENTED OUT OR THE MAP WILL NOT SHOW!!!! 
    // 3.2 determin the height of the storyboard.
    let storyboardHeight = window.innerHeight;
    let storyboardMarginTop = (window.innerHeight - storyboardHeight) / 2;

    storyboard.style.height = storyboardHeight + "px";
    storyboard.style.top = storyboardMarginTop + "px"

    // 3.3 tell scrollama/script panel to update new element dimensions
    scriptPanel.resize();
}

// assign the access token
mapboxgl.accessToken = 'pk.eyJ1IjoieWowNTA1IiwiYSI6ImNtaGVhZm13NzBiZHAyaXBwNnVia3kyY3YifQ.JDOB2t61C-q1Qo7WLT7DDw';


// declare the map object
let map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/dark-v10',
    zoom: 1.2, // starting zoom
    scrollZoom: false,
    minZoom: 1,
    center: [0, 20] // starting center
});

// declare the coordinated chart as well as other variables.
let chart = null;
    activeLayer = "combinedata";
    worldData = null;

// create a few constant variables.
const incomeBreaks = [0, 2000, 5000, 10000, 20000, 40000];
const incomeColors = ['#f2f0f7','#cbc9e2','#9e9ac8','#756bb1','#54278f','#3f007d'];

const schoolingBreaks = [0, 3, 6, 9, 12];
const schoolingColors = ['#edf8fb','#b2e2e2','#66c2a4','#2ca25f','#006d2c'];

// const combinedataBreaks = [0, 1, 2, 3];
// const combinedataColors = ['#ff0800','#ff6f00','#d4ff00'];

// create the legend object and anchor it to the html element with id legend.
const legend = document.getElementById('legend');

function updateLegend(type) {
    let breaks = type === "income" ? incomeBreaks : schoolingBreaks;
    let colors = type === "income" ? incomeColors : schoolingColors;

    let labels = [`<strong>${type === "income" ? "Avg Yearly Income (USD)" : "Avg Years Schooling"}</strong>`];

    for (let i = 0; i < breaks.length - 1; i++) {
        labels.push(`
            <p class="break">
                <span class="dot" style="background:${colors[i]}; width:18px; height:18px;"></span>
                <span class="dot-label">${breaks[i]} – ${breaks[i+1]}</span>
            </p>
        `);
    }

    legend.innerHTML = labels.join('');
}

function clean(v) {
    return v === -1 ? null : v;
}

async function loadData() {
    //Referenced the following sources to use variables in file path, in this case to put current selected year variable into file path as year changes:
    //https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/Strings
    //https://stackoverflow.com/questions/3304014/how-to-interpolate-variables-in-strings-in-javascript-without-concatenation
    console.log("currentYear variable before fetch:::", currentYear);
    let response = await fetch(`assets/${currentYear}/merged_${currentYear}.geojson`); //the backticks are for string literals, have to use these to use variable name in string name
    worldData = await response.json();

    map.on("load", () => {

        map.addSource("world", {
            type: "geojson",
            data: worldData
        });

        //NOTE: IS FOR TESTING COMBINED LAYER CHANGE THIS LATER!!!
        // "COMBINED LAYER" choropleth
        map.addLayer({
            id: "combined-layer",
            type: "fill",
            source: "world",
            paint: {
            "fill-color": [
                "case",
                ["==", ["get", "INCOME"], -1], '#999999',
                [
                    "step",
                    ["get", "INCOME"],
                    incomeColors[0], incomeBreaks[1],
                    incomeColors[1], incomeBreaks[2],
                    incomeColors[2], incomeBreaks[3],
                    incomeColors[3], incomeBreaks[4],
                    incomeColors[4], incomeBreaks[5],
                    incomeColors[5]
                ]
            ],
                "fill-opacity": 0.8,
                "fill-outline-color": "#222"
            }
        });

        // Income choropleth
        map.addLayer({
            id: "income-layer",
            type: "fill",
            source: "world",
            paint: {
            "fill-color": [
                "case",
                ["==", ["get", "INCOME"], -1], '#999999',
                [
                    "step",
                    ["get", "INCOME"],
                    incomeColors[0], incomeBreaks[1],
                    incomeColors[1], incomeBreaks[2],
                    incomeColors[2], incomeBreaks[3],
                    incomeColors[3], incomeBreaks[4],
                    incomeColors[4], incomeBreaks[5],
                    incomeColors[5]
                ]
            ],
                "fill-opacity": 0.8,
                "fill-outline-color": "#222"
            }
        });


        
        // Schooling choropleth
        map.addLayer({
            id: "schooling-layer",
            type: "fill",
            source: "world",
            layout: { visibility: "none" },
            paint: {
            "fill-color": [
                "case",
                ["==", ["get", "AVG_YR_SCH"], -1], "#999999",

                [
                    "step",
                    ["get", "AVG_YR_SCH"],
                    schoolingColors[0], schoolingBreaks[1],
                    schoolingColors[1], schoolingBreaks[2],
                    schoolingColors[2], schoolingBreaks[3],
                    schoolingColors[3], schoolingBreaks[4],
                    schoolingColors[4]
                ]
            ],
                "fill-opacity": 0.8,
                "fill-outline-color": "#222"
            }
        });


        //TESTING ADDING CALL filterBy FUNCTION TO MAP TO CHANGE YEAR VALUE TO SHOW DIFF DATA!
        // Set filter to year 2000 (0 is an index, here it is 0 and is year 2000). 
        // Am using currentYear variable here, is set to index 0 aka year 2000, see code at top of this file
        filterBy(currentYear);
        //REMINDER: currentYear is a GLOBAL VARIABLE (see code at top of this file where it is defined and declared)
        document.getElementById('slider').addEventListener('input', (e) => { 
            //console.log("value of e:", e);
            let currSelYear = parseInt(e.target.value, 10); //create currSelYear variable which gets timeslider value of the year. 10 in this case means use base 10
            //to understand line above and parseInt function, used this reference: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/parseInt
            console.log("currentYear value from line above in code:", currSelYear);
            console.log("currSelYear value:", currSelYear);
            console.log("currentYear variable type:", typeof currSelYear);
            currentYear = yearsRange[yearsRange.indexOf(currSelYear)] //update currentYear variable to be the index of the selected year, so that it can be used in the filterBy function to show the data for that year. 
            // indexOf function gets index of the selected year from yearsRange array. 
            // Referenced this source for indexOf function: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf
            //
            console.log("currentYear variable after update:", currentYear);

            //TESTING BELOW, ATTEMPTING TO RELOAD MAP SINCE MAP ISNT' UPDATING AND GETTING CALLED AGAIN AS DATA CHAANGES:
            //Referenced the following sources to update the map according to the year selected:
            //https://docs.mapbox.com/mapbox-gl-js/example/live-update-feature/
            //https://stackoverflow.com/questions/63963704/refreshing-a-source-in-order-to-update-the-visualized-data
            map.getSource('world').setData(`assets/${currentYear}/merged_${currentYear}.geojson`); //update the map source of 'world' to show the data for the selected year.

            filterBy(currSelYear);
        });
        //TESTING ADDING CALL filterBy FUNCTION TO MAP TO CHANGE YEAR VALUE TO SHOW DIFF DATA!


        updateLegend("income");
    });


    // TESTING!!!
    // 9. Initialize the script panel
    //Referenced this source make side panel appear faster editing offset property value, adding the easing property, and adding the animate property to make the side panel appear and disappear smoother: https://docs.mapbox.com/mapbox-gl-js/api/properties/
    scriptPanel.setup({
        step: ".scene", // all the scenes.
        offset: 0.9, // the location of the enter and exit trigger, need higher value to make side panel show up faster, orginal value was 0.33, current best value that makes side panel show right away is 0.9, can only be at max 1.0 or fails to work
        easing:1,
        animate:true,
        debug: false // toggler on or off the debug mode.
        })
        .onStepEnter(handleSceneEnter)
        .onStepExit(handleSceneExit);

    // 10. This function performs when a scene enters the storyboard
    function handleSceneEnter(response) {
        var index = response.index; // capture the id of the current scene. 
        if (index === 0) { // When enter the first scene
            // map.flyTo({
            //     center: [0,20],
            //     zoom: 1.2,
            //     pitch: 0,
            //     speed: 0.5
            // }); // fly to a new location

            // // two lines below are used to make the side panel show by default
            document.getElementById("mySidepanel").style.width = "470px";
            document.getElementById("mySidepanel").style.height = "100%";
            document.getElementById("mySidepanel").style.padding = "0px 0px 0px 20px"; //padding to left, 20px 

            // document.getElementById("legend").style.visibility = "visible"; //need this to make legend appear quicker
            
            if (typeof (map.getSource('world')) == 'undefined') { //if the map source 'world' does not exist
                map.addSource('world', {
                    type: 'geojson',
                    data: worldData
                }); // reload the map source of 'world'
            } 
            document.getElementById("cover").style.visibility = "hidden"; // Hide the cover page
            document.getElementById("mySidepanel").style.visibility = "visible"; //show side panel
        } 
         
    }

    //*****************TODO: FIX CODE HERE AFTER FIXING LINE 333 SECTION */
    // 11. This function performs when a scene exists the storyboard
    function handleSceneExit(response) {
        var index = response.index;

        if (index === 0) { //NOTE: "getLayer" uses the MAP ID FROM THE map.addlayer FUNCTION!!!
            //ORIGINAL BELOW:
            // if (map.getLayer("income-layer")) {
            //     map.removeLayer('income-layer');
            // } else if (map.getLayer("schooling-layer")) {
            //     map.removeLayer('schooling-layer');
            // }
            //TESTING BELOW:
            if (map.getLayer("income-layer")) {
                map.removeLayer('combined-layer');
                map.removeLayer('schooling-layer');
                // map.addLayer('income-layer');
            } else if (map.getLayer("schooling-layer")) {
                map.removeLayer('combined-layer');
                // map.addLayer('schooling-layer');
                map.removeLayer('income-layer');

            } else if (map.getLayer("combined-layer")) {
                // map.addLayer('combined-layer');
                map.removeLayer('schooling-layer');
                map.removeLayer('income-layer');

            }


            //ORGINAL BELOW
            // if (response.direction == 'down') { 
            // document.getElementById("cover").style.visibility = "hidden"; // when you scroll down, the cover page will be hided.
            // } else {
            // document.getElementById("cover").style.visibility = "visible"; // when you scroll up, the cover page will be shown.
            // }
            //TESTING BELOW TO MAKE MAP REAPPEAR
            if (response.direction == 'down') { 
            document.getElementById("cover").style.visibility = "visible"; // when you scroll down, the cover page will be hided.
            document.getElementById("mySidepanel").style.visibility = "hidden"; //hide side panel
            } else if (response.direction == 'up') {
            document.getElementById("cover").style.visibility = "visible"; // when you scroll up, the cover page will be shown.
            document.getElementById("mySidepanel").style.visibility = "hidden"; //hide side panel
            } else {
            //document.getElementById("map").style.visibility = "visible";
            // document.getElementById("cover").style.visibility = "visible";    
            }
        } 
    }
    // TESTING!!!



}

loadData();

//Referenced this sources for code to add and remove classes from "buttons": https://stackoverflow.com/questions/507138/how-to-add-a-class-to-an-html-element-with-javascript
//for button element ids "btn-combined", "btn-income", "btn-schooling"  
//in the two seciotns below when getting the elments add class to make button appear in the "active" color 
//and remove "active" class from the other two ids so they are not shown in the "active" color
//see added 3 lines below in each code chunk below the updateLegend line

//NOTE AND TODO AND FIX LATER!!!: FOR THE COMBINEDATA LAYER, AM TEMOPORARILY SHOWING THE INCOME LAYER!!!

//WEIRD ERROR, FOR NOW AM LEAVING COMMENTED OUT, UNCOMMENT AND VIEW CONSOLE TO SEE AND ALSO MAKES THE SIDE PANEL DISAPPEAR???
document.getElementById("btn-combinedata").addEventListener("click", () => {
    activeLayer = "combinedata";
    map.setLayoutProperty("combined-layer", "visibility", "visible"); //NOTE: THESE LAYERS ARE THE IDs FROM ABOVE WHEN IMPORTING LAYERS!
    map.setLayoutProperty("income-layer", "visibility", "none");
    map.setLayoutProperty("schooling-layer", "visibility", "none");
    updateLegend("schooling"); //TODO: WILL FIX THIS LATER, FOR TESTING PURPOSES LEAVING AS IS
    document.getElementById("btn-combinedata").classList.add("active");
    document.getElementById("btn-schooling").classList.remove("active");
    document.getElementById("btn-income").classList.remove("active");
});

document.getElementById("btn-schooling").addEventListener("click", () => {
    activeLayer = "schooling";
    map.setLayoutProperty("combined-layer", "visibility", "none");
    map.setLayoutProperty("income-layer", "visibility", "none");
    map.setLayoutProperty("schooling-layer", "visibility", "visible");
    updateLegend("schooling");
    document.getElementById("btn-combinedata").classList.remove("active");
    document.getElementById("btn-schooling").classList.add("active");
    document.getElementById("btn-income").classList.remove("active");
});

document.getElementById("btn-income").addEventListener("click", () => {
    activeLayer = "income";
    map.setLayoutProperty("combined-layer", "visibility", "none");
    map.setLayoutProperty("income-layer", "visibility", "visible");
    map.setLayoutProperty("schooling-layer", "visibility", "none");
    updateLegend("income");
    document.getElementById("btn-combinedata").classList.remove("active");
    document.getElementById("btn-schooling").classList.remove("active");
    document.getElementById("btn-income").classList.add("active");
});


map.on("click", (e) => {
    
    let features = map.queryRenderedFeatures(e.point, {
        layers: ["combined-layer", "income-layer", "schooling-layer"]
    });

    if (!features.length) return;

    let props = features[0].properties;

    let income = clean(parseFloat(props.INCOME));
    let schooling = clean(parseFloat(props.AVG_YR_SCH));

    document.getElementById("country-name").innerHTML = props.COUNTRY;
    document.getElementById("income").innerHTML = income === null ? "No Data" : income.toLocaleString();
    document.getElementById("schooling").innerHTML = schooling === null ? "No Data" : schooling;

    generateChart(income, schooling);

    // Popup at clicked point
    new mapboxgl.Popup()
        .setLngLat(e.lngLat)
        .setHTML(`
            <strong>${props.COUNTRY}</strong><br>
            Income: ${income === null ? "No Data" : income.toLocaleString()}<br>
            Schooling: ${schooling === null ? "No Data" : schooling}
        `)
        .addTo(map);
    
    //Referenced the following sources to update the map according to the year selected:
    //https://docs.mapbox.com/mapbox-gl-js/example/live-update-feature/
    //https://stackoverflow.com/questions/63963704/refreshing-a-source-in-order-to-update-the-visualized-data
        map.getSource('world').setData(`assets/${currentYear}/merged_${currentYear}.geojson`); //update the map source of 'world' to show the data for the selected year.
});


//ORGINAL FUNCTION
// function generateChart(income, schooling) {

//     if (chart) chart.destroy();

//     chart = c3.generate({
//         bindto: "#chart",
//         data: {
//             columns: [
//                 ["Income", income || 0],
//                 ["Schooling", schooling || 0]
//             ],
//             type: "bar",
//             colors: {
//                 Income: "#54278f",
//                 Schooling: "#2ca25f"
//             }
//         },
//         tooltip: {
//             format: {
//                 value: function (value) {
//                     return value === 0 ? "No Data" : value;
//                 }
//             }
//         },
//         axis: {
//             x: { type: "category", categories: [""] }
//         }
//     });
// }
function generateChart(income, schooling) {
    if (activeLayer == "combinedata") { //first case for combined data
        if (chart) chart.destroy();
        chart = c3.generate({
            bindto: "#chart",
            data: {
                columns: [
                    ["Income", income || 0],
                    ["Schooling", schooling || 0]
                ],
                type: "bar",
                colors: {
                    Income: "#54278f",
                    Schooling: "#2ca25f"
                }
            },
            tooltip: {
                format: {
                    value: function (value) {
                        return value === 0 ? "No Data" : value;
                    }
                }
            },
            axis: {
                x: { type: "category", categories: [""] }
            }
        });
    } else if (activeLayer == "schooling") { //second case for education data
        if (chart) chart.destroy();

        chart = c3.generate({
            bindto: "#chart",
            data: {
                columns: [
                    ["Schooling", schooling || 0]
                ],
                type: "bar",
                colors: {
                    Schooling: "#2ca25f"
                }
            },
            tooltip: {
                format: {
                    value: function (value) {
                        return value === 0 ? "No Data" : value;
                    }
                }
            },
            axis: {
                x: { type: "category", categories: [""] }
            }
        });
    } else { //third case for income data
        if (chart) chart.destroy();

        chart = c3.generate({
            bindto: "#chart",
            data: {
                columns: [
                    ["Income", income || 0]
                ],
                type: "bar",
                colors: {
                    Income: "#54278f",
                }
            },
            tooltip: {
                format: {
                    value: function (value) {
                        return value === 0 ? "No Data" : value;
                    }
                }
            },
            axis: {
                x: { type: "category", categories: [""] }
            }
        });    
    }
    

    

    
}


document.getElementById("reset").addEventListener("click", () => {
    map.flyTo({ zoom: 1.2, center: [0, 20] });
});


// Code section for side panel that opens and closes on click to view main panel
// Referenced the following for side panel that opens and closes on click to view main panel: 
// https://www.w3schools.com/howto/howto_js_collapse_sidepanel.asp
// https://www.w3schools.com/howto/howto_js_collapse_sidebar.asp-->

// two lines below are used to make the side panel show by default
// document.getElementById("mySidepanel").style.width = "400px";
// document.getElementById("mySidepanel").style.height = "100%";

/* Set the width and heigh of the sidebar (show it) */
function openNav() {
  document.getElementById("mySidepanel").style.width = "470px";
  document.getElementById("mySidepanel").style.height = "100%";
}

/* Set the width of the sidebar to 0 (hide it) */
function closeNav() {
  document.getElementById("mySidepanel").style.width = "0";
}


