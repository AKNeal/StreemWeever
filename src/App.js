import React, { useState, useRef } from 'react';
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
              <Radio className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-800">
                StreamWeever
              </h1>
              <p className="text-sm text-slate-500">Live Streaming Control</p>
            </div>
          </div>
          
          {isCapturing && (
            <div className="flex items-center gap-3 px-5 py-3 bg-red-50 border-2 border-red-200 rounded-xl">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-red-600 text-base font-bold">
                {isStreaming ? 'LIVE' : 'PREVIEW'}
              </span>
            </div>
          )}
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Preview */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl overflow-hidden shadow-lg border border-slate-200">
              <div className="border-b border-slate-200 px-6 py-4 bg-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Video className="w-5 h-5 text-blue-500" />
                  <span className="text-base font-semibold text-slate-700">
                    Live Preview
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <span>1920×1080</span>
                  <span>•</span>
                  <span>60 FPS</span>
                </div>
              </div>
              
              <div className="relative aspect-video bg-slate-900">
                {!isCapturing ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                    <div className="w-16 h-16 border-4 border-slate-300 border-t-blue-500 rounded-full animate-spin"></div>
                    <p className="text-slate-400 text-base">No Signal</p>
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
                        className="absolute pointer-events-none border-2 border-blue-400 transition-opacity rounded"
                        style={{
                          left: `${logoPosition.x}px`,
                          top: `${logoPosition.y}px`,
                          width: `${logoSize}px`,
                          height: `${logoSize}px`,
                          opacity: isDragging ? 1 : 0
                        }}
                      >
                        <div className="absolute -top-10 left-0 text-sm text-blue-500 bg-white px-3 py-1 rounded-lg shadow-lg border border-blue-200">
                          <Move className="w-4 h-4 inline mr-1" />
                          Drag to position
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Control Bar */}
            <div className="mt-6 flex gap-4">
              {!isCapturing ? (
                <button
                  onClick={startCapture}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-6 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-3 text-lg"
                >
                  <Play className="w-6 h-6" />
                  Start Capture
                </button>
              ) : (
                <>
                  <button
                    onClick={toggleStreaming}
                    className={`flex-1 font-semibold py-6 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-3 text-lg ${
                      isStreaming
                        ? 'bg-red-500 hover:bg-red-600 text-white'
                        : 'bg-blue-500 hover:bg-blue-600 text-white'
                    }`}
                  >
                    <Radio className="w-6 h-6" />
                    {isStreaming ? 'Stop Stream' : 'Go Live'}
                  </button>
                  <button
                    onClick={stopCapture}
                    className="px-8 bg-slate-300 hover:bg-slate-400 text-slate-700 font-semibold py-6 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-3 text-lg"
                  >
                    <Square className="w-6 h-6" />
                    Stop
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Controls Panel */}
          <div className="space-y-6">
            {/* Logo Control */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
              <div className="flex items-center gap-3 mb-5">
                <Upload className="w-5 h-5 text-blue-500" />
                <h3 className="text-lg font-semibold text-slate-700">Logo Overlay</h3>
              </div>
              
              <div className="space-y-5">
                <label className="block">
                  <div className="w-full border-2 border-dashed border-slate-300 hover:border-blue-400 rounded-xl p-8 transition-colors cursor-pointer text-center bg-slate-50">
                    <Upload className="w-10 h-10 mx-auto mb-3 text-slate-400" />
                    <span className="text-sm text-slate-600 font-medium">
                      {logo ? '✓ Logo Loaded' : 'Click to Upload Logo'}
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
                      <label className="block text-sm text-slate-600 mb-3 font-medium">
                        Logo Size: {logoSize}px
                      </label>
                      <input
                        type="range"
                        min="50"
                        max="300"
                        value={logoSize}
                        onChange={(e) => setLogoSize(Number(e.target.value))}
                        className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                        style={{
                          accentColor: '#3b82f6'
                        }}
                      />
                    </div>

                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl text-sm text-slate-600">
                      <strong className="text-blue-600">Tip:</strong> Drag logo directly on preview to position
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Stream Settings */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
              <div className="flex items-center gap-3 mb-5">
                <Settings className="w-5 h-5 text-blue-500" />
                <h3 className="text-lg font-semibold text-slate-700">Stream Config</h3>
              </div>
              
              <div className="space-y-5">
                <div>
                  <label className="block text-sm text-slate-600 mb-2 font-medium">
                    X.com Stream Key
                  </label>
                  <input
                    type="password"
                    value={streamKey}
                    onChange={(e) => setStreamKey(e.target.value)}
                    placeholder="Enter your X stream key..."
                    className="w-full bg-slate-50 border-2 border-slate-200 focus:border-blue-400 rounded-xl px-4 py-3 text-sm focus:outline-none transition-colors text-slate-700"
                  />
                </div>

                <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl text-sm text-slate-600 space-y-2">
                  <p className="text-blue-600 font-semibold">How to Get Stream Key:</p>
                  <ol className="list-decimal list-inside space-y-1 text-sm">
                    <li>Go to X.com Media Studio</li>
                    <li>Navigate to "Producer" section</li>
                    <li>Copy your Stream Key</li>
                    <li>Paste it above</li>
                  </ol>
                  <a 
                    href="https://studio.twitter.com/" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-2 text-blue-500 hover:text-blue-600 underline font-medium"
                  >
                    Open X Media Studio →
                  </a>
                </div>
              </div>
            </div>

            {/* System Info */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
              <h3 className="text-lg font-semibold text-slate-700 mb-4">System Status</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Status</span>
                  <span className={`font-semibold ${isCapturing ? 'text-blue-500' : 'text-slate-400'}`}>
                    {isCapturing ? 'Active' : 'Standby'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Capture</span>
                  <span className="text-slate-600">
                    {isCapturing ? 'Screen' : 'None'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Overlay</span>
                  <span className="text-slate-600">
                    {logo ? 'Loaded' : 'None'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        
        * {
          font-family: 'Inter', sans-serif;
        }

        input[type="range"]::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          background: #3b82f6;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        input[type="range"]::-moz-range-thumb {
          width: 20px;
          height: 20px;
          background: #3b82f6;
          border-radius: 50%;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
      `}</style>
    </div>
  );
}
