import { useState, useRef, useCallback, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Monitor, 
  Image, 
  Settings, 
  Play, 
  Square, 
  Upload, 
  Eye,
  EyeOff,
  ExternalLink,
  Signal,
  SignalZero,
  Tv,
  Activity,
  Clock,
  Gauge
} from "lucide-react";
import type { 
  CaptureStatus, 
  OverlayPosition, 
  StreamConfig, 
  OverlayConfig, 
  SystemStatus 
} from "@shared/schema";

export default function Home() {
  const [captureStatus, setCaptureStatus] = useState<CaptureStatus>("standby");
  const [streamRef, setStreamRef] = useState<MediaStream | null>(null);
  const [showStreamKey, setShowStreamKey] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const [streamConfig, setStreamConfig] = useState<StreamConfig>({
    streamKey: "",
    resolution: "1920x1080",
    fps: 60,
  });
  
  const [overlayConfig, setOverlayConfig] = useState<OverlayConfig>({
    logoUrl: null,
    position: "top-right",
    opacity: 100,
  });
  
  const [systemStatus, setSystemStatus] = useState<SystemStatus>({
    status: "standby",
    capture: "None",
    overlay: "None",
    fps: 0,
    bitrate: 0,
    duration: 0,
  });

  const [duration, setDuration] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (captureStatus === "capturing") {
      interval = setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [captureStatus]);

  const formatDuration = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const startCapture = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          width: { ideal: 1920 },
          height: { ideal: 1080 },
          frameRate: { ideal: 60 },
        },
        audio: true,
      });
      
      setStreamRef(stream);
      setCaptureStatus("capturing");
      setDuration(0);
      
      setSystemStatus(prev => ({
        ...prev,
        status: "capturing",
        capture: "Screen",
        fps: 60,
        bitrate: 6000,
      }));
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }

      stream.getVideoTracks()[0].onended = () => {
        stopCapture();
      };
    } catch (err) {
      console.error("Error starting capture:", err);
    }
  }, []);

  const stopCapture = useCallback(() => {
    if (streamRef) {
      streamRef.getTracks().forEach(track => track.stop());
      setStreamRef(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCaptureStatus("standby");
    setSystemStatus(prev => ({
      ...prev,
      status: "standby",
      capture: "None",
      fps: 0,
      bitrate: 0,
    }));
  }, [streamRef]);

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (overlayConfig.logoUrl) {
        URL.revokeObjectURL(overlayConfig.logoUrl);
      }
      const url = URL.createObjectURL(file);
      setOverlayConfig(prev => ({ ...prev, logoUrl: url }));
      setSystemStatus(prev => ({ ...prev, overlay: file.name }));
    }
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const positionOptions: { value: OverlayPosition; label: string }[] = [
    { value: "top-left", label: "Top Left" },
    { value: "top-right", label: "Top Right" },
    { value: "bottom-left", label: "Bottom Left" },
    { value: "bottom-right", label: "Bottom Right" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="h-14 border-b border-border flex items-center justify-between px-6 gap-4">
        <div className="flex items-center gap-3">
          <Tv className="h-6 w-6 text-primary" />
          <h1 className="text-lg font-semibold" data-testid="text-app-title">StreemWeever</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            {captureStatus === "capturing" ? (
              <Badge variant="default" className="bg-red-500 text-white gap-1.5">
                <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
                Recording
              </Badge>
            ) : (
              <Badge variant="secondary" className="gap-1.5">
                <span className="h-2 w-2 rounded-full bg-muted-foreground" />
                Standby
              </Badge>
            )}
          </div>
        </div>
      </header>

      <div className="flex flex-1" style={{ height: "calc(100vh - 3.5rem - 4rem)" }}>
        <main className="flex-1 p-6 overflow-auto">
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between gap-4 pb-4">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Monitor className="h-5 w-5" />
                Live Preview
              </CardTitle>
              <div className="flex items-center gap-4 text-sm text-muted-foreground font-mono">
                <span data-testid="text-resolution">{streamConfig.resolution}</span>
                <span className="text-muted-foreground/50">|</span>
                <span data-testid="text-fps">{streamConfig.fps} FPS</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="relative aspect-video bg-black/90 rounded-lg overflow-hidden flex items-center justify-center">
                {captureStatus === "standby" ? (
                  <div className="flex flex-col items-center gap-4 text-muted-foreground">
                    <SignalZero className="h-16 w-16" />
                    <span className="text-lg font-medium" data-testid="text-no-signal">No Signal</span>
                  </div>
                ) : (
                  <>
                    <video
                      ref={videoRef}
                      autoPlay
                      muted
                      playsInline
                      className="w-full h-full object-contain"
                      data-testid="video-preview"
                    />
                    {overlayConfig.logoUrl && (
                      <div
                        className={`absolute p-4 ${
                          overlayConfig.position === "top-left" ? "top-0 left-0" :
                          overlayConfig.position === "top-right" ? "top-0 right-0" :
                          overlayConfig.position === "bottom-left" ? "bottom-0 left-0" :
                          "bottom-0 right-0"
                        }`}
                        style={{ opacity: overlayConfig.opacity / 100 }}
                      >
                        <img
                          src={overlayConfig.logoUrl}
                          alt="Logo overlay"
                          className="h-16 w-auto"
                          data-testid="img-logo-overlay"
                        />
                      </div>
                    )}
                    {captureStatus === "capturing" && (
                      <div className="absolute top-4 right-4 bg-black/70 px-3 py-1.5 rounded-md font-mono text-sm text-white flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                        {formatDuration(duration)}
                      </div>
                    )}
                  </>
                )}
              </div>
              
              <div className="flex justify-center mt-6">
                {captureStatus === "standby" ? (
                  <Button
                    size="lg"
                    onClick={startCapture}
                    className="gap-2"
                    data-testid="button-start-capture"
                  >
                    <Play className="h-5 w-5" />
                    Start Capture
                  </Button>
                ) : (
                  <Button
                    size="lg"
                    variant="destructive"
                    onClick={stopCapture}
                    className="gap-2"
                    data-testid="button-stop-capture"
                  >
                    <Square className="h-5 w-5" />
                    Stop Capture
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </main>

        <aside className="w-80 border-l border-border p-6 overflow-auto flex flex-col gap-6">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Image className="h-5 w-5" />
                Logo Overlay
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <input
                type="file"
                id="logo-upload"
                ref={fileInputRef}
                onChange={handleLogoUpload}
                accept="image/*"
                className="sr-only"
                data-testid="input-logo-upload"
              />
              
              <label
                htmlFor="logo-upload"
                className="border-2 border-dashed border-border rounded-lg p-6 flex flex-col items-center gap-3 cursor-pointer hover-elevate transition-colors focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2"
                data-testid="button-upload-logo"
              >
                {overlayConfig.logoUrl ? (
                  <img
                    src={overlayConfig.logoUrl}
                    alt="Logo preview"
                    className="h-20 w-20 object-contain rounded"
                  />
                ) : (
                  <>
                    <Upload className="h-8 w-8 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Click to Upload Logo</span>
                  </>
                )}
              </label>

              {overlayConfig.logoUrl && (
                <>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Position</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {positionOptions.map(option => (
                        <Button
                          key={option.value}
                          variant={overlayConfig.position === option.value ? "default" : "outline"}
                          size="sm"
                          onClick={() => setOverlayConfig(prev => ({ ...prev, position: option.value }))}
                          data-testid={`button-position-${option.value}`}
                        >
                          {option.label}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Opacity: {overlayConfig.opacity}%</Label>
                    <Slider
                      value={[overlayConfig.opacity]}
                      onValueChange={([value]) => setOverlayConfig(prev => ({ ...prev, opacity: value }))}
                      max={100}
                      step={1}
                      data-testid="slider-opacity"
                    />
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Stream Config
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="stream-key" className="text-sm font-medium">X.com Stream Key</Label>
                <div className="relative">
                  <Input
                    id="stream-key"
                    type={showStreamKey ? "text" : "password"}
                    value={streamConfig.streamKey}
                    onChange={(e) => setStreamConfig(prev => ({ ...prev, streamKey: e.target.value }))}
                    placeholder="Enter your stream key"
                    className="pr-10 font-mono"
                    data-testid="input-stream-key"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full"
                    onClick={() => setShowStreamKey(!showStreamKey)}
                    aria-label={showStreamKey ? "Hide stream key" : "Show stream key"}
                    data-testid="button-toggle-stream-key"
                  >
                    {showStreamKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                <h4 className="text-sm font-medium">How to Get Stream Key:</h4>
                <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                  <li>Go to X.com Media Studio</li>
                  <li>Navigate to "Producer" section</li>
                  <li>Copy your Stream Key</li>
                  <li>Paste it above</li>
                </ol>
                <a
                  href="https://studio.twitter.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-primary hover:underline mt-2"
                  data-testid="link-x-media-studio"
                >
                  Open X Media Studio
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Activity className="h-5 w-5" />
                System Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground flex items-center gap-2">
                    <Signal className="h-4 w-4" />
                    Status
                  </span>
                  <Badge 
                    variant={systemStatus.status === "capturing" ? "default" : "secondary"}
                    className={systemStatus.status === "capturing" ? "bg-red-500" : ""}
                    data-testid="badge-status"
                  >
                    {systemStatus.status === "standby" ? "Standby" : "Capturing"}
                  </Badge>
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground flex items-center gap-2">
                    <Monitor className="h-4 w-4" />
                    Capture
                  </span>
                  <span className="text-sm font-medium" data-testid="text-capture-status">
                    {systemStatus.capture}
                  </span>
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground flex items-center gap-2">
                    <Image className="h-4 w-4" />
                    Overlay
                  </span>
                  <span className="text-sm font-medium" data-testid="text-overlay-status">
                    {systemStatus.overlay}
                  </span>
                </div>

                {captureStatus === "capturing" && (
                  <>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground flex items-center gap-2">
                        <Gauge className="h-4 w-4" />
                        FPS
                      </span>
                      <span className="text-sm font-mono font-medium" data-testid="text-current-fps">
                        {systemStatus.fps}
                      </span>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        Duration
                      </span>
                      <span className="text-sm font-mono font-medium" data-testid="text-duration">
                        {formatDuration(duration)}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </aside>
      </div>

      <footer className="h-16 border-t border-border flex items-center justify-between px-6">
        <div className="flex items-center gap-6 text-sm text-muted-foreground">
          <span className="flex items-center gap-2">
            <Gauge className="h-4 w-4" />
            <span className="font-mono">{systemStatus.fps} FPS</span>
          </span>
          <span className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            <span className="font-mono">{systemStatus.bitrate} kbps</span>
          </span>
          <span className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span className="font-mono">{formatDuration(duration)}</span>
          </span>
        </div>
        <div className="text-sm text-muted-foreground">
          StreemWeever v1.0
        </div>
      </footer>
    </div>
  );
}
