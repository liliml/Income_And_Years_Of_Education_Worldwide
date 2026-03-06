// CODE HERE

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
    let response = await fetch("assets/2000/merged_2000.geojson");
    worldData = await response.json();

    map.on("load", () => {

        map.addSource("world", {
            type: "geojson",
            data: worldData
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

        updateLegend("income");
    });


    // TESTING!!!
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
            // map.flyTo({
            //     center: [0,20],
            //     zoom: 1.2,
            //     pitch: 0,
            //     speed: 0.5
            // }); // fly to a new location
            
            if (typeof (map.getSource('world')) == 'undefined') { //if the map source 'world' does not exist
                map.addSource('world', {
                    type: 'geojson',
                    data: worldData
                }); // reload the map source of 'world'
            } 
            document.getElementById("cover").style.visibility = "hidden"; // Hide the cover page
        } 
    }

    // 11. This function performs when a scene exists the storyboard
    function handleSceneExit(response) {
        var index = response.index;

        if (index === 0) { //NOTE: "getLayer" uses the MAP ID FROM THE map.addlayer FUNCTION!!!
            if (map.getLayer("income-layer")) {
                map.removeLayer('income-layer');
            } else if (map.getLayer("schooling-layer")) {
                map.removeLayer('schooling-layer');
            }
            if (response.direction == 'down') { 
            document.getElementById("cover").style.visibility = "hidden"; // when you scroll down, the cover page will be hided.
            } else {
            document.getElementById("cover").style.visibility = "visible"; // when you scroll up, the cover page will be shown.
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

//WEIRD ERROR, FOR NOW AM LEAVING COMMENTED OUT, UNCOMMENT AND VIEW CONSOLE TO SEE AND ALSO MAKES THE SIDE PANEL DISAPPEAR???
// document.getElementById("btn-combinedata").addEventListener("click", () => {
//     activeLayer = "combinedata";
//     map.setLayoutProperty("income-layer", "visibility", "visible");
//     map.setLayoutProperty("schooling-layer", "visibility", "none");
//     updateLegend("schooling");
//     document.getElementById("btn-combinedata").classList.add("active");
//     document.getElementById("btn-schooling").classList.remove("active");
//     document.getElementById("btn-income").classList.remove("active");
// });

document.getElementById("btn-schooling").addEventListener("click", () => {
    activeLayer = "schooling";
    map.setLayoutProperty("income-layer", "visibility", "none");
    map.setLayoutProperty("schooling-layer", "visibility", "visible");
    updateLegend("schooling");
    document.getElementById("btn-combinedata").classList.remove("active");
    document.getElementById("btn-schooling").classList.add("active");
    document.getElementById("btn-income").classList.remove("active");
});

document.getElementById("btn-income").addEventListener("click", () => {
    activeLayer = "income";
    map.setLayoutProperty("income-layer", "visibility", "visible");
    map.setLayoutProperty("schooling-layer", "visibility", "none");
    updateLegend("income");
    document.getElementById("btn-combinedata").classList.remove("active");
    document.getElementById("btn-schooling").classList.remove("active");
    document.getElementById("btn-income").classList.add("active");
});


map.on("click", (e) => {
    let features = map.queryRenderedFeatures(e.point, {
        layers: ["income-layer", "schooling-layer"]
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
document.getElementById("mySidepanel").style.width = "400px";
document.getElementById("mySidepanel").style.height = "100%";

/* Set the width and heigh of the sidebar (show it) */
function openNav() {
  document.getElementById("mySidepanel").style.width = "400px";
  document.getElementById("mySidepanel").style.height = "100%";
}

/* Set the width of the sidebar to 0 (hide it) */
function closeNav() {
  document.getElementById("mySidepanel").style.width = "0";
}


