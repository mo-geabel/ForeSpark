import { useState, useEffect} from 'react';
import { APIProvider, Map, Marker, InfoWindow, useMap } from '@vis.gl/react-google-maps';
import { useNavigate } from 'react-router-dom';
import Search from './Search'; 

function MapContent({ onLocationSelect, markerPos, placeName, isAnalyzing, handleAnalyze }: any) {
  const navigate = useNavigate();
  const map = useMap();
  const [mapType, setMapType] = useState<string>('satellite');
  useEffect(() => {
    if (map && markerPos) {
      map.panTo(markerPos); // Move camera to new coordinates
      map.setZoom(12);      // Zoom in for better detail of the searched area
    }
  }, [map, markerPos]);    // Trigger whenever map loads or markerPos updates
  const handleFindMe = () => {
    if (!navigator.geolocation) return alert("Geolocation not supported");
    navigator.geolocation.getCurrentPosition((pos) => {
      const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
      map?.panTo(loc);
      map?.setZoom(14);
      onLocationSelect(loc);
    });
  };

  return (
    <>
      {/* --- UI CONTROLS --- */}
      <button 
        onClick={() => navigate('/')} 
        className="absolute top-6 left-6 z-50 flex items-center gap-2.5 h-10 px-4 bg-white/80 backdrop-blur-md rounded-xl border border-emerald-100/50 shadow-sm hover:border-emerald-300 transition-all active:scale-95 group"
      >
        <span className="text-emerald-600 font-bold group-hover:-translate-x-0.5 transition-transform">←</span>
        <span className="font-black text-[9px] uppercase tracking-[0.15em] text-slate-500">Back</span>
      </button>

      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4">
        <Search onPlaceSelect={onLocationSelect} />
      </div>

      <div className="absolute top-24 left-6 z-30 flex flex-col gap-2">
        {['satellite', 'terrain', 'hybrid'].map((type) => (
          <button 
            key={type}
            onClick={() => setMapType(type)}
            className={`px-4 py-2 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all border shadow-lg ${
              mapType === type 
                ? 'bg-emerald-600 text-white border-emerald-400' 
                : 'bg-white/90 text-slate-600 border-slate-100 backdrop-blur-md hover:bg-emerald-50'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* --- GOOGLE MAP --- */}
      <Map
        style={{ width: '100%', height: '100%' }}
        defaultCenter={{ lat: 39.0, lng: 35.0 }}
        defaultZoom={6}
        mapTypeId={mapType}
        gestureHandling={'greedy'}
        disableDefaultUI={true}
        onClick={(ev) => { if (ev.detail.latLng) onLocationSelect(ev.detail.latLng); }}
      >
        {markerPos && (
          <>
            <Marker position={markerPos} />
            <InfoWindow position={markerPos} disableAutoPan={true}>
              <div className="p-2 min-w-[180px]">
                <p className="text-[10px] font-black text-emerald-600 uppercase mb-1 tracking-wider">Location Found</p>
                <p className="text-[11px] font-medium text-slate-700 mb-2 leading-relaxed">
                  {placeName || "Identifying terrain..."}
                </p>
                <div className="text-[9px] font-mono bg-slate-50 p-2 rounded border border-slate-100 flex flex-col gap-0.5">
                   <span>LAT: {markerPos.lat.toFixed(5)}</span>
                   <span>LNG: {markerPos.lng.toFixed(5)}</span>
                </div>
              </div>
            </InfoWindow>
          </>
        )}
      </Map>

      {/* --- ACTION BUTTONS --- */}
      <div className="absolute bottom-32 right-6 z-50 flex flex-col gap-2">
        <button onClick={handleFindMe} className="h-10 w-10 flex items-center justify-center bg-white/90 rounded-xl border border-slate-100 shadow-xl text-lg">🎯</button>
        <button onClick={() => map?.setZoom((map.getZoom() || 10) + 1)} className="h-10 w-10 flex items-center justify-center bg-white/90 rounded-xl border border-slate-100 shadow-xl font-bold">+</button>
        <button onClick={() => map?.setZoom((map.getZoom() || 10) - 1)} className="h-10 w-10 flex items-center justify-center bg-white/90 rounded-xl border border-slate-100 shadow-xl font-bold">−</button>
      </div>

      {markerPos && (
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 w-full max-w-xs px-4">
          <button 
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className={`w-full py-5 rounded-2xl font-medium text-[12px] uppercase tracking-[0.2em] shadow-2xl transition-all flex items-center justify-center gap-3
              ${isAnalyzing ? 'bg-slate-200 text-slate-400' : 'bg-emerald-600 text-white hover:bg-emerald-500 active:scale-95'}`}
          >
            {isAnalyzing ? (
              <div className="h-4 w-4 border-2 border-slate-400 border-t-emerald-600 rounded-full animate-spin" />
            ) : "Analyze Fire Risk"}
          </button>
        </div>
      )}
    </>
  );
}

export default function MapSelector() {
  const [markerPos, setMarkerPos] = useState<google.maps.LatLngLiteral | null>(null);
  const [placeName, setPlaceName] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const GOOGLE_API_KEY = 'AIzaSyAXt3psuCVpA4bRMPg9Ik6oZ_Qn7MtngtE';

  // --- REVERSE GEOCODING (To get the place name) ---
  const fetchPlaceName = async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_API_KEY}`
      );
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        setPlaceName(data.results[0].formatted_address);
      } else {
        setPlaceName("Open Wilderness/Forest");
      }
    } catch (err) {
      setPlaceName("Coordinate Selected");
    }
  };

  const handleLocationUpdate = (loc: google.maps.LatLngLiteral) => {
    setMarkerPos(loc);
    fetchPlaceName(loc.lat, loc.lng);
  };

  const handleAnalyze = async () => {
    if (!markerPos) return;
    setIsAnalyzing(true);
    try {
      const response = await fetch('http://localhost:5000/api/scans/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('fireforest_token') || ''
        },
        body: JSON.stringify({ lat: markerPos.lat, lng: markerPos.lng, name: placeName })
      });
      const data = await response.json();
      if (response.ok) {
        console.log(data);
        setAnalysisResult(data);
        setIsModalOpen(true);
      }
    } catch (err) {
      alert("Error connecting to AI service");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSaveFeedback = async (scanId: string, isCorrect: boolean) => {
    const token = localStorage.getItem('fireforest_token');
    try {
      const response = await fetch(`http://localhost:5000/api/scans/feedback/${scanId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token || ''
        },
        body: JSON.stringify({ isCorrect, notes: "User confirmed analysis" })
      });

      if (response.ok) {
        setIsModalOpen(false);
        navigate('/history');
      }
    } catch (err) {
      console.error("Feedback error:", err);
    }
  };

  return (
    <div className="h-screen w-screen relative bg-slate-100">
      <APIProvider apiKey={GOOGLE_API_KEY}>
        <MapContent 
          onLocationSelect={handleLocationUpdate}
          markerPos={markerPos}
          placeName={placeName}
          isAnalyzing={isAnalyzing}
          handleAnalyze={handleAnalyze}
        />
      </APIProvider>

      {isModalOpen && analysisResult && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-emerald-950/40 backdrop-blur-xl p-4 overflow-y-auto">
          <div className="w-full max-w-5xl bg-white rounded-[3.5rem] shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] overflow-hidden flex flex-col lg:flex-row animate-in fade-in zoom-in duration-500">
            
            {/* Left: 3x3 Spatial Grid */}
            <div className="lg:w-3/5 p-10 bg-emerald-50/50 border-r border-emerald-100">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-800">Spatial Grid Analysis</h3>
                  <p className="text-[10px] text-emerald-600 mt-1">9-point deep learning verification</p>
                </div>
                {/* <div className="h-8 w-8 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 font-bold text-xs">9</div> */}
              </div>

              <div className="grid grid-cols-3">
                {analysisResult.grid_data.map((point: any, idx: number) => (
                  <div key={idx} className="relative overflow-hidden shadow-md border-2 border-white aspect-square group">
                    <img 
                        src={`https://maps.googleapis.com/maps/api/staticmap?center=${point.lat},${point.lng}&zoom=17&size=300x300&maptype=satellite&key=${GOOGLE_API_KEY}`} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/80 via-transparent to-transparent opacity-90" />
                    
                    {/* Compass Label */}
                    <div className="absolute top-3 left-3 px-2.5 py-1.5 bg-white/95 backdrop-blur-md rounded-xl text-[9px] font-black text-emerald-900 shadow-sm border border-emerald-50">
                        {point.label}
                    </div>

                    {/* Confidence Meter */}
                    <div className="absolute bottom-3 left-3 right-3 flex flex-col gap-1">
                      <div className="flex justify-between items-center text-[9px] font-black text-white uppercase tracking-wider">
                        <span className={point.individual_prob > 0.4 ? "text-orange-300" : "text-emerald-300"}>
                            {(point.individual_prob * 100).toFixed(0)}% probability
                        </span>
                      </div>
                      <div className="w-full bg-white/20 h-1 rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-1000 ${point.individual_prob > 0.4 ? 'bg-orange-400' : 'bg-emerald-400'}`}
                          style={{ width: `${point.individual_prob * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Aggregated Conclusion */}
            <div className="lg:w-2/5 p-12 flex flex-col justify-center bg-white relative">
              <div className="mb-12">
                <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-[9px] font-black uppercase tracking-widest border border-emerald-100">
                  AI Verdict
                </span>
                {analysisResult.result === "High Risk" || analysisResult.result === "Critical Risk" ? (
                  <>
                <h2 className="text-5xl font-bold text-red-600 tracking-tighter mt-4 leading-none">
                  {analysisResult.result}
                </h2>
                  </>
                ) : (
                  <>
                <h2 className="text-5xl font-bold text-emerald-600 tracking-tighter mt-4 leading-none">
                  {analysisResult.result}
                </h2>
                </>
                )}
                <div className="mt-8 flex items-baseline gap-3">
                  <span className="text-6xl font-medium text-slate-900 tabular-nums">
                    {(analysisResult.total_probability * 100).toFixed(1)}%
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <button 
                  onClick={() => handleSaveFeedback(analysisResult._id, true)} 
                  className="w-full py-5 bg-emerald-600 text-white rounded-[1.5rem] text-[11px] font-black uppercase tracking-[0.25em] hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-200 active:scale-95"
                >
                    Confirm & Save History
                </button>
                <button 
                  onClick={() => setIsModalOpen(false)} 
                  className="w-full py-5 bg-slate-50 text-slate-400 rounded-[1.5rem] text-[11px] font-black uppercase tracking-[0.25em] hover:bg-slate-100 transition-all active:scale-95"
                >
                    Discard Scan
                </button>
              </div>

              <div className="mt-12 p-6 bg-emerald-50/50 rounded-3xl border border-emerald-100/50">
                 <p className="text-[10px] text-emerald-800 leading-relaxed italic font-medium">
                    "This report combines spatial data from surrounding areas. The weighted algorithm prioritizes central terrain while monitoring perimeter threats."
                 </p>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}