import React from 'react';

const KofiSupportBanner = ({ kofiUrl = '#' }) => {
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 my-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-lg">
      <div className="flex-grow">
        <h3 className="font-semibold text-lg text-white mb-1">
          Want to read more chapters and support us? ☕
        </h3>
        <p className="text-gray-300 text-sm">
          Join our Ko-fi membership for early access to unreleased chapters of our ongoing novels!
        </p>
      </div>
      <div className="flex-shrink-0 mt-3 md:mt-0">
        <a 
          href={kofiUrl} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="inline-flex items-center bg-[#13C3FF] hover:bg-[#00A2D9] text-black font-bold py-2 px-5 rounded-lg transition-colors duration-200 shadow-md"
        >
          Join on Ko-fi
        </a>
      </div>
    </div>
  );
};

export default KofiSupportBanner;