import { NextRequest, NextResponse } from 'next/server';

const API_KEY = 'dcffc3ecfa81ce6e76867b87d0862d08';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const city = searchParams.get('city') || 'McAdenville,NC,US';
    const days = parseInt(searchParams.get('days') || '1');

    // McAdenville, NC coordinates (hardcoded as fallback)
    let lat = 35.2654;
    let lon = -81.0814;

    // Try to get coordinates via geocoding API
    try {
      const geoUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=1&appid=${API_KEY}`;
      const geoRes = await fetch(geoUrl);
      const geoData = await geoRes.json();

      if (geoData && geoData.length > 0 && geoData[0].lat) {
        lat = geoData[0].lat;
        lon = geoData[0].lon;
      }
    } catch (geoError) {
      // Use default McAdenville coordinates
      console.log('Geocoding failed, using default McAdenville coordinates');
    }

    if (days === 1) {
      // Current weather
      const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${API_KEY}`;
      const weatherRes = await fetch(weatherUrl);
      const weatherData = await weatherRes.json();

      // Check for API errors
      if (weatherData.cod && weatherData.cod !== 200) {
        return NextResponse.json({ 
          error: 'OpenWeatherMap API error',
          message: weatherData.message || 'API key may need activation (can take 1-2 hours)',
          fallback: 'Weather data temporarily unavailable'
        }, { status: 503 });
      }

      const temp = Math.round(weatherData.main.temp);
      const feelsLike = Math.round(weatherData.main.feels_like);
      const description = weatherData.weather[0].description;
      const humidity = weatherData.main.humidity;
      const windSpeed = Math.round(weatherData.wind.speed);

      const forecast = `${temp}°F (feels like ${feelsLike}°F), ${description}. Humidity: ${humidity}%, Wind: ${windSpeed} mph`;

      return NextResponse.json({ 
        forecast,
        temp,
        description,
        humidity,
        windSpeed,
        feelsLike
      });
    } else {
      // 7-day forecast
      const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${API_KEY}`;
      const forecastRes = await fetch(forecastUrl);
      const forecastData = await forecastRes.json();

      // Group by day and get one forecast per day (noon-ish)
      const dailyForecasts = [];
      const seenDates = new Set();

      for (const item of forecastData.list) {
        const date = new Date(item.dt * 1000);
        const dateStr = date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
        
        if (!seenDates.has(dateStr) && dailyForecasts.length < days) {
          seenDates.add(dateStr);
          const temp = Math.round(item.main.temp);
          const description = item.weather[0].description;
          dailyForecasts.push(`${dateStr}: ${temp}°F, ${description}`);
        }
      }

      const forecast = dailyForecasts.join('\n');

      return NextResponse.json({ forecast, daily: dailyForecasts });
    }
  } catch (error: any) {
    console.error('Weather API error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
