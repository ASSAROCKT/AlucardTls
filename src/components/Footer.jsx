import React from 'react';

function Footer() {
  const handleBackToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-black text-white p-4 shadow-lg mt-8">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center text-center md:text-left">
        <div className="mb-4 md:mb-0">
          <p className="text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} Alucard Translations. All rights reserved.
          </p>
        </div>
        <div className="flex space-x-6 mb-4 md:mb-0">
          <a href="https://discord.gg/x22HkcVKHT" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition duration-300 ease-in-out">
            <i className="fab fa-discord text-2xl"></i>
          </a>
          <a href="https://ko-fi.com/aphroditescans" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition duration-300 ease-in-out">
            <i className="fas fa-mug-hot text-2xl"></i>
          </a>
        </div>
        <div>
          <button
            onClick={handleBackToTop}
            className="text-indigo-400 hover:text-indigo-300 transition duration-300 ease-in-out text-sm font-semibold"
          >
            Back to Top
          </button>
        </div>
      </div>
    </footer>
  );
}

export default Footer;