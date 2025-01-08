import React from "react";

const AddSong = () => {
  return (
    <div className="w-full max-w-4xl mx-auto px-4  flex items-center gap-4 mb-6">
      {/* Search Container with Border */}
      <div className="relative flex-1">
        <input
          type="text"
          className="w-full bg-transparent border border-gray-600 rounded-md px-4 py-2 text-white focus:outline-none focus:border-gray-400 transition-colors"
          placeholder="Type or paste your text here"
        />
        {/* Search Icon */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-gray-400"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </div>
      </div>

      {/* Add Song Button */}
      <button className="px-4 py-2 text-sm text-white hover:text-yellow-200 transition-colors">
        Add song
      </button>
    </div>
  );
};

export default AddSong;
