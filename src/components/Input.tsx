import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`w-full px-4 py-2.5 bg-white border rounded-lg text-gray-900 placeholder-gray-400
            transition-all duration-200 outline-none
            ${error
              ? 'border-red-500 focus:border-red-600 focus:ring-2 focus:ring-red-200'
              : 'border-gray-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200'
            }
            disabled:bg-gray-100 disabled:cursor-not-allowed
            ${className}`}
          {...props}
        />
        {error && (
          <p className="mt-1.5 text-sm text-red-600">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
