import { useState } from 'react'

const Header = ({ lastUpdate, selectedDevice, onDeviceChange }) => {
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => setIsRefreshing(false), 1000)
    // Trigger refresh in parent component
    if (onDeviceChange) {
      onDeviceChange(selectedDevice)
    }
  }

  const formatDate = (date) => {
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
  }

  const devices = [
    { id: 'device1', label: 'Device 1' },
    { id: 'device2', label: 'Device 2' },
    { id: 'device3', label: 'Device 3' },
    { id: 'device4', label: 'Device 4' },
  ]

  return (
    <header className="bg-panel-bg border-b border-panel-border px-4 py-2 h-14 flex-shrink-0">
      <div className="flex items-center justify-between h-full">
        <div className="flex items-center space-x-4">
          <h1 className="text-lg font-bold text-white">Coal Mines Monitoring Dashboard</h1>
          <nav className="hidden md:flex space-x-3 text-sm">
            {devices.map((device) => (
              <button
                key={device.id}
                onClick={() => onDeviceChange && onDeviceChange(device.id)}
                className={`transition ${
                  selectedDevice === device.id
                    ? 'text-white font-semibold'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                {device.label}
              </button>
            ))}
          </nav>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="text-xs text-gray-400">
            {formatDate(lastUpdate)}
          </div>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white rounded transition text-xs font-medium"
          >
            {isRefreshing ? 'Refreshing...' : 'Refresh 10s'}
          </button>
          <div className="text-xs text-gray-400">
            {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header

