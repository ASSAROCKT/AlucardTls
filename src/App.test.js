    import { render, screen } from '@testing-library/react';
    import App from './App'; // Your App component (now a layout)
    import { MemoryRouter } from 'react-router-dom'; // Import MemoryRouter for testing React Router components

    // A simple test to check if the App component renders correctly
    // Since App is now a layout, we'll check for something it always renders, like the Header's title.
    test('renders the main application layout with Header', () => {
      // When testing components that use React Router hooks (like <Outlet> in App),
      // they need to be wrapped in a Router. MemoryRouter is good for isolated tests.
      render(
        <MemoryRouter>
          <App />
        </MemoryRouter>
      );

      // Check for the presence of text from your Header component
      const headerTitle = screen.getByText(/Aphrodite Scans/i);
      expect(headerTitle).toBeInTheDocument();
    });
    