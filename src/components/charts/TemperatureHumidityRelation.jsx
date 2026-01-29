import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { calculateStats } from '../../utils/mockData'

const TemperatureHumidityRelation = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="bg-panel-bg border border-panel-border rounded p-2 h-full flex flex-col overflow-hidden">
        <h2 className="text-sm font-semibold mb-1 text-white">Relation between temperature and humidity</h2>
        <div className="flex-1 flex items-center justify-center text-gray-400">
          No data available
        </div>
      </div>
    )
  }

  const scatterData = data.map(d => ({
    temperature: d.temperature || 0,
    humidity: d.humidity || 0,
  })).filter(d => d.temperature > 0 && d.humidity > 0)

  const humidityStats = calculateStats(data, 'humidity')
  const temperatureStats = calculateStats(data, 'temperature')

  return (
    <div className="bg-panel-bg border border-panel-border rounded p-2 h-full flex flex-col overflow-hidden">
      <h2 className="text-sm font-semibold mb-1 text-white">Relation between temperature and humidity</h2>
      
      <div className="flex flex-row gap-2 flex-1 min-h-0">
        
        {/* Chart */}
        <div className="flex-[2] min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart data={scatterData} margin={{ top: 5, right: 5, bottom: 20, left: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#404040" />
              <XAxis 
                type="number" 
                dataKey="temperature" 
                name="Temperature"
                domain={['dataMin - 1', 'dataMax + 1']}
                stroke="#888"
                tick={{ fill: '#888', fontSize: 10 }}
                label={{ value: 'Temperature (°C)', position: 'insideBottom', offset: -5, fill: '#888', style: { fontSize: '10px' } }}
              />
              <YAxis 
                type="number" 
                dataKey="humidity" 
                name="Humidity"
                domain={['dataMin - 5', 'dataMax + 5']}
                stroke="#888"
                tick={{ fill: '#888', fontSize: 10 }}
                label={{ value: 'Humidity (%)', angle: -90, position: 'insideLeft', fill: '#888', style: { fontSize: '10px' } }}
              />
              <Tooltip
                cursor={{ strokeDasharray: '3 3' }}
                labelFormatter={() => ''}   // ❌ removes the first number (22.84)
                contentStyle={{
                  backgroundColor: '#2d2d2d',
                  border: '1px solid #404040',
                  borderRadius: '4px',
                  color: '#f59e0b',
                  fontSize: '12px',
                }}
                itemStyle={{ color: '#f59e0b' }}
                labelStyle={{ display: 'none' }} // extra safety
              />
              <Scatter dataKey="humidity" fill="#22c55e">
                {scatterData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill="#22c55e" />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>

        {/* Stats table */}
        <div className="w-52 flex-shrink-0">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="border-b border-panel-border">
                <th className="text-left p-1 text-gray-300">Name</th>
                <th className="text-right p-1 text-gray-300">Max</th>
                <th className="text-right p-1 text-gray-300">Min</th>
                <th className="text-right p-1 text-gray-300">Mean</th>
                <th className="text-right p-1 text-gray-300">Diff</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-panel-border">
                <td className="p-1 text-white">humidity</td>
                <td className="p-1 text-right text-white">{humidityStats.max}</td>
                <td className="p-1 text-right text-white">{humidityStats.min}</td>
                <td className="p-1 text-right text-white">{humidityStats.mean}</td>
                <td className="p-1 text-right text-white">
                  {humidityStats.difference > 0 ? '+' : ''}
                  {humidityStats.difference}
                </td>
              </tr>
              <tr>
                <td className="p-1 text-white">temperature</td>
                <td className="p-1 text-right text-white">{temperatureStats.max}</td>
                <td className="p-1 text-right text-white">{temperatureStats.min}</td>
                <td className="p-1 text-right text-white">{temperatureStats.mean}</td>
                <td className="p-1 text-right text-white">
                  {temperatureStats.difference > 0 ? '+' : ''}
                  {temperatureStats.difference}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

      </div>
    </div>
  )
}

export default TemperatureHumidityRelation

