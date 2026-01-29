// import { useEffect, useMemo, useState } from 'react'
// import {
//   MapContainer,
//   TileLayer,
//   CircleMarker,
//   Popup,
//   useMap,
// } from 'react-leaflet'
// import 'leaflet/dist/leaflet.css'
// import '../../utils/leafletFix'

// /* 🔥 Recenter map whenever coordinates change */
// const MapCenterUpdater = ({ lat, lng }) => {
//   const map = useMap()

//   useEffect(() => {
//     if (Number.isFinite(lat) && Number.isFinite(lng)) {
//       map.setView([lat, lng], map.getZoom(), { animate: true })
//     }
//   }, [lat, lng, map])

//   return null
// }

// const LocationTracing = ({ data }) => {
//   const [isFullscreen, setIsFullscreen] = useState(false)

//   /* ✅ Get latest point */
//   const latest = useMemo(() => {
//     if (!Array.isArray(data) || data.length === 0) return null

//     const sorted = [...data]
//       .filter(d => d.timestamp)
//       .sort(
//         (a, b) =>
//           new Date(a.timestamp).getTime() -
//           new Date(b.timestamp).getTime()
//       )

//     return sorted[sorted.length - 1] || null
//   }, [data])

//   const lat = Number(latest?.latitude)
//   const lng = Number(latest?.longitude)
//   const humidity = Number(latest?.humidity)

//   const safeLat = Number.isFinite(lat) ? lat : 23.5
//   const safeLng = Number.isFinite(lng) ? lng : 77.2
//   const safeHumidity = Number.isFinite(humidity) ? humidity : 0

//   const getColor = value => {
//     if (value < 40) return '#ef4444'
//     if (value < 80) return '#f59e0b'
//     return '#22c55e'
//   }

//   const getRadius = value =>
//     Math.max(6, Math.min(14, value / 5))

//   /* 🗺 Map JSX reused for normal + fullscreen */
//   const MapView = (
//     <MapContainer
//       center={[safeLat, safeLng]}
//       zoom={6}
//       style={{ height: '100%', width: '100%' }}
//       scrollWheelZoom
//     >
//       <MapCenterUpdater lat={safeLat} lng={safeLng} />

//       <TileLayer
//         attribution="&copy; OpenStreetMap contributors"
//         url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//       />

//       <CircleMarker
//         center={[safeLat, safeLng]}
//         radius={getRadius(safeHumidity)}
//         pathOptions={{
//           fillColor: getColor(safeHumidity),
//           color: getColor(safeHumidity),
//           fillOpacity: 0.6,
//         }}
//       >
//         <Popup>
//           <div className="text-black text-xs">
//             <p>Lat: {safeLat.toFixed(4)}</p>
//             <p>Lng: {safeLng.toFixed(4)}</p>
//             <p>Humidity: {safeHumidity.toFixed(1)}%</p>
//           </div>
//         </Popup>
//       </CircleMarker>
//     </MapContainer>
//   )

//   return (
//     <>
//       {/* 🔹 Normal panel */}
//       <div className="bg-panel-bg border border-panel-border rounded p-2 h-full flex flex-col overflow-hidden relative">
//         <h2 className="text-sm font-semibold mb-1 text-white">
//           location tracing
//         </h2>

//         {/* 🔘 Maximize button */}
//         <button
//           onClick={() => setIsFullscreen(true)}
//           className="absolute top-2 right-2 z-10 text-xs bg-black/60 text-white px-2 py-1 rounded hover:bg-black"
//         >
//           ⛶
//         </button>

//         <div className="flex-1 min-h-0 relative rounded overflow-hidden">
//           {MapView}
//         </div>

//         <div className="mt-1 flex items-center space-x-3 text-xs">
//           <Legend color="#ef4444" label="<40" />
//           <Legend color="#f59e0b" label="40–80" />
//           <Legend color="#22c55e" label="80+" />
//           <span className="text-gray-500 ml-2">Active device</span>
//         </div>
//       </div>

//       {/* 🔥 FULLSCREEN OVERLAY */}
//       {isFullscreen && (
//         <div className="fixed inset-0 z-[9999] bg-black">
//           {/* Close button */}
//           <button
//             onClick={() => setIsFullscreen(false)}
//             className="absolute top-4 right-4 z-[10000] text-white bg-black/70 px-3 py-1 rounded hover:bg-black"
//           >
//             ✕ Close
//           </button>

//           <div className="h-full w-full">
//             {MapView}
//           </div>
//         </div>
//       )}
//     </>
//   )
// }

// const Legend = ({ color, label }) => (
//   <div className="flex items-center space-x-1">
//     <div
//       className="w-3 h-3 rounded"
//       style={{ backgroundColor: color }}
//     />
//     <span className="text-gray-400">{label}</span>
//   </div>
// )

// export default LocationTracing


/// DAIICT ADDRESS
// const lat = Number(23.188528)
// const lng = Number(72.628914)


import { useEffect, useMemo, useRef, useState } from 'react'
import Map, {
  Marker,
  Popup,
  NavigationControl,
} from 'react-map-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN

const LocationTracing = ({ data }) => {
  const mapRef = useRef(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showPopup, setShowPopup] = useState(false)

  /* 🔎 Get latest device data */
  const latest = useMemo(() => {
    if (!Array.isArray(data) || data.length === 0) return null
    return [...data]
      .filter(d => d.timestamp)
      .sort(
        (a, b) =>
          new Date(a.timestamp).getTime() -
          new Date(b.timestamp).getTime()
      )
      .at(-1)
  }, [data])

  const lat = Number(latest?.latitude)
  const lng = Number(latest?.longitude)
// const lat = Number(23.188528)
// const lng = Number(72.628914)
  const humidity = Number(latest?.humidity)

  const safeLat = Number.isFinite(lat) ? lat : 23.5
  const safeLng = Number.isFinite(lng) ? lng : 77.2
  const safeHumidity = Number.isFinite(humidity) ? humidity : 0

  /* 🎥 Smooth camera follow */
  useEffect(() => {
    if (!mapRef.current) return
    mapRef.current.flyTo({
      center: [safeLng, safeLat],
      zoom: 7,
      pitch: 45,
      speed: 1.2,
      curve: 1.4,
      essential: true,
    })
  }, [safeLat, safeLng])

  /* 🎨 Color logic */
  const getColor = value => {
    if (value < 40) return '#ef4444'
    if (value <= 80) return '#f59e0b'
    return '#22c55e'
  }

  const color = getColor(safeHumidity)

  const MapView = (
    <Map
      ref={mapRef}
      mapboxAccessToken={MAPBOX_TOKEN}
      initialViewState={{
        latitude: safeLat,
        longitude: safeLng,
        zoom: 6,
      }}
      mapStyle="mapbox://styles/mapbox/streets-v12"
      style={{ width: '100%', height: '100%' }}
      scrollZoom
      dragPan
      doubleClickZoom
      attributionControl={false}
    >
      <NavigationControl position="bottom-right" />

      {/* 📍 Device marker (dot + pulse + glow) */}
      <Marker latitude={safeLat} longitude={safeLng}>
        <div
          className="device-marker"
          style={{ '--marker-color': color }}
          onClick={() => setShowPopup(true)}
        >
          <div className="pulse-ring" />
          <div className="center-dot" />
        </div>
      </Marker>

      {/* 🧾 Popup */}
      {showPopup && (
        <Popup
          latitude={safeLat}
          longitude={safeLng}
          closeOnClick={false}
          onClose={() => setShowPopup(false)}
          offset={22}
        >
          <div className="popup-card">
            <p><b>Latitude:</b> {safeLat.toFixed(4)}</p>
            <p><b>Longitude:</b> {safeLng.toFixed(4)}</p>
            <p>
              <b>Humidity:</b>{' '}
              <span style={{ color }}>
                {safeHumidity.toFixed(1)}%
              </span>
            </p>
          </div>
        </Popup>
      )}
    </Map>
  )

  return (
    <>
      {/* 🌞 Panel */}
      <div className="bg-white rounded-xl shadow-md p-2 h-full flex flex-col overflow-hidden relative">
        <h2 className="text-sm font-semibold mb-1 text-gray-800">
          Location Tracing
        </h2>

        <button
          onClick={() => setIsFullscreen(true)}
          className="absolute top-2 right-2 z-10 text-xs bg-gray-200 text-gray-800 px-2 py-1 rounded hover:bg-gray-300"
        >
          ⛶
        </button>

        <div className="flex-1 min-h-0 rounded overflow-hidden">
          {MapView}
        </div>

        {/* 📊 Legend */}
        <div className="mt-1 flex items-center space-x-3 text-xs">
          <Legend color="#ef4444" label="<40" />
          <Legend color="#f59e0b" label="40–80" />
          <Legend color="#22c55e" label=">80" />
          <span className="text-gray-500 ml-2">Live device</span>
        </div>
      </div>

      {/* 🔥 Fullscreen */}
      {isFullscreen && (
        <div className="fixed inset-0 z-[9999] bg-white">
          <button
            onClick={() => setIsFullscreen(false)}
            className="absolute top-4 right-4 z-[10000] bg-gray-200 px-3 py-1 rounded"
          >
            ✕ Close
          </button>
          {MapView}
        </div>
      )}
    </>
  )
}

const Legend = ({ color, label }) => (
  <div className="flex items-center space-x-1">
    <div
      className="w-3 h-3 rounded-full"
      style={{ backgroundColor: color }}
    />
    <span className="text-gray-600">{label}</span>
  </div>
)

export default LocationTracing
