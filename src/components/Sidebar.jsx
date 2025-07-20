import { MapPin, Trash, MapPinLine } from 'phosphor-react';

const Sidebar = ({ pins = [], onPinSelect, selectedPin, setShow, setPinId }) => {

  const getFormattedDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const shortenText = (text, limit = 50) => {
    return text.length <= limit ? text : `${text.slice(0, limit)}...`;
  };

  const handleDelete = (id) => {
    setShow(true);
    setPinId(id);
  };

  const getPinCountText = (count) => {
    return `${count} pin${count === 1 ? '' : 's'} saved`;
  };

  const renderEmptyMessage = () => (
    <div className="p-6 text-center">
      <MapPinLine className="w-12 h-12 text-zinc-400 mx-auto mb-2" />
      <p className="text-zinc-500 text-sm">No pins yet</p>
      <p className="text-zinc-400 text-xs mt-1">Click on the map to add your first pin!</p>
    </div>
  );

  const renderPinItem = (pin) => {
    const isSelected = selectedPin?.id === pin.id;
    const itemStyle = isSelected
      ? 'bg-blue-200 border-l-4 border-blue-500'
      : 'hover:bg-zinc-50';

    return (
      <div
        key={pin.id}
        className={`p-4 rounded-2xl cursor-pointer transition-colors mt-5 ${itemStyle}`}
        onClick={() => onPinSelect(pin)}
      >
        <div className="flex items-start justify-between w-[288px] p-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center mb-1">
              <MapPin className="w-4 h-4 mr-2 text-red-500" weight="fill" />
              <h3 className="text-sm font-medium text-gray-800 truncate">
                {pin.remark}
              </h3>
            </div>

            <p className="text-xs text-gray-600 mb-2 leading-relaxed">
              {shortenText(pin.address, 80)}
            </p>

            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">{getFormattedDate(pin.timestamp)}</span>
              <div className="flex items-center space-x-1">
                <span className="text-xs text-gray-400">
                  {pin.lat.toFixed(4)}, {pin.lng.toFixed(4)}
                </span>
                <button
                  onClick={() => handleDelete(pin.id)}
                  className="text-gray-400 hover:text-red-500 p-1"
                  title="Delete pin"
                >
                  <Trash className="w-5 h-5" color="red" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white flex flex-col p-5 overflow-hidden">
      <div className="p-4 border-b border-zinc-200">
        <h1 className="text-2xl font-bold text-gray-800 mb-1 flex items-center">
          <MapPin className="w-8 h-8 mr-2 text-blue-500" weight="light" />
          Map Pins
        </h1>
        <p className="text-sm text-gray-600 ml-1 mt-4">
          {getPinCountText(pins.length)}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto">
        {pins.length === 0 ? (
          renderEmptyMessage()
        ) : (
          <div className="divide-y divide-zinc-100">
            {pins.map(renderPinItem)}
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
