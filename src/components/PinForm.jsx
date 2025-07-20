import { useState } from 'react';
import { MapPin, X, Spinner } from 'phosphor-react';

const PinForm = ({ onSubmit, onCancel, location }) => {
  const [note, setNote] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const submitNote = async (e) => {
    e.preventDefault();
    const trimmedNote = note.trim();
    if (!trimmedNote) return;

    setIsAdding(true);
    await onSubmit(trimmedNote);
    setIsAdding(false);
  };

  const resetAndClose = () => {
    setNote('');
    onCancel();
  };

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-zinc-800 flex items-center gap-2">
            <MapPin />
            Drop a Pin
          </h2>
          <button
            onClick={resetAndClose}
            className="text-zinc-400 hover:text-zinc-600 transition-colors"
          >
            <X className="w-6 h-6 text-red-500" />
          </button>
        </div>

        <div className="mb-4 p-3 bg-blue-50 rounded-md">
          <p className="text-sm text-blue-500">
            <strong>Coordinates:</strong>{' '}
            {location?.lat.toFixed(6)}, {location?.lng.toFixed(6)}
          </p>
        </div>

        <form onSubmit={submitNote}>
          <div className="mb-4">
            <label htmlFor="note" className="block text-sm font-medium text-zinc-700 mb-2">
              Your Note *
            </label>
            <textarea
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Describe this place or why it matters..."
              className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows="3"
              required
              autoFocus
            />
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={resetAndClose}
              disabled={isAdding}
              className="flex-1 px-4 py-2 text-zinc-700 bg-zinc-100 hover:bg-red-500 hover:text-white rounded-lg transition-colors duration-300"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={!note.trim() || isAdding}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-zinc-300 disabled:cursor-not-allowed transition-colors"
            >
              {isAdding ? (
                <span className="flex items-center justify-center">
                  <Spinner size={16} className="animate-spin mr-2 text-blue-200" />
                  Saving...
                </span>
              ) : (
                'Save Pin'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PinForm;
