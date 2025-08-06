import React from 'react';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <header className="bg-black text-white p-4 shadow-lg">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center mb-4 md:mb-0">
          <Link to="/" className="text-2xl font-bold text-indigo-400 hover:text-indigo-300 transition duration-300 ease-in-out">
            Alucard Translations
          </Link>
        </div>
        <nav className="flex flex-wrap justify-center md:justify-end items-center space-x-6">
          <Link to="/about" className="text-gray-300 hover:text-white transition duration-300 ease-in-out">
            About
          </Link>
          <div className="flex space-x-4">
            <a href="https://discord.gg/x22HkcVKHT" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition duration-300 ease-in-out">
              <i className="fab fa-discord text-2xl"></i>
            </a>
            <a href="https://ko-fi.com/alucardnovels" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition duration-300 ease-in-out">
              <i className="fas fa-mug-hot text-2xl"></i>
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
}

export default Header;