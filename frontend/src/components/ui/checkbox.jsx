import React from "react"

export const Checkbox = ({ 
  checked, 
  onCheckedChange, 
  className = '', 
  disabled = false,
  ...props 
}) => (
  <button
    type="button"
    role="checkbox"
    aria-checked={checked}
    disabled={disabled}
    className={`peer h-4 w-4 shrink-0 rounded-sm border border-gray-300 ring-offset-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 ${
      checked ? 'bg-gray-900 text-white' : 'bg-white'
    } ${className}`}
    onClick={() => onCheckedChange?.(!checked)}
    {...props}
  >
    {checked && (
      <svg width="12" height="12" viewBox="0 0 15 15" fill="none">
        <path
          d="m11.4669 3.72684c.5865.50978 .5865 1.33196 0 1.84174L7.14123 10.7708c-.58651.5098-1.537.5098-2.12351 0L2.53314 8.30137c-.58651-.50978-.58651-1.33196 0-1.84174.58651-.50978 1.537-.50978 2.12351 0L6 7.70321l4.34339-3.97637c.58651-.50978 1.537-.50978 2.12351 0Z"
          fill="currentColor"
          fillRule="evenodd"
          clipRule="evenodd"
        />
      </svg>
    )}
  </button>
)