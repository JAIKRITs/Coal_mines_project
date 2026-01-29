// Fix for Leaflet default icon issue in React
// This ensures Leaflet icons work properly if we use Marker components in the future
// Currently using CircleMarker which doesn't require this, but keeping for compatibility
import L from 'leaflet'

// Only set default icon if needed (for future Marker usage)
if (typeof window !== 'undefined') {
  try {
    delete L.Icon.Default.prototype._getIconUrl
    L.Icon.Default.mergeOptions({
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    })
  } catch (e) {
    // Silently fail if already configured
  }
}

