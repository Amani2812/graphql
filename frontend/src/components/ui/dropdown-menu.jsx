import React, { useState, createContext, useContext, useRef, useEffect } from "react"

const DropdownContext = createContext()

export const DropdownMenu = ({ children, ...props }) => {
  const [open, setOpen] = useState(false)
  
  return (
    <DropdownContext.Provider value={{ open, setOpen }}>
      <div className="relative inline-block text-left" {...props}>
        {children}
      </div>
    </DropdownContext.Provider>
  )
}

export const DropdownMenuTrigger = ({ children, ...props }) => {
  const { open, setOpen } = useContext(DropdownContext)
  
  return (
    <button onClick={() => setOpen(!open)} {...props}>
      {children}
    </button>
  )
}

export const DropdownMenuContent = ({ children, className = '', ...props }) => {
  const { open, setOpen } = useContext(DropdownContext)
  const ref = useRef()
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false)
      }
    }
    
    if (open) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [open, setOpen])
  
  if (!open) return null
  
  return (
    <div
      ref={ref}
      className={`absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50 ${className}`}
      {...props}
    >
      <div className="px-1 py-1">
        {children}
      </div>
    </div>
  )
}

export const DropdownMenuItem = ({ children, className = '', ...props }) => {
  const { setOpen } = useContext(DropdownContext)
  
  return (
    <button
      className={`group flex w-full items-center rounded-md px-2 py-2 text-sm hover:bg-gray-100 ${className}`}
      onClick={() => setOpen(false)}
      {...props}
    >
      {children}
    </button>
  )
}

export const DropdownMenuSeparator = ({ className = '', ...props }) => (
  <div className={`my-1 h-px bg-gray-200 ${className}`} {...props} />
)