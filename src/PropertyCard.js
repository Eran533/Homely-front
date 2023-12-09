import React, { useState, useEffect } from "react";
import "./PropertyCard.css";

function PropertyCard({ properties }) {
  const [propertyList, setPropertyList] = useState([]);

  useEffect(() => {
    // Update propertyList when properties change
    setPropertyList(
      properties.map((property) => ({
        ...property,
        currentImageIndex: 0,
      }))
    );
  }, [properties]);

  const nextImage = (propertyIndex) => {
    setPropertyList((prevPropertyList) => {
      const updatedProperties = [...prevPropertyList];
      const property = { ...updatedProperties[propertyIndex] };
      const nextIndex =
        (property.currentImageIndex + 1) % property.photos.length;
      property.currentImageIndex = nextIndex;
      updatedProperties[propertyIndex] = property;
      return updatedProperties;
    });
  };

  const prevImage = (propertyIndex) => {
    setPropertyList((prevPropertyList) => {
      const updatedProperties = [...prevPropertyList];
      const property = { ...updatedProperties[propertyIndex] };
      const prevIndex =
        property.currentImageIndex === 0
          ? property.photos.length - 1
          : property.currentImageIndex - 1;
      property.currentImageIndex = prevIndex;
      updatedProperties[propertyIndex] = property;
      return updatedProperties;
    });
  };

  return (
    <div className="property-list">
      {propertyList.map((property, propertyIndex) => (
        <div key={property.id} className="property-card">
          {/* Rendering property details */}
          <h3>{property.propertyName}</h3>
          {/* Other property details */}
          {/* Rendering property photos */}
          <div className="photos">
            <div className="main-photo">
              <img
                src={`${process.env.PUBLIC_URL}/imgs/${
                  property.photos[property.currentImageIndex]
                }`}
                alt={`${property.propertyName} - Photo ${
                  property.currentImageIndex + 1
                }`}
              />
            </div>
            {property.photos.length > 1 && (
              <div className="photo-navigation">
                <button onClick={() => prevImage(propertyIndex)}>
                  Previous
                </button>
                <button onClick={() => nextImage(propertyIndex)}>Next</button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default PropertyCard;
