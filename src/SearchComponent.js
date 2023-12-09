import React, { useState } from "react";
import "./SearchComponent.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const locationData = [
  { name: "Middle East" },
  { name: "Africa" },
  { name: "United States" },
  { name: "South America" },
  { name: "Europe" },
  { name: "Asia" },
];

function SearchComponent({ onSearch }) {
  const [location, setLocation] = useState("Anywhere");
  const [showWorldDropdown, setShowWorldDropdown] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const handleLocationChange = (selectedLocation) => {
    setLocation(selectedLocation);
    setShowWorldDropdown(false); // Close the dropdown after selecting a location
  };

  const toggleWorldDropdown = () => {
    setShowWorldDropdown(!showWorldDropdown);
  };

  const handleSearch = async () => {
    const searchData = {
      startDate: startDate,
      endDate: endDate,
      location: location, // Include location in search data
    };

    try {
      const response = await fetch("http://localhost:8080/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(searchData),
      });

      if (response.ok) {
        const properties = await response.json();
        onSearch(properties);
      } else {
        throw new Error("Request failed");
      }
    } catch (error) {
      console.error("Error:", error);
      // Handle error
    }
  };

  return (
    <div className="search-container" style={{ display: "flex", gap: "10px" }}>
      <div className="search-field" style={{ flex: "1", position: "relative" }}>
        <label style={{ marginRight: "5px" }}></label>
        <div style={{ position: "relative" }}>
          <input
            type="text"
            value={location}
            onChange={() => {}}
            placeholder="Anywhere"
            onClick={toggleWorldDropdown}
          />
          {showWorldDropdown && (
            <div className="guest-dropdown">
              {locationData.map((place) => (
                <div
                  key={place.name}
                  onClick={() => handleLocationChange(place.name)}
                  className="location-item" // Added class for styling
                >
                  <p>{place.name}</p>
                  <img
                    src={`${
                      process.env.PUBLIC_URL
                    }/imgs/${`${place.name}.png`}`}
                    alt={place.name}
                    style={{ width: "100px", height: "100px" }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="search-field" style={{ flex: "1", position: "relative" }}>
        <label style={{ marginRight: "5px" }}></label>
        <DatePicker
          selected={startDate}
          onChange={(date) => setStartDate(date)}
          selectsStart
          startDate={startDate}
          endDate={endDate}
          dateFormat="MMMM d, yyyy"
          placeholderText="Select start date"
        />
      </div>
      <div className="search-field" style={{ flex: "1", position: "relative" }}>
        <label style={{ marginRight: "5px" }}></label>
        <DatePicker
          selected={endDate}
          onChange={(date) => setEndDate(date)}
          selectsEnd
          startDate={startDate}
          endDate={endDate}
          minDate={startDate}
          dateFormat="MMMM d, yyyy"
          placeholderText="Select end date"
        />
      </div>
      <button className="search-btn" onClick={handleSearch}>
        Search
      </button>
    </div>
  );
}

export default SearchComponent;
