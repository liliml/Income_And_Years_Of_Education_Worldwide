//slider years array variable (called "yearsRange") from 2000 to 2021 for dataset select to show data for that year. Will use indexing to show what year for instance
//for 2014: yearsRange[14] will show 2014 data.
let yearsRange = [2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021];

//currentYear variable to be used for indexing the selectedYear array and showing the data for that year. Will start with 2000 data.
//This variable will change as the user moves the slider to select different years and show the data for that year.
let currentYear = yearsRange[0]; //default is show data for year 2000 when the page is loaded: yearsRange[0] so year is 2000.

let lnglat = null; //global var for long lat alter

let average_global_income = 0; //is a global variable for the average income for ALL countries in the world for the current selected year (currentYear)
let average_global_schoolingyears = 0; //is a global variable for the average number of years of schooling for ALL countries in the world for the current selected year (currentYear)


//Referenced this source for time slider: https://docs.mapbox.com/mapbox-gl-js/example/timeline-animation/
//Function for year selected on time slider
function filterBy(yearPassedIn) { //NOTE: yearPassedIn is a parameter, and is a year, can be currentYear, 
//but can change, later see filterBy function call and updating the slider and such in the code
    // Set the label to show current selected year (see yearSliderValue id in index.html in the slider div)
    document.getElementById('yearSliderValue').innerHTML = yearPassedIn;
    document.getElementById('title').innerHTML = `Global Income & Schooling (${yearPassedIn})`; //update title in side panel to show textoftitle + (current year here)
}

// Declare the maps, script panels, and different thematic layers.
let scriptPanel = scrollama();

// Initialize the layout.
history.scrollRestoration = "manual"; // make sure the geo-narrative will be scrolled to the cover page even after a page refresh.
window.scrollTo(0, 0); // scroll the geo-narrative to the coverpage
adjustStoryboardlSize(); // force a browser window resize.
window.addEventListener("resize", adjustStoryboardlSize); // ask the browser window listen to the resize event, thereby force a viewport resize whenever adjusting the window size.

// Define Generic window resize listener event
function adjustStoryboardlSize() {

    const scenes = document.getElementsByClassName("scene");

    // determine the height of each scene element
    let sceneH = Math.floor(window.innerHeight * 0.75);
    for (const scene of scenes) {
        scene.style.height = sceneH + "px";
    }
    
    // determine the height of the storyboard.
    let storyboardHeight = window.innerHeight;
    let storyboardMarginTop = (window.innerHeight - storyboardHeight) / 2;

    storyboard.style.height = storyboardHeight + "px";
    storyboard.style.top = storyboardMarginTop + "px"

    // tell scrollama/script panel to update new element dimensions
    scriptPanel.resize();
}

// assign the access token
mapboxgl.accessToken = 'pk.eyJ1IjoieWowNTA1IiwiYSI6ImNtaGVhZm13NzBiZHAyaXBwNnVia3kyY3YifQ.JDOB2t61C-q1Qo7WLT7DDw';

// declare the map object
let map = new mapboxgl.Map({
    projection:"globe",
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/dark-v10',
    zoom: 2.5, // starting zoom
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

const combinedataBreaks = [0, 2000, 5000, 10000, 20000, 40000];
const combinedataColors = ['#005eff','#0a0079','#ff00d9','#00ffbb','#ffd000','#ff0000'];

// create the legend object and anchor it to the html element with id legend.
const legend = document.getElementById('legend');

//function to update legend
function updateLegend(type) {
    if (type == "combinedata") {
        document.getElementById("legend").style.visibility = "hidden";
    } else {
        let breaks = type === "income" ? incomeBreaks : schoolingBreaks;
        let colors = type === "income" ? incomeColors : schoolingColors; 
        let labels = [`<strong>${type === "income" ? "Avg Yearly Income (USD)" : "Avg Years Schooling"}</strong>`];

        for (let i = 0; i < breaks.length - 1; i++) {
            labels.push(
                //div is "item" variable and span is "key" varible. Second span below is for "value" variable.
                `<div>
                    <span class="legend-key" style="background-color: ${colors[i]};"></span>
                    <span>${breaks[i]}</span>
                </div>`   
            );
        }
    
        legend.innerHTML = labels.join('');
    }
}

function clean(v) {
    return v === -1 ? null : v;
}

async function loadData() {
    //NOTE: code in the 2 lines below is for the combined data tab, while the other code below before map.on is for the education and income tabs. See code later for futher explaination
    //Referenced the following sources to use variables in file path, in this case to put current selected year variable into file path as year changes:
    //https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/Strings
    //https://stackoverflow.com/questions/3304014/how-to-interpolate-variables-in-strings-in-javascript-without-concatenation
    let response = await fetch(`assets/${currentYear}/merged_${currentYear}.geojson`); //the backticks are for string literals, have to use these to use variable name in string name
    worldData = await response.json();

    map.on("load", () => {
        //Referenced for globe map and for setting background appearence of map: https://docs.mapbox.com/mapbox-gl-js/guides/globe/
        map.setFog({
            color: 'rgb(186, 210, 235)', // Lower atmosphere
            'high-color': 'rgb(36, 92, 223)', // Upper atmosphere
            'horizon-blend': 0.02, // Atmosphere thickness (default 0.2 at low zooms)
            'space-color': 'rgb(11, 11, 25)', // Background color
            'star-intensity': 0.6 // Background star brightness (default 0.35 at low zoooms )
        });

        map.addSource("world", {
            type: "geojson",
            data: worldData
        });

        // combined layer choropleth
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
                    combinedataColors[0], combinedataBreaks[1],
                    combinedataColors[1], combinedataBreaks[2],
                    combinedataColors[2], combinedataBreaks[3],
                    combinedataColors[3], combinedataBreaks[4],
                    combinedataColors[4], combinedataBreaks[5],
                    combinedataColors[5]
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
            layout: { visibility: "none" },
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

        // filterBy function used to cahnge year value to show different data
        // Set filter to year 2000 (0 is an index, here it is 0 and is year 2000). 
        // Am using currentYear variable here, is set to index 0 aka year 2000, see code at top of this file
        filterBy(currentYear);
        //REMINDER: currentYear is a GLOBAL VARIABLE (see code at top of this file where it is defined and declared)
        document.getElementById('slider').addEventListener('input', (e) => { 
            let currSelYear = parseInt(e.target.value, 10); //create currSelYear variable which gets timeslider value of the year. 10 in this case means use base 10
            //to understand line above and parseInt function, used this reference: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/parseInt
            currentYear = yearsRange[yearsRange.indexOf(currSelYear)] //update currentYear variable to be the index of the selected year, so that it can be used in the filterBy function to show the data for that year. 
            // indexOf function gets index of the selected year from yearsRange array. 
            // Referenced this source for indexOf function: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf

            //Reloads and updates map as data changes for the selected year:
            //Referenced the following sources to update the map according to the year selected:
            //https://docs.mapbox.com/mapbox-gl-js/example/live-update-feature/
            //https://stackoverflow.com/questions/63963704/refreshing-a-source-in-order-to-update-the-visualized-data
            map.getSource('world').setData(`assets/${currentYear}/merged_${currentYear}.geojson`); //update the map source of 'world' to show the data for the selected year.
            filterBy(currSelYear);
            if (lnglat != null) {
                lng = lnglat[0];
                lat = lnglat[1];
                map.fire("click", {point: map.project([lng, lat]), lngLat: lng, lat});
            }

        });
        updateLegend("combinedata");
    });

    //FOR CONTEXT FOR DATASETS BELOW AND WHY USE OF REDUNDANT LOOKING CODE AND MANY DATASETS, SEE map.on(click.. function in code later below outside of this function
    //Load in all the datasets for later for showing all the income and education data for those tabs over the years for a selected country. There is one datset per each year from 2000 to 2021
    let response_2000 = await fetch(`assets/2000/merged_2000.geojson`); 
    worldData_2000 = await response_2000.json();
    
    let response_2001 = await fetch(`assets/2001/merged_2001.geojson`); 
    worldData_2001 = await response_2001.json();
    
    let response_2002 = await fetch(`assets/2002/merged_2002.geojson`); 
    worldData_2002 = await response_2002.json();
    
    let response_2003 = await fetch(`assets/2003/merged_2003.geojson`); 
    worldData_2003 = await response_2003.json();
    
    let response_2004 = await fetch(`assets/2004/merged_2004.geojson`); 
    worldData_2004 = await response_2004.json();
    
    let response_2005 = await fetch(`assets/2005/merged_2005.geojson`); 
    worldData_2005 = await response_2005.json();
    
    let response_2006 = await fetch(`assets/2006/merged_2006.geojson`); 
    worldData_2006 = await response_2006.json();
    
    let response_2007 = await fetch(`assets/2007/merged_2007.geojson`); 
    worldData_2007 = await response_2007.json();
    
    let response_2008 = await fetch(`assets/2008/merged_2008.geojson`); 
    worldData_2008 = await response_2008.json();
    
    let response_2009 = await fetch(`assets/2009/merged_2009.geojson`); 
    worldData_2009 = await response_2009.json();
    
    let response_2010 = await fetch(`assets/2010/merged_2010.geojson`); 
    worldData_2010 = await response_2010.json();

    let response_2011 = await fetch(`assets/2011/merged_2011.geojson`); 
    worldData_2011 = await response_2011.json();

    let response_2012 = await fetch(`assets/2012/merged_2012.geojson`); 
    worldData_2012 = await response_2012.json();

    let response_2013 = await fetch(`assets/2013/merged_2013.geojson`); 
    worldData_2013 = await response_2013.json();

    let response_2014 = await fetch(`assets/2014/merged_2014.geojson`); 
    worldData_2014 = await response_2014.json();

    let response_2015 = await fetch(`assets/2015/merged_2015.geojson`); 
    worldData_2015 = await response_2015.json();

    let response_2016 = await fetch(`assets/2016/merged_2016.geojson`); 
    worldData_2016 = await response_2016.json();

    let response_2017 = await fetch(`assets/2017/merged_2017.geojson`); 
    worldData_2017 = await response_2017.json();

    let response_2018 = await fetch(`assets/2018/merged_2018.geojson`); 
    worldData_2018 = await response_2018.json();

    let response_2019 = await fetch(`assets/2019/merged_2019.geojson`); 
    worldData_2019 = await response_2019.json();

    let response_2020 = await fetch(`assets/2020/merged_2020.geojson`); 
    worldData_2020 = await response_2020.json();

    let response_2021 = await fetch(`assets/2021/merged_2021.geojson`); 
    worldData_2021 = await response_2021.json();

    // Initialize the script panel
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

    // This function performs when a scene enters the storyboard
    function handleSceneEnter(response) {
        var index = response.index; // capture the id of the current scene. 
        if (index === 0) { // When enter the first scene

            // // two lines below are used to make the side panel show by default
            document.getElementById("mySidepanel").style.width = "35%";
            document.getElementById("mySidepanel").style.height = "100%";
            document.getElementById("mySidepanel").style.padding = "0px 0px 0px 0px"; //padding to left, 0px 
            
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

    // This function performs when a scene exists the storyboard
    function handleSceneExit(response) {
        var index = response.index;
        closeNav(); //close the nav smoothly with animation

        if (index === 0) { //NOTE: "getLayer" uses the MAP ID FROM THE map.addlayer FUNCTION!!!
            //makes map reappear as needed when scrolling up and down to and past map scene
            if (response.direction == 'down') { 
                document.getElementById("cover").style.visibility = "visible"; // when you scroll down, the cover page will be hided.
                document.getElementById("mySidepanel").style.visibility = "hidden"; //hide side panel
            } else if (response.direction == 'up') {
                document.getElementById("cover").style.visibility = "visible"; // when you scroll up, the cover page will be shown.
                document.getElementById("mySidepanel").style.visibility = "hidden"; //hide side panel
            } 
        } 
    }
}

loadData();

//Referenced this sources for code to add and remove classes from "buttons": https://stackoverflow.com/questions/507138/how-to-add-a-class-to-an-html-element-with-javascript
//for button element ids "btn-combined", "btn-income", "btn-schooling"  
//in the two seciotns below when getting the elments add class to make button appear in the "active" color 
//and remove "active" class from the other two ids so they are not shown in the "active" color
//see added 3 lines below in each code chunk below the updateLegend line
document.getElementById("btn-combinedata").addEventListener("click", () => {
    activeLayer = "combinedata";
    map.setLayoutProperty("combined-layer", "visibility", "visible"); //NOTE: THESE LAYERS ARE THE IDs FROM ABOVE WHEN IMPORTING LAYERS!
    map.setLayoutProperty("income-layer", "visibility", "none");
    map.setLayoutProperty("schooling-layer", "visibility", "none");
    document.getElementById("legend").style.visibility = "hidden";
    updateLegend("combinedata");
    document.getElementById("btn-combinedata").classList.add("active");
    document.getElementById("btn-schooling").classList.remove("active");
    document.getElementById("btn-income").classList.remove("active");
    //NOTE: no updateLegend call as combined data layer doesn't use a legend
});

document.getElementById("btn-schooling").addEventListener("click", () => {
    activeLayer = "schooling";
    map.setLayoutProperty("combined-layer", "visibility", "none");
    map.setLayoutProperty("income-layer", "visibility", "none");
    map.setLayoutProperty("schooling-layer", "visibility", "visible");
    document.getElementById("legend").style.visibility = "visible";
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
    document.getElementById("legend").style.visibility = "visible";
    updateLegend("income");
    document.getElementById("btn-combinedata").classList.remove("active");
    document.getElementById("btn-schooling").classList.remove("active");
    document.getElementById("btn-income").classList.add("active");
});

features = null; //update global variable here for features

//click function for when you click on a country and a pop up appears + call chart function to show chart data
map.on("click", (e) => {
    let features = map.queryRenderedFeatures(e.point, {
        layers: ["combined-layer", "income-layer", "schooling-layer"]
    });

    //Is for education and schooling layer and is prep work for the charts to make sure the charts show one column for each year of data, with the data being shown depending on the country selected
    //1. create a variable that is declared by getting current selected country name and store into a variable (use features.properties, specifically features[0].properties["COUNTRY"])
    let curr_sel_country_name = features[0].properties["COUNTRY"] //variable for currently selected country name
    
    //2. create two empty arrays that will each eventually be 21 items long since there is 21 years: one for education data for the selected country ("education_allyears_data_sel_country"), 
    //and one for income data for the selected country ("income_allyears_data_sel_country")
    let education_allyears_data_sel_country = []
    let income_allyears_data_sel_country = []
    
    //3. for each (use for each loop that goes thorugh yearsRange array) year:
        //first get merged_CURRYEAR.geojson file under /assets/CURRYEAR. Do this with the following but create different variables that are not called "response" and "worldData" and do so in the loadData function, yes this does mean several repeated lines of code: 
        //and also create an array that contains each of these "datasets" such as worldData_2000 for the year 2000. See code in two comments below for how to do the response and worlddata thing, see loadData function for actual variables
        //let response = await fetch(`assets/${currentYear}/merged_${currentYear}.geojson`); //the backticks are for string literals, have to use these to use variable name in string name
        //worldData = await response.json();
        //second get variable that is the row with index that matches same name as "current selected country" and store this into a varible (lets call it "country_datarow" for now), 
        //third index into this variable which might be an array or a dictionary and first use a print statement to view this "row", 
        //fourth do two indexings: 
            //- first attempt to index through and get the index number as in arrayname[#] that has the INCOME value and use education_allyears_data_sel_country.push(VALUE FOUND IN THIS STEP) to add the value to the array
            //- second attempt to index through and get the index number as in arrayname[#] that has the AVG_YR_SCH value and use income_allyears_data_sel_country.push(VALUE FOUND IN THIS STEP) to add the value to the array
    
    //array below contains each of the "datasets" such as worldData_2000 for the year 2000, these datasets are created in the loadData function as need the "await" function which only can occur there
    let worldData_array = [worldData_2000, worldData_2001, worldData_2002, worldData_2003, worldData_2004, worldData_2005, worldData_2006, worldData_2007, worldData_2008, worldData_2009, worldData_2010, worldData_2011, worldData_2012, worldData_2013, worldData_2014, worldData_2015, worldData_2016, worldData_2017, worldData_2018, worldData_2019, worldData_2020, worldData_2021] 
    for (let curr_year_in_yearsRange = 0; curr_year_in_yearsRange <= 21; curr_year_in_yearsRange++) { //has to be equal to 20 to fix off by 1 error and for indexing
        curr_dataset = worldData_array[curr_year_in_yearsRange]
        //NOTE: worldData_array[curr_year_in_yearsRange] is the "current dataset", is similar to worldData, but is a specific dataset from the array worldData_array retrieved by index
        //Referenced this source to index through dictionaries: https://stackoverflow.com/questions/3337367/checking-length-of-dictionary-object
        //for each row in worldData.features output, do this by legnth of worldData.features
        //if worldData.features[curr index in loop] == curr_sel_country_name
            //add to array worldData.features[curr index in loop].properties["AVG_YR_SCH"] //get row index, then index into the row and get the AVG_YR_SCH value and add it to the array
        for (let i = 0; i <= Object.keys(curr_dataset.features).length; i++) {
            if (curr_dataset.features[i].properties["COUNTRY"] == curr_sel_country_name) {
                education_allyears_data_sel_country.push(curr_dataset.features[i].properties["AVG_YR_SCH"])
                income_allyears_data_sel_country.push(curr_dataset.features[i].properties["INCOME"])
                break; //used to break out of inner loop if match is found, is necessary or fails to show multiple years of data as loop does not break otherwise as it needs to
            } 
        }
    }    
    if (!features.length) return;
    
    lnglat = features[0].geometry.coordinates[0][0][0];  
    console.log("curr lnglat", lnglat);
    let props = features[0].properties;
    
    let income = clean(parseFloat(props.INCOME));
    let schooling = clean(parseFloat(props.AVG_YR_SCH));
    
    document.getElementById("country-name").innerHTML = props.COUNTRY;
    document.getElementById("income").innerHTML = income === null ? "No Data" : income.toLocaleString();
    document.getElementById("schooling").innerHTML = schooling === null ? "No Data" : schooling;
    
    //4. Send the array values to the generateFunction function and call the function passing those two arrays in (see previous steps 1-3 in code section above)      
    if (activeLayer == "combinedata") { //for combined data layer

        //1. to find avg educ years for current year (current year data is called worldData)
        for (let i = 0; i <= worldData.features.length - 1; i++) { //Missing a coountry for some reason so added a -1?
            if (worldData.features[i].properties.AVG_YR_SCH == -1) { //add 0 to average if value is -1
                average_global_schoolingyears += 0;    
            } else { //add current value to average if not -1
                average_global_schoolingyears += worldData.features[i].properties["AVG_YR_SCH"];
            }
        }
        average_global_schoolingyears = average_global_schoolingyears / worldData.features.length; //should be divided by 252, but am using .features.length here, there is 252 countries

        //2. to find avg income amount for current year (current year data is called worldData)
        for (let i = 0; i <= worldData.features.length - 1; i++) { //Missing a coountry for some reason so added a -1?
            if (worldData.features[i].properties.INCOME == -1) { //add 0 to average if value is -1
                average_global_income += 0;    
            } else { //add current value to average if not -1
                average_global_income += worldData.features[i].properties["INCOME"];
                //console.log("CURR AVG INCOME:", average_global_schoolingyears)
            }
        }
        average_global_income = average_global_income / worldData.features.length; //should be divided by 252, but am using .features.length here, there is 252 countries

        //3. Find average between (current country education/schooling value / global avg income) + (current country income value / global avg income)
        if (schooling == -1) { //is for if schooling value is -1, in that case assign 0 for schooling / average_global_schoolingyears
            avg_between_schooling_educ_and_curr_country_data = ((0) + (income / average_global_income)) / 2; //find average between (current country education/schooling value / global avg income) + (current country income value / global avg income)
        } else if (income == -1) { //is for if income value is -1, in that case assign 0 for income / average_global_income
            avg_between_schooling_educ_and_curr_country_data = ((schooling / average_global_schoolingyears) + (0)) / 2; //find average between (current country education/schooling value / global avg income) + (current country income value / global avg income)
        } else { //normal case for when there is no missing data for current education or income for the current country
            avg_between_schooling_educ_and_curr_country_data = ((schooling / average_global_schoolingyears) + (income / average_global_income)) / 2; //find average between (current country education/schooling value / global avg income) + (current country income value / global avg income)
        }
        generateChart(average_global_schoolingyears, average_global_income, avg_between_schooling_educ_and_curr_country_data, income, schooling); //pass in five parameters: average years of schooling (average_global_schoolingyears), and avg global income for all countries (average_global_income) for current year (currentYear), the average between the two and the current country, as well as "income" and "schooling" parameters

    } else { //for income or education (aka schooling) layer, pass in the two arrays created earlier (education_allyears_data_sel_country and income_allyears_data_sel_country accordingly for education and income) 
        generateChart(null, null, null, income_allyears_data_sel_country, education_allyears_data_sel_country) //here instead of income, schooling, we pass in the appropriate arrays for income data for all years for the selected country and same for the education data. Also first three variables are null as don't need any of the global averages here for income and schooling maps
    }

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

//function to show the charts and get data values for it
function generateChart(avg_schooling, avg_income, avg_relative_to_world, income, schooling) {
    if (activeLayer == "combinedata") { //first case for combined data
        if (chart) chart.destroy();
        chart = c3.generate({
            bindto: "#chart",
            data: {
                columns: [
                    ["Avg Global Schooling", avg_schooling],
                    ["Avg Global Income ($1000)", avg_income / 1000 || 0],
                    ["schooling income percentages relative to global average", avg_relative_to_world],
                    ["Income ($1000)", income / 1000 || 0], //divide by 1000 to make education more visible
                    ["Schooling (Avg Years)", schooling || 0]
                ],
                type: "bar",
                colors: {
                    "Avg Global Schooling":  "#845f00",
                    "Avg Global Income":  "#1100ff",
                    "schooling income percentages relative to global average":  "#ffdd00",
                    "Income ($1000)": "#54278f",
                    "Schooling (Avg Years)": "#2ca25f"
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
                    ["Schooling"].concat(schooling) //is Schooling, year, year, year, etc (is concating to an array and is formatting of how columns parameter works)
                ],
                type: "bar",
                colors: {
                    "Schooling": "#2ca25f"
                }
            },
            tooltip: {
                format: {
                    value: function (value) { //"value" parameter is the value for that year of data
                        return value === 0 ? "No Data" : value;
                    }
                }
            },
            axis: {
                x: { type: "category", categories: yearsRange, label: "Years" }, //yearsRange is the "x axis" label and is the years 2000 to 2021 array
                y: {type: 'linear', label: 'Avg Yaers of Educ'}
            }
        });
    } else { //third case for income data
        if (chart) chart.destroy();
        chart = c3.generate({
            bindto: "#chart",
            data: {
                columns: [
                    ["Income"].concat(income)
                ],
                type: "bar",
                colors: {
                    "Income": "#54278f",
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
                x: { type: "category", categories: yearsRange, label: "Years" }
                , y: {type: 'linear', label: 'Income (USD)'}
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
// https://www.w3schools.com/howto/howto_js_collapse_sidebar.asp

// Set the width and heigh of the sidebar (show it) 
function openNav() {
    document.getElementById("mySidepanel").style.padding = "0px 0px 0px 0px"; //padding to left is 0px
    document.getElementById("mySidepanel").style.width = "30%";
    document.getElementById("mySidepanel").style.height = "100%";
    //line below hides nav button and makes invisible
    document.getElementsByClassName("openbtn")[0].style.visibility = "hidden"; //have to select first instacne of class opnbutton since is an array (there can be multiple opnbutton elemnts with that class name)
}

// Set the width of the sidebar to 0 (hide it)
function closeNav() {
    document.getElementById("mySidepanel").style.padding = "0px 0px 0px 0px"; //remove left padding to remove black bar on left 
    document.getElementById("mySidepanel").style.width = "0";
    //line below puts nav button back and makes visible
    document.getElementsByClassName("openbtn")[0].style.visibility = "visible"; //have to select first instacne of class opnbutton since is an array (there can be multiple opnbutton elemnts with that class name)
}


