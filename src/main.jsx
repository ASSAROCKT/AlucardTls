import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

// Import your page components
import App from './App.jsx';
import HomePage from './pages/HomePage.jsx';
import AboutPage from './pages/AboutPage.jsx'; // Assuming you have this
import NovelSeriesPage from './pages/NovelSeriesPage.jsx';
import NovelReader from './pages/NovelReader.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-950 text-red-500">
        <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
        <a href="/" className="mt-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-full">
          Go Home
        </a>
      </div>
    ),
    children: [
      { index: true, element: <HomePage /> },
      { path: 'about', element: <AboutPage /> },
      { path: 'novel/:novelSlug', element: <NovelSeriesPage /> },
      { path: 'novel/:novelSlug/:chapterNumber', element: <NovelReader /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);