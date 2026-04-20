# Stevens Institute of Technology - CS 554 Web Programming II - Spring 2026

## Project Name: `Ontology`

## Group: `CtrlAltElite`

### Team Members

- Amaan Rajguru (<arajguru@stevens.edu>)
- Cedric Pollefeys (<cpollefe@stevens.edu>)
- Elijah Gervais (<egervais@stevens.edu>)
- Mamadou Diallo (<mdiallo2@stevens.edu>)

### I - Introduction

The purpose of this project `Ontology` is to give the financially aware user an easy-to-use application that actively tracks their financial status and recommends methods to improve their economic stability. The application aims to reduce the obfuscation that often accompanies financial decision making by structuring a user’s financial data into attainable goals that they can pursue.

By providing clear insights into income allocation and financial behavior, users will be
able to maintain a stable lifestyle and build long-term financial security through retirement
planning and asset growth.

The system will generate a financial dashboard using the information provided by the
user. This dashboard will compute financial metrics and offer comparisons between different
financial instruments such as bonds, savings accounts, and other low-risk financial vehicles.

The platform will also inform users of emerging economic opportunities or potential
financial constraints that may affect their future financial outlook. For users interested in
the stock market, the system will provide a foundational view of market data and real-time
financial indicators.

The central research question the project seeks to address is:
Given a user’s current economic circumstances, how likely are they to experience upward mobility in terms of economic and financial stability?

### II - GitHub Repo

```
https://github.com/CS-554-Group-Project-Ontology/CS-554-Ontology
```

### III - Dataset

#### New York City, Sans Francisco and Houston Neighborhoods GeoJson map data

Documentation of how to use the geoJson data

```
https://gist.github.com/ix4/ff7603f48283cf06fc4fb3dfb6a0635c?short_path=5cdd9db
```

API GeoJson Data

NYC

```
https://gist.githubusercontent.com/ix4/ff7603f48283cf06fc4fb3dfb6a0635c/raw/3eae4056c9d4de99f0040b6bedbd9ba547e8d215/nyc.geojson
```

Sans Francisco

```
https://raw.githubusercontent.com/codeforgermany/click_that_hood/main/public/data/san-francisco.geojson
```

Houston

```
https://raw.githubusercontent.com/blackmad/neighborhoods/refs/heads/master/gn-houston.geojson
```

### IV - How to run the application

#### 1. Install dependencies by running below cmd from `/project_root` folder

```
npm install
```

#### 2. Install Server dependencies by running below cmd from `/back_end` folder

```
cd back_end
npm install
```

#### 3. Install Client dependencies by running below cmd from `/front_end` folder

```
cd front_end
npm install
```

#### 4. Ensure a Redis instance is running on the default port `6379` (required by the backend cache)

#### 5. Run both Server and Client from root directory `/project_root`

```
npm run dev
```

#### 6. Visit the application

```
http://localhost:5173/
```

#### 7. If you want to visit the Server then go to

```
http://localhost:4000/
```

#### 8. If you want to clear Server cache, then go to

```
cd back_end
redis-cli flushall
```
