import React from 'react';
import { DiscussionEmbed } from 'disqus-react';

const DisqusComments = ({ shortname, novelTitle, novelSlug, chapterKey }) => {
  // IMPORTANT: Replace this with the actual domain where your app is hosted.
  // This is crucial for Disqus to correctly identify pages.
  const websiteUrl = 'https://alucardtranslations.org'; 

  const disqusConfig = {
    url: `${websiteUrl}/novel/${novelSlug}/${chapterKey}`,
    identifier: `${novelSlug}-${chapterKey}`, // A unique identifier for each chapter's comment thread
    title: `${novelTitle} - ${chapterKey.replace('chapter-', '')}`, // The title for this specific comment thread
  };

  // The DiscussionEmbed component will not render if shortname is not provided.
  if (!shortname) {
    return (
        <div className="text-center text-gray-400 p-4 bg-gray-800 rounded-lg">
            Disqus comments could not be loaded. Please configure your shortname.
        </div>
    );
  }

  return (
    // You can style this container div to match your site's theme
    <div className="bg-gray-900/50 p-4 sm:p-6 rounded-lg mt-8 border border-gray-800">
       <DiscussionEmbed
        shortname={shortname}
        config={disqusConfig}
      />
    </div>
  );
};

export default DisqusComments;