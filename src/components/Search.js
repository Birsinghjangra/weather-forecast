import React, { useState, useEffect } from 'react';

function Search() {
    const [searchTerm, setSearchTerm] = useState('');
    const [data, setData] = useState([]);
    const [selectedCountryCode, setSelectedCountryCode] = useState('');
    const [filteredData, setFilteredData] = useState([]);
    const [sortColumn, setSortColumn] = useState(null);
    const [sortDirection, setSortDirection] = useState(null);

    useEffect(() => {
        // Fetch data from JSON file
        fetch('/india.json')
            .then(response => response.json())
            .then(data => {
                setData(data);
                setFilteredData(data);
            })
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    useEffect(() => {
        // Filter data by selected country code
        const newData = selectedCountryCode
            ? data.filter(item => item.country_code === selectedCountryCode)
            : data;

        // Filter data by search term
        const searchData = newData.filter(item => {
            const countryCode = item.country_code ? item.country_code.toLowerCase() : '';
            const couName = item.cou_name_en ? item.cou_name_en.toLowerCase() : '';
            const itemName = item.name ? item.name.toLowerCase() : '';
            const population = item.population ? item.population.toString().toLowerCase() : '';
            const timezone = item.timezone ? item.timezone.toLowerCase() : '';

            return (
                countryCode.includes(searchTerm.toLowerCase()) ||
                couName.includes(searchTerm.toLowerCase()) ||
                itemName.includes(searchTerm.toLowerCase()) ||
                population.includes(searchTerm.toLowerCase()) ||
                timezone.includes(searchTerm.toLowerCase())
            );
        });

        // Apply sorting
        let sortedData = [...searchData].sort((a, b) => {
            if (sortDirection === 'asc') {
                return a[sortColumn] - b[sortColumn];
            } else {
                return b[sortColumn] - a[sortColumn];
            }
        });

        setFilteredData(sortedData);
    }, [selectedCountryCode, data, searchTerm, sortColumn, sortDirection]);

    const handleSort = (column) => {
        if (sortColumn === column) {
            // Toggle sort direction if the same column is clicked
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            // Set new column and default to ascending direction
            setSortColumn(column);
            setSortDirection('asc');
        }
    }

    return (
        <div className="container p-4">
            {/* Card */}
            <div className="bg-white rounded-lg shadow-md p-6" style={{ maxHeight: '500px', overflowY: 'auto' }}>
                {/* Search Input, Filter Dropdown, and Filter Button - Side by Side */}
                <div className="flex">
                    <div className="flex-grow pr-2">
                        <input
                            type="text"
                            placeholder="Search..."
                            className="w-full h-12 px-4 py-2 border rounded-md"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex-grow pr-2">
                        <select
                            className="w-full h-12 px-4 py-2 border rounded-md cursor-pointer"
                            value={selectedCountryCode}
                            onChange={e => setSelectedCountryCode(e.target.value)}
                        >
                            <option value="">Select Code</option>
                            <option value="IN">IN</option>
                            <option value="US">US</option>
                            {/* Add more country codes as needed */}
                        </select>
                    </div>
                </div>

                {/* Table Wrapper */}
                <div className="table-wrapper">
                    {/* Table */}
                    <table className="min-w-full bg-white border-collapse border border-gray-300 shadow-md mt-4">
                        <thead className="fixed-top">
                            <tr className="bg-gray-200">
                                <th className="border border-gray-300 px-4 py-2">Code</th>
                                <th className="border border-gray-300 px-4 py-2">Country</th>
                                <th className="border border-gray-300 px-4 py-2">City</th>
                                <th className="border border-gray-300 px-4 py-2 flex items-center" onClick={() => handleSort('population')}>
                                    <span className="mr-1">Population</span>
                                    {sortColumn === 'population' && sortDirection && (sortDirection === 'asc' ? '▲' : '▼')}
                                </th>
                                <th className="border border-gray-300 px-4 py-2">Timezone</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredData.length > 0 ? (
                                filteredData.map((item, index) => (
                                    <tr key={index} className="hover:bg-gray-100">
                                        <td className="border border-gray-300 px-4 py-2">{item.country_code}</td>
                                        <td className="border border-gray-300 px-4 py-2">{item.cou_name_en}</td>
                                        <td className="border border-gray-300 px-4 py-2">{item.name}</td>
                                        <td className="border border-gray-300 px-4 py-2">{item.population}</td>
                                        <td className="border border-gray-300 px-4 py-2">{item.timezone}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="text-center py-4">No data found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );

}

export default Search;
