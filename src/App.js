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

  const toggleStreaming = () => {
    if (!streamKey) {
      alert('Please enter your X.com stream key first!');
      return;
    }
    setIsStreaming(!isStreaming);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }

        body {
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
        }

        .app-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
        }

        .app-header {
          background: white;
          border-bottom: 1px solid #e2e8f0;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }

        .header-content {
          max-width: 1280px;
          margin: 0 auto;
          padding: 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 16px;
        }

        .logo-section {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .logo-icon {
          width: 56px;
          height: 56px;
          background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 6px rgba(59, 130, 246, 0.3);
        }

        .app-title {
          font-size: 28px;
          font-weight: 700;
          color: #1e293b;
        }

        .app-subtitle {
          font-size: 14px;
          color: #64748b;
          margin-top: 4px;
        }

        .live-indicator {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 20px;
          background: #fef2f2;
          border: 2px solid #fecaca;
          border-radius: 12px;
        }

        .live-dot {
          width: 12px;
          height: 12px;
          background: #ef4444;
          border-radius: 50%;
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .live-text {
          color: #dc2626;
          font-size: 16px;
          font-weight: 700;
        }

        .main-content {
          max-width: 1280px;
          margin: 0 auto;
          padding: 32px 24px;
        }

        .content-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 24px;
        }

        @media (min-width: 1024px) {
          .content-grid {
            grid-template-columns: 2fr 1fr;
          }
        }

        .card {
          background: white;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
          border: 1px solid #e2e8f0;
        }

        .card-header {
          border-bottom: 1px solid #e2e8f0;
          padding: 20px 24px;
          background: #f8fafc;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
        }

        .card-title {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 16px;
          font-weight: 600;
          color: #334155;
        }

        .video-specs {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          color: #64748b;
        }

        .card-body {
          padding: 24px;
        }

        .video-container {
          position: relative;
          aspect-ratio: 16/9;
          background: #1e293b;
        }

        .no-signal {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 16px;
        }

        .spinner {
          width: 64px;
          height: 64px;
          border: 4px solid #cbd5e1;
          border-top-color: #3b82f6;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .no-signal-text {
          color: #94a3b8;
          font-size: 16px;
        }

        .video-canvas {
          width: 100%;
          height: 100%;
          object-fit: contain;
          cursor: move;
        }

        .logo-border {
          position: absolute;
          pointer-events: none;
          border: 2px solid #60a5fa;
          border-radius: 4px;
          transition: opacity 0.2s;
        }

        .logo-hint {
          position: absolute;
          top: -40px;
          left: 0;
          font-size: 14px;
          color: #3b82f6;
          background: white;
          padding: 8px 12px;
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
          border: 1px solid #bfdbfe;
          display: flex;
          align-items: center;
          gap: 4px;
          white-space: nowrap;
        }

        .button-container {
          margin-top: 24px;
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
        }

        .btn {
          padding: 24px 32px;
          font-size: 18px;
          font-weight: 600;
          border-radius: 12px;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          transition: all 0.2s;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }

        .btn:hover {
          box-shadow: 0 6px 8px rgba(0,0,0,0.15);
          transform: translateY(-1px);
        }

        .btn-large {
          flex: 1;
          min-width: 200px;
        }

        .btn-medium {
          flex: 0 0 auto;
          min-width: 120px;
        }

        .btn-primary {
          background: #3b82f6;
          color: white;
        }

        .btn-primary:hover {
          background: #2563eb;
        }

        .btn-danger {
          background: #ef4444;
          color: white;
        }

        .btn-danger:hover {
          background: #dc2626;
        }

        .btn-secondary {
          background: #cbd5e1;
          color: #475569;
        }

        .btn-secondary:hover {
          background: #94a3b8;
        }

        .side-panel {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .section-title {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 20px;
          font-size: 18px;
          font-weight: 600;
          color: #334155;
        }

        .section-title h3 {
          margin: 0;
          font-size: 18px;
        }

        .control-group {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .upload-label {
          display: block;
          cursor: pointer;
        }

        .upload-area {
          width: 100%;
          border: 2px dashed #cbd5e1;
          border-radius: 12px;
          padding: 32px;
          text-align: center;
          background: #f8fafc;
          transition: all 0.2s;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }

        .upload-area:hover {
          border-color: #60a5fa;
          background: #eff6ff;
        }

        .upload-text {
          font-size: 14px;
          color: #475569;
          font-weight: 500;
        }

        .slider-group {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .slider-label {
          font-size: 14px;
          color: #475569;
          font-weight: 500;
        }

        .slider {
          width: 100%;
          height: 12px;
          background: #e2e8f0;
          border-radius: 6px;
          outline: none;
          cursor: pointer;
          -webkit-appearance: none;
        }

        .slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 24px;
          height: 24px;
          background: #3b82f6;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }

        .slider::-moz-range-thumb {
          width: 24px;
          height: 24px;
          background: #3b82f6;
          border-radius: 50%;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }

        .tip-box {
          padding: 16px;
          background: #eff6ff;
          border: 1px solid #bfdbfe;
          border-radius: 12px;
          font-size: 14px;
          color: #475569;
        }

        .tip-box strong {
          color: #3b82f6;
          font-weight: 600;
        }

        .input-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .input-label {
          font-size: 14px;
          color: #475569;
          font-weight: 500;
        }

        .text-input {
          width: 100%;
          background: #f8fafc;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          padding: 12px 16px;
          font-size: 14px;
          color: #1e293b;
          transition: all 0.2s;
        }

        .text-input:focus {
          outline: none;
          border-color: #60a5fa;
          background: white;
        }

        .text-input::placeholder {
          color: #94a3b8;
        }

        .info-box {
          padding: 16px;
          background: #eff6ff;
          border: 1px solid #bfdbfe;
          border-radius: 12px;
          font-size: 14px;
          color: #475569;
        }

        .info-title {
          color: #2563eb;
          font-weight: 600;
          margin-bottom: 8px;
        }

        .info-list {
          margin: 8px 0 8px 20px;
          padding: 0;
        }

        .info-list li {
          margin: 4px 0;
        }

        .info-link {
          display: inline-block;
          margin-top: 8px;
          color: #3b82f6;
          text-decoration: underline;
          font-weight: 500;
        }

        .info-link:hover {
          color: #2563eb;
        }

        .status-title {
          font-size: 18px;
          font-weight: 600;
          color: #334155;
          margin-bottom: 16px;
        }

        .status-group {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .status-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 14px;
        }

        .status-label {
          color: #64748b;
        }

        .status-value {
          color: #475569;
          font-weight: 500;
        }

        .status-active {
          color: #3b82f6;
          font-weight: 600;
        }

        @media (max-width: 768px) {
          .app-title {
            font-size: 24px;
          }
          
          .btn {
            padding: 20px 24px;
            font-size: 16px;
          }
          
          .section-title {
            font-size: 16px;
          }
        }
      `}</style>
      
      <div className="app-container">
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
            <div className="preview-section">
              <div className="card">
                <div className="card-header">
                  <div className="card-title">
                    <Video size={20} color="#3b82f6" />
                    <span>Live Preview</span>
                  </div>
                  <div className="video-specs">
                    <span>1920Ã—1080</span>
                    <span>â€¢</span>
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

            <div className="side-panel">
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
                          {logo ? 'âœ“ Logo Loaded' : 'Click to Upload Logo'}
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
                        Open X Media Studio â†’
                      </a>
                    </div>
                  </div>
                </div>
              </div>

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
    </>
  );
}
