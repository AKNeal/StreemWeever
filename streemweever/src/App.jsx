import React, { useState, useRef, useEffect } from 'react';
import { Camera, Globe, Type, Image, Play, Pause, X, Plus, Settings } from 'lucide-react';

export default function PodcastStudio() {
  const [videos, setVideos] = useState([]);
  const [websites, setWebsites] = useState([]);
  const [logo, setLogo] = useState(null);
  const [textOverlays, setTextOverlays] = useState([]);
  const [showAddVideo, setShowAddVideo] = useState(false);
  const [showAddWebsite, setShowAddWebsite] = useState(false);
  const [showAddText, setShowAddText] = useState(false);
  const [newWebsiteUrl, setNewWebsiteUrl] = useState('');
  const [newText, setNewText] = useState({
    content: '',
    scrollDirection: 'none',
    speed: 5,
    fontSize: 24,
    color: '#ffffff',
    backgroundColor: 'rgba(0,0,0,0.7)'
  });

  const videoInputRef = useRef(null);
  const logoInputRef = useRef(null);

  const handleVideoUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      const url = URL.createObjectURL(file);
      setVideos(prev => [...prev, {
        id: Date.now() + Math.random(),
        url,
        name: file.name,
        playing: false,
        position: { x: 50, y: 50 },
        size: { width: 320, height: 180 }
      }]);
    });
    e.target.value = '';
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setLogo({
        url,
        position: { x: 20, y: 20 },
        size: { width: 100, height: 100 }
      });
    }
    e.target.value = '';
  };

  const addWebsite = () => {
    if (newWebsiteUrl) {
      setWebsites(prev => [...prev, {
        id: Date.now(),
        url: newWebsiteUrl,
        position: { x: 100, y: 100 },
        size: { width: 640, height: 480 }
      }]);
      setNewWebsiteUrl('');
      setShowAddWebsite(false);
    }
  };

  const addTextOverlay = () => {
    if (newText.content) {
      setTextOverlays(prev => [...prev, {
        id: Date.now(),
        ...newText,
        position: { x: 50, y: window.innerHeight - 150 }
      }]);
      setNewText({
        content: '',
        scrollDirection: 'none',
        speed: 5,
        fontSize: 24,
        color: '#ffffff',
        backgroundColor: 'rgba(0,0,0,0.7)'
      });
      setShowAddText(false);
    }
  };

  const toggleVideoPlay = (id) => {
    setVideos(prev => prev.map(v => 
      v.id === id ? { ...v, playing: !v.playing } : v
    ));
  };

  const removeVideo = (id) => {
    setVideos(prev => prev.filter(v => v.id !== id));
  };

  const removeWebsite = (id) => {
    setWebsites(prev => prev.filter(w => w.id !== id));
  };

  const removeTextOverlay = (id) => {
    setTextOverlays(prev => prev.filter(t => t.id !== id));
  };

  const updatePosition = (type, id, newPos) => {
    if (type === 'video') {
      setVideos(prev => prev.map(v => 
        v.id === id ? { ...v, position: newPos } : v
      ));
    } else if (type === 'website') {
      setWebsites(prev => prev.map(w => 
        w.id === id ? { ...w, position: newPos } : w
      ));
    } else if (type === 'logo') {
      setLogo(prev => ({ ...prev, position: newPos }));
    } else if (type === 'text') {
      setTextOverlays(prev => prev.map(t => 
        t.id === id ? { ...t, position: newPos } : t
      ));
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Control Panel */}
      <div className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">Streem Weever</h1>
            <a 
              href="/mapper/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg transition"
            >
              <Settings size={20} />
              Screen Mapper
            </a>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => videoInputRef.current?.click()}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition"
            >
              <Camera size={20} />
              Add Video
            </button>
            
            <button
              onClick={() => setShowAddWebsite(true)}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition"
            >
              <Globe size={20} />
              Add Website
            </button>
            
            <button
              onClick={() => logoInputRef.current?.click()}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition"
            >
              <Image size={20} />
              {logo ? 'Change' : 'Add'} Logo
            </button>
            
            <button
              onClick={() => setShowAddText(true)}
              className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 rounded-lg transition"
            >
              <Type size={20} />
              Add Text
            </button>
          </div>

          <input
            ref={videoInputRef}
            type="file"
            accept="video/*"
            multiple
            onChange={handleVideoUpload}
            className="hidden"
          />
          
          <input
            ref={logoInputRef}
            type="file"
            accept="image/*"
            onChange={handleLogoUpload}
            className="hidden"
          />
        </div>
      </div>

      {/* Canvas Area */}
      <div className="relative w-full h-[calc(100vh-120px)] bg-black overflow-hidden">
        
        {/* NealMedia Logo - Fixed Bottom Left */}
        <a 
          href="https://www.nealmedia.app" 
          target="_blank" 
          rel="noopener noreferrer"
          className="fixed bottom-6 left-6 z-50 transition-transform hover:scale-110"
          style={{
            background: 'white',
            borderRadius: '12px',
            padding: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
          }}
        >
          <img 
            src="/nealmedia-logo.png" 
            alt="NealMedia"
            className="w-20 h-20 object-contain"
            onError={(e) => {
              console.error('Logo failed to load');
              e.target.style.display = 'none';
            }}
          />
        </a>
        {/* Videos */}
        {videos.map(video => (
          <DraggableElement
            key={video.id}
            position={video.position}
            onPositionChange={(pos) => updatePosition('video', video.id, pos)}
          >
            <div className="relative bg-gray-800 rounded-lg overflow-hidden shadow-2xl">
              <video
                src={video.url}
                style={{ width: video.size.width, height: video.size.height }}
                autoPlay={video.playing}
                loop
                muted
                className="object-cover"
              />
              <div className="absolute top-2 right-2 flex gap-2">
                <button
                  onClick={() => toggleVideoPlay(video.id)}
                  className="p-2 bg-black/50 hover:bg-black/70 rounded-full transition"
                >
                  {video.playing ? <Pause size={16} /> : <Play size={16} />}
                </button>
                <button
                  onClick={() => removeVideo(video.id)}
                  className="p-2 bg-red-500/50 hover:bg-red-500/70 rounded-full transition"
                >
                  <X size={16} />
                </button>
              </div>
              <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/50 rounded text-xs">
                {video.name}
              </div>
            </div>
          </DraggableElement>
        ))}

        {/* Websites */}
        {websites.map(website => (
          <DraggableElement
            key={website.id}
            position={website.position}
            onPositionChange={(pos) => updatePosition('website', website.id, pos)}
          >
            <div className="relative bg-white rounded-lg overflow-hidden shadow-2xl">
              <iframe
                src={website.url}
                style={{ width: website.size.width, height: website.size.height }}
                className="border-0"
                sandbox="allow-scripts allow-same-origin"
              />
              <div className="absolute top-2 right-2">
                <button
                  onClick={() => removeWebsite(website.id)}
                  className="p-2 bg-red-500 hover:bg-red-600 rounded-full transition"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          </DraggableElement>
        ))}

        {/* Logo */}
        {logo && (
          <DraggableElement
            position={logo.position}
            onPositionChange={(pos) => updatePosition('logo', null, pos)}
          >
            <div className="relative">
              <img
                src={logo.url}
                style={{ width: logo.size.width, height: logo.size.height }}
                className="object-contain"
                alt="Logo"
              />
              <button
                onClick={() => setLogo(null)}
                className="absolute -top-2 -right-2 p-1 bg-red-500 hover:bg-red-600 rounded-full transition"
              >
                <X size={14} />
              </button>
            </div>
          </DraggableElement>
        )}

        {/* Text Overlays */}
        {textOverlays.map(text => (
          <DraggableElement
            key={text.id}
            position={text.position}
            onPositionChange={(pos) => updatePosition('text', text.id, pos)}
          >
            <ScrollingText text={text} onRemove={() => removeTextOverlay(text.id)} />
          </DraggableElement>
        ))}
      </div>

      {/* Add Website Modal */}
      {showAddWebsite && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg max-w-md w-full mx-4">
            <h2 className="text-xl font-bold mb-4">Add Website</h2>
            <input
              type="url"
              value={newWebsiteUrl}
              onChange={(e) => setNewWebsiteUrl(e.target.value)}
              placeholder="https://example.com"
              className="w-full px-4 py-2 bg-gray-700 rounded-lg mb-4 outline-none focus:ring-2 focus:ring-green-500"
            />
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowAddWebsite(false)}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                onClick={addWebsite}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Text Modal */}
      {showAddText && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-gray-800 p-6 rounded-lg max-w-md w-full mx-4 my-8">
            <h2 className="text-xl font-bold mb-4">Add Text Overlay</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Text Content</label>
                <textarea
                  value={newText.content}
                  onChange={(e) => setNewText({...newText, content: e.target.value})}
                  placeholder="Enter your text..."
                  className="w-full px-4 py-2 bg-gray-700 rounded-lg outline-none focus:ring-2 focus:ring-orange-500 h-24 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Scroll Direction</label>
                <select
                  value={newText.scrollDirection}
                  onChange={(e) => setNewText({...newText, scrollDirection: e.target.value})}
                  className="w-full px-4 py-2 bg-gray-700 rounded-lg outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="none">No Scroll</option>
                  <option value="horizontal">Horizontal</option>
                  <option value="vertical">Vertical</option>
                </select>
              </div>

              {newText.scrollDirection !== 'none' && (
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Scroll Speed: {newText.speed}
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={newText.speed}
                    onChange={(e) => setNewText({...newText, speed: parseInt(e.target.value)})}
                    className="w-full"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-2">
                  Font Size: {newText.fontSize}px
                </label>
                <input
                  type="range"
                  min="12"
                  max="72"
                  value={newText.fontSize}
                  onChange={(e) => setNewText({...newText, fontSize: parseInt(e.target.value)})}
                  className="w-full"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Text Color</label>
                  <input
                    type="color"
                    value={newText.color}
                    onChange={(e) => setNewText({...newText, color: e.target.value})}
                    className="w-full h-10 bg-gray-700 rounded-lg cursor-pointer"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Background</label>
                  <select
                    value={newText.backgroundColor}
                    onChange={(e) => setNewText({...newText, backgroundColor: e.target.value})}
                    className="w-full px-4 py-2 bg-gray-700 rounded-lg outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="transparent">Transparent</option>
                    <option value="rgba(0,0,0,0.7)">Dark</option>
                    <option value="rgba(0,0,0,0.9)">Darker</option>
                    <option value="rgba(255,255,255,0.7)">Light</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex gap-3 justify-end mt-6">
              <button
                onClick={() => setShowAddText(false)}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                onClick={addTextOverlay}
                className="px-4 py-2 bg-orange-600 hover:bg-orange-700 rounded-lg transition"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function DraggableElement({ children, position, onPositionChange }) {
  const [isDragging, setIsDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e) => {
    if (e.target.tagName === 'VIDEO' || e.target.tagName === 'IFRAME') return;
    setIsDragging(true);
    setOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDragging) {
        onPositionChange({
          x: e.clientX - offset.x,
          y: e.clientY - offset.y
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, offset, onPositionChange]);

  return (
    <div
      style={{
        position: 'absolute',
        left: position.x,
        top: position.y,
        cursor: isDragging ? 'grabbing' : 'grab'
      }}
      onMouseDown={handleMouseDown}
    >
      {children}
    </div>
  );
}

function ScrollingText({ text, onRemove }) {
  const containerRef = useRef(null);
  const contentRef = useRef(null);
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    if (text.scrollDirection === 'none') return;

    const interval = setInterval(() => {
      setScrollPosition(prev => {
        if (text.scrollDirection === 'horizontal') {
          const containerWidth = containerRef.current?.offsetWidth || 0;
          const contentWidth = contentRef.current?.offsetWidth || 0;
          return prev <= -(contentWidth + containerWidth) ? containerWidth : prev - text.speed;
        } else {
          const containerHeight = containerRef.current?.offsetHeight || 0;
          const contentHeight = contentRef.current?.offsetHeight || 0;
          return prev <= -(contentHeight + containerHeight) ? containerHeight : prev - text.speed;
        }
      });
    }, 50);

    return () => clearInterval(interval);
  }, [text.scrollDirection, text.speed]);

  const containerStyle = {
    backgroundColor: text.backgroundColor,
    padding: '12px 20px',
    borderRadius: '8px',
    maxWidth: text.scrollDirection === 'horizontal' ? '600px' : '400px',
    maxHeight: text.scrollDirection === 'vertical' ? '200px' : 'auto',
    overflow: 'hidden',
    position: 'relative'
  };

  const contentStyle = {
    color: text.color,
    fontSize: `${text.fontSize}px`,
    fontWeight: '600',
    whiteSpace: text.scrollDirection === 'horizontal' ? 'nowrap' : 'normal',
    transform: text.scrollDirection === 'horizontal' 
      ? `translateX(${scrollPosition}px)` 
      : `translateY(${scrollPosition}px)`,
    display: 'inline-block'
  };

  return (
    <div className="relative">
      <div ref={containerRef} style={containerStyle}>
        <div ref={contentRef} style={contentStyle}>
          {text.content}
        </div>
      </div>
      <button
        onClick={onRemove}
        className="absolute -top-2 -right-2 p-1 bg-red-500 hover:bg-red-600 rounded-full transition z-10"
      >
        <X size={14} />
      </button>
    </div>
  );
}
