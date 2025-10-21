import { useState, useEffect } from 'react';
import { MessageCircle } from 'lucide-react';
import { cn } from '../lib/utils';

export function ChatbotWidget() {
  const [isVisible, setIsVisible] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    // Add entrance animation after a short delay
    const timer = setTimeout(() => setIsVisible(true), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <button
        onClick={() => setIsChatOpen(true)}
        className={cn(
          "fixed z-50 flex items-center justify-center",
          "w-14 h-14 md:w-[56px] md:h-[56px]",
          "bg-[#2D7A3E] rounded-full text-white",
          "hover:scale-110 hover:shadow-xl",
          "transition-all duration-300",
          "bottom-4 right-4 md:bottom-6 md:right-6",
          "animate-pulse",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        )}
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      {isChatOpen && (
        <div 
          className={cn(
            "fixed bottom-0 right-0 z-40",
            "w-full sm:w-[400px] h-[600px]",
            "bg-white rounded-t-lg shadow-2xl",
            "transform transition-transform duration-300",
            isChatOpen ? "translate-y-0" : "translate-y-full"
          )}
        >
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="font-semibold">Chat Support</h3>
            <button
              onClick={() => setIsChatOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <span className="sr-only">Close chat</span>
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="p-4">
            <p className="text-gray-500">Chat interface coming soon...</p>
          </div>
        </div>
      )}
    </>
  );
}