import React from "react"

export const Separator = ({ 
  className = '', 
  orientation = 'horizontal', 
  decorative = true, 
  ...props 
}) => (
  <div
    role={!decorative ? 'separator' : undefined}
    aria-orientation={orientation}
    className={`shrink-0 bg-gray-200 ${
      orientation === 'horizontal' ? 'h-[1px] w-full' : 'h-full w-[1px]'
    } ${className}`}
    {...props}
  />
)