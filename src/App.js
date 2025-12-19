import React, { useState, useRef, useEffect } from 'react';
import { Video, Upload, Radio, Square, Play, Settings, Move } from 'lucide-react';

export default function StreamWeever() {
  const [isCapturing, setIsCapturing] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [logo, setLogo] = useState(null);
  const [logoPosition, setLogoPosition] = useState({ x: 20, y: 20 });
  const [logoSize, setLogoSize] = useState(120);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [streamKey, setStreamKey] = useState('');
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const screenStreamRef = useRef(null);
  const animationFrameRef = useRef(null);

  // Start screen capture
  const startCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: { 
          mediaSource: 'screen',
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        },
        audio: true
      });
      
      screenStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsCapturing(true);
      startCompositing();

      // Handle user stopping share via browser UI
      stream.getVideoTracks()[0].onended = () => {
        stopCapture();
      };
    } catch (err) {
      console.error('Error capturing screen:', err);
      alert('Failed to capture screen. Please grant permission.');
    }
  };

  // Stop screen capture
  const stopCapture = () => {
    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach(track => track.stop());
      screenStreamRef.current = null;
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    setIsCapturing(false);
    setIsStreaming(false);
  };

  // Composite video with logo overlay
  const startCompositing = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    const ctx = canvas.getContext('2d');

    const composite = () => {
      if (!video || !canvas || !ctx) return;

      // Match canvas to video dimensions
      if (video.videoWidth && video.videoHeight) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // Draw video frame
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Draw logo if exists
        if (logo) {
          const scale = canvas.width / videoRef.current.offsetWidth;
          const scaledX = logoPosition.x * scale;
          const scaledY = logoPosition.y * scale;
          const scaledSize = logoSize * scale;
          
          ctx.drawImage(logo, scaledX, scaledY, scaledSize, scaledSize);
        }
      }

      animationFrameRef.current = requestAnimationFrame(composite);
    };

    composite();
  };

  // Handle logo upload
  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => setLogo(img);
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  // Logo dragging handlers
  const handleLogoMouseDown = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Check if click is on logo
    if (
      x >= logoPosition.x &&
      x <= logoPosition.x + logoSize &&
      y >= logoPosition.y &&
      y <= logoPosition.y + logoSize
    ) {
      setIsDragging(true);
      setDragOffset({
        x: x - logoPosition.x,
        y: y - logoPosition.y
      });
    }
  };

  const handleLogoMouseMove = (e) => {
    if (!isDragging) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - dragOffset.x;
    const y = e.clientY - rect.top - dragOffset.y;
    
    // Constrain to canvas bounds
    const maxX = rect.width - logoSize;
    const maxY = rect.height - logoSize;
    
    setLogoPosition({
      x: Math.max(0, Math.min(x, maxX)),
      y: Math.max(0, Math.min(y, maxY))
    });
  };

  const handleLogoMouseUp = () => {
    setIsDragging(false);
  };

  // Start streaming (setup)
  const toggleStreaming = () => {
    if (!streamKey) {
      alert('Please enter your X.com stream key first!');
      return;
    }
    setIsStreaming(!isStreaming);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-mono">
      {/* Animated background */}
      <div className="fixed inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 2px, #00ff88 2px, #00ff88 4px),
                           repeating-linear-gradient(90deg, transparent, transparent 2px, #00ff88 2px, #00ff88 4px)`,
          backgroundSize: '50px 50px',
          animation: 'scan 20s linear infinite'
        }}></div>
      </div>

      {/* Header */}
      <header className="relative border-b border-[#00ff88]/20 bg-black/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#00ff88] to-[#00aa88] rounded-lg flex items-center justify-center">
              <Radio className="w-6 h-6 text-black" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                STREEM<span className="text-[#00ff88]">WEEVER</span>
              </h1>
              <p className="text-xs text-gray-500 tracking-wider">BROADCAST CONTROL</p>
            </div>
          </div>
          
          {isCapturing && (
            <div className="flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/30 rounded">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-red-400 text-sm font-bold tracking-wider">
                {isStreaming ? 'LIVE' : 'PREVIEW'}
              </span>
            </div>
          )}
        </div>
      </header>

      <div className="relative max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Preview */}
          <div className="lg:col-span-2">
            <div className="bg-black/50 backdrop-blur border border-[#00ff88]/20 rounded-lg overflow-hidden">
              <div className="border-b border-[#00ff88]/20 px-4 py-3 flex items-center justify-between bg-black/30">
                <div className="flex items-center gap-2">
                  <Video className="w-4 h-4 text-[#00ff88]" />
                  <span className="text-sm font-bold tracking-wider text-[#00ff88]">
                    LIVE PREVIEW
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <span>1920Ã—1080</span>
                  <span>â€¢</span>
                  <span>60 FPS</span>
                </div>
              </div>
              
              <div className="relative aspect-video bg-black">
                {!isCapturing ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                    <div className="w-20 h-20 border-4 border-[#00ff88]/20 border-t-[#00ff88] rounded-full animate-spin"></div>
                    <p className="text-gray-500 text-sm tracking-wider">NO SIGNAL</p>
                  </div>
                ) : (
                  <>
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="hidden"
                    />
                    <canvas
                      ref={canvasRef}
                      className="w-full h-full object-contain cursor-move"
                      onMouseDown={handleLogoMouseDown}
                      onMouseMove={handleLogoMouseMove}
                      onMouseUp={handleLogoMouseUp}
                      onMouseLeave={handleLogoMouseUp}
                    />
                    {logo && (
                      <div 
                        className="absolute pointer-events-none border-2 border-[#00ff88]/50 transition-opacity"
                        style={{
                          left: `${logoPosition.x}px`,
                          top: `${logoPosition.y}px`,
                          width: `${logoSize}px`,
                          height: `${logoSize}px`,
                          opacity: isDragging ? 1 : 0
                        }}
                      >
                        <div className="absolute -top-6 left-0 text-xs text-[#00ff88] bg-black px-2 py-1 rounded">
                          <Move className="w-3 h-3 inline mr-1" />
                          DRAG TO POSITION
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Control Bar */}
            <div className="mt-4 flex gap-3">
              {!isCapturing ? (
                <button
                  onClick={startCapture}
                  className="flex-1 bg-gradient-to-r from-[#00ff88] to-[#00aa88] text-black font-bold py-4 rounded-lg hover:shadow-lg hover:shadow-[#00ff88]/50 transition-all flex items-center justify-center gap-2 tracking-wider"
                >
                  <Play className="w-5 h-5" />
                  START CAPTURE
                </button>
              ) : (
                <>
                  <button
                    onClick={toggleStreaming}
                    className={`flex-1 font-bold py-4 rounded-lg transition-all flex items-center justify-center gap-2 tracking-wider ${
                      isStreaming
                        ? 'bg-red-500 hover:bg-red-600 text-white'
                        : 'bg-blue-500 hover:bg-blue-600 text-white'
                    }`}
                  >
                    <Radio className="w-5 h-5" />
                    {isStreaming ? 'STOP STREAM' : 'GO LIVE'}
                  </button>
                  <button
                    onClick={stopCapture}
                    className="px-6 bg-gray-800 hover:bg-gray-700 font-bold py-4 rounded-lg transition-all flex items-center justify-center gap-2 tracking-wider"
                  >
                    <Square className="w-5 h-5" />
                    STOP
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Controls Panel */}
          <div className="space-y-4">
            {/* Logo Control */}
            <div className="bg-black/50 backdrop-blur border border-[#00ff88]/20 rounded-lg p-5">
              <div className="flex items-center gap-2 mb-4">
                <Upload className="w-4 h-4 text-[#00ff88]" />
                <h3 className="text-sm font-bold tracking-wider text-[#00ff88]">LOGO OVERLAY</h3>
              </div>
              
              <div className="space-y-4">
                <label className="block">
                  <div className="w-full border-2 border-dashed border-[#00ff88]/30 rounded-lg p-6 hover:border-[#00ff88]/60 transition-colors cursor-pointer text-center">
                    <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <span className="text-xs text-gray-400 tracking-wider">
                      {logo ? 'LOGO LOADED' : 'CLICK TO UPLOAD LOGO'}
                    </span>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                </label>

                {logo && (
                  <>
                    <div>
                      <label className="block text-xs text-gray-400 mb-2 tracking-wider">
                        LOGO SIZE: {logoSize}px
                      </label>
                      <input
                        type="range"
                        min="50"
                        max="300"
                        value={logoSize}
                        onChange={(e) => setLogoSize(Number(e.target.value))}
                        className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-[#00ff88]"
                      />
                    </div>

                    <div className="p-3 bg-[#00ff88]/5 border border-[#00ff88]/20 rounded text-xs text-gray-400 tracking-wider">
                      <strong className="text-[#00ff88]">TIP:</strong> Drag logo directly on preview to position
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Stream Settings */}
            <div className="bg-black/50 backdrop-blur border border-[#00ff88]/20 rounded-lg p-5">
              <div className="flex items-center gap-2 mb-4">
                <Settings className="w-4 h-4 text-[#00ff88]" />
                <h3 className="text-sm font-bold tracking-wider text-[#00ff88]">STREAM CONFIG</h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-2 tracking-wider">
                    X.COM STREAM KEY
                  </label>
                  <input
                    type="password"
                    value={streamKey}
                    onChange={(e) => setStreamKey(e.target.value)}
                    placeholder="Enter your X stream key..."
                    className="w-full bg-black/50 border border-[#00ff88]/30 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#00ff88] transition-colors"
                  />
                </div>

                <div className="p-3 bg-blue-500/5 border border-blue-500/20 rounded text-xs text-gray-400 space-y-2">
                  <p className="text-blue-400 font-bold tracking-wider">HOW TO GET STREAM KEY:</p>
                  <ol className="list-decimal list-inside space-y-1 text-xs">
                    <li>Go to X.com Media Studio</li>
                    <li>Navigate to "Producer" section</li>
                    <li>Copy your Stream Key</li>
                    <li>Paste it above</li>
                  </ol>
                  <a 
                    href="https://studio.twitter.com/" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-2 text-blue-400 hover:text-blue-300 underline"
                  >
                    Open X Media Studio â†’
                  </a>
                </div>
              </div>
            </div>

            {/* System Info */}
            <div className="bg-black/50 backdrop-blur border border-[#00ff88]/20 rounded-lg p-5">
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-500">STATUS</span>
                  <span className={isCapturing ? 'text-[#00ff88]' : 'text-gray-400'}>
                    {isCapturing ? 'ACTIVE' : 'STANDBY'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">CAPTURE</span>
                  <span className="text-gray-400">
                    {isCapturing ? 'SCREEN' : 'NONE'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">OVERLAY</span>
                  <span className="text-gray-400">
                    {logo ? 'LOADED' : 'NONE'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&display=swap');
        
        * {
          font-family: 'JetBrains Mono', monospace;
        }
        
        @keyframes scan {
          0% { transform: translateY(0); }
          100% { transform: translateY(50px); }
        }

        input[type="range"]::-webkit-slider-thumb {
          appearance: none;
          width: 16px;
          height: 16px;
          background: #00ff88;
          border-radius: 50%;
          cursor: pointer;
        }

        input[type="range"]::-moz-range-thumb {
          width: 16px;
          height: 16px;
          background: #00ff88;
          border-radius: 50%;
          cursor: pointer;
          border: none;
        }
      `}</style>
    </div>
  );
}
