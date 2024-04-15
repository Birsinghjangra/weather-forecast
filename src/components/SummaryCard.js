import React from 'react';
import moment from 'moment';

function SummaryCard({ weather_icon, day }) {

    const getWeatherIcon = (iconCode) => {
        return `https://openweathermap.org/img/wn/${iconCode}.png`;
    };

    return (
        <li className="container p-4 flex items-center justify-center bg-gray-300 rounded-lg my-auto mr-1">
            <div className="my-auto">
                <p className="font-bold text-3xl text-pink-600 mb-2">{Math.round(day.main.temp)}&deg;C</p>
                <p className="text-2xl text-gray-800 tracking-widest">
                    {day.weather[0].main}
                    <img
                        src={getWeatherIcon(day.weather[0].icon)}
                        alt={day.weather[0].description}
                        className="w-1/4 inline"
                    />
                </p>
                <p className="text-gray-400 text-xs uppercase tracking-widest">{day.weather[0].description}</p>
                <p className="tracking-wider">{moment(day.dt_txt).format("dddd")}</p>
            </div>
        </li>
    );
}

export default SummaryCard;
