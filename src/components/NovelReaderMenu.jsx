import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Footer from '../components/Footer.jsx';
import ReactMarkdown from 'react-markdown';
import ChapterListMenu from '../components/ChapterListMenu.jsx';
import { slugify } from '../utils/slugify';
import AdComponent from '../components/AdComponent.jsx';

// --- Kofi Support Banner Component ---
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

// --- Reader Settings Menu Component (Corrected) ---
function NovelReaderMenu({
  currentFont,
  setCurrentFont, // FIX: Changed from setFont
  currentTextSize,
  setCurrentTextSize, // FIX: Changed from setTextSize
  currentLineHeight,
  setCurrentLineHeight, // FIX: Changed from setLineHeight
  currentContrast,
  setCurrentContrast, // FIX: Changed from setContrast
  resetSettings, // FIX: Changed from onReset
  onClose
}) {
  const fonts = [
    { name: 'Inter', className: 'font-inter' },
    { name: 'Merriweather', className: 'font-merriweather' },
    { name: 'Montserrat', className: 'font-montserrat' },
  ];

  const handleTextSizeChange = (increment) => {
    setCurrentTextSize(prev => Math.max(12, Math.min(30, prev + increment)));
  };

  const handleLineHeightChange = (increment) => {
    setCurrentLineHeight(prev => Math.max(18, Math.min(40, prev + increment)));
  };

  return (
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
              onClick={() => setCurrentFont(font.className)} // FIX: Changed to setCurrentFont
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
            onClick={() => setCurrentContrast('normal')} // FIX: Changed to setCurrentContrast
            className={`px-4 py-2 rounded-md text-sm font-medium transition duration-200 ${
              currentContrast === 'normal'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            Normal
          </button>
          <button
            onClick={() => setCurrentContrast('high')} // FIX: Changed to setCurrentContrast
            className={`px-4 py-2 rounded-md text-sm font-medium transition duration-200 ${
              currentContrast === 'high'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            High
          </button>
        </div>
      </div>

      {/* Reset Button */}
      <button
        onClick={resetSettings} // FIX: Changed to resetSettings
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition duration-200"
      >
        RESET
      </button>
    </div>
  );
}

// Helper to get initial settings from localStorage
const getInitialSettings = () => {
  try {
    const savedSettings = localStorage.getItem('novelReaderSettings');
    return savedSettings ? JSON.parse(savedSettings) : {};
  } catch (error) {
    console.error("Failed to parse settings from localStorage:", error);
    return {};
  }
};

// --- Main NovelReader Component ---
function NovelReader() {
  const [chapterContent, setChapterContent] = useState(null);
  const [novelData, setNovelData] = useState(null);
  const [loading, setLoading] = useState(true);
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
  const kofiUrl = "https://ko-fi.com/alucardnovels";

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

  // Ad remover script
  useEffect(() => {
    const removePornAds = () => {
      try {
        const queue = document.getElementById('disqus_thread');
        if (!queue) return;
        const elements = queue.getElementsByTagName('iframe');
        
        if (elements.length >= 5) {
          elements[1]?.remove();
        } else if (elements.length === 4 || elements.length === 2) {
          elements[0]?.remove();
        }
      } catch (e) {
        console.error('Error removing Disqus ad iframe:', e);
        clearInterval(intervalId);
      }
    };
    const intervalId = setInterval(removePornAds, 1000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const controlNavbar = () => {
      setShowIcons(window.scrollY <= 50 || window.scrollY < lastScrollY.current);
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
      setError(null);
      try {
        const mainListResponse = await fetch("https://raw.githubusercontent.com/ASSAROCKT/Apscans-novels-Repo/main/novels.json");
        if (!mainListResponse.ok) throw new Error("Could not fetch the main list of novels.");
        const allNovels = await mainListResponse.json();

        const targetNovelInfo = allNovels.find(novel => slugify(novel.title) === novelSlug);
        if (!targetNovelInfo) throw new Error(`Novel with slug "${novelSlug}" not found.`);

        const seriesResponse = await fetch(targetNovelInfo.url);
        if (!seriesResponse.ok) throw new Error(`Novel series data not found.`);
        
        const seriesData = await seriesResponse.json();
        seriesData.sourceUrl = targetNovelInfo.url;
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
      setError(null);
      setChapterContent(null);
      try {
        const isPremium = !novelData.chapters[chapterNumber] && novelData.premium_chapters && novelData.premium_chapters[chapterNumber];
        if (!novelData.chapters[chapterNumber] && !isPremium) {
          throw new Error(`Chapter "${chapterNumber}" not found.`);
        }

        if (isPremium) {
           throw new Error(`This is a premium chapter. Please read it on Ko-fi.`);
        }

        const novelJsonUrl = novelData.sourceUrl;
        const basePath = novelJsonUrl.substring(0, novelJsonUrl.lastIndexOf('/') + 1);
        const chapterFileName = novelData.chapters[chapterNumber].url;
        const chapterContentUrl = `${basePath}${chapterFileName}`;

        const chapterResponse = await fetch(chapterContentUrl);
        if (!chapterResponse.ok) throw new Error(`Chapter content file not found.`);
        setChapterContent(await chapterResponse.text());
      } catch (e) {
        setError(`Failed to load chapter. ${e.message}`);
      }
    };
    fetchChapterContent();
  }, [novelData, chapterNumber]);

  const { prevChapterKey, nextChapterKey } = useMemo(() => {
    if (!novelData?.chapters) return { prevChapterKey: null, nextChapterKey: null };

    const keys = Object.keys(novelData.chapters).sort((aKey, bKey) => {
        const chapA = novelData.chapters[aKey];
        const chapB = novelData.chapters[bKey];
        return (chapA.display_chapter || 0) - (chapB.display_chapter || 0);
    });
    
    const index = keys.indexOf(chapterNumber);
    const prevKey = index > 0 ? keys[index - 1] : null;
    const nextKey = index < keys.length - 1 ? keys[index + 1] : null;
    return { prevChapterKey: prevKey, nextChapterKey: nextKey };
  }, [novelData, chapterNumber]);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white"><div className="text-xl font-semibold">Loading novel...</div></div>;
  if (error) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-950 text-red-500 p-4 text-center">
      <div className="text-xl font-semibold mb-4">{error}</div>
      <Link to="/" className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-full">Back to Home</Link>
    </div>
  );
  if (!novelData || !chapterContent) return <div className="min-h-screen flex items-center justify-center bg-gray-950 text-gray-400"><div className="text-xl font-semibold">Loading chapter content...</div></div>;
  
  const currentChapterDetails = novelData.chapters[chapterNumber];
  const fullChapterTitle = `Chapter ${currentChapterDetails?.display_chapter}${currentChapterDetails?.title ? ` - ${currentChapterDetails.title}` : ''}`;
  
  const readerContainerClasses = `min-h-screen flex flex-col ${currentContrast === 'high' ? 'bg-black text-gray-100' : 'bg-gray-950 text-white'}`;
  const contentStyle = { fontSize: `${currentTextSize}px`, lineHeight: `${currentLineHeight}px` };
  
  const hasPremiumChapters = novelData?.premium_chapters && Object.keys(novelData.premium_chapters).length > 0;

  return (
    <div className={readerContainerClasses}>
      <Helmet>
        <title>{`${fullChapterTitle} - ${novelData.title}`}</title>
      </Helmet>

      <div className={`fixed bottom-4 right-4 z-40 flex flex-row space-x-3 transition-opacity duration-300 ${showIcons ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <button onClick={() => {setShowChapterMenu(p => !p); setShowSettingsMenu(false);}} className="bg-gray-800 text-white p-3 rounded-full shadow-lg hover:bg-gray-700" aria-label="Open chapter list">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
        </button>
        <button onClick={() => {setShowSettingsMenu(p => !p); setShowChapterMenu(false);}} className="bg-gray-800 text-white p-3 rounded-full shadow-lg hover:bg-gray-700" aria-label="Open settings menu">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
        </button>
      </div>

      {showChapterMenu && <ChapterListMenu chapters={novelData.chapters} currentChapterKey={chapterNumber} novelSlug={novelSlug} onClose={() => setShowChapterMenu(false)} />}
      {showSettingsMenu && <NovelReaderMenu {...{currentFont, setCurrentFont, currentTextSize, setCurrentTextSize, currentLineHeight, setCurrentLineHeight, currentContrast, setCurrentContrast, resetSettings}} onClose={() => setShowSettingsMenu(false)} />}

      <main className="p-4 max-w-4xl mx-auto flex-grow w-full">
        <h1 className="text-3xl sm:text-4xl font-bold text-indigo-400 mb-2 text-center">{novelData.title}</h1>
        <h2 className="text-2xl sm:text-3xl font-semibold text-gray-200 text-center">{fullChapterTitle}</h2>
        
        <nav aria-label="breadcrumb" className="text-sm text-gray-400 mt-4 mb-12 text-center">
          <ol className="flex items-center justify-center space-x-2 flex-wrap">
            <li><Link to="/" className="hover:text-indigo-400">Home</Link></li>
            <li className="text-gray-500">›</li>
            <li><Link to={`/novel/${novelSlug}`} title={novelData.title} className="hover:text-indigo-400">{novelData.title}</Link></li>
            <li className="text-gray-500">›</li>
            <li className="font-semibold text-gray-200 truncate">Ch. {currentChapterDetails.display_chapter}</li>
          </ol>
        </nav>
        
        <AdComponent key={`ad-top-${chapterNumber}`} />

        <div className={`text-lg leading-relaxed prose prose-invert max-w-none ${currentFont}`} style={contentStyle}>
          <ReactMarkdown components={{ p: ({ node, ...props }) => <p className="mb-6" {...props} /> }}>
            {chapterContent}
          </ReactMarkdown>
        </div>
        
        <KofiSupportBanner kofiUrl={kofiUrl} />

        <nav className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
          <div className="w-full sm:w-auto flex justify-start">
            {prevChapterKey ? (
              <Link to={`/novel/${novelSlug}/${prevChapterKey}`} className="w-full sm:w-auto flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                Previous
              </Link>
            ) : (
              <button disabled className="w-full sm:w-auto flex items-center justify-center bg-gray-800 text-gray-500 font-semibold py-2 px-4 rounded-lg cursor-not-allowed">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                Previous
              </button>
            )}
          </div>

          <div className="w-full sm:w-auto flex justify-center">
            <Link to={`/novel/${novelSlug}`} className="w-full sm:w-auto flex items-center justify-center bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md">
              Back to Series
            </Link>
          </div>
          
          <div className="w-full sm:w-auto flex justify-end">
            {nextChapterKey ? (
              <Link to={`/novel/${novelSlug}/${nextChapterKey}`} className="w-full sm:w-auto flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md">
                Next
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg>
              </Link>
            ) : hasPremiumChapters ? (
              <a href={kofiUrl} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto flex items-center justify-center bg-[#13C3FF] hover:bg-[#00A2D9] text-black font-bold py-2 px-4 rounded-lg shadow-md">
                Read More on Ko-fi
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg>
              </a>
            ) : (
              <button disabled className="w-full sm:w-auto flex items-center justify-center bg-gray-800 text-gray-500 font-semibold py-2 px-4 rounded-lg cursor-not-allowed">
                Next
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg>
              </button>
            )}
          </div>
        </nav>

        <AdComponent key={`ad-bottom-${chapterNumber}`} />
      </main>
      <Footer />
    </div>
  );
}

export default NovelReader;
