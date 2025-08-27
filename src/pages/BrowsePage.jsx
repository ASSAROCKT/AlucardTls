import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { slugify } from '../utils/slugify'; 

const SeriesCard = ({ item }) => {
  const basePath = item.type === 'novel' ? '/novel' : '';
  
  const truncate = (str, num) => {
    if (!str || str.length <= num) {
      return str;
    }
    return str.slice(0, num) + '...';
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'ongoing':
        return 'bg-green-600';
      case 'completed':
        return 'bg-gray-600';
      case 'dropped':
        return 'bg-red-600';
      default:
        return 'bg-blue-600';
    }
  };

  return (
    <div className="bg-gray-900 rounded-lg shadow-lg overflow-hidden flex flex-col md:flex-row gap-4 p-4">
      <Link to={`${basePath}/${slugify(item.title)}`} className="flex-shrink-0 w-full md:w-40">
        <img 
          src={item.cover} 
          alt={`${item.title} Cover`} 
          className="w-full h-auto object-cover rounded-md aspect-[2/3]"
          onError={(e) => { e.target.src = "https://placehold.co/192x288/333333/FFFFFF?text=No+Cover"; }}
        />
      </Link>
      <div className="flex flex-col">
        <h3 className="text-xl font-bold text-white hover:text-indigo-400">
            <Link to={`${basePath}/${slugify(item.title)}`}>{item.title}</Link>
        </h3>
        <div className="flex items-center gap-2 mt-1 mb-2">
            <span className="text-xs font-semibold bg-blue-600 text-white px-2 py-0.5 rounded-full">{item.type?.charAt(0).toUpperCase() + item.type?.slice(1)}</span>
            {item.status && (
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${getStatusColor(item.status)} text-white`}>
                  {item.status}
              </span>
            )}
        </div>
        <p className="text-sm text-gray-400 mb-3">
            {truncate(item.description || 'No description available.', 150)}
        </p>
        <div className="flex flex-wrap gap-2 mb-3">
            {(item.genres || []).map(genre => (
                <span key={genre} className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded">
                    {genre}
                </span>
            ))}
        </div>
        <div className="mt-auto flex justify-between items-center text-sm text-gray-500">
            <span>{Object.keys(item.chapters || {}).length} Chapters</span>
            {item.last_updated && <span>Updated: {new Date(item.last_updated).toLocaleDateString()}</span>}
        </div>
      </div>
    </div>
  );
};

// Helper function to find the latest update time from chapters
const getLatestUpdateTime = (chapters) => {
    if (!chapters || typeof chapters !== 'object' || Object.keys(chapters).length === 0) {
        return null;
    }
    const timestamps = Object.values(chapters).map(ch => ch.last_updated).filter(Boolean);
    return timestamps.length > 0 ? Math.max(...timestamps) : null;
};


const BrowsePage = () => {
  const [allSeries, setAllSeries] = useState([]);
  const [filteredSeries, setFilteredSeries] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState('last_updated');
  const [sortOrder, setSortOrder] = useState('descending');

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const indexRes = await fetch('https://raw.githubusercontent.com/ASSAROCKT/Apscans-novels-Repo/main/novels.json');
        const indexData = await indexRes.json();
        
        const fetchPromises = indexData.map(meta =>
          fetch(meta.url)
            .then(res => res.ok ? res.json() : Promise.reject(`Failed to fetch ${meta.url}`))
            .then(data => {
              const latestUpdate = getLatestUpdateTime(data.chapters);
              // --- FIX: Swapped the order of ...data and ...meta ---
              // This ensures that properties from the main novels.json (like status) are preserved.
              return { ...data, ...meta, type: 'novel', last_updated: latestUpdate };
            })
            .catch(error => {
              console.error(error);
              return null; // Return null for failed fetches
            })
        );

        const fullData = (await Promise.all(fetchPromises)).filter(Boolean); // Filter out any nulls from failed fetches
        
        console.log("Fetched and processed data:", fullData);

        fullData.sort((a, b) => (b.last_updated || 0) - (a.last_updated || 0));

        setAllSeries(fullData);
        setFilteredSeries(fullData);
      } catch (error) {
        console.error("Failed to fetch series data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, []);

  const handleApplyFilters = () => {
    let series = [...allSeries];

    if (searchQuery) {
      series = series.filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    if (statusFilter !== 'All') {
      series = series.filter(item => 
        item.status && item.status.toLowerCase() === statusFilter.toLowerCase()
      );
    }
    
    series.sort((a, b) => {
        if (sortBy === 'title') {
            return a.title.localeCompare(b.title);
        }
        if (sortBy === 'last_updated') {
            return (b.last_updated || 0) - (a.last_updated || 0);
        }
        return 0;
    });

    if (sortOrder === 'descending' && sortBy === 'title') {
        series.reverse();
    }
    if (sortOrder === 'ascending' && sortBy === 'last_updated') {
        series.reverse();
    }

    setFilteredSeries(series);
  };
  

  if (loading) {
    return <div className="min-h-screen text-center pt-20 text-white">Loading series...</div>;
  }

  return (
    <div className="bg-gray-950 min-h-screen text-white">
      <div className="container mx-auto p-4 md:p-8">
        <h1 className="text-4xl font-bold mb-8">Browse All Series</h1>
        
        <div className="bg-gray-900 p-4 rounded-lg mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <input 
            type="text" 
            placeholder="Search title, description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="lg:col-span-2 bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="bg-gray-800 border border-gray-700 rounded-md px-3 py-2">
            <option value="All">All Status</option>
            <option value="Ongoing">Ongoing</option>
            <option value="Completed">Completed</option>
            <option value="Dropped">Dropped</option>
          </select>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="bg-gray-800 border border-gray-700 rounded-md px-3 py-2">
            <option value="last_updated">Sort by Update Date</option>
            <option value="title">Sort by Title</option>
          </select>
          <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className="bg-gray-800 border border-gray-700 rounded-md px-3 py-2">
            <option value="descending">Descending</option>
            <option value="ascending">Ascending</option>
          </select>
          <button onClick={handleApplyFilters} className="bg-indigo-600 hover:bg-indigo-700 rounded-md px-4 py-2 font-semibold transition-colors w-full md:col-span-2 lg:col-span-1">
            Apply Filters
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredSeries.length > 0 ? (
            filteredSeries.map(item => <SeriesCard key={slugify(item.title)} item={item} />)
          ) : (
            <p className="lg:col-span-2 text-center text-gray-400">No series found that match your criteria.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default BrowsePage;
