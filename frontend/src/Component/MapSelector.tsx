import { useState, useEffect, useRef } from 'react';
import { APIProvider, Map, Marker, InfoWindow, useMap } from '@vis.gl/react-google-maps';
import { useNavigate } from 'react-router-dom';
import { MapPinIcon } from '@heroicons/react/24/outline';
import Search from './Search'; 

function MapContent({ onLocationSelect, markerPos, placeName, isAnalyzing, handleAnalyze }: any) {
  // This must be OUTSIDE MapSelector to keep focus stable

  const navigate = useNavigate();
  const map = useMap();
  const [mapType, setMapType] = useState<string>('satellite');
  // Try to restore last viewed viewport from localStorage
  const savedViewport = (() => {
    try {
      const raw = localStorage.getItem('lastMapViewport');
      return raw ? JSON.parse(raw) as { lat: number; lng: number; zoom: number } : null;
    } catch (e) {
      return null;
    }
  })();
  useEffect(() => {
    if (map && markerPos) {
      map.panTo(markerPos); // Move camera to new coordinates
      map.setZoom(12);      // Zoom in for better detail of the searched area
    }
  }, [map, markerPos]);    // Trigger whenever map loads or markerPos updates

  // Persist viewport (center & zoom) whenever the map becomes idle
  useEffect(() => {
    if (!map) return;
    const saveViewport = () => {
      try {
        const c = map.getCenter();
        if (!c) return;
        const viewport = { lat: c.lat(), lng: c.lng(), zoom: map.getZoom() || 6 };
        localStorage.setItem('lastMapViewport', JSON.stringify(viewport));
      } catch (err) {
        // ignore storage errors
      }
    };

    const idleListener = map.addListener('idle', saveViewport);
    return () => idleListener?.remove();
  }, [map]);
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
        defaultCenter={savedViewport ? { lat: savedViewport.lat, lng: savedViewport.lng } : { lat: 39.0, lng: 35.0 }}
        defaultZoom={savedViewport ? savedViewport.zoom : 6}
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
        <button onClick={handleFindMe} className="h-10 w-10 flex items-center justify-center bg-white/90 rounded-xl border border-slate-100 shadow-xl text-lg"><MapPinIcon className="h-6 w-6"/></button>
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
  const feedback = useRef<boolean | null>(null);
  const userNotesRef = useRef("");
  const navigate = useNavigate();

  const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

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
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/scans/analyze`, {
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
       navigate(`/analysis/${data._id}`, {
        state: {
          analysisResult: data,
          feedback,
          userNotes: userNotesRef.current
        }
      });

      }
    } catch (err) {
      alert("Error connecting to AI service");
    } finally {
      setIsAnalyzing(false);
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

      {/* {isModalOpen && analysisResult && (
  <div className="fixed inset-0 z-[200] flex items-center justify-center bg-emerald-950/40 backdrop-blur-xl p-2 sm:p-4 overflow-y-auto">
    <div className="
      w-full max-w-5xl
      max-h-[90vh]
      overflow-y-visible lg:overflow-y-auto
      bg-white
      rounded-none sm:rounded-3xl lg:rounded-[3.5rem]
      shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)]
      flex flex-col lg:flex-row
      animate-in fade-in zoom-in duration-500
    ">

      
      <div className="lg:w-3/5 p-5 sm:p-6 lg:p-10 bg-emerald-50/50 border-b lg:border-b-0 lg:border-r border-emerald-100">
        <div className="mb-6">
          <h3 className="text-[9px] font-black uppercase tracking-[0.3em] text-emerald-800">
            Spatial Grid Analysis
          </h3>
          <p className="text-[9px] text-emerald-600 mt-1">
            9-point deep learning verification
          </p>
        </div>

        <div className="grid grid-cols-3 gap-1 sm:gap-2">
          {analysisResult.grid_data.map((point: any, idx: number) => (
            <div
              key={idx}
              className="relative overflow-hidden shadow-md border-2 border-white aspect-square group"
            >
              <img
                src={`https://maps.googleapis.com/maps/api/staticmap?center=${point.lat},${point.lng}&zoom=17&size=300x300&maptype=satellite&key=${GOOGLE_API_KEY}`}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/80 via-transparent to-transparent" />

              <div className="absolute top-2 left-2 px-2 py-1 bg-white/95 backdrop-blur rounded-lg text-[8px] font-black text-emerald-900">
                {point.label}
              </div>

              <div className="absolute bottom-2 left-2 right-2">
                <span className={`text-[8px] font-black uppercase ${
                  point.individual_prob > 0.4 ? "text-orange-300" : "text-emerald-300"
                }`}>
                  {(point.individual_prob * 100).toFixed(0)}%
                </span>

                <div className="w-full bg-white/20 h-1 rounded-full overflow-hidden mt-1">
                  <div
                    className={`h-full transition-all duration-1000 ${
                      point.individual_prob > 0.4 ? "bg-orange-400" : "bg-emerald-400"
                    }`}
                    style={{ width: `${point.individual_prob * 100}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      
      <div className="lg:w-2/5 p-6 sm:p-8 lg:p-12 flex flex-col justify-center bg-white">
        <div className="mb-6 sm:mb-8">
          <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-[9px] font-black uppercase tracking-widest border border-emerald-100">
            AI Verdict
          </span>

          <h2
            className={`mt-4 font-bold tracking-tight leading-none
              text-3xl sm:text-4xl lg:text-5xl
              ${analysisResult.result === "High Risk" || analysisResult.result === "Critical Risk"
                ? "text-red-600"
                : "text-emerald-600"}
            `}
          >
            {analysisResult.result}
          </h2>

          <div className="mt-6 flex items-end gap-3">
            <span className="text-4xl sm:text-5xl lg:text-6xl font-medium text-slate-900 tabular-nums">
              {(analysisResult.total_probability * 100).toFixed(1)}%
            </span>
            <span className="text-[10px] font-bold text-slate-400 uppercase leading-tight">
              Model<br />Certainty
            </span>
          </div>
        </div>

        <FeedbackSection
          feedback={feedback}
          setFeedback={setFeedback}
          initialNotes={userNotesRef.current}
          onNotesChange={(val: string) => (userNotesRef.current = val)}
        />

        <div className="space-y-3 mt-6">
          <button
            onClick={() => handleSaveFeedback(analysisResult._id)}
            className="w-full py-4 bg-emerald-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.25em] hover:bg-emerald-700 transition-all active:scale-95"
          >
            Confirm & Save History
          </button>

          <button
            onClick={() => setIsModalOpen(false)}
            className="w-full py-4 bg-slate-50 text-slate-400 rounded-2xl text-[10px] font-black uppercase tracking-[0.25em] hover:bg-slate-100 transition-all active:scale-95"
          >
            Discard Scan
          </button>
        </div>

        <div className="mt-6 p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100/50">
          <p className="text-[9px] text-emerald-800 italic leading-relaxed">
            "This report combines spatial data from surrounding areas. The weighted algorithm
            prioritizes central terrain while monitoring perimeter threats."
          </p>
        </div>
      </div>

    </div>
  </div>
)} */}

    </div>
  );
}