import React, { useEffect, useState } from 'react';
import { XIcon, MaximizeIcon, MinimizeIcon } from 'lucide-react';
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}
export function Modal({
  isOpen,
  onClose,
  children
}: ModalProps) {
  const [isFullScreen, setIsFullScreen] = useState(false);
  // Reset to popup mode when modal closes
  useEffect(() => {
    if (!isOpen) {
      setIsFullScreen(false);
    }
  }, [isOpen]);
  if (!isOpen) return null;
  return <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} aria-hidden="true" />
      <div className={`relative bg-white shadow-xl transition-all duration-200 ${isFullScreen ? 'fixed inset-0 w-full h-full rounded-none' : 'w-full max-w-2xl mx-4 rounded-lg p-6'}`}>
        <div className="flex justify-end gap-2 absolute top-4 right-4 z-10">
          <button onClick={() => setIsFullScreen(!isFullScreen)} className="text-gray-400 hover:text-gray-600" aria-label={isFullScreen ? 'Exit full screen' : 'Enter full screen'}>
            {isFullScreen ? <MinimizeIcon className="w-5 h-5" /> : <MaximizeIcon className="w-5 h-5" />}
          </button>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600" aria-label="Close modal">
            <XIcon className="w-5 h-5" />
          </button>
        </div>
        <div className={isFullScreen ? 'h-full p-6 overflow-auto' : ''}>
          {children}
        </div>
      </div>
    </div>;
}