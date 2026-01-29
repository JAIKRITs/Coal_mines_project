import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import axios from 'axios'

const app = express()
const PORT = process.env.PORT || 8000

// =========================
// Middleware
// =========================
app.use(cors({
  origin: '*',
}))
app.use(express.json())

// =========================
// Health check
// =========================
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' })
})

// =========================
// Telemetry API (Axios proxy)
// =========================
app.get('/api/telemetry', async (req, res) => {
  const { deviceId } = req.query

  try {
    // Build target URL
    const targetUrl = `${process.env.API_URL}/telemetry`

    // Forward query params if needed
    const response = await axios.get(targetUrl, {
    //   params: deviceId ? { deviceId } : {},
      timeout: 5000,
    })

    console.log(response.data)
    res.json(response.data)
  } catch (error) {
    console.error('❌ Error calling telemetry API')

    if (error.response) {
      // API responded with error
      res.status(error.response.status).json({
        error: 'Telemetry API error',
        details: error.response.data,
      })
    } else if (error.code === 'ECONNREFUSED') {
      res.status(503).json({
        error: 'Telemetry API is not reachable',
      })
    } else if (error.code === 'ETIMEDOUT') {
      res.status(504).json({
        error: 'Telemetry API request timed out',
      })
    } else {
      res.status(500).json({
        error: 'Unexpected server error',
        details: error.message,
      })
    }
  }
})

// =========================
// Start server
// =========================
app.listen(PORT, () => {
  console.log(`🚀 Server listening on http://localhost:${PORT}`)
})
