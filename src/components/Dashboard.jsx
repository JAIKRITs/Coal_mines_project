// import { useState, useEffect } from 'react'
// import Header from './Header'
// import TemperatureHumidityRelation from './charts/TemperatureHumidityRelation'
// import HumidityTemperatureTimeSeries from './charts/HumidityTemperatureTimeSeries'
// import HumidityMonitoring from './monitoring/HumidityMonitoring'
// import VoltageBarChart from './charts/VoltageBarChart'
// import LocationTracing from './maps/LocationTracing'
// import VoltageTemperatureDisplay from './monitoring/VoltageTemperatureDisplay'
// import GaugePanel from './monitoring/GaugePanel'
// import { generateMockData, getLatestValues } from '../utils/mockData'
// import { loadCSVData, filterByDevice, assignCoordinates } from '../utils/csvParser'
// import { fetchDeviceData } from '../utils/apiClient'

// const Dashboard = () => {
//   const [allData, setAllData] = useState([])
//   const [data, setData] = useState([])
//   const [selectedDevice, setSelectedDevice] = useState('device1')
//   const [lastUpdate, setLastUpdate] = useState(new Date())

//   // Load data on mount (PostgreSQL API with CSV fallback)
//   // useEffect(() => {
//   //   const loadData = async () => {
//   //     try {
//   //       // Try to load from backend API (PostgreSQL)
//   //       const apiData = await fetchDeviceData(selectedDevice)
//   //       const dataWithCoords = assignCoordinates(apiData)
//   //       setAllData(dataWithCoords)
//   //       setData(filterByDevice(dataWithCoords, selectedDevice))
//   //       setLastUpdate(new Date())
        
//   //       return
//   //     } catch (apiError) {
//   //       console.error('Error loading data from API, falling back to CSV:', apiError)
//   //     }

//   //     try {
//   //       // Fallback to CSV file
//   //       const csvData = await loadCSVData()
//   //       if (csvData && csvData.length > 0) {
//   //         const dataWithCoords = assignCoordinates(csvData)
//   //         setAllData(dataWithCoords)
//   //         setData(filterByDevice(dataWithCoords, selectedDevice))
//   //       } else {
//   //         const mockData = generateMockData()
//   //         setAllData(mockData)
//   //         setData(filterByDevice(mockData, selectedDevice))
//   //       }
//   //       setLastUpdate(new Date())
//   //     } catch (error) {
//   //       console.error('Error loading data from CSV, falling back to mock data:', error)
//   //       const mockData = generateMockData()
//   //       setAllData(mockData)
//   //       setData(filterByDevice(mockData, selectedDevice))
//   //       setLastUpdate(new Date())
//   //     }
//   //   }
    
//   //   // loadData()
    
//   //   // Update data every 10 seconds (matching the refresh rate in the image)
//   //   const interval = setInterval(() => {
//   //     loadData()
//   //   }, 10000)

//   //   return () => clearInterval(interval)
//   // }, [])

//   // Filter data when device changes
//   useEffect(() => {
//     const updateForDevice = async () => {
//       if (!selectedDevice) return

//       try {
//         const apiData = await fetchDeviceData(selectedDevice);
//         console.log("apiData", apiData);
//         const dataWithCoords = assignCoordinates(apiData)
//         setAllData(dataWithCoords)
//         setData(filterByDevice(dataWithCoords, selectedDevice))
//         setLastUpdate(new Date())
//       } catch (error) {
//         console.error('Error updating data for device from API, using existing data:', error)
//         if (allData.length > 0) {
//           const filtered = filterByDevice(allData, selectedDevice)
//           setData(filtered)
//           setLastUpdate(new Date())
//         }
//       }
//     }

//     // updateForDevice()
//     const interval = setInterval(() => {
//       updateForDevice()
//     }, 10000)

//     return () => clearInterval(interval)
//   }, [selectedDevice, allData])

//   const handleDeviceChange = (deviceId) => {
//     setSelectedDevice(deviceId)
//   }

//   const latestValues = getLatestValues(data)

//   return (
//     <div className="h-screen bg-dashboard-bg text-white flex flex-col overflow-hidden">
//       <Header 
//         lastUpdate={lastUpdate} 
//         selectedDevice={selectedDevice}
//         onDeviceChange={handleDeviceChange}
//       />
      
//       <div className="flex-1 p-2 overflow-auto">
//         <div className="h-full grid grid-rows-3 gap-2">
//           {/* Top Row */}
//           <div className="grid grid-cols-2 gap-2 min-h-0">
//             <TemperatureHumidityRelation data={data} />
//             <HumidityTemperatureTimeSeries data={data} />
//           </div>

//           {/* Middle Row */}
//           <div className="grid grid-cols-3 gap-2 min-h-0">
//             <HumidityMonitoring value={latestValues.humidity} data={data} />
//             <LocationTracing data={data} />
//             <VoltageBarChart data={data} />
//           </div>

//           {/* Bottom Row */}
//           <div className="grid grid-cols-2 gap-2 min-h-0">
//             <VoltageTemperatureDisplay 
//               voltage1={latestValues.voltage}
//               voltage2={latestValues.voltage + 0.02}
//               temperature1={latestValues.temperature}
//               temperature2={latestValues.temperature}
//             />
//             <GaugePanel 
//               humidity={latestValues.humidity}
//               temperature={latestValues.temperature}
//               voltage={latestValues.voltage}
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default Dashboard

import { useState, useEffect } from 'react'
import Header from './Header'
import TemperatureHumidityRelation from './charts/TemperatureHumidityRelation'
import HumidityTemperatureTimeSeries from './charts/HumidityTemperatureTimeSeries'
import HumidityMonitoring from './monitoring/HumidityMonitoring'
import VoltageBarChart from './charts/VoltageBarChart'
import LocationTracing from './maps/LocationTracing'
import VoltageTemperatureDisplay from './monitoring/VoltageTemperatureDisplay'
import GaugePanel from './monitoring/GaugePanel'
// import { getLatestValues } from '../utils/mockData'
import { fetchDeviceData } from '../utils/apiClient'

const Dashboard = () => {
  const [data, setData] = useState([])
  const [selectedDevice, setSelectedDevice] = useState('device1')
  const [lastUpdate, setLastUpdate] = useState(new Date())
  const [loading, setLoading] = useState(false)

  // Fetch data from API
  const fetchData = async () => {
    if (!selectedDevice) return

    try {
      setLoading(true)
      const apiData = await fetchDeviceData(selectedDevice)
      setData(apiData)
      setLastUpdate(new Date())
    } catch (error) {
      console.error('❌ Error fetching data from API:', error)
    } finally {
      setLoading(false)
    }
  }

  // Initial load + polling
  useEffect(() => {
    fetchData()

    const interval = setInterval(() => {
      fetchData()
    }, 10000)

    return () => clearInterval(interval)
  }, [selectedDevice])

  const getLatestValuesFromData = (data) => {
    if (!Array.isArray(data) || data.length === 0) {
      return {
        humidity: 0,
        temperature: 0,
        voltage: 0,
        latitude: 23.5,
        longitude: 77.2,
      }
    }
  
    const latest = data[0] || {}
    console.log("data", data);
    console.log("latest", latest);
  
    return {
      humidity: Number(latest.humidity) || 0,
      temperature: Number(latest.temperature) || 0,
      voltage: Number(latest.voltage) || 0,
      latitude: Number(latest.latitude) || 23.5,
      longitude: Number(latest.longitude) || 77.2,
    }
  }

  const handleDeviceChange = (deviceId) => {
    setSelectedDevice(deviceId)
  }

  const latestValues = getLatestValuesFromData(data)

  return (
    <div className="h-screen bg-dashboard-bg text-white flex flex-col overflow-hidden">
      <Header
        lastUpdate={lastUpdate}
        selectedDevice={selectedDevice}
        onDeviceChange={handleDeviceChange}
      />

      <div className="flex-1 p-2 overflow-auto">
        {loading && (
          <div className="text-xs text-gray-400 mb-1">
            Loading latest data…
          </div>
        )}

        <div className="h-full grid grid-rows-3 gap-2">
          {/* Top Row */}
          <div className="grid grid-cols-2 gap-2 min-h-0">
            <TemperatureHumidityRelation data={data} />
            <HumidityTemperatureTimeSeries data={data} />
          </div>

          {/* Middle Row */}
          <div className="grid grid-cols-3 gap-2 min-h-0">
            <HumidityMonitoring
              value={latestValues.humidity}
              data={data}
            />
            <LocationTracing data={data} />
            <VoltageBarChart data={data} />
          </div>

          {/* Bottom Row */}
          <div className="grid grid-cols-2 gap-2 min-h-0">
            <VoltageTemperatureDisplay
              voltage1={latestValues.voltage}
              voltage2={(latestValues.voltage || 0) + 0.02}
              temperature1={latestValues.temperature}
              temperature2={latestValues.temperature}
            />
            <GaugePanel
              humidity={latestValues.humidity}
              temperature={latestValues.temperature}
              voltage={latestValues.voltage}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
