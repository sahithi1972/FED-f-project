import React from 'react';
import { MessageSquare } from 'lucide-react';

/**
 * Small floating chat placeholder shown in the bottom-right.
 * Non-functional; informs the user that the chatbot interface is coming soon.
 */
const ChatPlaceholder: React.FC = () => {
  return (
    <div className="fixed right-4 bottom-6 z-50 flex items-center">
      <div className="group relative">
        <div className="w-14 h-14 rounded-full bg-emerald-600 shadow-lg flex items-center justify-center text-white">
          <MessageSquare className="h-6 w-6" />
        </div>

        <div className="pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-150 absolute right-full bottom-1/2 translate-y-1/2 mr-3">
          <div className="bg-black/80 text-emerald-100 text-sm px-3 py-2 rounded-md shadow-lg whitespace-nowrap">
            Chatbot interface coming soon
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPlaceholder;
