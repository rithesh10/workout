import React from 'react';
import { Loader2 } from 'lucide-react';

const AuthButton = ({ children, type = "button", onClick, isLoading = false, fullWidth = true }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isLoading}
      className={`
        ${fullWidth ? 'w-full' : ''}
        flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white 
        bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 
        disabled:opacity-50 disabled:cursor-not-allowed
        transform transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]
      `}
    >
      {isLoading ? (
        <>
          <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
          Processing...
        </>
      ) : (
        children
      )}
    </button>
  );
};

export default AuthButton;
