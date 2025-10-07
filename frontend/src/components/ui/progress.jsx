import React from "react"

export const Progress = ({ className = '', value = 0, max = 100, ...props }) => (
  <div
    className={`relative h-2 w-full overflow-hidden rounded-full bg-gray-100 ${className}`}
    {...props}
  >
    <div
      className="h-full w-full flex-1 bg-gray-900 transition-all"
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    />
  </div>
)