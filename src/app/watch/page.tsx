"use client";
import { Suspense, useState, useRef, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
  HiPlay,
  HiPause,
  HiVolumeUp,
  HiVolumeOff,
  HiDotsVertical,
  HiThumbUp,
  HiThumbDown,
  HiShare,
  HiDownload,
} from "react-icons/hi";
import { BiFullscreen, BiExitFullscreen } from "react-icons/bi";
import { MdSpeed, MdClosedCaption } from "react-icons/md";

// Component that uses useSearchParams
function VideoPlayer() {
  const videoPrefix =
    "https://storage.googleapis.com/codeyalaya-yt-processed-videos/";
  const searchParams = useSearchParams();
  const videoSrc = searchParams.get("v");

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<number | null>(null);

  // Mock video data - replace with actual data from your API
  const videoData = {
    title: "Amazing Video Tutorial - Learn React in 30 Minutes",
    channel: "CodeMaster",
    subscribers: "2.3M",
    views: "1,234,567",
    uploadDate: "2 days ago",
    likes: "12K",
    description:
      "In this comprehensive tutorial, we'll cover everything you need to know about React...",
  };

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const handlePlayPause = (): void => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = (): void => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = (): void => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>): void => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const newTime = percent * duration;

    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
    setIsMuted(newVolume === 0);
  };

  const toggleMute = (): void => {
    if (videoRef.current) {
      if (isMuted) {
        videoRef.current.volume = volume;
        setIsMuted(false);
      } else {
        videoRef.current.volume = 0;
        setIsMuted(true);
      }
    }
  };

  const toggleFullscreen = (): void => {
    if (!isFullscreen) {
      if (containerRef.current?.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  const handleMouseMove = (): void => {
    setShowControls(true);
    if (controlsTimeoutRef.current !== null) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = window.setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3000);
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    if (isDisliked) setIsDisliked(false);
  };

  const handleDislike = () => {
    setIsDisliked(!isDisliked);
    if (isLiked) setIsLiked(false);
  };

  // Auto-play video when component mounts and video is loaded
  useEffect(() => {
    const video = videoRef.current;
    if (video && videoSrc) {
      const handleCanPlay = () => {
        // Try to auto-play the video
        video.play().catch((error) => {
          console.log("Auto-play prevented by browser:", error);
          // Auto-play was prevented, user will need to click play
        });
      };

      video.addEventListener("canplay", handleCanPlay);
      return () => {
        video.removeEventListener("canplay", handleCanPlay);
      };
    }
  }, [videoSrc]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  if (!videoSrc) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center text-gray-800">
          <div className="text-6xl mb-4">📹</div>
          <h2 className="text-2xl font-bold mb-2">No Video Selected</h2>
          <p className="text-gray-600">Please select a video to watch</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Video Player Container */}
        <div
          ref={containerRef}
          className="relative bg-black group"
          onMouseMove={handleMouseMove}
          onMouseLeave={() => isPlaying && setShowControls(false)}
        >
          <video
            ref={videoRef}
            src={videoPrefix + videoSrc}
            className="w-full aspect-video"
            onClick={handlePlayPause}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          />

          {/* Play/Pause Overlay */}
          {!isPlaying && (
            <div
              className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 cursor-pointer"
              onClick={handlePlayPause}
            >
              <div className="bg-blue-600 rounded-full p-4 hover:bg-blue-700 transition-colors">
                <HiPlay size={48} className="text-white ml-1" />
              </div>
            </div>
          )}

          {/* Video Controls */}
          <div
            className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/50 to-transparent p-4 transition-opacity duration-300 ${
              showControls ? "opacity-100" : "opacity-0"
            }`}
          >
            {/* Progress Bar */}
            <div
              className="w-full h-1 bg-gray-600 rounded-full mb-4 cursor-pointer hover:h-2 transition-all"
              onClick={handleSeek}
            >
              <div
                className="h-full bg-blue-600 rounded-full relative"
                style={{ width: `${(currentTime / duration) * 100}%` }}
              >
                <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-blue-600 rounded-full opacity-0 hover:opacity-100 transition-opacity"></div>
              </div>
            </div>

            {/* Control Buttons */}
            <div className="flex items-center justify-between text-white">
              <div className="flex items-center space-x-4">
                <button
                  onClick={handlePlayPause}
                  className="hover:text-blue-400 transition-colors"
                >
                  {isPlaying ? <HiPause size={24} /> : <HiPlay size={24} />}
                </button>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={toggleMute}
                    className="hover:text-blue-400 transition-colors"
                  >
                    {isMuted ? (
                      <HiVolumeOff size={20} />
                    ) : (
                      <HiVolumeUp size={20} />
                    )}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    className="w-20 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>

                <span className="text-sm text-gray-300">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <button className="hover:text-blue-400 transition-colors p-2">
                  <MdClosedCaption size={20} />
                </button>
                <button className="hover:text-blue-400 transition-colors p-2">
                  <MdSpeed size={20} />
                </button>
                <button
                  onClick={toggleFullscreen}
                  className="hover:text-blue-400 transition-colors p-2"
                >
                  {isFullscreen ? (
                    <BiExitFullscreen size={20} />
                  ) : (
                    <BiFullscreen size={20} />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Video Info Section */}
        <div className="bg-white text-gray-900 p-6 border-b border-gray-200">
          <div className="flex flex-col lg:flex-row lg:space-x-8">
            {/* Main Content */}
            <div className="flex-1">
              <h1 className="text-2xl font-bold mb-4 text-gray-900">
                {videoData.title}
              </h1>

              {/* Video Stats and Actions */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 space-y-4 md:space-y-0">
                <div className="flex items-center space-x-4 text-gray-600">
                  <span>{videoData.views} views</span>
                  <span>•</span>
                  <span>{videoData.uploadDate}</span>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleLike}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-colors ${
                      isLiked
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                    }`}
                  >
                    <HiThumbUp size={20} />
                    <span>{videoData.likes}</span>
                  </button>

                  <button
                    onClick={handleDislike}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-colors ${
                      isDisliked
                        ? "bg-red-600 text-white"
                        : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                    }`}
                  >
                    <HiThumbDown size={20} />
                  </button>

                  <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors text-gray-700">
                    <HiShare size={20} />
                    <span>Share</span>
                  </button>

                  <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors text-gray-700">
                    <HiDownload size={20} />
                    <span>Download</span>
                  </button>

                  <button className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors text-gray-700">
                    <HiDotsVertical size={20} />
                  </button>
                </div>
              </div>

              {/* Channel Info */}
              <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                  {videoData.channel[0]}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-gray-900">
                    {videoData.channel}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {videoData.subscribers} subscribers
                  </p>
                  <p className="text-gray-700 mt-2 text-sm leading-relaxed">
                    {videoData.description}
                  </p>
                  <button className="text-gray-600 text-sm mt-2 hover:text-gray-900 transition-colors">
                    Show more
                  </button>
                </div>
                <button className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-full font-medium transition-colors text-white">
                  Subscribe
                </button>
              </div>
            </div>

            {/* Sidebar - Suggested Videos */}
            <div className="lg:w-96 mt-8 lg:mt-0">
              <h3 className="text-lg font-semibold mb-4 text-gray-900">
                Up next
              </h3>
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="flex space-x-3 hover:bg-gray-50 p-2 rounded-lg cursor-pointer transition-colors border border-gray-100"
                  >
                    <div className="w-40 h-24 bg-gray-200 rounded-lg flex-shrink-0"></div>
                    <div className="flex-1">
                      <h4 className="text-sm font-medium line-clamp-2 mb-1 text-gray-900">
                        Related Video Title {i}
                      </h4>
                      <p className="text-gray-600 text-xs">Channel Name</p>
                      <p className="text-gray-600 text-xs">
                        500K views • 1 day ago
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #2563eb;
          cursor: pointer;
        }

        .slider::-moz-range-thumb {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #2563eb;
          cursor: pointer;
          border: none;
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}

// Loading component for Suspense fallback
function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center text-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-lg">Loading video player...</p>
      </div>
    </div>
  );
}

// Main page component with Suspense boundary
export default function Watch() {
  return (
    <Suspense fallback={<Loading />}>
      <VideoPlayer />
    </Suspense>
  );
}
