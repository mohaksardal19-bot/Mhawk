import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download, X } from 'lucide-react';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already running as an installed PWA, hide the button
  if (isInstalled) {
    return null;
  }

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    return (
      <button
        onClick={install}
        className="flex items-center gap-2 rounded-sm border border-system-blue bg-system-blue/10 px-3 py-1.5 text-xs font-bold text-system-blue shadow-[0_0_10px_rgba(0,229,255,0.2)] hover:bg-system-blue hover:text-black transition-colors uppercase tracking-widest"
      >
        <Download className="w-3 h-3" />
        Install App
      </button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className="flex items-center gap-2 rounded-sm border border-system-blue bg-system-blue/10 px-3 py-1.5 text-xs font-bold text-system-blue shadow-[0_0_10px_rgba(0,229,255,0.2)] hover:bg-system-blue hover:text-black transition-colors uppercase tracking-widest"
        >
          <Download className="w-3 h-3" />
          Install on iOS
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="w-full max-w-sm rounded-sm bg-dark-indigo border border-system-blue/50 p-6 shadow-[0_0_20px_rgba(0,229,255,0.2)] relative">
              <button 
                onClick={() => setShowIOSGuide(false)}
                className="absolute top-4 right-4 text-white/50 hover:text-system-red transition-colors"
              >
                <X size={20} />
              </button>
              
              <h3 className="text-lg font-black italic uppercase tracking-widest text-system-blue mb-4">System Installation</h3>
              
              <div className="space-y-4 text-sm text-white/80 font-mono">
                <p>To install Solo Leveling on your iOS device:</p>
                <ol className="list-decimal pl-5 space-y-2">
                  <li>Tap the <strong>Share</strong> button in the Safari toolbar at the bottom of your screen.</li>
                  <li>Scroll down and tap <strong>Add to Home Screen</strong>.</li>
                </ol>
              </div>
              
              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-6 w-full rounded-sm bg-white/10 py-2.5 text-xs font-bold text-white uppercase tracking-widest hover:bg-white/20 transition-colors border border-white/20"
              >
                Close Window
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
