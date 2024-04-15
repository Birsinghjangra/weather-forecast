import React from 'react';
import moment from 'moment';

function DetailCard({ weather_icon, data, isCelsius }) {
    const { clouds, main, weather } = data.list[0];
    console.log("weather_icon:", weather_icon);


    // Function to convert Celsius to Fahrenheit
    const celsiusToFahrenheit = (celsius) => {
        return (celsius * 9 / 5) + 32;
    };

    const temperature = isCelsius ? Math.round(main.temp) : Math.round(celsiusToFahrenheit(main.temp));
    const feelsLike = isCelsius ? Math.round(main.feels_like) : Math.round(celsiusToFahrenheit(main.feels_like));
    const tempMin = isCelsius ? Math.round(main.temp_min) : Math.round(celsiusToFahrenheit(main.temp_min));
    const tempMax = isCelsius ? Math.round(main.temp_max) : Math.round(celsiusToFahrenheit(main.temp_max));

    return (
        <div className="container p-3 flex items-center justify-center shadow-lg rounded-lg bg-white h-1/3 mb-auto">
            <div className="my-auto">
                <p className="font-bold text-4xl text-pink-800">{temperature}&deg;{isCelsius ? 'C' : 'F'}</p>
                <p className="text-4xl text-gray-800 tracking-widest">{weather[0].main}
                    <img src={weather_icon} alt="Weather Icon" className="w-1/4 inline" />
                </p>
                <p className="text-gray-400 text-xs uppercase tracking-widest">{weather[0].description}</p>
                <p className="tracking-wider">{moment().format("dddd MMM YYYY")}</p>
            </div>
            <div className="mr-5 border-l-2 border-gray-100 pl-3">
                <p className="text-gray-400 text-md">RealFeel: {feelsLike}&deg;{isCelsius ? 'C' : 'F'}</p>
                <p className="text-gray-400 text-md">Humidity: {main.humidity}%</p>
                <p className="text-gray-400 text-md">Cloud Cover: {clouds.all}%</p>
                <p className="text-gray-400 text-md">Min Temp: {tempMin}&deg;{isCelsius ? 'C' : 'F'}</p>
                <p className="text-gray-400 text-md">Max Temp: {tempMax}&deg;{isCelsius ? 'C' : 'F'}</p>
            </div>
        </div>
    );
}

export default DetailCard;
