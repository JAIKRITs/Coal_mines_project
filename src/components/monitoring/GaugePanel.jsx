const GaugePanel = ({ humidity, temperature, voltage }) => {
  const Gauge = ({ value, label, max, color }) => {
    const percentage = (value / max) * 100
    const circumference = 2 * Math.PI * 35
    const strokeDasharray = circumference
    const strokeDashoffset = circumference - (percentage / 100) * circumference

    return (
      <div className="flex flex-col items-center">
        <div className="relative w-24 h-24">
          <svg className="transform -rotate-90 w-24 h-24">
            <circle
              cx="48"
              cy="48"
              r="35"
              stroke="#404040"
              strokeWidth="6"
              fill="none"
            />
            <circle
              cx="48"
              cy="48"
              r="35"
              stroke={color}
              strokeWidth="6"
              fill="none"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-lg font-bold text-white">{value.toFixed(1)}</span>
          </div>
        </div>
        <span className="mt-1 text-xs text-gray-400">{label}</span>
      </div>
    )
  }

  return (
    <div className="bg-panel-bg border border-panel-border rounded p-2 h-full flex flex-col overflow-hidden">
      <h2 className="text-sm font-semibold mb-1 text-white">New panel</h2>
      
      <div className="flex justify-around items-center flex-1">
        <Gauge value={humidity??0} label="humidity" max={100} color="#22c55e" />
        <Gauge value={temperature??0} label="temperature" max={50} color="#22c55e" />
        <Gauge value={voltage??0} label="voltage" max={1} color="#22c55e" />
      </div>
    </div>
  )
}

export default GaugePanel

