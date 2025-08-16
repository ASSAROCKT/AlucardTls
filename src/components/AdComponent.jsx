import React, { useEffect, useRef } from 'react';

const AdComponent = () => {
  const adContainerRef = useRef(null);

  useEffect(() => {
    // The ad-loading logic is now active.
    
    // Check if the ref is attached to an element
    if (!adContainerRef.current) {
      return;
    }
    
    // The ad network's script expects a specific container ID.
    // We create that container *inside* our component's unique div.
    const adContainer = document.createElement('div');
    adContainer.id = 'container-7dec6cf94d541857f357038408486140';

    // Create the script element
    const script = document.createElement('script');
    script.src = "//pl27382146.profitableratecpm.com/7dec6cf94d541857f357038408486140/invoke.js";
    script.async = true;
    script.setAttribute('data-cfasync', 'false');

    // Append the container and the script to our component's div
    // Use a local variable to avoid issues if the ref changes during cleanup
    const currentAdContainer = adContainerRef.current;
    currentAdContainer.appendChild(adContainer);
    currentAdContainer.appendChild(script);

    // Cleanup function to remove everything when the component unmounts
    return () => {
      // Clear the innerHTML to remove the ad and script
      if (currentAdContainer) {
        currentAdContainer.innerHTML = '';
      }
    };
  }, []); // The empty dependency array ensures this runs only once

  // This outer div is unique to each instance of the component
  return (
    <div ref={adContainerRef} className="my-8 flex justify-center w-full"></div>
  );
};

export default AdComponent;
