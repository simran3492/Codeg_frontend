import { useState, useRef, useEffect } from 'react';
import {
  Play, Pause, Maximize, Minimize, Volume2, VolumeX,
  FastForward, Rewind, Settings, Check,
} from 'lucide-react';

// Define the available playback speed options
const playbackRates = [0.5, 0.75, 1, 1.25, 1.5, 2];

 const Editorial = ({ secureUrl, thumbnailUrl, duration }) => {
  const playerWrapperRef = useRef(null);
  const videoRef = useRef(null);

  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [muted, setMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [played, setPlayed] = useState(0);
  const [seeking, setSeeking] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [videoDuration, setVideoDuration] = useState(duration || 0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (playing) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(err => {
          console.error('Play failed:', err);
          setError(err.message);
        });
      }
      setPlaying(!playing);
    }
  };

  const handleRewind = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime - 10);
    }
  };

  const handleFastForward = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.min(videoDuration, videoRef.current.currentTime + 10);
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    setMuted(newVolume === 0);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
  };

  const handleToggleMute = () => {
    const newMuted = !muted;
    setMuted(newMuted);
    if (videoRef.current) {
      videoRef.current.muted = newMuted;
    }
  };

  const handlePlaybackRateChange = (rate) => {
    setPlaybackRate(rate);
    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
    }
    setShowSettings(false);
  };

  const handleSeekMouseDown = () => setSeeking(true);
  
  const handleSeekChange = (e) => {
    const newPlayed = parseFloat(e.target.value);
    setPlayed(newPlayed);
    if (videoRef.current) {
      videoRef.current.currentTime = newPlayed * videoDuration;
    }
  };
  
  const handleSeekMouseUp = (e) => {
    setSeeking(false);
    const newPlayed = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = newPlayed * videoDuration;
    }
  };

  const handleToggleFullScreen = () => {
    if (document.fullscreenEnabled && playerWrapperRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
        setIsFullScreen(false);
      } else {
        playerWrapperRef.current.requestFullscreen().catch(err => {
          console.error('Fullscreen failed:', err);
        });
        setIsFullScreen(true);
      }
    }
  };
  
  const formatTime = (seconds) => {
    if (isNaN(seconds) || seconds === Infinity) return '00:00';
    const date = new Date(seconds * 1000);
    const hh = date.getUTCHours();
    const mm = date.getUTCMinutes();
    const ss = date.getUTCSeconds().toString().padStart(2, '0');
    if (hh) {
      return `${hh}:${mm.toString().padStart(2, '0')}:${ss}`;
    }
    return `${mm}:${ss}`;
  };
  
  // Video event handlers
  const handleVideoLoadStart = () => {
    setIsLoading(true);
    setError(null);
  };

  const handleVideoCanPlay = () => {
    setIsLoading(false);
  };

  const handleVideoError = (e) => {
    setError('Failed to load video');
    setIsLoading(false);
    console.error('Video error:', e);
  };

  const handleVideoLoadedMetadata = () => {
    if (videoRef.current) {
      setVideoDuration(videoRef.current.duration);
      videoRef.current.volume = volume;
      videoRef.current.muted = muted;
      videoRef.current.playbackRate = playbackRate;
    }
  };

  const handleVideoTimeUpdate = () => {
    if (videoRef.current && !seeking) {
      setPlayed(videoRef.current.currentTime / videoDuration);
    }
  };

  const handleVideoEnded = () => {
    setPlaying(false);
  };

  useEffect(() => {
    let timeout;
    const handleMouseMove = () => {
      setShowControls(true);
      clearTimeout(timeout);
      if (playing) {
        timeout = setTimeout(() => setShowControls(false), 3000);
      }
    };
    const wrapper = playerWrapperRef.current;
    wrapper?.addEventListener('mousemove', handleMouseMove);
    return () => {
      wrapper?.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(timeout);
    };
  }, [playing]);

  if (!isClient) {
    return <div className="aspect-video w-full max-w-4xl mx-auto rounded-xl bg-black flex items-center justify-center">
      <div className="text-white">Loading player...</div>
    </div>;
  }

  return (
    <div ref={playerWrapperRef} className="relative w-full max-w-4xl mx-auto rounded-xl overflow-hidden shadow-2xl bg-black aspect-video group">
      {/* Debug info */}
      {error && (
        <div className="absolute top-2 left-2 bg-red-600 text-white px-2 py-1 rounded text-xs z-50">
          Error: {error}
        </div>
      )}
      
      <video
        ref={videoRef}
        className="w-full h-full object-contain"
        poster={thumbnailUrl}
        preload="metadata"
        onLoadStart={handleVideoLoadStart}
        onCanPlay={handleVideoCanPlay}
        onError={handleVideoError}
        onLoadedMetadata={handleVideoLoadedMetadata}
        onTimeUpdate={handleVideoTimeUpdate}
        onEnded={handleVideoEnded}
        crossOrigin="anonymous"
      >
        <source src={secureUrl} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="text-white">Loading video...</div>
        </div>
      )}

      {/* Controls overlay */}
      <div className={`absolute inset-0 flex flex-col justify-between bg-gradient-to-t from-black/70 to-transparent p-4 transition-opacity duration-300 ${showControls || !playing ? 'opacity-100' : 'opacity-0'}`}>
        <div></div>
        <div>
          {/* Progress bar */}
          <div className="flex items-center gap-2">
            <span className="text-white text-xs font-semibold">{formatTime(played * videoDuration)}</span>
            <input 
              type="range" 
              min={0} 
              max={0.999999} 
              step="any" 
              value={played} 
              onMouseDown={handleSeekMouseDown} 
              onChange={handleSeekChange} 
              onMouseUp={handleSeekMouseUp} 
              className="flex-1 cursor-pointer bg-gray-600 rounded-lg appearance-none h-1 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:cursor-pointer"
            />
            <span className="text-white text-xs font-semibold">{formatTime(videoDuration)}</span>
          </div>
          
          {/* Control buttons */}
          <div className="flex justify-between items-center mt-2">
            <div className="flex items-center gap-2">
              <button onClick={handleRewind} className="p-2 rounded-full hover:bg-white/20 text-white transition-colors">
                <Rewind size={20} />
              </button>
              <button onClick={handlePlayPause} className="p-2 rounded-full hover:bg-white/20 text-white transition-colors">
                {playing ? <Pause size={32} /> : <Play size={32} />}
              </button>
              <button onClick={handleFastForward} className="p-2 rounded-full hover:bg-white/20 text-white transition-colors">
                <FastForward size={20} />
              </button>
              
              {/* Volume control */}
              <div className="flex items-center group">
                <button onClick={handleToggleMute} className="p-2 rounded-full hover:bg-white/20 text-white transition-colors">
                  {muted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
                </button>
                <input 
                  type="range" 
                  min="0" 
                  max="1" 
                  step="any" 
                  value={volume} 
                  onChange={handleVolumeChange} 
                  className="w-20 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity bg-gray-600 rounded-lg appearance-none h-1 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:cursor-pointer"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {/* Settings menu */}
              <div className="relative">
                <button onClick={() => setShowSettings(prev => !prev)} className="p-2 rounded-full hover:bg-white/20 text-white transition-colors">
                  <Settings size={20} />
                </button>
                {showSettings && (
                  <div className="absolute bottom-full right-0 mb-2 bg-black/80 backdrop-blur-md rounded-lg p-2 min-w-[120px]">
                    <h4 className="text-white text-sm font-bold px-2 py-1">Speed</h4>
                    {playbackRates.map((rate) => (
                      <button 
                        key={rate} 
                        onClick={() => handlePlaybackRateChange(rate)} 
                        className={`flex justify-between items-center w-full text-left text-sm px-2 py-1 rounded transition-colors ${playbackRate === rate ? 'bg-blue-600 text-white' : 'text-white hover:bg-white/20'}`}
                      >
                        <span>{rate === 1 ? 'Normal' : `${rate}x`}</span>
                        {playbackRate === rate && <Check size={16} />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Fullscreen toggle */}
              <button onClick={handleToggleFullScreen} className="p-2 rounded-full hover:bg-white/20 text-white transition-colors">
                {isFullScreen ? <Minimize size={20} /> : <Maximize size={20} />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Editorial;
