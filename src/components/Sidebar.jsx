import { MapPin, Trash, MapPinLine } from '@phosphor-icons/react';

const Sidebar = ({ pins, onPinSelect, onPinDelete, selectedPin }) => {
  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const truncateText = (text, maxLength = 50) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div className="w-80 bg-white shadow-lg flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-800 mb-1 flex items-center">
          <MapPin className="w-6 h-6 mr-2 text-red-500" weight="fill" />
          Map Pins
        </h1>
        <p className="text-sm text-gray-600">
          {pins.length} pin{pins.length !== 1 ? 's' : ''} saved
        </p>
      </div>

      {/* Pins List */}
      <div className="flex-1 overflow-y-auto">
        {pins.length === 0 ? (
          <div className="p-6 text-center">
            <div className="text-gray-400 mb-2">
              <MapPinLine className="w-12 h-12 mx-auto" />
            </div>
            <p className="text-gray-500 text-sm">No pins yet</p>
            <p className="text-gray-400 text-xs mt-1">Click on the map to add your first pin!</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {pins.map((pin) => (
              <div
                key={pin.id}
                className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                  selectedPin?.id === pin.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                }`}
                onClick={() => onPinSelect(pin)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center mb-1">
                      <MapPin className="w-4 h-4 mr-2 text-red-500" weight="fill" />
                      <h3 className="text-sm font-medium text-gray-800 truncate">
                        {pin.remark}
                      </h3>
                    </div>
                    
                    <p className="text-xs text-gray-600 mb-2 leading-relaxed">
                      {truncateText(pin.address, 80)}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-gray-500">
                        {formatDate(pin.timestamp)}
                      </p>
                      
                      <div className="flex items-center space-x-1">
                        <span className="text-xs text-gray-400">
                          {pin.lat.toFixed(4)}, {pin.lng.toFixed(4)}
                        </span>
                        
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (window.confirm('Are you sure you want to delete this pin?')) {
                              onPinDelete(pin.id);
                            }
                          }}
                          className="text-gray-400 hover:text-red-500 transition-colors p-1"
                          title="Delete pin"
                        >
                          <Trash className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar; 