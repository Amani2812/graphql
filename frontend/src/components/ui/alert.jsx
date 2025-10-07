import React from "react"

export const Alert = ({ children, className = '', variant = 'default', ...props }) => {
  const variantClasses = {
    default: 'bg-gray-50 text-gray-800 border-gray-200',
    destructive: 'bg-red-50 text-red-800 border-red-200'
  }
  
  return (
    <div
      className={`relative w-full rounded-lg border px-4 py-3 text-sm ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

export const AlertDescription = ({ children, className = '', ...props }) => (
  <div className={`text-sm ${className}`} {...props}>
    {children}
  </div>
)