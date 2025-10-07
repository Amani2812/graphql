import React from "react"

const Switch = React.forwardRef(({ 
  className = '', 
  checked = false, 
  onCheckedChange,
  disabled = false,
  ...props 
}, ref) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    disabled={disabled}
    className={`peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 ${
      checked ? 'bg-gray-900' : 'bg-gray-200'
    } ${className}`}
    onClick={() => onCheckedChange?.(!checked)}
    ref={ref}
    {...props}
  >
    <span
      className={`pointer-events-none block h-4 w-4 rounded-full bg-white shadow-lg ring-0 transition-transform ${
        checked ? 'translate-x-4' : 'translate-x-0'
      }`}
    />
  </button>
))
Switch.displayName = "Switch"

export { Switch }