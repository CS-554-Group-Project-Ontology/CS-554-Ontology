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

#### `New York City` Neighborhoods GeoJson map data

```
https://gist.githubusercontent.com/PollefeysC/da321dabb6455a52cfe0e121b314da51/raw/2725bf0b9ca897c590bdb592040ab587e4348725/nyc.geojson
```

#### `San Francisco` Neighborhoods GeoJson map data

```
https://gist.githubusercontent.com/PollefeysC/f2f3bc6cb40e1edcaa0ae94c48c14cab/raw/0927e4107ea832d01de8dae70e0c8efc05ae780f/sf.geojson
```

#### `Houston` Neighborhoods GeoJson map data

```
https://gist.githubusercontent.com/PollefeysC/4158b5b31f2e862362fef059da811dfb/raw/8612c7813439f31b9773b59c1446f62f64973670/houston.geojson
```

#### To `add a new City` with it's Neighborhoods GeoJson map data (Eg. Jersey City)

`a.` Get the GeoJson api file for that city and add it with the geo-location and zoom to the `constants.ts` file like below

```
export const JERSEY_CITY_GEOJSON_URL = 'https://gist.githubusercontent.com/mdiallo24/a1fcd6d66a60fd759280e244bddc44d1/raw/73e6adf9f2e19e21d418f0bbb126847a4e9ca2c4/jc.geojson';

export const JERSEY_CITY_INITIAL_CENTER: [number, number] = [-74.0885, 40.7257];
export const JERSEY_CITY_INITIAL_ZOOM: number = 11.61;
```

`b.` Then add the city config in the `affordabilityCityConfig.ts` file like below

```
jc: {
    slug: 'jc',
    cityTitle: 'Jersey City',
    profileCity: 'Jersey City',
    sourceIdPrefix: 'jc',
    geoJsonUrl: JERSEY_CITY_GEOJSON_URL,
    initialCenter: JERSEY_CITY_INITIAL_CENTER,
    initialZoom: JERSEY_CITY_INITIAL_ZOOM,
  },
```

`c.` Voila - you can now visit the city's map by replacing `slug` with city slug (`eg: jc`)

```
http://localhost:5173/affordability/:slug
```

### IV - How to run the application

#### 1. Environment variables

Make sure you add the `.env` files containing the below variables on each directory below.

The `MONGO_URL`, `KAFKA_PUBLIC`, `REDIS_URL`, `FRED_REDIS_URL`, and `AUTH_REDIS_URL` values can point to the hosted Railway/Atlas instances or to your own local services (for example `mongodb://localhost:27017`, `redis://localhost:6379`, `localhost:9092`). Edit the URLs in the env files to use local instead of hosted.

##### a. Add Backend `.env` file at `/project_root/back_end` folder

```
MONGO_URL=your_mongo_db_url
FIREBASE_PROJECT_ID=ontology-id
FIREBASE_CLIENT_EMAIL=your_firebase_client_email
FIREBASE_PRIVATE_KEY=your_firebase_private_key
FRED_API_KEY=your_fred_api_key
FRED_REDIS_URL=your_redis_url
AUTH_REDIS_URL=redis:your_auth_redis_url
```

##### b. Add Frontend `.env` file at `/project_root/front_end` folder

```
VITE_FIREBASE_KEY=your_firebase_key
VITE_FIREBASE_DOMAIN=ontology-id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=ontology-id
VITE_FIREBASE_STORAGE_BUCKET=ontology-id.firebasestorage.app
VITE_FIREBASE_SENDER_ID=your_firebase_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
VITE_MAPBOX_ACCESS_TOKEN=your_mapbox_access_token
VITE_BACKEND_URL=your_backend_server_url
VITE_STREAM_URL=your_kafka_stream_server_url
```


##### c. Add kafka_layer `.env` file at `/project_root/kafka_layer` folder

```
KAFKA_PUBLIC=your_kafka_broker_url
X_BEARER_TOKEN=your_x_bearer_token
```

##### d. Add redis_streams_layer `.env` file at `/project_root/redis_streams_layer`  folder

```
REDIS_URL=your_redis_url
ALPHA_VANTAGE_KEY=your_alpha_vantage_key
KAFKA_PUBLIC=your_kafka_broker_url
```


#### 2. Install dependencies

##### `a`. Install dependencies by running below cmd from `/project_root` folder

```
npm install
```

##### `b`. Install Server dependencies by running below cmd from `/back_end` folder

```
cd back_end
npm install
```

##### `c`. Install Client dependencies by running below cmd from `/front_end` folder

```
cd front_end
npm install
```

##### `d`. Install kafka_layer dependencies by running below cmd from `/kafka_layer` folder

```
cd kafka_layer
npm install
```

##### `e`. Install redis_streams_layer dependencies by running below cmd from `/redis_streams_layer` folder

```
cd redis_streams_layer
npm install
```

#### 3. Run both Server and Client from root directory `/project_root`

```
npm run dev
```

#### 4. Visit the application

```
http://localhost:5173/
```

#### 5. If you want to visit the Server then go to

```
http://localhost:4000/
```

#### 6. If you want to clear Server cache, then go to

```
cd back_end
set -a && source .env && set +a
redis-cli -u "$FRED_REDIS_URL" flushall
redis-cli -u "$AUTH_REDIS_URL" flushall
```

#### 7. Production
The production environment is deployed on Railway. Railway uses Railpack to infer the runtime and build time environment from the connected GitHub repository which in this case is our main branch.

The application is split into separate services so each layer can be deployed independently and connected through environment variables. Locally, `npm run dev` from `/project_root` starts all four layers concurrently.

Production Link:
https://ontologyfrontend-production.up.railway.app

Services:
- project_root/front_end
- project_root/back_end
- project_root/kafka_layer
- project_root/redis_streams_layer
