// Generate mock data for the dashboard (fallback if CSV fails)
export const generateMockData = () => {
  const now = new Date();
  const dataPoints = [];
  
  // Generate data for the last 3 minutes (similar to the image)
  for (let i = 180; i >= 0; i--) {
    const timestamp = new Date(now.getTime() - i * 1000);
    const temperature = 27 + Math.random() * 5; // 27-32 range
    const humidity = 40 + Math.random() * 30; // 40-70 range
    const voltage = 0.2 + Math.random() * 0.3; // 0.2-0.5 range
    
    dataPoints.push({
      timestamp: timestamp.toISOString(),
      time: timestamp.toLocaleTimeString('en-US', { hour12: false }),
      temperature: parseFloat(temperature.toFixed(1)),
      humidity: parseFloat(humidity.toFixed(1)),
      voltage: parseFloat(voltage.toFixed(3)),
      latitude: 23.5 + Math.random() * 2, // Example coordinates
      longitude: 77.2 + Math.random() * 2,
      device_id: i % 2 === 0 ? 'device1' : 'device2',
    });
  }
  
  return dataPoints;
};

// Calculate statistics
export const calculateStats = (data, field) => {
  if (!data || data.length === 0) return { max: 0, min: 0, mean: 0, count: 0 };
  
  const values = data.map(d => d[field]);
  const max = Math.max(...values);
  const min = Math.min(...values);
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const difference = max - min;
  
  return {
    max: parseFloat(max.toFixed(1)),
    min: parseFloat(min.toFixed(1)),
    mean: parseFloat(mean.toFixed(1)),
    difference: parseFloat(difference.toFixed(1)),
    count: values.length,
  };
};

// Get latest values
export const getLatestValues = (data) => {
  if (!data || data.length === 0) {
    return {
      temperature: 0,
      humidity: 0,
      voltage: 0,
      latitude: 0,
      longitude: 0,
    };
  }
  
  const latest = data[data.length - 1];
  return {
    temperature: latest.temperature,
    humidity: latest.humidity,
    voltage: latest.voltage,
    latitude: latest.latitude,
    longitude: latest.longitude,
  };
};

