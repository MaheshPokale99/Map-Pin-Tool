import React, { useState, useRef, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import PinForm from './PinForm';
import { MapPin, Lightbulb } from '@phosphor-icons/react';

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom marker icon using Phosphor-style SVG
const createCustomIcon = (color = '#ef4444') => {
  return new L.DivIcon({
    html: `
      <div style="
        background: ${color};
        width: 32px;
        height: 32px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 2px solid white;
        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
      ">
        <svg style="
          transform: rotate(45deg);
          width: 16px;
          height: 16px;
          color: white;
        " viewBox="0 0 256 256" fill="currentColor">
          <path d="M128,64A40,40,0,1,0,168,104,40,40,0,0,0,128,64Zm0,64a24,24,0,1,1,24-24A24,24,0,0,1,128,128Zm0-112C87.63,16,56,47.63,56,88c0,66,72,120,72,120s72-54,72-120C200,47.63,168.37,16,128,16Zm0,160c-13.24,0-24-10.76-24-24s10.76-24,24-24,24,10.76,24,24S141.24,176,128,176Z"/>
        </svg>
      </div>
    `,
    className: 'custom-marker',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  });
};

const customIcon = createCustomIcon('#ef4444'); // Red for regular pins
const selectedIcon = createCustomIcon('#3b82f6'); // Blue for selected pins

// Component to handle map click events
function MapClickHandler({ onMapClick }) {
  useMapEvents({
    click: (e) => {
      onMapClick(e.latlng);
    },
  });
  return null;
}

const MapComponent = ({ pins, onAddPin, selectedPin, onPinSelect }) => {
  const [showPinForm, setShowPinForm] = useState(false);
  const [clickedLocation, setClickedLocation] = useState(null);
  const mapRef = useRef();

  const handleMapClick = (latlng) => {
    setClickedLocation(latlng);
    setShowPinForm(true);
  };

  const handlePinSubmit = async (remark) => {
    if (clickedLocation) {
      try {
        // Fetch address using Nominatim API
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${clickedLocation.lat}&lon=${clickedLocation.lng}&zoom=18&addressdetails=1`
        );
        const data = await response.json();
        
        const address = data.display_name || 'Address not found';
        
        const newPin = {
          lat: clickedLocation.lat,
          lng: clickedLocation.lng,
          remark,
          address,
          timestamp: new Date().toISOString()
        };
        
        onAddPin(newPin);
        setShowPinForm(false);
        setClickedLocation(null);
      } catch (error) {
        console.error('Error fetching address:', error);
        // Add pin without address if geocoding fails
        const newPin = {
          lat: clickedLocation.lat,
          lng: clickedLocation.lng,
          remark,
          address: 'Address not available',
          timestamp: new Date().toISOString()
        };
        
        onAddPin(newPin);
        setShowPinForm(false);
        setClickedLocation(null);
      }
    }
  };

  const handlePinCancel = () => {
    setShowPinForm(false);
    setClickedLocation(null);
  };

  // Center map on selected pin
  useEffect(() => {
    if (selectedPin && mapRef.current) {
      mapRef.current.setView([selectedPin.lat, selectedPin.lng], 15);
    }
  }, [selectedPin]);

  return (
    <div className="flex-1 relative">
      <MapContainer
        ref={mapRef}
        center={[51.505, -0.09]}
        zoom={13}
        className="h-full w-full"
        style={{ height: '100vh' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapClickHandler onMapClick={handleMapClick} />
        
        {pins.map((pin) => (
          <Marker
            key={pin.id}
            position={[pin.lat, pin.lng]}
            icon={selectedPin?.id === pin.id ? selectedIcon : customIcon}
            eventHandlers={{
              click: () => onPinSelect(pin),
            }}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-semibold text-gray-800 mb-1 flex items-center">
                  <MapPin className="w-4 h-4 mr-1 text-red-500" weight="fill" />
                  {pin.remark}
                </h3>
                <p className="text-sm text-gray-600 mb-2">{pin.address}</p>
                <p className="text-xs text-gray-500">
                  {new Date(pin.timestamp).toLocaleString()}
                </p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Instructions overlay */}
      <div className="absolute top-4 right-4 bg-white bg-opacity-90 rounded-lg p-3 shadow-lg z-[1000]">
        <p className="text-sm text-gray-700 flex items-center">
          <Lightbulb className="w-4 h-4 mr-2 text-yellow-500" weight="fill" />
          <strong>Tip:</strong> Click anywhere on the map to add a pin!
        </p>
      </div>

      {/* Pin Form Modal */}
      {showPinForm && (
        <PinForm
          onSubmit={handlePinSubmit}
          onCancel={handlePinCancel}
          location={clickedLocation}
        />
      )}
    </div>
  );
};

export default MapComponent; 