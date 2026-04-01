import { NextRequest } from 'next/server'

export const runtime = 'nodejs'

const WMO_CODES: Record<number, { condition: string; icon: string }> = {
  0: { condition: 'Clear sky', icon: 'sunny' },
  1: { condition: 'Mainly clear', icon: 'sunny' },
  2: { condition: 'Partly cloudy', icon: 'partly-cloudy' },
  3: { condition: 'Overcast', icon: 'cloudy' },
  45: { condition: 'Foggy', icon: 'foggy' },
  48: { condition: 'Icy fog', icon: 'foggy' },
  51: { condition: 'Light drizzle', icon: 'rainy' },
  53: { condition: 'Drizzle', icon: 'rainy' },
  55: { condition: 'Heavy drizzle', icon: 'rainy' },
  61: { condition: 'Light rain', icon: 'rainy' },
  63: { condition: 'Rain', icon: 'rainy' },
  65: { condition: 'Heavy rain', icon: 'rainy' },
  71: { condition: 'Light snow', icon: 'snowy' },
  73: { condition: 'Snow', icon: 'snowy' },
  75: { condition: 'Heavy snow', icon: 'snowy' },
  80: { condition: 'Rain showers', icon: 'rainy' },
  81: { condition: 'Showers', icon: 'rainy' },
  82: { condition: 'Heavy showers', icon: 'rainy' },
  85: { condition: 'Snow showers', icon: 'snowy' },
  86: { condition: 'Heavy snow showers', icon: 'snowy' },
  95: { condition: 'Thunderstorm', icon: 'stormy' },
  96: { condition: 'Thunderstorm with hail', icon: 'stormy' },
  99: { condition: 'Severe thunderstorm', icon: 'stormy' },
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export async function GET(req: NextRequest) {
  const city = req.nextUrl.searchParams.get('city') || 'San Francisco'

  try {
    // Geocode the city
    const geoRes = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&format=json`,
      { signal: AbortSignal.timeout(8000) }
    )
    if (!geoRes.ok) throw new Error('Geocoding failed')
    const geoData = await geoRes.json() as { results?: { latitude: number; longitude: number; name: string; country: string; country_code: string }[] }

    if (!geoData.results?.length) {
      return Response.json({ error: 'City not found' }, { status: 404 })
    }

    const { latitude, longitude, name, country } = geoData.results[0]

    // Fetch weather
    const weatherRes = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,wind_speed_10m,relative_humidity_2m,weather_code,apparent_temperature&daily=weather_code,temperature_2m_max,temperature_2m_min&temperature_unit=fahrenheit&wind_speed_unit=mph&forecast_days=7&timezone=auto`,
      { signal: AbortSignal.timeout(8000) }
    )
    if (!weatherRes.ok) throw new Error('Weather fetch failed')
    const wData = await weatherRes.json() as {
      current: { temperature_2m: number; wind_speed_10m: number; relative_humidity_2m: number; weather_code: number; apparent_temperature: number }
      daily: { time: string[]; weather_code: number[]; temperature_2m_max: number[]; temperature_2m_min: number[] }
    }

    const current = wData.current
    const daily = wData.daily
    const weatherInfo = WMO_CODES[current.weather_code] || { condition: 'Unknown', icon: 'cloudy' }

    const forecast = daily.time.map((dateStr, i) => {
      const dayOfWeek = new Date(dateStr).getDay()
      return {
        day: i === 0 ? 'Today' : DAYS[dayOfWeek],
        high: Math.round(daily.temperature_2m_max[i]),
        low: Math.round(daily.temperature_2m_min[i]),
        condition: (WMO_CODES[daily.weather_code[i]] || { icon: 'cloudy' }).icon,
        label: (WMO_CODES[daily.weather_code[i]] || { condition: 'Cloudy' }).condition,
      }
    })

    return Response.json({
      location: `${name}, ${country}`,
      temperature: Math.round(current.temperature_2m),
      feelsLike: Math.round(current.apparent_temperature),
      condition: weatherInfo.condition,
      icon: weatherInfo.icon,
      humidity: current.relative_humidity_2m,
      windSpeed: Math.round(current.wind_speed_10m),
      forecast,
    })
  } catch (error) {
    console.error('Weather API error:', error)
    return Response.json({ error: 'Weather service unavailable' }, { status: 503 })
  }
}
