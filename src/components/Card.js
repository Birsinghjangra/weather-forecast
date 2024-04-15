<div className="flex flex-col my-10">
{weatherData.length === 0 ? (
  <div className="container p-4 flex items-center justify-center h-1/3 mb-auto">
    <h1 className="text-gray-300 text-4xl font-bold uppercase">{noData}</h1>
  </div>
) : (
  <>
    <h1 className="text-2xl text-gray-800 mb-3">Today</h1>
    <DetailCard weather_icon={weatherIcon} data={weatherData} />
    <h1 className="text-2xl text-gray-600 mb-3 mt-3">More On {city}</h1>
    <ul className="grid grid-cols-2 gap-2">
      {weatherData.list.map((days, index) => {
        if (index > 0) {
          return <SummaryCard key={index} day={days} />;
        } else {
          return null;
        }
      })}
    </ul>
  </>
)}
</div>