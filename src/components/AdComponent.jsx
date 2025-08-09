import React, { useEffect, useRef } from 'react';

const AdComponent = () => {
  // Create a ref to attach to our component's root div
  const adContainerRef = useRef(null);

  useEffect(() => {
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
    adContainerRef.current.appendChild(adContainer);
    adContainerRef.current.appendChild(script);

    // Cleanup function to remove everything when the component unmounts
    return () => {
      if (adContainerRef.current) {
        adContainerRef.current.innerHTML = '';
      }
    };
  }, []); // The empty dependency array ensures this runs only once per instance

  // This outer div is unique to each instance of the component
  return (
    <div ref={adContainerRef} className="my-8 flex justify-center w-full"></div>
  );
};

export default AdComponent;