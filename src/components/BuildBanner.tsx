import React, { useState, useEffect } from 'react';
import { X, Info } from 'lucide-react';

/**
 * Small dismissible banner shown on the homepage to inform users that the app
 * is under active development. Persists dismissal in localStorage.
 */
const BuildBanner: React.FC = () => {
  const [visible, setVisible] = useState<boolean>(true);

  useEffect(() => {
    try {
      const dismissed = localStorage.getItem('wc_build_banner_dismissed');
      if (dismissed === '1') setVisible(false);
    } catch (e) {
      // ignore
    }
  }, []);

  const close = () => {
    try {
      localStorage.setItem('wc_build_banner_dismissed', '1');
    } catch (e) {
      // ignore
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="w-full bg-gradient-to-r from-emerald-700/60 via-emerald-600/40 to-emerald-700/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="max-w-5xl mx-auto flex items-start sm:items-center gap-3 sm:gap-6">
          <div className="flex-shrink-0 mt-0.5">
            <div className="bg-white/8 p-2 rounded-md">
              <Info className="h-5 w-5 text-emerald-200" />
            </div>
          </div>

          <div className="flex-1 text-sm sm:text-base text-emerald-100">
            <div className="font-semibold text-emerald-50">Welcome to WasteChef — we&apos;re still building!</div>
            <div className="mt-1 text-emerald-100/90">
              You may encounter unfinished features or rough edges as we roll out new functionality.
              Most things work, but some features (upload, sync, and advanced filters) may be limited right now.
              Thanks for your patience — we&apos;re actively improving the experience.
            </div>
          </div>

          <div className="flex-shrink-0">
            <button
              aria-label="Dismiss development banner"
              onClick={close}
              className="p-2 rounded-md hover:bg-white/6 text-emerald-100"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuildBanner;
