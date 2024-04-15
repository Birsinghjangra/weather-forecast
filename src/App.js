import React, { useState } from "react";
import Header from "./components/Header";
import Search from "./components/Search";

function App() {
  const [city, setCity] = useState("Unknown location");

  const updateCity = (newCity) => {
    setCity(newCity);
  };

  return (
    <div className="flex items-center justify-center ">
      <div className="flex flex-row">
        <div className="form-container">
          <div className="flex items-center justify-center p-2">
            <h3 className="my-auto mr-auto text-2xl text-pink-700 font-bold shadow-md py-1 px-3 rounded-md bg-gray-200 bg-opacity-50">
              weather forecast
            </h3>
            <div className="flex p-2 text-gray-100 bg-gray-600 bg-opacity-30 rounded-lg">
              <i className="fa fa-map my-auto" aria-hidden="true"></i>
              <div className="text-right">
                <p className="font-semibold text-sm ml-2">{city}</p>
              </div>
            </div>
          </div>
          <Search updateCity={updateCity}></Search> {/* Pass updateCity as prop */}
        </div>

        <div className="w-2/4 p-5">
          <Header updateCity={updateCity} /> {/* Pass updateCity as prop */}
        </div>
      </div>
    </div>
  );
}

export default App;
