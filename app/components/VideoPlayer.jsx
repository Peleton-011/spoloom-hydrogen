import React from 'react';

export function VideoPlayer({videoUrl}) {
  return (
    <div className="aspect-w-16 aspect-h-9">
      <iframe
        src={videoUrl}
        frameBorder="0"
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
      ></iframe>
    </div>
  );
}