import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import HeroBanner from '../components/HeroBanner';
import Footer from '../components/Footer';
import { slugify } from '../utils/slugify';
import AdComponent from '../components/AdComponent.jsx';

// --- Time Formatting Utility ---
const formatRelativeTime = (timestamp) => {
  if (!timestamp) return '';
  const now = Date.now();
  const seconds = Math.floor((now - timestamp) / 1000);

  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min${minutes > 1 ? 's' : ''} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days > 1 ? 's' : ''} ago`;
};

// --- Child Component for HomePage ---
const SeriesGrid = ({ title, items, itemType }) => {
  if (!items || items.length === 0) return null;
  const basePath = itemType === 'novel' ? '/novel' : '';

  return (
    <section className="mb-12">
      <h2 className="text-4xl font-bold text-indigo-400 mb-8 text-center">{title}</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {items.map((item) => (
          <div key={`${item.title}-${item.chapterKey}`} className="group block overflow-hidden">
            <Link to={`${basePath}/${slugify(item.title)}/${item.chapterKey}`} className="block">
              <img
                src={item.cover}
                alt={`${item.title} Cover`}
                className="w-full h-64 object-cover object-top rounded-md transition duration-300 group-hover:scale-105"
                onError={(e) => { e.target.src = "https://placehold.co/200x280/333333/FFFFFF?text=No+Cover"; }}
              />
              <div className="p-3">
                <h3 className="mb-1 truncate text-white font-semibold text-lg hover:underline hover:text-purple-400">
                  <Link to={`${basePath}/${slugify(item.title)}`} onClick={(e) => e.stopPropagation()}>
                    {item.title}
                  </Link>
                </h3>
                <div className="flex justify-between items-center text-gray-400 text-sm">
                  {/* === UPDATED: Conditional Volume Display === */}
                  <span>
                    {item.volume && item.volume !== 'WN' && `Vol. ${item.volume} `}
                    Ch. {item.display_chapter}
                  </span>
                  <span className="text-gray-500">{formatRelativeTime(item.last_updated)}</span>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
};

const AllSeriesGrid = ({ title, items, hoveredItem, tooltipHandlers }) => {
  if (!items || items.length === 0) return null;

  return (
    <section className="pb-4">
      <h2 className="text-4xl font-bold text-indigo-400 mb-8 text-center">{title}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
        {items.map((item, index) => {
          const basePath = item.type === 'novel' ? '/novel' : '';
          const currentItemIsHovered = hoveredItem.index === index;

          return (
            <div
              key={`${item.type}-${index}`}
              className="relative group"
              onMouseMove={(e) => tooltipHandlers.onMouseMove(e, index)}
              onMouseLeave={tooltipHandlers.onMouseLeave}
            >
              <Link to={`${basePath}/${slugify(item.title)}`}>
                <div className="absolute top-2 left-2 bg-black bg-opacity-75 text-white text-xs font-bold px-2 py-1 rounded z-10">
                  {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                </div>
                <img
                  src={item.cover}
                  alt={`${item.title} Cover`}
                  className="w-full rounded-md shadow-md object-cover aspect-[2/3]"
                  onError={(e) => { e.target.src = "https://placehold.co/192x288/333333/FFFFFF?text=No+Cover"; }}
                />
                <h3 className="text-white text-md md:text-lg font-semibold mt-2 truncate text-center">{item.title}</h3>
              </Link>
              
              {currentItemIsHovered && (
                <div
                  className="fixed bg-black bg-opacity-90 rounded-md p-3 text-white z-50 w-56 pointer-events-none hidden lg:block"
                  style={{ left: `${hoveredItem.x + 15}px`, top: `${hoveredItem.y + 15}px`, transform: 'translate(0, -100%)' }}
                >
                  <p className="font-bold text-base mb-1">
                    {item.type.charAt(0).toUpperCase() + item.type.slice(1)} | {Object.keys(item.chapters || {}).length} Chapters
                  </p>
                  <p className="text-sm">{item.genres?.join(', ') || 'No Genres'}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

// --- Data Processing Function ---
const processLatestUpdates = (rawData) => {
  const latestChapterPerNovel = rawData
    .map(novel => {
      const chapterEntries = Object.entries(novel.chapters || {});
      if (chapterEntries.length === 0) return null;

      const [latestChapterKey, latestChapterDetails] = chapterEntries.sort(
        ([, a], [, b]) => b.last_updated - a.last_updated
      )[0];

      return {
        ...latestChapterDetails,
        title: novel.title,
        cover: novel.cover,
        chapterKey: latestChapterKey,
      };
    })
    .filter(Boolean);

  return latestChapterPerNovel
    .sort((a, b) => b.last_updated - a.last_updated)
    .slice(0, 8);
};

// --- Main HomePage Component ---
const HomePage = () => {
  const [novels, setNovels] = useState({ data: [], latest: [], loading: true, error: null });
  const [allSeries, setAllSeries] = useState([]);
  const [hoveredItem, setHoveredItem] = useState({ index: null, x: 0, y: 0 });

  useEffect(() => {
    const fetchData = async (url, type, setter) => {
      try {
        const indexRes = await fetch(url);
        if (!indexRes.ok) throw new Error(`Could not fetch ${type} index.`);
        const indexData = await indexRes.json();

        const fetchPromises = indexData.map(meta =>
          fetch(meta.url)
            .then(res => res.ok ? res.json() : null)
            .then(data => data ? { ...meta, ...data, type } : null)
        );
        
        const rawData = (await Promise.all(fetchPromises)).filter(Boolean);
        const latest = processLatestUpdates(rawData);
        setter({ data: rawData, latest, loading: false, error: null });
      } catch (e) {
        setter({ data: [], latest: [], loading: false, error: `Failed to load ${type} data.` });
      }
    };
    fetchData('https://raw.githubusercontent.com/ASSAROCKT/Apscans-novels-Repo/main/novels.json', 'novel', setNovels);
  }, []);
  
  useEffect(() => {
    if (!novels.loading) {
      const sortedNovels = [...novels.data].sort((a, b) => a.title.localeCompare(b.title));
      setAllSeries(sortedNovels);
    }
  }, [novels.data, novels.loading]);

  const tooltipHandlers = {
    onMouseMove: (event, index) => setHoveredItem({ index, x: event.clientX, y: event.clientY }),
    onMouseLeave: () => setHoveredItem({ index: null, x: 0, y: 0 }),
  };

  if (novels.loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white">Loading...</div>;
  }
  if (novels.error) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-950 text-red-500">{novels.error}</div>;
  }

  return (
    <div className="bg-gray-950 font-inter text-white">
      <div className="container mx-auto p-4">
        <HeroBanner />
        <SeriesGrid title="Latest Novel Releases" items={novels.latest} itemType="novel" />
        
        <div className="my-12">
          <AdComponent />
        </div>

        <AllSeriesGrid
          title="All Series"
          items={allSeries}
          hoveredItem={hoveredItem}
          tooltipHandlers={tooltipHandlers}
        />
      </div>
      <Footer />
    </div>
  );
}

export default HomePage;