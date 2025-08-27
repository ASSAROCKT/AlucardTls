import React from 'react';
import Footer from '../components/Footer.jsx'; // Import the Footer component

function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-950 font-inter text-white flex flex-col justify-between py-12">
      <div className="container mx-auto p-4 max-w-4xl flex-grow">
        <h1 className="text-5xl font-extrabold text-indigo-400 mb-10 text-center leading-tight">
          Welcome to Alucard Translations
        </h1>
        <div className="bg-gray-900 rounded-xl shadow-2xl p-8 md:p-10 border border-gray-700 transform hover:scale-102 transition duration-300 ease-in-out">
          <p className="text-gray-200 mb-6 text-lg leading-relaxed">
            We are a dedicated group of enthusiasts passionate about bringing captivating stories from Japanese to English, ensuring a smooth and enjoyable reading experience for our community.
          </p>

          <h2 className="text-3xl font-bold text-indigo-400 mb-6 mt-8">Homepage</h2>
          <p className="text-gray-200 mb-4 text-lg">
            We make it easy to find new and exciting series:
          </p>
          <ul className="list-disc list-inside text-gray-300 mb-6 space-y-3 pl-4">
            <li>
              <strong className="font-bold">Featured Banner:</strong> Right on our homepage, you'll see a beautiful banner showcasing some of our top picks. Click "<strong className="font-bold">Start Reading</strong>" to jump straight into the action!
            </li>
            <li>
              <strong className="font-bold">Latest Updates:</strong> Always stay current! Our homepage features a dedicated section for the newest chapters released across all our series. Never miss an update.
            </li>
            <li>
              <strong className="font-bold">Browse All Series:</strong> Looking for something specific or just want to explore? Our "<strong className="font-bold">All Series</strong>" section lists every novel we offer, complete with cover art and a brief description.
            </li>
          </ul>

          <h2 className="text-3xl font-bold text-indigo-400 mb-6 mt-8">Series Page</h2>
          <p className="text-gray-200 mb-4 text-lg">
            Every novel has its own dedicated page where you can learn more:
          </p>
          <ul className="list-disc list-inside text-gray-300 mb-6 space-y-3 pl-4">
            <li>
              <strong className="font-bold">Series Overview:</strong> Get all the details about a novel, including who the amazing artist and author are, a full description of the story, and what genres or themes it covers.
            </li>
            <li>
              <strong className="font-bold">Start Reading Instantly:</strong> A prominent button on each series page lets you begin reading from the very first chapter right away.
            </li>
            <li>
              <strong className="font-bold">Chapter List:</strong> Easily find any chapter you're looking for. We list all available chapters, complete with their titles and when they were last updated, so you can pick up exactly where you left off.
            </li>
          </ul>

          <h2 className="text-3xl font-bold text-indigo-400 mb-6 mt-8">Novel Reader</h2>
          <p className="text-gray-200 mb-4 text-lg">
            Our built-in reader is designed for a comfortable reading experience:
          </p>
          <ul className="list-disc list-inside text-gray-300 mb-6 space-y-3 pl-4">
            <li>
              <strong className="font-bold">Effortless Navigation:</strong>
              <ul className="list-circle list-inside ml-6 mt-2 space-y-2">
                <li>
                  Use the <strong className="font-bold">arrow keys</strong> on your keyboard to quickly jump to the next or previous chapter.
                </li>
                <li>
                  Our <strong className="font-bold">Reader Menu</strong> lets you easily select any chapter from the series.
                </li>
              </ul>
            </li>
             <li>
              <strong className="font-bold">Personalized Settings:</strong>
              <ul className="list-circle list-inside ml-6 mt-2 space-y-2">
                <li>
                  Adjust font size and reading theme to your preference for maximum comfort.
                </li>
                <li>
                  <strong className="font-bold">Save Your Preferences:</strong> Your settings are automatically saved, so you don't have to set them every time you visit.
                </li>
              </ul>
            </li>
          </ul>

          <h2 className="text-3xl font-bold text-indigo-400 mb-6 mt-8">Seamless on Any Device</h2>
          <p className="text-gray-200 mb-6 text-lg leading-relaxed">
            Whether you're on your phone, tablet, or desktop computer, <strong className="font-bold">Alucard Translations</strong> looks and works beautifully. Our design adapts to your screen, ensuring a smooth and intuitive experience no matter how you're reading.
          </p>

          <h2 className="text-3xl font-bold text-indigo-400 mb-6 mt-8">Join Our Community!</h2>
          <p className="text-gray-200 mb-6 text-lg leading-relaxed">
            We love connecting with our readers! For more updates, discussions, and to chat with fellow novel enthusiasts, be sure to join our Discord server.
          </p>
          <div className="flex justify-center mt-8">
            <a
              href="https://discord.gg/x22HkcVKHT"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105 flex items-center group text-xl"
            >
              <i className="fab fa-discord mr-3 text-3xl group-hover:animate-pulse"></i>
              Dive into Our Discord Community
            </a>
          </div>
          <p className="text-center text-indigo-300 text-2xl font-semibold mt-10">Happy Reading!</p>
        </div>
      </div>
      <Footer /> {/* Render the Footer component here */}
    </div>
  );
}

export default AboutPage;
