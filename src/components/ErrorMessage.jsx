// src/components/ErrorMessage.jsx
import { ExclamationTriangleIcon } from '@heroicons/react/24/solid';
import { ServerIcon } from '@heroicons/react/24/outline';

const ErrorMessage = ({ message, onRetry }) => {
  const isOffline = message.includes('internet') || message.includes('connection');
  
  return (
    <div 
      onClick={onRetry}
      className="glass-panel max-w-2xl mx-auto p-8 text-center cursor-pointer hover:bg-white/10 transition-colors duration-300"
    >
      <div className="flex flex-col items-center space-y-4">
        {isOffline ? (
          <ServerIcon className="w-12 h-12 text-red-400 animate-pulse" />
        ) : (
          <ExclamationTriangleIcon className="w-12 h-12 text-yellow-400" />
        )}
        
        <h3 className="text-xl font-medium text-white">
          {isOffline ? 'Connection Issue' : 'Something Went Wrong'}
        </h3>
        
        <p className="text-white/80 max-w-md">
          {message}
        </p>
        
        <button
          className="mt-4 px-6 py-2 bg-white/10 hover:bg-white/20 rounded-full text-white font-medium transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            onRetry();
          }}
        >
          {isOffline ? (
            <span className="flex items-center gap-2">
              <ServerIcon className="w-5 h-5" />
              Retry Connection
            </span>
          ) : 'Try Again'}
        </button>
      </div>
    </div>
  );
};

export default ErrorMessage;