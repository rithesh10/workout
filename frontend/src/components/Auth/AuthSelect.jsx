import React from 'react';
import { ChevronDown } from 'lucide-react';

const AuthSelect = ({ 
  id, 
  label, 
  value, 
  onChange, 
  options = [], 
  placeholder = "Select an option",
  required = false,
  error,
  icon: Icon
}) => {
  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-1">
        {label}
      </label>
      <div className="relative rounded-md shadow-sm">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
        )}
        <select
          id={id}
          name={id}
          required={required}
          className={`block w-full rounded-lg bg-gray-700 border ${error ? 'border-red-500' : 'border-gray-600'} text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-3 ${Icon ? 'pl-10' : ''} appearance-none transition-all duration-200`}
          value={value}
          onChange={onChange}
        >
          <option value="" disabled>{placeholder}</option>
          {options.map((option) => (
            <option key={option.value || option} value={option.value || option}>
              {option.label || option}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <ChevronDown className="h-5 w-5 text-gray-400" aria-hidden="true" />
        </div>
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-500" id={`${id}-error`}>
          {error}
        </p>
      )}
    </div>
  );
};

export default AuthSelect;
