// import { useEffect, useRef, useState } from "react";
// import mapboxgl from "mapbox-gl";
// import "mapbox-gl/dist/mapbox-gl.css";

// const INITIAL_CENTER: [number, number] = [-74.0242, 40.6941];
// const INITIAL_ZOOM: number = 10.12;

// const AffordabilityNYC = () => {
//   const mapRef = useRef<mapboxgl.Map | null>(null);
//   const mapContainerRef = useRef<HTMLDivElement | null>(null);

//   const [center, setCenter] = useState<[number, number]>([
//     INITIAL_CENTER[0],
//     INITIAL_CENTER[1],
//   ]);
//   const [zoom, setZoom] = useState<number>(INITIAL_ZOOM);

//   useEffect(() => {
//     mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
//     if (!mapRef.current && mapContainerRef.current) {
//       mapRef.current = new mapboxgl.Map({
//         container: mapContainerRef.current,
//         center: INITIAL_CENTER,
//         zoom: INITIAL_ZOOM,
//       });

//       mapRef.current.on("move", () => {
//         const mapCenter = mapRef.current!.getCenter();
//         const mapZoom = mapRef.current!.getZoom();
//         setCenter([mapCenter.lng, mapCenter.lat]);
//         setZoom(mapZoom);
//       });
//     }

//     return () => {
//       if (mapRef.current) {
//         mapRef.current.remove();
//         mapRef.current = null;
//       }
//     };
//   }, []);

//   return (
//     <div className='container mx-auto flex-1 px-2 py-8 sm:px-4 lg:px-6'>
//       <h1 className='text-3xl font-bold mb-4'>
//         Affordability in New York City
//       </h1>

//       <p className='text-lg text-gray-700 mb-4'>
//         This map displays the affordability of the New York City neighborhoods
//         based on the median income and median rent.
//       </p>

//       <div className='mb-4 text-sm text-gray-600'>
//         <p className='font-bold'>Adjust the slider to zoom in or out</p>
//         <input
//           type='range'
//           min='0'
//           max='20'
//           value={zoom}
//           onChange={(e) => {
//             const newZoom = parseFloat(e.target.value);
//             setZoom(newZoom);
//             if (mapRef.current) {
//               mapRef.current.setZoom(newZoom);
//             }
//           }}
//         />
//       </div>

//       {/* Reset view button */}
//       <button
//         className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-8'
//         onClick={() => {
//           setCenter(INITIAL_CENTER);
//           setZoom(INITIAL_ZOOM);
//           if (mapRef.current) {
//             mapRef.current.setCenter(INITIAL_CENTER);
//             mapRef.current.setZoom(INITIAL_ZOOM);
//           }
//         }}
//       >
//         Reset View
//       </button>

//       {/* Map container with sidebar overlay */}
//       <div className='map-app-container'>
//         <div className='map-sidebar'>
//           Longitude: {center[0].toFixed(4)} | Latitude: {center[1].toFixed(4)} |
//           Zoom: {zoom.toFixed(2)}
//         </div>
//       </div>

//       <div
//         ref={mapContainerRef}
//         className='map-container'
//         style={{ height: "500px" }}
//       />
//     </div>
//   );
// };

// export default AffordabilityNYC;
