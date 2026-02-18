# Income_And_Years_Of_Education_Worldwide
Group 3: Lilian Law, Nina Jiang, Yijia Liu

---

## **Overview of Project:**
For our final project we are planning to make an interactive web map that explores the relationship between education and income across different countries in the world (the scope of this map is worldwide and focuses on data per country). We want to visualize how average years of schooling correlate with average annual wages, and use the map to highlight broad global patterns as well as regional differences. 

## **Maps:**
The idea is to make these connections easy to see by using three maps, each being able to be viewed with a checkbox system. The first map will be a choropleth map showing both education and income data for the countries for that year with the ability to hover over a country to view data about the income and average amount of years of schooling for that year in that country and also include a slider to select a year to show data from.

The second and third maps will be of two choropleth layers, one map being for education and the other map being for income. Both maps will allow users to hover over individual countries to view pop‑ups with key statistics (with checkboxes in a menu to select what data aka columns from the data such as years of education to show in the pop up), such as the annual average wages or years of education, and short explanations. There also will be an included slider to select a year to show data from. 

## **Project Intent and Audience:** 
Our hope is that this map can serve as a simple but informative tool for understanding how educational attainment may be linked to economic outcomes and assist in teaching future educators and education administrators about this potential predicted correlation between increased education years and higher income.

The primary audience for this project includes government officials, especially those working in education or labor policy, as well as education administrators (such as superintendents), teachers, education researchers, and students and general publics who are interested in learning about global inequality. 

## **Project Datasets:**
We plan to use two publicly available datasets to build the map: 1. The Average Years of Schooling Among Adults dataset from Our World in Data, which offers global education indicators; and  2. The Average Annual Wages dataset from the OECD, which provides comparable wage data (converted to USD using the 2024 rate) across many countries. For now we are planning to use the 2000-2023 section of both datasets, and do data cleaning to cut out unrelated data for our project. We will also use 3. a global country shapefile to combine with these datasets for visualization. Additionally for the first map as described above, after doing initial cleaning we plan to create an additional dataset from combining the resulting cleaned datasets using a merge on the country names or on the country short letter codes (such as US for United States) (for example the education dataset for 2012, the income dataset for 2012, and the country shapefile would all be merged on the country name or the short country letter codes accordingly to create one data file, and this process would be repeated for each year in the datasets in the range we selected, so from 2000 to 2023).

- The Average Years of Schooling Among Adults dataset from Our World in Data: [https://ourworldindata.org/grapher/years-of-schooling](https://ourworldindata.org/grapher/years-of-schooling)
- The Average Annual Wages dataset from the OECD: [https://data-explorer.oecd.org/vis?fs[0]=Topic%2C1%7CEmployment%23JOB%23%7CBenefits&pg=0&fc=Topic&bp=true&snb=21&df[ds]=dsDisseminateFinalDMZ&df[id]=DSD_EARNINGS%40AV_AN_WAGE&df[ag]=OECD.ELS.SAE&df[vs]=1.0&dq=......&pd=2000%2C&to[TIME_PERIOD]=false&vw=tb](https://data-explorer.oecd.org/vis?fs[0]=Topic%2C1%7CEmployment%23JOB%23%7CBenefits&pg=0&fc=Topic&bp=true&snb=21&df[ds]=dsDisseminateFinalDMZ&df[id]=DSD_EARNINGS%40AV_AN_WAGE&df[ag]=OECD.ELS.SAE&df[vs]=1.0&dq=......&pd=2000%2C&to[TIME_PERIOD]=false&vw=tb)
- Global country shapefile for basemap and for merging to datasets: [https://hub.arcgis.com/datasets/esri::world-countries-generalized/explore?location=-26.635437%2C39.726562%2C1](https://hub.arcgis.com/datasets/esri::world-countries-generalized/explore?location=-26.635437%2C39.726562%2C1) 

## **Multimedia:** 
We are still deciding what multimedia elements to include, but after talking with the TA, we are expecting to add whatever is necessary when working on the project, such as text explanations, legends, or small images, or links to media or videos to make the final map clear and engaging.

## **Projects We Intend to Learn From (Project Inspiration) + Screenshots of the Projects:**
Here are the screenshots of projects we plan to learn from:

![Years of Schooling map](/img/yearsofschooling.png)
This project visualizes global years of schooling by level of education and gender, with a time slider and pop-ups.

![Income map](/img/income.png)
This project shows the Adjusted net national income per capita (current US$), also with time slider and pop-ups when hovering to a country.



