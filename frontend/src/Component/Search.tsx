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
    <div className="w-full">
      <div className="relative group">
        <input
          ref={inputRef}
          type="text"
          onKeyDown={handleKeyDown}
          placeholder="Search place or paste coords..."
          className="w-full bg-white/90 backdrop-blur-md border border-slate-200 rounded-xl px-4 md:px-6 py-3 md:py-4 text-xs md:text-sm text-slate-800 shadow-lg outline-none focus:border-emerald-500 transition-all pr-12"
        />
        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-mono pointer-events-none">
          ⏎
        </div>
      </div>
    </div>
  );
}