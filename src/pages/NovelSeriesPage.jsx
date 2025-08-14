import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { slugify } from '../utils/slugify';
import Footer from '../components/Footer.jsx';
import AdComponent from '../components/AdComponent.jsx';

// Helper function for time ago formatting
const formatTimestampToTimeAgo = (timestamp) => {
  if (!timestamp) return 'N/A';
  const then = parseInt(timestamp, 10);
  if (isNaN(then)) return 'Invalid date';

  const now = Date.now();
  const seconds = Math.floor((now - then) / 1000);

  if (seconds < 60) return `${seconds} seconds ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minutes ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hours ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} days ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} months ago`;
  const years = Math.floor(months / 12);
  return `${years} years ago`;
};

// Component for truncating text
const TruncatedDescription = ({ text, maxLength = 300, maxLines = 4 }) => {
  const [showFull, setShowFull] = useState(false);
  const textRef = React.useRef(null);
  const [needsTruncation, setNeedsTruncation] = useState(false);

  useEffect(() => {
    if (textRef.current) {
      const isOverflowing = text.length > maxLength || text.split('\n').length > maxLines;
      setNeedsTruncation(isOverflowing);
    }
  }, [text, maxLength, maxLines]);

  const toggleShow = (e) => {
    e.preventDefault();
    setShowFull(prev => !prev);
  };

  if (!needsTruncation) {
    return <p className="text-gray-300 text-sm mb-4 leading-relaxed lg:text-base">{text}</p>;
  }

  return (
    <p ref={textRef} className="text-gray-300 text-sm mb-4 leading-relaxed lg:text-base">
      {showFull ? text : `${text.substring(0, maxLength)}...`}
      <button onClick={toggleShow} className="text-indigo-400 hover:underline ml-1 focus:outline-none">
        {showFull ? 'Show Less' : 'Show More'}
      </button>
    </p>
  );
};

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

function NovelSeriesPage() {
  const [novelData, setNovelData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('latest');

  const { novelSlug } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!novelSlug) {
      setError("No novel slug provided in the URL.");
      setLoading(false);
      return;
    }

    const fetchNovelData = async () => {
      try {
        setLoading(true);
        setError(null);
        const MAIN_NOVEL_LIST_URL = "https://raw.githubusercontent.com/ASSAROCKT/Apscans-novels-Repo/main/novels.json";
        const mainListResponse = await fetch(MAIN_NOVEL_LIST_URL);
        if (!mainListResponse.ok) {
          throw new Error("Could not fetch the main list of novels.");
        }
        const allNovels = await mainListResponse.json();
        const targetNovelInfo = allNovels.find(novel => slugify(novel.title) === novelSlug);
        if (!targetNovelInfo) {
          throw new Error(`Novel with slug "${novelSlug}" not found in the main list.`);
        }
        const seriesUrl = targetNovelInfo.url;
        const seriesResponse = await fetch(seriesUrl);
        if (!seriesResponse.ok) {
          const errorMessage = seriesResponse.status === 404 ? "Novel data not found at the specified URL." : `Failed to fetch data (HTTP ${seriesResponse.status}).`;
          throw new Error(errorMessage);
        }
        const data = await seriesResponse.json();
        setNovelData(data);
      } catch (e) {
        console.error("Error fetching novel data for series:", e);
        setError(`Failed to load series data: ${e.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchNovelData();
  }, [novelSlug]);

  const handleChapterClick = useCallback((chapterKey) => {
    if (novelData?.title) {
      navigate(`/novel/${novelSlug}/${chapterKey}`);
    }
  }, [novelData, novelSlug, navigate]);

  const filteredAndSortedChapterKeys = useMemo(() => {
    if (!novelData?.chapters) return [];
    
    const keys = Object.keys(novelData.chapters);

    const filtered = keys.filter(chapterKey => {
      const chapter = novelData.chapters[chapterKey];
      const chapterTitle = chapter.title ? chapter.title.toLowerCase() : '';
      const chapterNumStr = chapter.display_chapter ? String(chapter.display_chapter) : '';
      const search = searchTerm.toLowerCase();
      
      return chapterTitle.includes(search) || chapterNumStr.includes(search);
    });

    return filtered.sort((aKey, bKey) => {
      const chapterA = novelData.chapters[aKey];
      const chapterB = novelData.chapters[bKey];
      const volA = chapterA?.volume || 0;
      const volB = chapterB?.volume || 0;
      const numA = chapterA?.display_chapter || 0;
      const numB = chapterB?.display_chapter || 0;

      if (sortOrder === 'latest') {
        if (volB !== volA) return volB - volA;
        return numB - numA;
      } else {
        if (volA !== volB) return volA - volB;
        return numA - numB;
      }
    });
  }, [novelData, searchTerm, sortOrder]);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-950 text-white">
        <main className="flex-grow flex items-center justify-center">
          <div className="text-xl font-semibold md:text-2xl">Loading novel data...</div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-950 text-red-500">
        <main className="flex-grow flex flex-col items-center justify-center">
          <div className="text-xl font-semibold text-center px-4 md:text-2xl">{error}</div>
          <Link to="/" className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-full shadow-md transition duration-300 ease-in-out md:py-3 md:px-6 md:text-lg">
            Back to Home
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  if (!novelData) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-950 text-gray-400">
        <main className="flex-grow flex items-center justify-center">
          <div className="text-xl font-semibold md:text-2xl">Novel data not available.</div>
        </main>
        <Footer />
      </div>
    );
  }

  const chapterKeys = Object.keys(novelData.chapters || {});
  const sortedKeys = chapterKeys.sort((aKey, bKey) => {
    const chapA = novelData.chapters[aKey];
    const chapB = novelData.chapters[bKey];
    if (chapA.volume !== chapB.volume) return chapA.volume - chapB.volume;
    return chapA.display_chapter - chapB.display_chapter;
  });
  
  const firstChapterKey = sortedKeys.length > 0 ? sortedKeys[0] : null;
  const lastChapterKey = sortedKeys.length > 0 ? sortedKeys[sortedKeys.length - 1] : null;

  return (
    <div className="flex flex-col min-h-screen bg-gray-950 font-inter text-white">
      <main className="flex-grow container mx-auto p-4 max-w-5xl md:max-w-6xl lg:max-w-7xl">
        <div className="flex flex-col sm:flex-row gap-6 mb-8 mt-8 md:gap-7 md:mb-10 md:mt-10">
          <div className="flex-shrink-0 relative">
            <img src={novelData.cover} alt={`${novelData.title} Cover`} className="w-full sm:w-[200px] h-auto rounded-lg shadow-md border border-gray-700 md:w-[220px] lg:w-[280px]" onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/200x280/333333/FFFFFF?text=No+Cover"; }} />
            <div className="absolute top-2 left-2 bg-black bg-opacity-75 text-white text-xs font-semibold px-2 py-0.5 rounded-md md:text-sm md:px-2.5 md:py-0.5">HD</div>
          </div>
          <div className="flex-grow">
            <h1 className="text-3xl font-semibold text-indigo-400 mb-2 md:text-4xl">{novelData.title}</h1>
            <p className="text-gray-300 text-sm mb-3 md:text-base md:mb-3.5"><span className="font-medium">Artist:</span> {novelData.artist || 'N/A'} | <span className="font-medium">Author:</span> {novelData.author || 'N/A'}</p>
            {novelData.genres?.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4 md:gap-2.5 md:mb-5">
                {novelData.genres.map((genre, index) => <span key={index} className="bg-gray-800 text-gray-300 text-xs px-2 py-1 rounded-sm border border-gray-700 md:text-sm md:px-2.5 md:py-1">{genre}</span>)}
              </div>
            )}
            {novelData.description && <TruncatedDescription text={novelData.description} />}
            <div className="flex gap-3 mt-4 md:gap-3.5 md:mt-5">
              {firstChapterKey && <Link to={`/novel/${novelSlug}/${firstChapterKey}`} className="inline-flex items-center bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-5 rounded-md shadow-sm transition duration-200 ease-in-out md:py-2.5 md:px-5.5 md:text-base">Read First</Link>}
              {lastChapterKey && <Link to={`/novel/${novelSlug}/${lastChapterKey}`} className="inline-flex items-center bg-gray-700 hover:bg-gray-600 text-gray-200 font-medium py-2 px-5 rounded-md shadow-sm transition duration-200 ease-in-out md:py-2.5 md:px-5.5 md:text-base">Read Latest</Link>}
            </div>
          </div>
        </div>

        <KofiSupportBanner kofiUrl="https://ko-fi.com/alucardnovels" />

        <div className="my-8">
            <AdComponent key={novelSlug} />
        </div>

        <div className="bg-gray-900 rounded-lg shadow-md border border-gray-700 p-6 md:p-7">
          <div className="flex justify-between items-center mb-4 md:mb-5">
            <h2 className="text-xl font-semibold text-indigo-400 flex items-center md:text-xl.5">Latest Chapters</h2>
            <div className="flex items-center space-x-2 text-sm text-gray-400 md:text-base md:space-x-2.5">
              <span>Sort</span>
              <button onClick={() => setSortOrder('latest')} className={`px-3 py-1 rounded-md ${sortOrder === 'latest' ? 'bg-indigo-600 text-white' : 'bg-gray-800 hover:bg-gray-700 text-gray-300'} md:px-3.5 md:py-1.5`}>Latest</button>
              <button onClick={() => setSortOrder('oldest')} className={`px-3 py-1 rounded-md ${sortOrder === 'oldest' ? 'bg-indigo-600 text-white' : 'bg-gray-800 hover:bg-gray-700 text-gray-300'} md:px-3.5 md:py-1.5`}>Oldest</button>
            </div>
          </div>
          <p className="text-gray-400 text-sm mb-4 md:text-base md:mb-4.5">Showing {filteredAndSortedChapterKeys.length} of {chapterKeys.length} chapters</p>
          <div className="mb-4 relative md:mb-5">
            <input type="text" placeholder="Find chapter (e.g. 42 or Panel Magic)" className="w-full pl-10 pr-4 py-2 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white bg-gray-800 md:py-2.5 md:pl-11 md:pr-4.5 md:text-base" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} aria-label="Search for a chapter by number or title" />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none md:pl-3.5"><svg className="h-5 w-5 text-gray-500 md:h-5.5 md:w-5.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg></div>
          </div>
          <div className="divide-y divide-gray-800 max-h-96 overflow-y-auto custom-scrollbar md:max-h-[450px] lg:max-h-[500px]">
            {filteredAndSortedChapterKeys.length > 0 ? (
              filteredAndSortedChapterKeys.map((chapterKey) => {
                const chapter = novelData.chapters[chapterKey];
                const lastUpdatedTimeAgo = formatTimestampToTimeAgo(chapter.last_updated);
                return (
                  <Link key={chapterKey} to={`/novel/${novelSlug}/${chapterKey}`} className={`flex justify-between items-center py-3 px-2 hover:bg-gray-800 transition duration-150 ease-in-out rounded-md md:py-3.5 md:px-2.5 text-white`}>
                    <div className="truncate text-sm font-medium md:text-base">
                      {chapter.volume && <span className="text-gray-400">Vol. {chapter.volume}</span>}
                      <span className="mx-2 text-gray-700">|</span>
                      <span>Ch. {chapter.display_chapter}</span>
                      {chapter.title && <span className="ml-2 text-gray-300">{chapter.title}</span>}
                    </div>
                    <div className="text-gray-400 text-xs md:text-sm flex-shrink-0 ml-4">
                      {lastUpdatedTimeAgo}
                    </div>
                  </Link>
                );
              })
            ) : (
              <div className="py-8 text-center bg-gray-800 rounded-md mt-4 md:py-10 md:mt-5">
                <p className="text-gray-300 text-lg font-medium md:text-xl">No chapters found for your search.</p>
                <p className="text-gray-500 text-sm mt-2 md:text-base">Try a different search term or clear the filter.</p>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default NovelSeriesPage;