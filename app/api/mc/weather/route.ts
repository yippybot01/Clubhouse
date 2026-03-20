import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const city = searchParams.get('city') || 'McAdenville, NC';
  
  try {
    // Use Open-Meteo (free, no API key, reliable)
    // First geocode the city
    const cityName = city.split(',')[0].trim();
    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1&language=en&format=json`;
    const geoRes = await fetch(geoUrl);
    const geoData = await geoRes.json();
    
    if (!geoData.results?.[0]) {
      throw new Error('City not found');
    }
    
    const { latitude, longitude, name } = geoData.results[0];
    
    // Get current weather
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&temperature_unit=fahrenheit&wind_speed_unit=mph`;
    const weatherRes = await fetch(weatherUrl);
    const weatherData = await weatherRes.json();
    
    const current = weatherData.current;
    const condition = weatherCodeToText(current.weather_code);
    
    return NextResponse.json({
      city: name,
      temperature: `${Math.round(current.temperature_2m)}°F`,
      condition,
      feelsLike: `${Math.round(current.apparent_temperature)}°F`,
      humidity: `${current.relative_humidity_2m}%`,
      windSpeed: `${Math.round(current.wind_speed_10m)} mph`,
      lastUpdated: new Date().toISOString()
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to fetch weather', message: error.message },
      { status: 500 }
    );
  }
}

function weatherCodeToText(code: number): string {
  const codes: Record<number, string> = {
    0: 'Clear sky', 1: 'Mainly clear', 2: 'Partly cloudy', 3: 'Overcast',
    45: 'Foggy', 48: 'Rime fog', 51: 'Light drizzle', 53: 'Drizzle',
    55: 'Heavy drizzle', 61: 'Light rain', 63: 'Rain', 65: 'Heavy rain',
    71: 'Light snow', 73: 'Snow', 75: 'Heavy snow', 77: 'Snow grains',
    80: 'Light showers', 81: 'Showers', 82: 'Heavy showers',
    85: 'Light snow showers', 86: 'Snow showers',
    95: 'Thunderstorm', 96: 'Thunderstorm w/ hail', 99: 'Severe thunderstorm'
  };
  return codes[code] || 'Unknown';
}
