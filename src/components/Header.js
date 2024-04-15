import React, { useState, useEffect } from 'react';
import ReactSwitch from 'react-switch';
import DetailCard from './DetailCard';
import SummaryCard from './SummaryCard';

function Header({ updateCity }) { // Receive updateCity as a prop
    const API_KEY = process.env.REACT_APP_API_KEY;

    // State variables
    const [noData, setNoData] = useState("No Data Yet");
    const [searchTerm, setSearchTerm] = useState('');
    const [recentSearches, setRecentSearches] = useState([]);
    const [weatherData, setWeatherData] = useState([]);
    const [city, setCity] = useState("Unknown location");
    const [weatherIcon, setWeatherIcon] = useState(
        `${process.env.REACT_APP_ICON_URL}10n@2x.png`
    );
    const [isLoading, setIsLoading] = useState(false);
    const [isCelsius, setIsCelsius] = useState(true);
    const [uniqueDates, setUniqueDates] = useState([]);

    useEffect(() => {
        const savedRecentSearches = JSON.parse(localStorage.getItem('recentSearches')) || [];
        setRecentSearches(savedRecentSearches);
    }, []);

    const saveRecentSearchesToLocalStorage = (searches) => {
        localStorage.setItem('recentSearches', JSON.stringify(searches));
    };

    const handleChange = () => {
        setIsCelsius(!isCelsius);
    };

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);

    };

    const handleRecentSearchSelect = (selectedValue) => {
        fetchWeatherData(selectedValue);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await fetchWeatherData(searchTerm);
    };

    const fetchWeatherData = async (location) => {
        setIsLoading(true);
        const data = await getWeather(location);
        setIsLoading(false);

        if (data) {
            if (!recentSearches.includes(location)) {
                const updatedSearches = [...recentSearches, location];
                const sortedSearches = updatedSearches.sort(
                    (a, b) => updatedSearches.indexOf(b) - updatedSearches.indexOf(a)
                ).reverse(); // Reverse the sorted array to display recent searches first
                setRecentSearches(sortedSearches);
                saveRecentSearchesToLocalStorage(sortedSearches);
            }
            updateCity(`${data.city.name}, ${data.city.country}`); // Update city using the callback
        }
        setSearchTerm('');
    };


    const getWeather = async (location) => {
        setWeatherData([]);
        let how_to_search =
            typeof location === "string"
                ? `q=${location}`
                : `lat=${location[0]}&lon=${location[1]}`;

        try {
            let res = await fetch(
                `${process.env.REACT_APP_URL + how_to_search}&appid=${API_KEY}&units=metric&exclude=daily`
            );
            let data = await res.json();
            if (data.cod !== "200") {
                console.log("API Data:", data);
                setNoData("Location Not Found");
                return null;
            }

            let uniqueDates = [...new Set(data.list.map(item => item.dt_txt.split(" ")[0]))];

            setWeatherData(data);
            setUniqueDates(uniqueDates);
            setCity(`${data.city.name}, ${data.city.country}`);
            setWeatherIcon(
                `${process.env.REACT_APP_ICON_URL + data.list[0].weather[0]["icon"]}@4x.png`
            );

            return data;
        } catch (error) {
            console.error("Error fetching weather:", error);
            setNoData("Error fetching data");
            return null;
        }
    };

    const handleGetCurrentLocation = () => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition((position) => {
                const { latitude, longitude } = position.coords;
                getWeather([latitude, longitude]);
            }, (error) => {
                console.error("Error getting location:", error);
                setNoData("Location access denied");
            });
        } else {
            setNoData("Geolocation is not supported by this browser.");
        }
    };

    return (
        <div className="bg-gray-200 min-h-screen rounded-3xl">
            <div className="container mx-auto p-4">
                <div className="flex items-center space-x-4">
                    <div className="flex flex-col items-center">
                        <form onSubmit={handleSubmit} className="flex items-center w-full max-w-xs">
                            <div className="relative w-full">
                                <input
                                    type="text"
                                    placeholder="Enter location"
                                    className="w-full py-2 pl-3 pr-10 bg-gray-600 bg-opacity-50 text-white placeholder-gray-200 rounded-md"
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                    list="searchSuggestions"  // Added list attribute
                                />
                                <button type="submit" className="absolute right-0 top-0 bottom-0 px-3 py-2 hover:bg-blue-600 text-white rounded-md">
                                    <i className="fa fa-search" aria-hidden="true"></i>
                                </button>
                            </div>
                        </form>

                        {recentSearches.length > 0 && (
                            <datalist id="searchSuggestions">
                                {recentSearches.slice(-5).reverse().map((search, index) => (
                                    <option
                                        key={index}
                                        value={search}
                                        // Use onSelect event handler instead of onClick
                                        onSelect={() => handleRecentSearchSelect(search)}
                                    >
                                        {search}
                                    </option>
                                ))}
                            </datalist>
                        )}
                    </div>


                    <i
                        className="fa fa-map-marker-alt text-white-200 cursor-pointer p-2 rounded-full"
                        aria-hidden="true"
                        onClick={handleGetCurrentLocation}
                    ></i>

                    <ul className="flex space-x-4 ">
                        <li className="text-sm text-gray-800 border-b-2 border-green-400 cursor-pointer ml-10">Weather</li>
                        <li className="text-sm text-gray-800 border-b-2 alert-notice hover:border-green-400 cursor-pointer">Alerts</li>
                        <li className="text-sm text-gray-800 border-b-2 hover:border-green-400 cursor-pointer">Map</li>
                        <li className="text-sm text-gray-800 border-b-2 hover:border-green-400 cursor-pointer">Satellite</li>
                        <li className="text-sm text-gray-800 border-b-2 hover:border-green-400 cursor-pointer">News</li>
                    </ul>
                </div>

                <div className="mt-8">
                    {isLoading ? (
                        <div className="text-center">
                            <h1 className="text-4xl font-bold text-gray-300">Loading...</h1>
                        </div>
                    ) : weatherData.length === 0 ? (
                        <div className="text-center">
                            <h1 className="text-4xl font-bold text-gray-300">{noData}</h1>
                        </div>
                    ) : (
                        <>
                            <div className="flex items-center justify-between mt-2">
                                <h1 className="text-2xl text-gray-800 mb-4 mr-4">Today</h1>
                                <div className="app">
                                    <div>
                                        <ReactSwitch
                                            checked={isCelsius}
                                            onChange={handleChange}
                                            onColor="#77B1C7"
                                            offColor="#77B1C7"
                                            checkedIcon={
                                                <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                                                    <span style={{ margin: '0 9px' }}>C</span>
                                                </div>
                                            }
                                            uncheckedIcon={
                                                <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                                                    <span style={{ margin: '0 4px', color: '#fff' }}>F</span>
                                                </div>
                                            }
                                            height={24}
                                            width={48}
                                            className="react-switch"
                                        />
                                    </div>
                                </div>
                            </div>
                            <DetailCard weather_icon={weatherIcon} data={weatherData} isCelsius={isCelsius} />
                            <h1 className="text-2xl text-gray-600 mb-4 mt-8">More On {city}</h1>
                            <div className="grid grid-cols-3 gap-3">
                                {uniqueDates.map((date, index) => {
                                    let dayData = weatherData.list.find(item => item.dt_txt.includes(date));
                                    if (dayData) {
                                        return <SummaryCard weather_icon={weatherIcon} data={weatherData} key={index} day={dayData} />;
                                    } else {
                                        return null;
                                    }
                                })}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Header;
