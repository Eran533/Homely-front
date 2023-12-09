import React, { useState, useEffect } from "react";
import PropertyCard from "./PropertyCard.js";
import { createRoot } from "react-dom/client";
import "./App.css";
import Header from "./Header.js";

function App() {
  const [filteredProperties, setFilteredProperties] = useState([]);

  const fetchAllProperties = async () => {
    try {
      const response = await fetch("http://localhost:8080/properties");
      if (response.ok) {
        const properties = await response.json();
        setFilteredProperties(properties);
      } else {
        throw new Error("Request failed");
      }
    } catch (error) {
      console.error("Error fetching properties:", error);
      // Handle error
    }
  };

  useEffect(() => {
    // Fetch all properties when the component mounts
    fetchAllProperties();
  }, []);

  const handleSearch = (searchResults) => {
    setFilteredProperties(searchResults);
  };

  return (
    <div className="app">
      <Header onSearch={handleSearch} />
      <div className="property-list">
        <PropertyCard properties={filteredProperties} />
      </div>
    </div>
  );
}

const root = document.getElementById("root");
createRoot(root).render(<App />);
