// CSV Parser utility
export const parseCSV = (csvText) => {
  const lines = csvText.trim().split('\n');
  if (lines.length < 2) return [];
  
  // Parse header - handle quoted values
  const parseCSVLine = (line) => {
    const result = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    result.push(current.trim());
    return result;
  };
  
  const headers = parseCSVLine(lines[0]).map(h => h.replace(/^"|"$/g, '').trim());
  
  // Parse data rows
  const data = [];
  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]).map(v => v.replace(/^"|"$/g, '').trim());
    if (values.length !== headers.length) continue;
    
    const row = {};
    headers.forEach((header, index) => {
      const value = values[index];
      // Convert numeric columns
      if (['id', 'voltage', 'humidity', 'temperature', 'latitude', 'longitude'].includes(header)) {
        row[header] = parseFloat(value) || 0;
      } else {
        row[header] = value;
      }
    });
    
    // Normalize temperature field name (handle both 'temperatu' and 'temperature')
    if (row.temperatu !== undefined) {
      row.temperature = row.temperatu;
      delete row.temperatu;
    }
    // If temperature already exists, ensure it's a number
    if (row.temperature !== undefined && typeof row.temperature === 'string') {
      row.temperature = parseFloat(row.temperature) || 0;
    }
    
    // Parse timestamp and create time string
    if (row.ts) {
      // Handle date format like "2025-11-1"
      let date;
      if (row.ts.includes('T') || row.ts.includes(' ')) {
        date = new Date(row.ts);
      } else {
        // Parse date string and add time component
        const dateStr = row.ts.trim();
        // Add a default time if not present
        date = new Date(dateStr + 'T00:00:00');
        // Add some variation based on row index to simulate different times
        date.setMinutes(date.getMinutes() + (i % 60));
        date.setSeconds(date.getSeconds() + (i % 60));
      }
      row.timestamp = date.toISOString();
      row.time = date.toLocaleTimeString('en-US', { hour12: false });
    }
    
    data.push(row);
  }
  
  return data;
};

// Load CSV data from file
export const loadCSVData = async () => {
  try {
    const response = await fetch('/data.csv');
    if (!response.ok) {
      throw new Error('Failed to load CSV file');
    }
    const csvText = await response.text();
    return parseCSV(csvText);
  } catch (error) {
    console.error('Error loading CSV:', error);
    return [];
  }
};

// Filter data by device_id
export const filterByDevice = (data, deviceId) => {
  if (!deviceId || deviceId === 'all') return data;
  return data.filter(row => row.device_id === deviceId);
};

// Generate consistent coordinates for devices
export const assignCoordinates = (data) => {
  const deviceCoords = {
    device1: { lat: 23.5, lng: 77.2 },
    device2: { lat: 23.7, lng: 77.4 },
    device3: { lat: 23.3, lng: 77.0 },
  };
  
  return data.map((row, index) => {
    const coords = deviceCoords[row.device_id] || { lat: 23.5, lng: 77.2 };
    // Add slight variation for multiple readings from same device
    const variation = (index % 10) * 0.01;
    return {
      ...row,
      latitude: row.latitude === 0 ? coords.lat + variation : row.latitude,
      longitude: row.longitude === 0 ? coords.lng + variation : row.longitude,
    };
  });
};

// Get unique device IDs from data
export const getDeviceIds = (data) => {
  const deviceIds = [...new Set(data.map(row => row.device_id))];
  return deviceIds.sort();
};

