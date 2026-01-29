const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://10.200.12.204:8000'

export const fetchDeviceData = async (deviceId) => {
  const params = new URLSearchParams()
  if (deviceId) {
    params.set('deviceId', deviceId)
  }

  // const url = `${API_BASE_URL}/api/readings?${params.toString()}`
  const url = `${API_BASE_URL}/telemetry`

  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Failed to fetch data from API: ${response.status}`)
  }

  const result = await response.json()
  const rows = result.data || []
  console.log("rows: ", rows);
  

  // ✅ Filter by device_id if provided
  const filteredRows = deviceId
    ? rows.filter(row => row.device_id === deviceId)
    : rows

  return filteredRows.map(row => {
    const ts = row.ts ? new Date(row.ts) : new Date()

    return {
      ...row,
      timestamp: ts.toISOString(),
      time: ts.toLocaleTimeString('en-US', { hour12: false }),
    }
  })
}


