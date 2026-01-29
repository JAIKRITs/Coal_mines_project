const VoltageTemperatureDisplay = ({ voltage1, voltage2, temperature1, temperature2 }) => {
  return (
    <div className="bg-panel-bg border border-panel-border rounded p-2 h-full flex flex-col overflow-hidden">
      <h2 className="text-sm font-semibold mb-2 text-white">Voltage Monitoring and Temperature</h2>
      
      <div className="grid grid-cols-2 gap-3 flex-1 items-center">
        <div className="space-y-2">
          <div className="text-green-500 text-xl font-semibold">
            voltage {voltage1.toFixed(3)}
          </div>
          <div className="text-green-500 text-xl font-semibold">
            voltage {voltage2.toFixed(3)}
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="text-green-500 text-xl font-semibold">
            temperature {temperature1.toFixed(1)}
          </div>
          <div className="text-green-500 text-xl font-semibold">
            temperature {temperature2.toFixed(1)}
          </div>
        </div>
      </div>
    </div>
  )
}

export default VoltageTemperatureDisplay

