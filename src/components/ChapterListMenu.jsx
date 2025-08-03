// src/components/ChapterListMenu.jsx

import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';

function ChapterListMenu({
  chapters,
  currentChapterKey,
  novelSlug,
  onClose,
  getChapterNumber, // Helper function passed from parent
}) {
  const [searchTerm, setSearchTerm] = useState('');

  // Memoize the sorted and filtered list of chapters for performance
  const filteredAndSortedChapters = useMemo(() => {
    if (!chapters) return [];

    // --- UPDATED: Search logic now includes the volume number ---
    const filtered = Object.entries(chapters).filter(([key, chapter]) => {
      // Construct the full title including the volume for accurate searching
      const fullTitle = `${chapter.volume ? `Vol. ${chapter.volume}: ` : ''}${chapter.chapter_title || `Chapter ${getChapterNumber(key)}`}`;
      return fullTitle.toLowerCase().includes(searchTerm.toLowerCase());
    });
    // --- END UPDATED ---

    // Sort the filtered chapters by their numerical value
    return filtered.sort(([keyA], [keyB]) => {
      return getChapterNumber(keyA) - getChapterNumber(keyB);
    });
  }, [chapters, searchTerm, getChapterNumber]);

  return (
    <div className="fixed top-4 right-4 bg-gray-900 border border-gray-700 rounded-lg shadow-xl p-6 z-50 w-80 flex flex-col" style={{ maxHeight: 'calc(100vh - 2rem)' }}>
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-gray-400 hover:text-white"
        aria-label="Close menu"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
      </button>

      <h3 className="text-xl font-semibold text-white mb-4">Chapters</h3>

      {/* Search Input */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search chapters..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-gray-800 border border-gray-600 text-white rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Chapter List */}
      <div className="flex-grow overflow-y-auto pr-2">
        {filteredAndSortedChapters.length > 0 ? (
          <ul className="space-y-2">
            {filteredAndSortedChapters.map(([key, chapter]) => (
              <li key={key}>
                <Link
                  to={`/novel/${novelSlug}/${key}`}
                  onClick={onClose} // Close menu on chapter selection
                  className={`block w-full text-left px-3 py-2 rounded-md text-sm transition duration-200 ${
                    key === currentChapterKey
                      ? 'bg-indigo-600 text-white font-semibold'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {/* --- UPDATED: Display volume number if it exists --- */}
                  {chapter.volume ? `Vol. ${chapter.volume}: ` : ''}
                  {chapter.chapter_title || `Chapter ${getChapterNumber(key)}`}
                  {/* --- END UPDATED --- */}
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400 text-sm text-center">No chapters found.</p>
        )}
      </div>
    </div>
  );
}

export default ChapterListMenu;
