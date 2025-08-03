import React from 'react';

function NovelReaderMenu({
  currentFont,
  setFont,
  currentTextSize,
  setTextSize,
  currentLineHeight,
  setLineHeight,
  currentContrast,
  setContrast,
  onReset,
  onClose
}) {
  const fonts = [
    { name: 'Inter', className: 'font-inter' },
    { name: 'Merriweather', className: 'font-merriweather' },
    { name: 'Montserrat', className: 'font-montserrat' },
  ];

  const handleTextSizeChange = (increment) => {
    setTextSize(prev => Math.max(12, Math.min(30, prev + increment)));
  };

  const handleLineHeightChange = (increment) => {
    setLineHeight(prev => Math.max(18, Math.min(40, prev + increment)));
  };

  return (
    // This ensures the menu stays in the viewport even when the page is scrolled.
    <div className="fixed top-4 right-4 bg-gray-900 border border-gray-700 rounded-lg shadow-xl p-6 z-50 w-80">
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-gray-400 hover:text-white"
        aria-label="Close menu"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
      </button>

      <h3 className="text-xl font-semibold text-white mb-4">Reader Settings</h3>

      {/* Font Selection */}
      <div className="mb-6">
        <label className="block text-gray-300 text-sm font-medium mb-2">Font</label>
        <div className="grid grid-cols-2 gap-3">
          {fonts.map((font) => (
            <button
              key={font.className}
              onClick={() => setFont(font.className)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition duration-200 ${
                currentFont === font.className
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {font.name}
            </button>
          ))}
        </div>
      </div>

      {/* Text Size */}
      <div className="mb-6">
        <label className="block text-gray-300 text-sm font-medium mb-2">Text size</label>
        <div className="flex items-center justify-between bg-gray-800 rounded-md p-2">
          <button
            onClick={() => handleTextSizeChange(-1)}
            className="p-1.5 rounded-full bg-gray-700 hover:bg-gray-600 text-white"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4"></path></svg>
          </button>
          <span className="text-white text-lg font-mono px-4">{currentTextSize}</span>
          <button
            onClick={() => handleTextSizeChange(1)}
            className="p-1.5 rounded-full bg-gray-700 hover:bg-gray-600 text-white"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
          </button>
        </div>
      </div>

      {/* Line Height */}
      <div className="mb-6">
        <label className="block text-gray-300 text-sm font-medium mb-2">Line height</label>
        <div className="flex items-center justify-between bg-gray-800 rounded-md p-2">
          <button
            onClick={() => handleLineHeightChange(-1)}
            className="p-1.5 rounded-full bg-gray-700 hover:bg-gray-600 text-white"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4"></path></svg>
          </button>
          <span className="text-white text-lg font-mono px-4">{currentLineHeight}</span>
          <button
            onClick={() => handleLineHeightChange(1)}
            className="p-1.5 rounded-full bg-gray-700 hover:bg-gray-600 text-white"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
          </button>
        </div>
      </div>

      {/* Contrast */}
      <div className="mb-6">
        <label className="block text-gray-300 text-sm font-medium mb-2">Contrast</label>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setContrast('normal')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition duration-200 ${
              currentContrast === 'normal'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            <svg className="w-5 h-5 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
            Normal
          </button>
          <button
            onClick={() => setContrast('high')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition duration-200 ${
              currentContrast === 'high'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            <svg className="w-5 h-5 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
            High
          </button>
        </div>
      </div>

      {/* Reset Button */}
      <button
        onClick={onReset}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition duration-200"
      >
        RESET
      </button>
    </div>
  );
}

export default NovelReaderMenu;