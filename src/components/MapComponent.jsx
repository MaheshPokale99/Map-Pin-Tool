import { useState, useRef, useEffect } from 'react';
import {MapContainer,TileLayer,Marker,Popup,useMapEvents} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import PinForm from './PinForm';
import { MapPin, Lightbulb, ThumbsUp, ThumbsDown } from 'phosphor-react';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png'
});

const makeMarkerIcon = (hex = '#ef4444') =>
  new L.DivIcon({
    html: `
      <div style="
        background: ${hex};
        width: 24px;
        height: 24px;
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
          width: 12px;
          height: 12px;
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

const basePinIcon = makeMarkerIcon();
const activePinIcon = makeMarkerIcon('#3b82f6');

const MapClickHandler = ({ onClick }) => {
  useMapEvents({
    click: (e) => onClick(e.latlng)
  });
  return null;
};

const MapComponent = ({pins,onAddPin,selectedPin,onPinSelect,setShow,show,pinId,onPinDelete}) => {
  const [pinFormVisible, setPinFormVisible] = useState(false);
  const [newPinLocation, setNewPinLocation] = useState(null);
  const mapRef = useRef();

  const openPinForm = (latlng) => {
    setNewPinLocation(latlng);
    setPinFormVisible(true);
  };

  const cancelNewPin = () => {
    setPinFormVisible(false);
    setNewPinLocation(null);
  };

  const submitNewPin = async (note) => {
    if (!newPinLocation) return;

    const lat = newPinLocation.lat;
    const lng = newPinLocation.lng;

    const fallbackAddress = 'Address not available';
    const timestamp = new Date().toISOString();

    let address = fallbackAddress;

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
      );
      const data = await res.json();
      address = data.display_name || fallbackAddress;
    } catch (err) {
      console.error('Reverse geocoding failed:', err);
    }

    onAddPin({ lat, lng, remark: note, address, timestamp });
    cancelNewPin();
  };

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
        zoom={20}
        className="h-full w-full"
        style={{ height: '100vh' }}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapClickHandler onClick={openPinForm} />

        {pins.map((pin) => (
          <Marker
            key={pin.id}
            position={[pin.lat, pin.lng]}
            icon={selectedPin?.id === pin.id ? activePinIcon : basePinIcon}
            eventHandlers={{ click: () => onPinSelect(pin) }}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-semibold text-zinc-800 mb-1 flex items-center">
                  <MapPin className="w-4 h-4 mr-1 text-red-500" weight="light" />
                  {pin.remark}
                </h3>
                <p className="text-sm text-zinc-600 mb-2">{pin.address}</p>
                <p className="text-xs text-zinc-500">
                  {new Date(pin.timestamp).toLocaleString()}
                </p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      <div className="absolute top-4 right-4 bg-white/90 rounded-lg p-3 shadow-lg z-[1000]">
        <div className="text-sm text-zinc-700 flex items-center">
          <Lightbulb size={32} className="text-yellow-600" />
          <div className="flex gap-2 ml-2">
            <strong>Tip:</strong>
            <span>Click the map to drop a pin!</span>
          </div>
        </div>
      </div>

      {pinFormVisible && (
        <PinForm
          onSubmit={submitNewPin}
          onCancel={cancelNewPin}
          location={newPinLocation}
        />
      )}

      {show && (
        <div className="fixed inset-0 bg-white/20 flex items-center justify-center z-[2000]">
          <div className="bg-[#EFF6FF] rounded-lg shadow-xl p-6 w-full max-w-md text-center">
            <p className="text-red-500 text-2xl font-semibold mb-4">
              Are you sure you want to delete this pin?
            </p>
            <div className="flex items-center justify-center gap-20">
              <ThumbsDown
                size={32}
                className="text-red-500 cursor-pointer hover:scale-110 transition-all duration-300"
                onClick={() => setShow(false)}
              />
              <ThumbsUp
                size={32}
                className="text-blue-500 cursor-pointer hover:scale-110 transition-all duration-300"
                onClick={() => {
                  setShow(false);
                  onPinDelete(pinId);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapComponent;
