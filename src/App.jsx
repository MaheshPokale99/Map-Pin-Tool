import { useState, useEffect } from 'react';
import MapComponent from './components/MapComponent';
import Sidebar from './components/Sidebar';

const App = () => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [pinIdToDelete, setPinIdToDelete] = useState(null);
  const [selectedPin, setSelectedPin] = useState(null);

  const [pins, setPins] = useState(() => {
    const saved = localStorage.getItem('mapPins');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('mapPins', JSON.stringify(pins));
  }, [pins]);

  const handleAddPin = (newPin) => {
    const pinWithId = { ...newPin, id: Date.now() };
    setPins((prev) => [...prev, pinWithId]);
  };

  const handleDeletePin = (id) => {
    setPins((prev) => prev.filter((pin) => pin.id !== id));
    if (selectedPin?.id === id) {
      setSelectedPin(null);
    }
  };

  const handleSelectPin = (pin) => {
    setSelectedPin(pin);
  };

  return (
    <div className="flex h-screen bg-zinc-100">
      <Sidebar
        pins={pins}
        selectedPin={selectedPin}
        onPinSelect={handleSelectPin}
        setShow={setShowConfirm}
        setPinId={setPinIdToDelete}
      />

      <MapComponent
        pins={pins}
        onAddPin={handleAddPin}
        selectedPin={selectedPin}
        onPinSelect={handleSelectPin}
        show={showConfirm}
        setShow={setShowConfirm}
        pinId={pinIdToDelete}
        onPinDelete={handleDeletePin}
      />
    </div>
  );
};

export default App;
