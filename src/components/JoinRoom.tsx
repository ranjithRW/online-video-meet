import { useState } from 'react';
import { Video, Users, ArrowRight } from 'lucide-react';

interface JoinRoomProps {
  onJoin: (name: string, roomNumber: string) => void;
}

export const JoinRoom = ({ onJoin }: JoinRoomProps) => {
  const [name, setName] = useState('');
  const [roomNumber, setRoomNumber] = useState('');
  const [errors, setErrors] = useState({ name: '', roomNumber: '' });

  const validateForm = () => {
    const newErrors = { name: '', roomNumber: '' };
    let isValid = true;

    if (!name.trim()) {
      newErrors.name = 'Please enter your name';
      isValid = false;
    } else if (name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
      isValid = false;
    }

    if (!roomNumber.trim()) {
      newErrors.roomNumber = 'Please enter a room number';
      isValid = false;
    } else if (!/^\d+$/.test(roomNumber.trim())) {
      newErrors.roomNumber = 'Room number must contain only digits';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onJoin(name.trim(), roomNumber.trim());
    }
  };

  const generateRandomRoom = () => {
    const randomRoom = Math.floor(100000 + Math.random() * 900000).toString();
    setRoomNumber(randomRoom);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl mb-6 shadow-lg shadow-blue-500/20">
            <Video className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Join Meeting</h1>
          <p className="text-gray-400">Enter your details to join the video conference</p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-gray-700">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                Your Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setErrors((prev) => ({ ...prev, name: '' }));
                  }}
                  placeholder="Enter your name"
                  className={`w-full px-4 py-3 bg-gray-900/50 border ${
                    errors.name ? 'border-red-500' : 'border-gray-600'
                  } rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <Users className="w-5 h-5 text-gray-500" />
                </div>
              </div>
              {errors.name && (
                <p className="mt-2 text-sm text-red-400">{errors.name}</p>
              )}
            </div>

            <div>
              <label htmlFor="roomNumber" className="block text-sm font-medium text-gray-300 mb-2">
                Room Number
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="roomNumber"
                  value={roomNumber}
                  onChange={(e) => {
                    setRoomNumber(e.target.value);
                    setErrors((prev) => ({ ...prev, roomNumber: '' }));
                  }}
                  placeholder="Enter room number"
                  className={`w-full px-4 py-3 bg-gray-900/50 border ${
                    errors.roomNumber ? 'border-red-500' : 'border-gray-600'
                  } rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                />
                <button
                  type="button"
                  onClick={generateRandomRoom}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-blue-400 hover:text-blue-300 font-medium transition-colors"
                >
                  Generate
                </button>
              </div>
              {errors.roomNumber && (
                <p className="mt-2 text-sm text-red-400">{errors.roomNumber}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30"
            >
              <span>Join Meeting</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-700">
            <div className="flex items-start gap-3 text-sm">
              <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg
                  className="w-4 h-4 text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="text-gray-400">
                <p className="font-medium text-gray-300 mb-1">Quick Tip</p>
                <p>Share the room number with others so they can join the same meeting room.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-gray-500 text-sm">
            By joining, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
};
