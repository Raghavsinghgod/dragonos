// DragonOS Weather App
import { useState, useEffect } from 'react';

const fakeWeather = {
  temp: 22,
  condition: 'Partly Cloudy',
  icon: '⛅',
  humidity: 65,
  wind: 12,
  forecast: [
    { day: 'Mon', icon: '☀️', high: 24, low: 16 },
    { day: 'Tue', icon: '⛅', high: 22, low: 15 },
    { day: 'Wed', icon: '🌧️', high: 18, low: 12 },
    { day: 'Thu', icon: '⛈️', high: 16, low: 11 },
    { day: 'Fri', icon: '☀️', high: 25, low: 17 },
    { day: 'Sat', icon: '🌤️', high: 23, low: 14 },
    { day: 'Sun', icon: '☀️', high: 26, low: 18 },
  ],
};

export default function Weather() {
  const [, setTime] = useState(new Date());
  useEffect(() => { const i = setInterval(() => setTime(new Date()), 60000); return () => clearInterval(i); }, []);

  return (
    <div className="p-5 font-inter space-y-5">
      <div className="flex items-center gap-4">
        <span className="text-5xl">{fakeWeather.icon}</span>
        <div>
          <p className="text-3xl text-white/80 font-mono">{fakeWeather.temp}°</p>
          <p className="text-xs text-white/50">{fakeWeather.condition}</p>
        </div>
      </div>
      <div className="flex gap-4">
        <div className="flex items-center gap-1.5 text-xs text-white/40"><span>💧</span><span>{fakeWeather.humidity}%</span></div>
        <div className="flex items-center gap-1.5 text-xs text-white/40"><span>💨</span><span>{fakeWeather.wind} km/h</span></div>
      </div>
      <div>
        <p className="text-[10px] text-white/30 uppercase tracking-wider mb-2">7-Day Forecast</p>
        <div className="space-y-1.5">
          {fakeWeather.forecast.map(f => (
            <div key={f.day} className="flex items-center justify-between p-2 rounded-lg bg-white/[0.02]">
              <span className="text-xs text-white/50 w-10">{f.day}</span>
              <span className="text-sm">{f.icon}</span>
              <span className="text-xs text-white/60 font-mono">{f.high}°</span>
              <span className="text-xs text-white/30 font-mono">{f.low}°</span>
            </div>
          ))}
        </div>
      </div>
      <p className="text-[9px] text-white/20 text-center">Simulated weather data</p>
    </div>
  );
}
