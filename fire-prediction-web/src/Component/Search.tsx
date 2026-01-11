import { useEffect, useRef } from 'react';
import { useMapsLibrary } from '@vis.gl/react-google-maps';

interface SearchProps {
  onPlaceSelect: (location: { lat: number; lng: number }) => void;
}

export default function Search({ onPlaceSelect }: SearchProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const places = useMapsLibrary('places');

  useEffect(() => {
    if (!places || !inputRef.current) return;

    const autocomplete = new places.Autocomplete(inputRef.current, {
      componentRestrictions: { country: 'tr' },
      fields: ['geometry']
    });

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      if (place.geometry?.location) {
        onPlaceSelect({
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        });
      }
    });
  }, [places, onPlaceSelect]);

  // Handle manual Coordinate entry
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const value = inputRef.current?.value || "";
      // Regex to check for: "lat, lng" (e.g., 39.93, 32.85)
      const coordRegex = /^(-?\d+(\.\d+)?),\s*(-?\d+(\.\d+)?)$/;
      const match = value.match(coordRegex);

      if (match) {
        const lat = parseFloat(match[1]);
        const lng = parseFloat(match[3]);
        onPlaceSelect({ lat, lng });
      }
    }
  };

  return (
    <div className="absolute top-6 left-1/2 -translate-x-1/2 w-full max-w-md px-4 z-30">
      <div className="relative group">
        <input
          ref={inputRef}
          type="text"
          onKeyDown={handleKeyDown}
          placeholder="Search place or paste coords (lat, lng)..."
          className="w-full bg-white/90 backdrop-blur-md border border-slate-700 rounded-2xl px-6 py-4 text-slate-800 shadow-2xl outline-none focus:border-green-500 transition-all pr-12"
        />
        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-800 text-xs font-mono pointer-events-none">
          ⏎
        </div>
      </div>
    </div>
  );
}