import React from 'react';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <header className="bg-black text-white p-4 shadow-lg">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        {/* Left-aligned group for Title and Main Navigation */}
        <div className="flex items-center mb-4 md:mb-0">
          <Link to="/" className="text-2xl font-bold text-indigo-400 hover:text-indigo-300 transition duration-300 ease-in-out">
            Alucard Translations
          </Link>
          {/* Desktop Navigation with Social Icons */}
          <nav className="hidden md:flex items-center space-x-6 ml-10">
            <Link to="/" className="flex items-center text-gray-300 hover:text-white transition duration-300 ease-in-out">
              <i className="fas fa-home mr-2"></i> Home
            </Link>
            <Link to="/browse" className="flex items-center text-gray-300 hover:text-white transition duration-300 ease-in-out">
              <i className="fas fa-book-open mr-2"></i> Browse
            </Link>
            <Link to="/about" className="text-gray-300 hover:text-white transition duration-300 ease-in-out">
              About
            </Link>
            <a href="https://discord.gg/x22HkcVKHT" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition duration-300 ease-in-out">
              <i className="fab fa-discord text-2xl"></i>
            </a>
            <a href="https://ko-fi.com/alucardnovels" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition duration-300 ease-in-out">
              <i className="fas fa-mug-hot text-2xl"></i>
            </a>
          </nav>
        </div>
        
        {/* Mobile navigation for small screens */}
        <nav className="flex md:hidden items-center space-x-4">
          <Link to="/" className="flex items-center text-gray-300 hover:text-white transition duration-300 ease-in-out">
            <i className="fas fa-home mr-2"></i> Home
          </Link>
          <Link to="/browse" className="flex items-center text-gray-300 hover:text-white transition duration-300 ease-in-out">
            <i className="fas fa-book-open mr-2"></i> Browse
          </Link>
          <Link to="/about" className="text-gray-300 hover:text-white transition duration-300 ease-in-out">
            About
          </Link>
          <a href="https://discord.gg/x22HkcVKHT" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition duration-300 ease-in-out">
            <i className="fab fa-discord text-2xl"></i>
          </a>
          <a href="https://ko-fi.com/alucardnovels" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition duration-300 ease-in-out">
            <i className="fas fa-mug-hot text-2xl"></i>
          </a>
        </nav>
      </div>
    </header>
  );
}

export default Header;
