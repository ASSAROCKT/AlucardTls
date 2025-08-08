import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import Footer from '../components/Footer.jsx';
import ReactMarkdown from 'react-markdown';
import NovelReaderMenu from '../components/NovelReaderMenu.jsx';
import ChapterListMenu from '../components/ChapterListMenu.jsx';
import { slugify } from '../utils/slugify';

// NEW: Copied the Kofi banner component here for use in the reader
const KofiSupportBanner = ({ kofiUrl = '#' }) => {
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 mt-12 mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-lg">
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

const getChapterNumber = (key) => {
  const match = key.match(/(\d+(\.\d+)?)$/);
  return match ? parseFloat(match[1]) : 0;
};

// Helper function to get initial settings from localStorage
const getInitialSettings = () => {
  try {
    const savedSettings = localStorage.getItem('novelReaderSettings');
    if (savedSettings) {
      return JSON.parse(savedSettings);
    }
  } catch (error) {
    console.error("Failed to parse settings from localStorage:", error);
  }
  return {};
};


function NovelReader() {
  const [chapterContent, setChapterContent] = useState(null);
  const [novelData, setNovelData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingChapter, setLoadingChapter] = useState(false);
  const [error, setError] = useState(null);

  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const [showChapterMenu, setShowChapterMenu] = useState(false);

  const [showIcons, setShowIcons] = useState(true);
  const lastScrollY = useRef(0);

  const initialSettings = getInitialSettings();
  const [currentFont, setCurrentFont] = useState(initialSettings.font || 'font-inter');
  const [currentTextSize, setCurrentTextSize] = useState(initialSettings.size || 16);
  const [currentLineHeight, setCurrentLineHeight] = useState(initialSettings.lineHeight || 24);
  const [currentContrast, setCurrentContrast] = useState(initialSettings.contrast || 'normal');

  const { novelSlug, chapterNumber } = useParams();

  const resetSettings = useCallback(() => {
    setCurrentFont('font-inter');
    setCurrentTextSize(16);
    setCurrentLineHeight(24);
    setCurrentContrast('normal');
    localStorage.removeItem('novelReaderSettings');
  }, []);

  useEffect(() => {
    const settingsToSave = {
      font: currentFont,
      size: currentTextSize,
      lineHeight: currentLineHeight,
      contrast: currentContrast,
    };
    localStorage.setItem('novelReaderSettings', JSON.stringify(settingsToSave));
  }, [currentFont, currentTextSize, currentLineHeight, currentContrast]);


  const handleToggleChapterMenu = () => {
    setShowChapterMenu(prev => !prev);
    setShowSettingsMenu(false);
  };

  const handleToggleSettingsMenu = () => {
    setShowSettingsMenu(prev => !prev);
    setShowChapterMenu(false);
  };

  useEffect(() => {
    const controlNavbar = () => {
      if (window.scrollY > lastScrollY.current && window.scrollY > 50) {
        setShowIcons(false);
      } else {
        setShowIcons(true);
      }
      lastScrollY.current = window.scrollY;
    };
    window.addEventListener('scroll', controlNavbar);
    return () => window.removeEventListener('scroll', controlNavbar);
  }, []);

  useEffect(() => {
    if (!novelSlug) {
      setError("Novel slug not provided in the URL.");
      setLoading(false);
      return;
    }
    const fetchNovelData = async () => {
      setLoading(true);
      setNovelData(null);
      setError(null);
      try {
        const MAIN_NOVEL_LIST_URL = "https://raw.githubusercontent.com/ASSAROCKT/Apscans-novels-Repo/main/novels.json";
        const mainListResponse = await fetch(MAIN_NOVEL_LIST_URL);
        if (!mainListResponse.ok) throw new Error("Could not fetch the main list of novels.");
        const allNovels = await mainListResponse.json();

        const targetNovelInfo = allNovels.find(novel => slugify(novel.title) === novelSlug);
        if (!targetNovelInfo) throw new Error(`Novel with slug "${novelSlug}" not found.`);

        const seriesUrl = targetNovelInfo.url;
        const seriesResponse = await fetch(seriesUrl);
        if (!seriesResponse.ok) throw new Error(`Novel series data not found at ${seriesUrl}`);
        
        const seriesData = await seriesResponse.json();
        
        seriesData.sourceUrl = seriesUrl; 
        
        setNovelData(seriesData);
      } catch (e) {
        setError(`Failed to load novel metadata. ${e.message}`);
      } finally {
        setLoading(false);
      }
    };
    fetchNovelData();
  }, [novelSlug]);

  useEffect(() => {
    if (!novelData || !chapterNumber) return;
    
    setShowChapterMenu(false);
    setShowSettingsMenu(false);
    window.scrollTo(0, 0);

    const fetchChapterContent = async () => {
      setLoadingChapter(true);
      setError(null);
      try {
        if (!novelData.chapters[chapterNumber]) {
          throw new Error(`Chapter "${chapterNumber.replace('chapter-', '')}" not found.`);
        }

        const novelJsonUrl = novelData.sourceUrl;
        const basePath = novelJsonUrl.substring(0, novelJsonUrl.lastIndexOf('/') + 1);

        const chapterFileName = novelData.chapters[chapterNumber].url;
        const chapterContentUrl = `${basePath}${chapterFileName}`;

        const chapterResponse = await fetch(chapterContentUrl);
        if (!chapterResponse.ok) throw new Error(`Chapter content file not found at ${chapterContentUrl}.`);
        const text = await chapterResponse.text();
        setChapterContent(text);
      } catch (e) {
        setError(`Failed to load chapter. ${e.message}`);
        setChapterContent(null);
      } finally {
        setLoadingChapter(false);
      }
    };
    fetchChapterContent();
  }, [novelData, chapterNumber]);

  const { prevChapterKey, nextChapterKey } = useMemo(() => {
    if (!novelData?.chapters) return { prevChapterKey: null, nextChapterKey: null };
    const keys = Object.keys(novelData.chapters).sort((a, b) => getChapterNumber(a) - getChapterNumber(b));
    const index = keys.indexOf(chapterNumber);
    const prevKey = index > 0 ? keys[index - 1] : null;
    const nextKey = index < keys.length - 1 ? keys[index + 1] : null;
    return { prevChapterKey: prevKey, nextChapterKey: nextKey };
  }, [novelData, chapterNumber]);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white"><div className="text-xl font-semibold">Loading novel...</div></div>;
  if (error && !loadingChapter) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-950 text-red-500 p-4 text-center">
      <div className="text-xl font-semibold mb-4">{error}</div>
      <Link to="/" className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-full">Back to Home</Link>
    </div>
  );
  if (!novelData) return <div className="min-h-screen flex items-center justify-center bg-gray-950 text-gray-400"><div className="text-xl font-semibold">Novel data could not be loaded.</div></div>;

  const chapterNum = getChapterNumber(chapterNumber);
  const chapterSpecificTitle = novelData.chapters[chapterNumber]?.title;
  const fullChapterTitle = `Chapter ${chapterNum}${chapterSpecificTitle ? ` - ${chapterSpecificTitle}` : ''}`;
  
  const readerContainerClasses = `min-h-screen flex flex-col ${currentContrast === 'high' ? 'bg-black text-gray-100' : 'bg-gray-950 text-white'}`;
  const contentStyle = { fontSize: `${currentTextSize}px`, lineHeight: `${currentLineHeight}px` };

  return (
    <div className={readerContainerClasses}>
      <div className={`fixed bottom-4 right-4 z-40 flex flex-row space-x-3 transition-opacity duration-300 ${showIcons ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <button onClick={handleToggleChapterMenu} className="bg-gray-800 text-white p-3 rounded-full shadow-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500" aria-label="Open chapter list">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
        </button>
        <button onClick={handleToggleSettingsMenu} className="bg-gray-800 text-white p-3 rounded-full shadow-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500" aria-label="Open settings menu">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
        </button>
      </div>

      {showChapterMenu && (
        <ChapterListMenu chapters={novelData.chapters} currentChapterKey={chapterNumber} novelSlug={novelSlug} onClose={() => setShowChapterMenu(false)} getChapterNumber={getChapterNumber} />
      )}
      {showSettingsMenu && (
        <NovelReaderMenu currentFont={currentFont} setFont={setCurrentFont} currentTextSize={currentTextSize} setTextSize={setCurrentTextSize} currentLineHeight={currentLineHeight} setLineHeight={setCurrentLineHeight} currentContrast={currentContrast} setContrast={setCurrentContrast} onReset={resetSettings} onClose={() => setShowSettingsMenu(false)} />
      )}

      <main className="p-4 max-w-4xl mx-auto flex-grow w-full">
        {loadingChapter ? (
          <div className="text-center text-gray-400">Loading chapter...</div>
        ) : error && !chapterContent ? (
           <div className="text-red-500 text-center">{error}</div>
        ) : (
          <>
            <h1 className="text-3xl sm:text-4xl font-bold text-indigo-400 mb-2 text-center">{novelData.title}</h1>
            <h2 className="text-2xl sm:text-3xl font-semibold text-gray-200 text-center">{fullChapterTitle}</h2>
            
            <nav aria-label="breadcrumb" className="text-sm text-gray-400 mt-4 mb-12 text-center">
              <ol className="flex items-center justify-center space-x-2 flex-wrap">
                <li><Link to="/" className="hover:text-indigo-400">Home</Link></li>
                <li className="text-gray-500">›</li>
                <li>
                  <Link 
                    to={`/novel/${novelSlug}`} 
                    title={novelData.title} 
                    className="hover:text-indigo-400"
                  >
                    {novelData.title}
                  </Link>
                </li>
                <li className="text-gray-500">›</li>
                <li className="font-semibold text-gray-200 truncate">
                  Chapter {chapterNum}
                </li>
              </ol>
            </nav>
            
            <div className={`text-lg leading-relaxed prose prose-invert max-w-none ${currentFont}`} style={contentStyle}>
              <ReactMarkdown components={{ p: ({ node, ...props }) => <p className="mb-6" {...props} /> }}>
                {chapterContent}
              </ReactMarkdown>
            </div>

            
            <KofiSupportBanner kofiUrl="https://ko-fi.com/alucardnovels" />

            <nav className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-8">
              <div className="w-full sm:w-auto flex justify-start">
                {prevChapterKey ? (
                  <Link 
                    to={`/novel/${novelSlug}/${prevChapterKey}`} 
                    className="w-full sm:w-auto flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-transform transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-950 focus:ring-indigo-500"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Previous
                  </Link>
                ) : (
                  <button 
                    disabled 
                    className="w-full sm:w-auto flex items-center justify-center bg-gray-800 text-gray-500 font-semibold py-2 px-4 rounded-lg shadow-md cursor-not-allowed"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Previous
                  </button>
                )}
              </div>

              <div className="w-full sm:w-auto flex justify-center">
                <Link 
                  to={`/novel/${novelSlug}`} 
                  className="w-full sm:w-auto flex items-center justify-center bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-transform transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-950 focus:ring-indigo-500"
                >
                  Back to Series
                </Link>
              </div>
              
              <div className="w-full sm:w-auto flex justify-end">
                {nextChapterKey ? (
                  <Link 
                    to={`/novel/${novelSlug}/${nextChapterKey}`} 
                    className="w-full sm:w-auto flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-transform transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-950 focus:ring-indigo-500"
                  >
                    Next
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </Link>
                ) : (
                  <button 
                    disabled 
                    className="w-full sm:w-auto flex items-center justify-center bg-gray-800 text-gray-500 font-semibold py-2 px-4 rounded-lg shadow-md cursor-not-allowed"
                  >
                    Next
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                )}
              </div>
            </nav>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default NovelReader;