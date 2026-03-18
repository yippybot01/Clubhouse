import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const city = searchParams.get('city') || 'McAdenville, NC';
  
  try {
    const url = `https://wttr.in/${encodeURIComponent(city)}?format=j1`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Weather API returned ${response.status}`);
    }
    
    const data = await response.json();
    const current = data.data.current_condition[0];
    
    return NextResponse.json({
      city: city,
      temperature: `${current.temp_F}°F`,
      temperatureC: `${current.temp_C}°C`,
      condition: current.weatherDesc[0].value,
      feelsLike: `${current.FeelsLikeF}°F`,
      humidity: `${current.humidity}%`,
      windSpeed: `${current.windspeedMiles} mph`,
      lastUpdated: new Date().toISOString()
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to fetch weather', message: error.message },
      { status: 500 }
    );
  }
}
