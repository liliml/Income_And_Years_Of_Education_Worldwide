# Income_And_Years_Of_Education_Worldwide
Group 3: Lilian Law, Nina Jiang, Yijia Liu

---

## **Overview of Project:**
This project uses three interactive maps to explore and visualize the relationship between education and income 
(how average years of schooling correlates with annual wages) across different countries in the world. 
The maps also highlight broad global patterns as well as regional differences.

## **Maps:**
The idea of this project is to make the connection between years of schooling (education) and adjusted net national income per capita (income) easy to see by using three maps, each being able to be viewed with different map tabs on a side panel of the map. The first map (combined data tab) is a map showing both education and income data for the countries for that year with the ability to click on a country to view data about the income and average years of schooling for that year in that country. This map also includes a time slider to select a year of data to display ranging from 2000 to 2021.

The second (education tab) and third maps (income tab) will be of two choropleth map layers, one map being for education and the other map being for income. Both maps will allow users to click on individual countries to view a pop‑up with key statistics (education and income data for combined data tab, education data for education tab, and income data for the income tab) that correspond to the selected map tab. The map tabs in the side panel also select what data columns from the data such as years of education for the education tab to show in the side panel. There also is an included time slider to select of data to display ranging from 2000 to 2021. 

For our basemap, we chose to use one of the basemaps from Mapbox called Mapbox Dark [mapbox://styles/mapbox/dark-v10](mapbox://styles/mapbox/dark-v10) because it displays the color scheme of the maps nicely and creates a coherent appearance when combined with the panel style and color (an overall dark theme).

## **Project Intent and Audience:** 
The hope is that this project can serve as a simple but informative tool for understanding how educational attainment may be linked to economic outcomes and assist in teaching future educators and education administrators about this potential correlation between increased education years and higher income. The primary audience for this project includes government officials, especially those working in education or labor policy, as well as education administrators (such as superintendents), teachers, education researchers, students, and the general public who might be interested in learning about global inequality.

## **Project Datasets:**
This project used three publicly available datasets. 
The dataset chosen to show the average years of education by country was a dataset from Our World Data called "average years of schooling" (average-years-of-schooling-among-adults.csv). 
The dataset chosen to show income data was titled "adjusted net national income per capita" (API_NY.ADJ.NNTY.PC.CD_DS2_en_csv_v2_7997.csv) from the World Bank Group. 
The third dataset called "world countries generalized" (World_Countries_(Generalized)_9029012925078512962.geojson) was from ArcGIS Hub, 
and was chosen for country shapes and for merging to the other datasets. 
The year range chosen was from 2000 to 2021 as it was the greatest range of data that was able to avoid the following problem: 
earlier and later data had incomplete entries or different numbers of countries which is not ideal when merging the initial schooling (education) and income data to the countries dataset. 
These datasets were chosen as they were easy to work with and contained sufficient data, specifically for country names as the data file for the countries from arcgis had 252 countries, 
and we wanted the data to have the same number of rows (or at least not missing too many countries) when being merged to the countries dataset.

1. The Average Years of Schooling Among Adults dataset from Our World in Data, which provides the average number of years adults aged 25 and older have spent in formal education: [https://ourworldindata.org/grapher/years-of-schooling](https://ourworldindata.org/grapher/years-of-schooling) 

2. The Adjusted net national income per capita (current US$) from the World Bank Group, which provides comparable wage data (converted to USD using the 2024 rate) across many countries: [https://data.worldbank.org/indicator/NY.ADJ.NNTY.PC.CD](https://data.worldbank.org/indicator/NY.ADJ.NNTY.PC.CD)   
 
3. World Countries Generalized from ArcGIS Hub for country shapes and for merging to datasets: [https://hub.arcgis.com/datasets/esri::world-countries-generalized](https://hub.arcgis.com/datasets/esri::world-countries-generalized)

The image below is of the resulting merged dataset for the year 2000 geojson file using geojson.io view

![2000 dataset merged](/img/merged_2000_data.png)

## **Insiration and Template Projects:**

### **We used the following projects as initial inspiration for this project:**
- Our World In Data project that visualizes global years of schooling by level of education and gender, with a time slider and pop-ups: [https://ourworldindata.org/grapher/years-of-schooling?time=2023&metric_type=average_years_schooling&level=all&sex=both](https://ourworldindata.org/grapher/years-of-schooling?time=2023&metric_type=average_years_schooling&level=all&sex=both)
- World Bank Group project that shows the adjusted net national income per capita (current US$), also with time slider and pop-ups when hovering to a country: [https://data.worldbank.org/indicator/NY.ADJ.NNTY.PC.CD?view=map&year=2021](https://data.worldbank.org/indicator/NY.ADJ.NNTY.PC.CD?view=map&year=2021)

### **Template and Reference Maps and Projects:**
- To create the maps and rough draft of the side panel for the maps, lab 6 was used as a template and reference. Link to lab 6 (making a smart dashboard): [https://github.com/jakobzhao/geog458/tree/master/labs/lab06](https://github.com/jakobzhao/geog458/tree/master/labs/lab06)
- To create the geonarraive layout (the slides without the maps), lab 7 was used as a template and reference. Link to lab 7 (making a map-based storytelling project): [https://github.com/jakobzhao/geog458/tree/master/labs/lab07](https://github.com/jakobzhao/geog458/tree/master/labs/lab07)
- A 3D version of this map was attempted however time was limited and was unable to finish the 3d version of the maps. The orginal 3d project referenced was about resturant compaints in NYC. The project can be viewed here: [https://labs.mapbox.com/bites/00304/](https://labs.mapbox.com/bites/00304/)
    - The unfinished version of the 3d maps project GitHub repsository can be viewed here: [https://github.com/liliml/geog-458-finalprojectprep3dmap-part2](https://github.com/liliml/geog-458-finalprojectprep3dmap-part2)
    - The unfinished version of the 3d maps project web interface can be viewed here: [https://liliml.github.io/geog-458-finalprojectprep3dmap-part2/](https://liliml.github.io/geog-458-finalprojectprep3dmap-part2/)

## Prototype Visual:
The following images are of our initial protototype of the project which has changed over development. We chose to use charts instead of data tables in the map side panel. 

![project prototype img1](/img/prototype1.png)
![project prototype img2](/img/prototype2.png)
![project prototype img3](/img/prototype3.png)

