import {useEffect, useCallback, useState, useRef} from 'react';
import {Video} from '@shopify/hydrogen';

export function VideoPlayer({
  videoData,
  previewVideoData,
  isPreview = false,
  onEnded,
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const videoRef = useRef(null);

  const handleLoadedMetadata = useCallback((event) => {
    // console.log('Loaded metadata ', event.target.duration);
    setDuration(event.target.duration);
  }, []);

  const handleTimeUpdate = useCallback((event) => {
    setCurrentTime(event.target.currentTime);
    setProgress((event.target.currentTime / event.target.duration) * 100);
  }, []);

  const handleEnded = useCallback(() => {
    setIsPlaying(false);
    if (onEnded) {
      onEnded();
    }
  }, [onEnded]);

  const togglePlay = useCallback(() => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
    } else {
      videoRef.current.pause();
    }
    setIsPlaying(!videoRef.current.paused);
  }, []);

  const handleProgress = useCallback((event) => {
    if (!videoRef.current) return;
    const newTime = (event.target.value / 100) * videoRef.current.duration;
    videoRef.current.currentTime = newTime;
    setProgress(event.target.value);
  }, []);

  const handleVolumeChange = useCallback((event) => {
    const newVolume = parseFloat(event.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (!videoRef.current) return;
    if (!document.fullscreenElement) {
      videoRef.current.requestFullscreen().catch((err) => {
        console.error(
          `Error attempting to enable full-screen mode: ${err.message}`,
        );
      });
    } else {
      document.exitFullscreen();
    }
  }, []);

  const formatTime = (time) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60);
    return [
      hours > 0 ? hours : null,
      minutes,
      seconds < 10 ? `0${seconds}` : seconds,
    ]
      .filter(Boolean)
      .join(':');
  };

  const activeVideoData = isPreview ? previewVideoData : videoData;

  if (!activeVideoData) {
    return <div>No video data available</div>;
  }

  return (
    <div className="video-player">
      <Video
        data={activeVideoData}
        previewImageOptions={{
          width: 1920,
          height: 1080,
          crop: 'center',
        }}
        controls={false}
        autoPlay={false}
        loop={false}
        onEnded={handleEnded}
        onLoadedMetadata={handleLoadedMetadata}
        onTimeUpdate={handleTimeUpdate}
        className="w-full"
        ref={videoRef}
      />
      <div className="controls" role="group" aria-label="Video controls">
        <button onClick={togglePlay} aria-label={isPlaying ? 'Pause' : 'Play'}>
          {isPlaying ? 'Pause' : 'Play'}
        </button>
        <input
          type="range"
          min="0"
          max="100"
          value={progress}
          onChange={handleProgress}
          aria-label="Seek"
        />
        <span aria-label="Video time">
          {formatTime(currentTime)} / {formatTime(duration)}
        </span>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={volume}
          onChange={handleVolumeChange}
          aria-label="Volume"
        />
        <button onClick={toggleFullscreen} aria-label="Toggle fullscreen">
          Fullscreen
        </button>
      </div>
    </div>
  );
}
