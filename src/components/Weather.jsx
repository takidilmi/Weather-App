import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Countries from './Countries';

const WeatherComponent = ({ userCountry }) => {
  const [temperature, setTemperature] = useState(null);
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
          `https://api.openweathermap.org/data/2.5/weather?q=${country}&units=${unit}&appid=${process.env.REACT_APP_WEATHER_API_KEY}`
        );

        setTemperature(response.data.main.temp);
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
          <p>
            The current temperature in {country} is {temperature}°
            {unit === 'metric' ? 'C' : 'F'}
          </p>
          <button onClick={toggleUnit}>
            Switch to {unit === 'metric' ? 'Fahrenheit' : 'Celsius'}
          </button>
        </>
      )}
    </div>
  );
};

export default WeatherComponent;
