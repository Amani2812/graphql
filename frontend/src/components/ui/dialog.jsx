import React, { useState, createContext, useContext } from "react"

const DialogContext = createContext()

export const Dialog = ({ children, ...props }) => {
  const [open, setOpen] = useState(false)
  
  return (
    <DialogContext.Provider value={{ open, setOpen }}>
      <div {...props}>
        {children}
      </div>
    </DialogContext.Provider>
  )
}

export const DialogTrigger = ({ children, ...props }) => {
  const { setOpen } = useContext(DialogContext)
  
  return (
    <button onClick={() => setOpen(true)} {...props}>
      {children}
    </button>
  )
}

export const DialogContent = ({ children, className = '', ...props }) => {
  const { open, setOpen } = useContext(DialogContext)
  
  if (!open) return null
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={() => setOpen(false)} />
      <div className={`relative bg-white rounded-lg p-6 shadow-lg max-w-lg w-full mx-4 ${className}`} {...props}>
        <button
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
          onClick={() => setOpen(false)}
        >
          ✕
        </button>
        {children}
      </div>
    </div>
  )
}

export const DialogHeader = ({ children, className = '', ...props }) => (
  <div className={`flex flex-col space-y-1.5 text-center sm:text-left ${className}`} {...props}>
    {children}
  </div>
)

export const DialogTitle = ({ children, className = '', ...props }) => (
  <h2 className={`text-lg font-semibold leading-none tracking-tight ${className}`} {...props}>
    {children}
  </h2>
)

export const DialogDescription = ({ children, className = '', ...props }) => (
  <p className={`text-sm text-gray-600 ${className}`} {...props}>
    {children}
  </p>
)

export const DialogFooter = ({ children, className = '', ...props }) => (
  <div className={`flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 ${className}`} {...props}>
    {children}
  </div>
)