import React, { useState } from 'react';
import { MapPin, X, Spinner } from '@phosphor-icons/react';

const PinForm = ({ onSubmit, onCancel, location }) => {
  const [remark, setRemark] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (remark.trim()) {
      setIsSubmitting(true);
      await onSubmit(remark.trim());
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setRemark('');
    onCancel();
  };

  return (
    <div className="fixed inset-0 bg-white/20 g-opacity-50 flex items-center justify-center z-[2000]">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center">
            <MapPin className="w-6 h-6 mr-2 text-red-500" weight="fill" />
            Add New Pin
          </h2>
          <button
            onClick={handleCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Location:</strong> {location?.lat.toFixed(6)}, {location?.lng.toFixed(6)}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="remark" className="block text-sm font-medium text-gray-700 mb-2">
              Remark / Notes *
            </label>
            <textarea
              id="remark"
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
              placeholder="Enter your notes about this location..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows="3"
              required
              autoFocus
            />
          </div>

          <div className="flex space-x-3">
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!remark.trim() || isSubmitting}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <Spinner className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" />
                  Adding...
                </span>
              ) : (
                'Add Pin'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PinForm; 