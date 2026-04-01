import { useContext, useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { AuthContext } from "../context/AuthContext";

// Each of the 3 cities coordinates
const NYC_INITIAL_CENTER: [number, number] = [-74.0242, 40.6941];
const HOUSTON_INITIAL_CENTER: [number, number] = [-95.3698, 29.7604];
const SF_INITIAL_CENTER: [number, number] = [-122.4194, 37.7749];

// All 3 cities coordinates in a dictionary for easy access
const CITY = {
  "new-york-city": NYC_INITIAL_CENTER,
  houston: HOUSTON_INITIAL_CENTER,
  "san-francisco": SF_INITIAL_CENTER,
};

// Initial zoom level for the map
const INITIAL_ZOOM: number = 10.12;

const Affordability = ({ city }: { city: string }) => {
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);

  // track the current center and zoom level of the map
  const [center, setCenter] = useState<[number, number]>([
    NYC_INITIAL_CENTER[0],
    NYC_INITIAL_CENTER[1],
  ]);
  // track the zoom level of the map
  const [zoom, setZoom] = useState<number>(INITIAL_ZOOM);

  // get initial city center based on passed city from props
  const selectedCityCenter =
    CITY[city as keyof typeof CITY] || NYC_INITIAL_CENTER;

  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
    if (!mapRef.current && mapContainerRef.current) {
      mapRef.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        center: selectedCityCenter,
        zoom: INITIAL_ZOOM,
      });

      mapRef.current.on("move", () => {
        const mapCenter = mapRef.current!.getCenter();
        const mapZoom = mapRef.current!.getZoom();
        setCenter([mapCenter.lng, mapCenter.lat]);
        setZoom(mapZoom);
      });
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  return (
    <div className='container mx-auto flex-1 px-2 py-8 sm:px-4 lg:px-6'>
      <h1 className='text-3xl font-bold mb-4'>
        Affordability in{" "}
        {city === "new-york-city"
          ? "New York City"
          : city === "houston"
            ? "Houston"
            : "San Francisco"}
      </h1>

      <p className='text-lg text-gray-700 mb-4'>
        This map displays the affordability of the{" "}
        {city === "new-york-city"
          ? "New York City"
          : city === "houston"
            ? "Houston"
            : "San Francisco"}{" "}
        neighborhoods based on the median income and median rent.
      </p>

      {currentUser && (
        <div className='mb-4 p-4 bg-blue-100 rounded-lg'>
          <h2 className='text-xl font-bold mb-2'>Your Financial Profile</h2>
          <p className='text-lg'>Neighborhood: Downtown</p>
          <p className='text-lg'>Income: $50,000</p>
          <p className='text-lg'>Debt: $10,000</p>
        </div>
      )}

      <div className='mb-4 text-sm text-gray-600'>
        <p className='font-bold'>Adjust the slider to zoom in or out</p>
        <input
          type='range'
          min='0'
          max='20'
          value={zoom}
          onChange={(e) => {
            const newZoom = parseFloat(e.target.value);
            setZoom(newZoom);
            if (mapRef.current) {
              mapRef.current.setZoom(newZoom);
            }
          }}
        />
      </div>

      {/* Reset view button */}
      <button
        className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-8'
        onClick={() => {
          setCenter(selectedCityCenter);
          setZoom(INITIAL_ZOOM);
          if (mapRef.current) {
            mapRef.current.setCenter(selectedCityCenter);
            mapRef.current.setZoom(INITIAL_ZOOM);
          }
        }}
      >
        Reset View
      </button>

      {/* Map container with sidebar overlay */}
      <div className='map-app-container'>
        <div className='map-sidebar'>
          Longitude: {center[0].toFixed(4)} | Latitude: {center[1].toFixed(4)} |
          Zoom: {zoom.toFixed(2)}
        </div>
      </div>

      <div
        ref={mapContainerRef}
        className='map-container'
        style={{ height: "500px" }}
      />
    </div>
  );
};

export default Affordability;
