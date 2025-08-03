import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './components/Header';

const App = () => {
  return (
    // This sets the base dark theme for the entire application
    <div className="bg-gray-950 font-inter text-white">
      <Header />
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default App;