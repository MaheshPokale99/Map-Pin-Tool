

import { useState, useEffect } from 'react';
import MapComponent from './components/MapComponent';
import Sidebar from './components/Sidebar';

const App = () => {
  
  const [pins, setPins] = useState(() => {
    const savedPins = localStorage.getItem('mapPins');
    return savedPins ? JSON.parse(savedPins) : [];
  });

  const [selectedPin, setSelectedPin] = useState(null);

  useEffect(() => {
    localStorage.setItem('mapPins', JSON.stringify(pins));
  }, [pins]);

  const addPin = (newPin) => {
    setPins(prevPins => [...prevPins, { ...newPin, id: Date.now() }]);
  };

  const deletePin = (pinId) => {
    setPins(prevPins => prevPins.filter(pin => pin.id !== pinId));
    if (selectedPin?.id === pinId) {
      setSelectedPin(null);
    }
  };

  const selectPin = (pin) => {
    setSelectedPin(pin);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar 
        pins={pins} 
        onPinSelect={selectPin}
        onPinDelete={deletePin}
        selectedPin={selectedPin}
      />
      <MapComponent 
        pins={pins}
        onAddPin={addPin}
        selectedPin={selectedPin}
        onPinSelect={selectPin}
      />
    </div>
  );
};

export default App;

