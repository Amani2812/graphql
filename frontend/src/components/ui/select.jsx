import React, { useState, createContext, useContext } from "react"

const SelectContext = createContext()

export const Select = ({ value, onValueChange, children, ...props }) => {
  const [open, setOpen] = useState(false)
  const [selectedValue, setSelectedValue] = useState(value)
  
  const handleValueChange = (newValue) => {
    setSelectedValue(newValue)
    onValueChange?.(newValue)
    setOpen(false)
  }
  
  return (
    <SelectContext.Provider value={{ open, setOpen, selectedValue, handleValueChange }}>
      <div className="relative" {...props}>
        {children}
      </div>
    </SelectContext.Provider>
  )
}

export const SelectTrigger = ({ children, className = '', ...props }) => {
  const { open, setOpen } = useContext(SelectContext)
  
  return (
    <button
      className={`flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      onClick={() => setOpen(!open)}
      {...props}
    >
      {children}
      <span className={`transition-transform ${open ? 'rotate-180' : ''}`}>▼</span>
    </button>
  )
}

export const SelectValue = ({ placeholder, className = '', ...props }) => {
  const { selectedValue } = useContext(SelectContext)
  
  return (
    <span className={`block truncate ${className}`} {...props}>
      {selectedValue || placeholder}
    </span>
  )
}

export const SelectContent = ({ children, className = '', ...props }) => {
  const { open } = useContext(SelectContext)
  
  if (!open) return null
  
  return (
    <div
      className={`absolute top-full left-0 z-50 min-w-full overflow-hidden rounded-md border bg-white shadow-md ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

export const SelectItem = ({ value, children, className = '', ...props }) => {
  const { handleValueChange, selectedValue } = useContext(SelectContext)
  
  return (
    <button
      className={`relative flex w-full cursor-pointer select-none items-center py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-gray-100 ${
        selectedValue === value ? 'bg-gray-100' : ''
      } ${className}`}
      onClick={() => handleValueChange(value)}
      {...props}
    >
      {selectedValue === value && (
        <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
          ✓
        </span>
      )}
      {children}
    </button>
  )
}