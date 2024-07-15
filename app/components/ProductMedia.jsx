import {Image, Video} from '@shopify/hydrogen';
import {useState} from 'react';

export function ProductMedia({media, className}) {
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);

  const handleThumbnailClick = (index) => {
    setActiveMediaIndex(index);
  };

  if (!media.length) {
    return null;
  }

  const activeMedia = media[activeMediaIndex];

  return (
    <div className={`product-media ${className}`}>
      <div className="main-media mb-4">
        {activeMedia.__typename === 'MediaImage' && (
          <Image
            data={activeMedia.image}
            aspectRatio="16/9"
            sizes="(min-width: 64em) 60vw, (min-width: 48em) 50vw, 90vw"
            className="w-full h-auto object-cover rounded-lg"
          />
        )}
        {activeMedia.__typename === 'Video' && (
          <Video
            data={activeMedia}
            className="w-full h-auto object-cover rounded-lg"
            controls
            preload="none"
          />
        )}
      </div>
      {media.length > 1 && (
        <div className="media-thumbnails flex space-x-2 overflow-x-auto">
          {media.map((item, index) => (
            <button
              key={item.id}
              onClick={() => handleThumbnailClick(index)}
              className={`thumbnail-button flex-shrink-0 w-20 h-20 rounded-md overflow-hidden ${
                index === activeMediaIndex ? 'ring-2 ring-blue-500' : ''
              }`}
            >
              {item.__typename === 'MediaImage' && (
                <Image
                  data={item.image}
                  sizes="80px"
                  className="w-full h-full object-cover"
                />
              )}
              {item.__typename === 'Video' && (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-gray-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
