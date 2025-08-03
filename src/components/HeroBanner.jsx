// src/components/HeroBanner.js

import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { slugify } from '../utils/slugify';

/**
 * A responsive, auto-playing, and touch-enabled hero banner component
 * that fetches and displays novel information.
 */
function HeroBanner() {
  // --- STATE MANAGEMENT ---
  const [bannerData, setBannerData] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- REFS FOR TOUCH, SWIPE, AND AUTOPLAY LOGIC ---
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const hasMovedHorizontally = useRef(false);
  const autoPlayIntervalRef = useRef(null);
  const isUserInteractingRef = useRef(false);

  // --- CONSTANTS ---
  const MIN_SWIPE_DISTANCE = 50;
  const TAP_TOLERANCE = 10;
  const AUTOPLAY_DELAY = 7000; // 7 seconds

  // --- AUTOPLAY LOGIC ---
  const startAutoPlay = () => {
    // Ensure there's data and no existing interval
    if (bannerData.length > 0 && !autoPlayIntervalRef.current) {
      autoPlayIntervalRef.current = setInterval(() => {
        // Only advance the slide if the user is not interacting
        if (!isUserInteractingRef.current) {
          setCurrentIndex((prevIndex) => (prevIndex + 1) % bannerData.length);
        }
      }, AUTOPLAY_DELAY);
    }
  };

  const stopAutoPlay = () => {
    if (autoPlayIntervalRef.current) {
      clearInterval(autoPlayIntervalRef.current);
      autoPlayIntervalRef.current = null;
    }
  };

  // --- DATA FETCHING EFFECT ---
  useEffect(() => {
    const fetchBannerData = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://raw.githubusercontent.com/ASSAROCKT/aphroditescans/refs/heads/main/bannernovels.json');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setBannerData(data);
      } catch (e) {
        console.error("Failed to fetch banner data:", e);
        setError("Failed to load banner content. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchBannerData();
  }, []); // Empty dependency array ensures this runs only once on mount

  // --- AUTOPLAY LIFECYCLE EFFECT ---
  useEffect(() => {
    startAutoPlay();
    // Cleanup function to stop autoplay when the component unmounts or data changes
    return () => stopAutoPlay();
  }, [bannerData.length]); // Restart autoplay if the banner data changes

  // --- SLIDER NAVIGATION ---
  const slideTo = (newIndex) => {
    setCurrentIndex(newIndex);
  };

  const nextSlide = () => {
    slideTo((currentIndex + 1) % bannerData.length);
  };

  const prevSlide = () => {
    slideTo((currentIndex - 1 + bannerData.length) % bannerData.length);
  };

  const goToSlide = (index) => {
    slideTo(index);
  };

  // --- TOUCH EVENT HANDLERS ---
  const handleTouchStart = (e) => {
    isUserInteractingRef.current = true;
    stopAutoPlay();
    touchStartX.current = e.touches[0].clientX;
    touchEndX.current = e.touches[0].clientX; // Reset end position
    hasMovedHorizontally.current = false;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
    // Check if horizontal movement exceeds the tap tolerance
    if (Math.abs(touchEndX.current - touchStartX.current) > TAP_TOLERANCE) {
      hasMovedHorizontally.current = true;
    }
  };

  const handleTouchEnd = (e) => {
    const distance = touchStartX.current - touchEndX.current;
    const isSwipe = Math.abs(distance) > MIN_SWIPE_DISTANCE;

    if (isSwipe) {
      // Swipe left (next) or right (prev)
      if (distance > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
      // Prevent parent elements from handling the event (e.g., link click)
      e.preventDefault();
      e.stopPropagation();
    }

    // Reset interaction states
    isUserInteractingRef.current = false;
    // Restart autoplay after a short delay to feel responsive
    setTimeout(() => startAutoPlay(), 300);
  };

  // --- LINK CLICK HANDLER ---
  const handleLinkClick = (e) => {
    // Prevent the link from navigating if a drag/swipe was detected
    if (hasMovedHorizontally.current) {
      e.preventDefault();
      console.log("Link click prevented: Drag detected.");
    }
  };

  // --- RENDER STATES ---
  if (loading) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-900 rounded-lg mb-12">
        <div className="text-xl font-semibold text-gray-400">Loading banner...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-900 rounded-lg mb-12">
        <div className="text-xl font-semibold text-red-500">{error}</div>
      </div>
    );
  }

  if (bannerData.length === 0) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-900 rounded-lg mb-12">
        <div className="text-xl font-semibold text-gray-400">No banner content available.</div>
      </div>
    );
  }

  const currentNovel = bannerData[currentIndex];

  // --- COMPONENT JSX ---
  return (
    <div
      className="relative w-full h-[400px] md:h-[600px] lg:h-[700px] rounded-xl overflow-hidden shadow-2xl mb-12 group"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Background Image */}
      <img
        src={currentNovel.cover}
        alt={`${currentNovel.title} Banner`}
        className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-1000 ease-in-out transform scale-100 group-hover:scale-105"
        onError={(e) => {
          e.target.onerror = null; // Prevent infinite loop if placeholder fails
          e.target.src = "https://placehold.co/1200x700/333333/FFFFFF?text=Image+Not+Found";
        }}
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent"></div>

      {/* Content */}
      <div className="absolute inset-0 flex items-center p-4 md:p-8 lg:p-12">
        <div className="max-w-xl text-white">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4 text-indigo-300 drop-shadow-lg line-clamp-3 md:line-clamp-none">
            {currentNovel.title}
          </h2>
          <p className="text-sm md:text-base lg:text-lg mb-6 line-clamp-4 md:line-clamp-5 text-gray-200 drop-shadow">
            {currentNovel.description}
          </p>
          <Link
            to={`/novel/${slugify(currentNovel.title)}`}
            onClick={handleLinkClick}
            className="inline-flex items-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-75"
          >
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"></path>
            </svg>
            Start Reading
          </Link>
        </div>
      </div>

      {/* Navigation Buttons (Desktop) */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full focus:outline-none transition duration-300 ease-in-out opacity-0 group-hover:opacity-100 hidden md:block"
        aria-label="Previous slide"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
        </svg>
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full focus:outline-none transition duration-300 ease-in-out opacity-0 group-hover:opacity-100 hidden md:block"
        aria-label="Next slide"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
        </svg>
      </button>

      {/* Pagination Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
        {bannerData.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ease-in-out ${
              currentIndex === index ? 'bg-indigo-500 w-6' : 'bg-gray-400 hover:bg-gray-300'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          ></button>
        ))}
      </div>
    </div>
  );
}

export default HeroBanner;