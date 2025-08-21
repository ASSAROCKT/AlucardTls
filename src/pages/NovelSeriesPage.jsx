import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { slugify } from '../utils/slugify';
import Footer from '../components/Footer.jsx';
import AdComponent from '../components/AdComponent.jsx';
import KofiSupportBanner from '../components/KofiSupportBanner.jsx';

// --- Helper Components & Functions ---

const KofiIcon = () => (
  <img 
    src="https://storage.ko-fi.com/cdn/brandasset/v2/kofi_symbol.png" 
    alt="Ko-fi symbol" 
    className="inline-block mr-2"
    width="24"
    height="24"
  />
);

const formatTimestampToTimeAgo = (timestamp) => {
  if (!timestamp) return 'N/A';
  const then = parseInt(timestamp, 10);
  if (isNaN(then)) return 'Invalid date';

  const seconds = Math.floor((Date.now() - then) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};

const TruncatedDescription = ({ text, maxLength = 300 }) => {
  const [showFull, setShowFull] = useState(false);
  if (!text || text.length <= maxLength) {
    return <p className="text-gray-300 text-sm mb-4 leading-relaxed lg:text-base">{text}</p>;
  }
  return (
    <p className="text-gray-300 text-sm mb-4 leading-relaxed lg:text-base">
      {showFull ? text : `${text.substring(0, maxLength)}...`}
      <button onClick={() => setShowFull(!showFull)} className="text-indigo-400 hover:underline ml-1 font-semibold">
        {showFull ? 'Show Less' : 'Show More'}
      </button>
    </p>
  );
};

// --- Main NovelSeriesPage Component ---
function NovelSeriesPage() {
  const [novelData, setNovelData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('latest');
  const { novelSlug } = useParams();
  const kofiUrl = "https://ko-fi.com/alucardnovels";

  useEffect(() => {
    const fetchNovelData = async () => {
      setLoading(true);
      setError(null);
      try {
        const mainListResponse = await fetch("https://raw.githubusercontent.com/ASSAROCKT/Apscans-novels-Repo/main/novels.json");
        if (!mainListResponse.ok) throw new Error("Could not fetch the main list of novels.");
        
        const allNovels = await mainListResponse.json();
        const targetNovelInfo = allNovels.find(novel => slugify(novel.title) === novelSlug);
        if (!targetNovelInfo) throw new Error(`Novel with slug "${novelSlug}" not found.`);
        
        const seriesResponse = await fetch(targetNovelInfo.url);
        if (!seriesResponse.ok) throw new Error("Novel data file not found.");
        
        setNovelData(await seriesResponse.json());
      } catch (e) {
        setError(`Failed to load series data: ${e.message}`);
      } finally {
        setLoading(false);
      }
    };
    fetchNovelData();
  }, [novelSlug]);
  
  const allChapters = useMemo(() => {
    if (!novelData) return {};
    const publicChapters = novelData.chapters ? Object.fromEntries(Object.entries(novelData.chapters).map(([key, value]) => [key, { ...value, isPremium: false }])) : {};
    const premiumChapters = novelData.premium_chapters ? Object.fromEntries(Object.entries(novelData.premium_chapters).map(([key, value]) => [key, { ...value, isPremium: true }])) : {};
    return { ...publicChapters, ...premiumChapters };
  }, [novelData]);

  const filteredAndSortedChapterKeys = useMemo(() => {
    const keys = Object.keys(allChapters);
    
    const filtered = keys.filter(key => {
      const chapter = allChapters[key];
      const search = searchTerm.toLowerCase();
      return (chapter.title?.toLowerCase().includes(search) || String(chapter.display_chapter).includes(search));
    });

    return filtered.sort((aKey, bKey) => {
      const chapA = allChapters[aKey];
      const chapB = allChapters[bKey];
      const sortMultiplier = sortOrder === 'latest' ? -1 : 1;
      
      const numA = chapA?.display_chapter || 0;
      const numB = chapB?.display_chapter || 0;

      return (numA - numB) * sortMultiplier;
    });
  }, [allChapters, searchTerm, sortOrder]);

  const { firstChapterKey, lastChapterKey } = useMemo(() => {
    if (!novelData?.chapters) return {};
    const keys = Object.keys(novelData.chapters);
    if (keys.length === 0) return {};
    const sortedPublicKeys = keys.sort((a, b) => novelData.chapters[a].display_chapter - novelData.chapters[b].display_chapter);
    return { firstChapterKey: sortedPublicKeys[0], lastChapterKey: sortedPublicKeys[sortedPublicKeys.length - 1] };
  }, [novelData?.chapters]);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white text-xl">Loading novel data...</div>;
  if (error) return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-950 text-red-500 p-4">
        <div className="text-xl text-center mb-4">{error}</div>
        <Link to="/" className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-full">Back to Home</Link>
      </div>
  );
  if (!novelData) return <div className="min-h-screen bg-gray-950 text-gray-400 flex items-center justify-center text-xl">Novel data not available.</div>;

  return (
    <div className="flex flex-col min-h-screen bg-gray-950 text-white font-inter">
      <main className="flex-grow container mx-auto p-4 max-w-5xl md:max-w-6xl lg:max-w-7xl">
        <div className="flex flex-col sm:flex-row gap-6 mb-8 mt-8 md:gap-7 md:mb-10 md:mt-10">
          <img src={novelData.cover} alt={`${novelData.title} Cover`} className="w-full sm:w-[200px] h-auto rounded-lg shadow-lg border-2 border-gray-800 md:w-[220px] lg:w-[280px]" onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/280x390/111827/FFFFFF?text=No+Cover"; }} />
          <div className="flex-grow">
            <h1 className="text-3xl font-semibold text-indigo-400 mb-2 md:text-4xl">{novelData.title}</h1>
            <p className="text-gray-300 text-sm mb-3 md:text-base md:mb-3.5">Artist: {novelData.artist || 'N/A'} | Author: {novelData.author || 'N/A'}</p>
            {novelData.genres?.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4 md:gap-2.5 md:mb-5">
                {novelData.genres.map(genre => <span key={genre} className="bg-gray-800 text-gray-300 text-xs px-2 py-1 rounded-sm border border-gray-700 md:text-sm md:px-2.5 md:py-1">{genre}</span>)}
              </div>
            )}
            <TruncatedDescription text={novelData.description} />
            <div className="flex gap-3 mt-4 md:gap-3.5 md:mt-5">
              {firstChapterKey && <Link to={`/novel/${novelSlug}/${firstChapterKey}`} className="inline-flex items-center bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-5 rounded-md shadow-sm transition md:py-2.5 md:px-5.5 md:text-base">Read First</Link>}
              {lastChapterKey && <Link to={`/novel/${novelSlug}/${lastChapterKey}`} className="inline-flex items-center bg-gray-700 hover:bg-gray-600 text-gray-200 font-medium py-2 px-5 rounded-md shadow-sm transition md:py-2.5 md:px-5.5 md:text-base">Read Latest</Link>}
            </div>
          </div>
        </div>

        <KofiSupportBanner kofiUrl={kofiUrl} />
        <div className="my-8"><AdComponent key={novelSlug} /></div>

        <div className="bg-gray-900 rounded-lg shadow-md border border-gray-700 p-6 md:p-7">
          <div className="flex justify-between items-center mb-4 md:mb-5">
            <h2 className="text-xl font-semibold text-indigo-400 flex items-center md:text-2xl">Latest Chapters</h2>
            <div className="flex items-center space-x-2 text-sm md:text-base md:space-x-2.5">
              <button onClick={() => setSortOrder('latest')} className={`px-3 py-1 rounded-md transition-colors ${sortOrder === 'latest' ? 'bg-indigo-600 text-white' : 'bg-gray-800 hover:bg-gray-700'}`}>Latest</button>
              <button onClick={() => setSortOrder('oldest')} className={`px-3 py-1 rounded-md transition-colors ${sortOrder === 'oldest' ? 'bg-indigo-600 text-white' : 'bg-gray-800 hover:bg-gray-700'}`}>Oldest</button>
            </div>
          </div>
          <p className="text-gray-400 text-sm mb-4 md:text-base md:mb-4.5">Showing {filteredAndSortedChapterKeys.length} of {Object.keys(allChapters).length} chapters</p>
          <input type="text" placeholder="Find chapter by number or title" className="w-full pl-4 pr-4 py-2 border border-gray-700 rounded-md focus:ring-2 focus:ring-indigo-500 text-white bg-gray-800 md:py-2.5" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />

          <div className="divide-y divide-gray-800 max-h-[50vh] overflow-y-auto custom-scrollbar mt-4">
            {filteredAndSortedChapterKeys.length > 0 ? (
              filteredAndSortedChapterKeys.map(chapterKey => {
                const chapter = allChapters[chapterKey];
                
                if (chapter.isPremium) {
                  return (
                    <a key={chapterKey} href={chapter.url} target="_blank" rel="noopener noreferrer" className="flex justify-between items-center py-3 px-2 hover:bg-gray-800/50 transition duration-150 rounded-md text-white border-l-2 border-transparent hover:border-[#13C3FF] md:py-3.5 md:px-2.5">
                      <div className="flex items-center truncate text-sm font-medium md:text-base">
                        <KofiIcon />
                        {/* UPDATED: Conditional Volume */}
                        {chapter.volume && chapter.volume !== 'WN' && (
                          <>
                            <span className="text-gray-400">Vol. {chapter.volume}</span>
                            <span className="mx-2 text-gray-700">|</span>
                          </>
                        )}
                        <span>Ch. {chapter.display_chapter}</span>
                        {chapter.title && <span className="ml-2 text-gray-300">{chapter.title}</span>}
                      </div>
                      <div className="text-[#13C3FF] text-xs font-semibold flex-shrink-0 ml-4 md:text-sm">
                        Read on Ko-fi
                      </div>
                    </a>
                  );
                }

                return (
                  <Link key={chapterKey} to={`/novel/${novelSlug}/${chapterKey}`} className="flex justify-between items-center py-3 px-2 hover:bg-gray-800 transition duration-150 rounded-md text-white md:py-3.5 md:px-2.5">
                    <div className="truncate text-sm font-medium md:text-base">
                      {/* UPDATED: Conditional Volume */}
                      {chapter.volume && chapter.volume !== 'WN' && (
                        <>
                          <span className="text-gray-400">Vol. {chapter.volume}</span>
                          <span className="mx-2 text-gray-700">|</span>
                        </>
                      )}
                      <span>Ch. {chapter.display_chapter}</span>
                      {chapter.title && <span className="ml-2 text-gray-300">{chapter.title}</span>}
                    </div>
                    <div className="text-gray-400 text-xs flex-shrink-0 ml-4 md:text-sm">
                      {formatTimestampToTimeAgo(chapter.last_updated)}
                    </div>
                  </Link>
                );
              })
            ) : (
              <div className="py-8 text-center bg-gray-800/50 rounded-md mt-4 md:py-10 md:mt-5">
                <p className="text-gray-300 text-lg md:text-xl">No chapters found for your search.</p>
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