import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Countries from './Countries';

const Weather = ({ userCountry }) => {
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unit, setUnit] = useState('metric'); // 'metric' for Celsius, 'imperial' for Fahrenheit
  const [country, setCountry] = useState(userCountry);

  const toggleUnit = () => {
    setUnit(unit === 'metric' ? 'imperial' : 'metric');
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/forecast?q=${country}&units=${unit}&appid=${process.env.REACT_APP_WEATHER_API_KEY}`
        );

        const dailyData = response.data.list.reduce((acc, value) => {
          const date = new Date(value.dt * 1000).toLocaleDateString();
          if (!acc[date]) {
            acc[date] = {
              minTemp: value.main.temp,
              maxTemp: value.main.temp,
            };
          } else {
            acc[date].minTemp = Math.min(acc[date].minTemp, value.main.temp);
            acc[date].maxTemp = Math.max(acc[date].maxTemp, value.main.temp);
          }
          return acc;
        }, {});

        const dailyMinMaxTemp = Object.keys(dailyData).map((date) => ({
          date,
          minTemp: dailyData[date].minTemp,
          maxTemp: dailyData[date].maxTemp,
        }));

        setForecast(dailyMinMaxTemp);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching weather data: ', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [country, unit]);

  return (
    <div>
      <Countries onCountryChange={setCountry} />
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <h2>5 Day Forecast in {country}</h2>
          {forecast.map((weather, index) => (
            <div key={index}>
              <p>
                {weather.date} - Low:{' '}
                {weather.minTemp ? weather.minTemp.toFixed(2) : 'N/A'}° / High:{' '}
                {weather.maxTemp ? weather.maxTemp.toFixed(2) : 'N/A'}°
                {unit === 'metric' ? 'C' : 'F'}
              </p>
            </div>
          ))}

          <button onClick={toggleUnit}>
            Switch to {unit === 'metric' ? 'Fahrenheit' : 'Celsius'}
          </button>
        </>
      )}
    </div>
  );
};

export default Weather;
