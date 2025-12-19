import React, { useState, useRef } from 'react';
import { Video, Upload, Radio, Square, Play, Settings, Move } from 'lucide-react';
import './App.css';

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

      if (video.videoWidth && video.videoHeight) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

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
    <div className="app-container">
      {/* Header */}
      <header className="app-header">
        <div className="header-content">
          <div className="logo-section">
            <div className="logo-icon">
              <Radio size={28} color="white" />
            </div>
            <div>
              <h1 className="app-title">StreamWeever</h1>
              <p className="app-subtitle">Live Streaming Control</p>
            </div>
          </div>
          
          {isCapturing && (
            <div className="live-indicator">
              <div className="live-dot"></div>
              <span className="live-text">
                {isStreaming ? 'LIVE' : 'PREVIEW'}
              </span>
            </div>
          )}
        </div>
      </header>

      <div className="main-content">
        <div className="content-grid">
          {/* Main Preview */}
          <div className="preview-section">
            <div className="card">
              <div className="card-header">
                <div className="card-title">
                  <Video size={20} color="#3b82f6" />
                  <span>Live Preview</span>
                </div>
                <div className="video-specs">
                  <span>1920×1080</span>
                  <span>•</span>
                  <span>60 FPS</span>
                </div>
              </div>
              
              <div className="video-container">
                {!isCapturing ? (
                  <div className="no-signal">
                    <div className="spinner"></div>
                    <p className="no-signal-text">No Signal</p>
                  </div>
                ) : (
                  <>
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      style={{ display: 'none' }}
                    />
                    <canvas
                      ref={canvasRef}
                      className="video-canvas"
                      onMouseDown={handleLogoMouseDown}
                      onMouseMove={handleLogoMouseMove}
                      onMouseUp={handleLogoMouseUp}
                      onMouseLeave={handleLogoMouseUp}
                    />
                    {logo && (
                      <div 
                        className="logo-border"
                        style={{
                          left: `${logoPosition.x}px`,
                          top: `${logoPosition.y}px`,
                          width: `${logoSize}px`,
                          height: `${logoSize}px`,
                          opacity: isDragging ? 1 : 0
                        }}
                      >
                        <div className="logo-hint">
                          <Move size={16} />
                          Drag to position
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Control Bar */}
            <div className="button-container">
              {!isCapturing ? (
                <button onClick={startCapture} className="btn btn-primary btn-large">
                  <Play size={24} />
                  Start Capture
                </button>
              ) : (
                <>
                  <button
                    onClick={toggleStreaming}
                    className={`btn btn-large ${isStreaming ? 'btn-danger' : 'btn-primary'}`}
                  >
                    <Radio size={24} />
                    {isStreaming ? 'Stop Stream' : 'Go Live'}
                  </button>
                  <button onClick={stopCapture} className="btn btn-secondary btn-medium">
                    <Square size={24} />
                    Stop
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Controls Panel */}
          <div className="side-panel">
            {/* Logo Control */}
            <div className="card">
              <div className="card-body">
                <div className="section-title">
                  <Upload size={20} color="#3b82f6" />
                  <h3>Logo Overlay</h3>
                </div>
                
                <div className="control-group">
                  <label className="upload-label">
                    <div className="upload-area">
                      <Upload size={40} color="#94a3b8" />
                      <span className="upload-text">
                        {logo ? '✓ Logo Loaded' : 'Click to Upload Logo'}
                      </span>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      style={{ display: 'none' }}
                    />
                  </label>

                  {logo && (
                    <>
                      <div className="slider-group">
                        <label className="slider-label">
                          Logo Size: {logoSize}px
                        </label>
                        <input
                          type="range"
                          min="50"
                          max="300"
                          value={logoSize}
                          onChange={(e) => setLogoSize(Number(e.target.value))}
                          className="slider"
                        />
                      </div>

                      <div className="tip-box">
                        <strong>Tip:</strong> Drag logo directly on preview to position
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Stream Settings */}
            <div className="card">
              <div className="card-body">
                <div className="section-title">
                  <Settings size={20} color="#3b82f6" />
                  <h3>Stream Config</h3>
                </div>
                
                <div className="control-group">
                  <div className="input-group">
                    <label className="input-label">
                      X.com Stream Key
                    </label>
                    <input
                      type="password"
                      value={streamKey}
                      onChange={(e) => setStreamKey(e.target.value)}
                      placeholder="Enter your X stream key..."
                      className="text-input"
                    />
                  </div>

                  <div className="info-box">
                    <p className="info-title">How to Get Stream Key:</p>
                    <ol className="info-list">
                      <li>Go to X.com Media Studio</li>
                      <li>Navigate to "Producer" section</li>
                      <li>Copy your Stream Key</li>
                      <li>Paste it above</li>
                    </ol>
                    <a 
                      href="https://studio.twitter.com/" 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="info-link"
                    >
                      Open X Media Studio →
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* System Info */}
            <div className="card">
              <div className="card-body">
                <h3 className="status-title">System Status</h3>
                <div className="status-group">
                  <div className="status-row">
                    <span className="status-label">Status</span>
                    <span className={`status-value ${isCapturing ? 'status-active' : ''}`}>
                      {isCapturing ? 'Active' : 'Standby'}
                    </span>
                  </div>
                  <div className="status-row">
                    <span className="status-label">Capture</span>
                    <span className="status-value">
                      {isCapturing ? 'Screen' : 'None'}
                    </span>
                  </div>
                  <div className="status-row">
                    <span className="status-label">Overlay</span>
                    <span className="status-value">
                      {logo ? 'Loaded' : 'None'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
