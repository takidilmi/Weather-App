import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Countries from './Countries';
import CloudsPic from '../assets/Clouds.jpg';
import ThunderstormPic from '../assets/Thunderstorm.jpg';
import DrizzlePic from '../assets/Drizzle.jpg';
import RainPic from '../assets/Rain.jpg';
import SnowPic from '../assets/Snow.jpg';
import ClearPic from '../assets/Clear.jpg';

const Weather = ({ userCountry }) => {
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unit, setUnit] = useState('metric'); // 'metric' for Celsius, 'imperial' for Fahrenheit
  const [country, setCountry] = useState(userCountry);
  const [currentWeather, setCurrentWeather] = useState(null);
  const [currentTemperature, setCurrentTemperature] = useState(null);

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
  useEffect(() => {
    const fetchCurrentWeather = async () => {
      try {
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${country}&units=${unit}&appid=${process.env.REACT_APP_WEATHER_API_KEY}`
        );
        setCurrentWeather(response.data.weather[0].main);
        setCurrentTemperature(response.data.main.temp);
      } catch (error) {
        console.error('Error fetching current weather data: ', error);
      }
    };

    fetchCurrentWeather();
  }, [country, unit]);
  const getBgImage = () => {
    switch (currentWeather) {
      case 'Clear':
        return `url(${ClearPic}) center center/cover no-repeat`;
      case 'Snow':
        return `url(${SnowPic}) center center/cover no-repeat`;
      case 'Rain':
        return `url(${RainPic}) center center/cover no-repeat`;
      case 'Drizzle':
        return `url(${DrizzlePic}) center center/cover no-repeat`;
      case 'Thunderstorm':
        return `url(${ThunderstormPic}) center center/cover no-repeat`;
      case 'Clouds':
        return `url(${CloudsPic}) center center/cover no-repeat`;
      default:
        return `url(${CloudsPic}) center center/cover no-repeat`;
    }
  };

  return (
    <div
      style={{
        background: getBgImage(),
        padding: '10px',
        borderRadius: '0px 0px 10px 10px',
        boxShadow: '0px 0px 3px 2px rgba(0, 0, 0, 0.5)',
      }}
    >
      <Countries onCountryChange={setCountry} />
      {loading ? (
        <div className="flex items-center justify-center">
          <div className="w-32 h-32 border-t-2 border-b-2 border-purple-500 rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <h2 className="text-center">
            Current Weather in {country}: {currentWeather}, {currentTemperature}
            °{unit === 'metric' ? 'C' : 'F'}
          </h2>
          <h2 className="text-center">5 Day Forecast in {country}</h2>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {forecast.map((weather, index) => (
              <div
                key={index}
                className="w-40 p-2 m-2 border boxShadowWeather"
              >
                <p>
                  {weather.date} - Low:{' '}
                  {weather.minTemp ? weather.minTemp.toFixed(2) : 'N/A'}° /
                  High: {weather.maxTemp ? weather.maxTemp.toFixed(2) : 'N/A'}°
                  {unit === 'metric' ? 'C' : 'F'}
                </p>
              </div>
            ))}
          </div>
          <button
            className="self-center buttonStyle"
            onClick={toggleUnit}
          >
            Switch to {unit === 'metric' ? 'Fahrenheit' : 'Celsius'}
          </button>
        </div>
      )}
    </div>
  );
};

export default Weather;
