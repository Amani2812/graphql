import React, { useState, createContext, useContext } from "react"

const AlertDialogContext = createContext()

export const AlertDialog = ({ children, ...props }) => {
  const [open, setOpen] = useState(false)
  
  return (
    <AlertDialogContext.Provider value={{ open, setOpen }}>
      <div {...props}>
        {children}
      </div>
    </AlertDialogContext.Provider>
  )
}

export const AlertDialogTrigger = ({ children, ...props }) => {
  const { setOpen } = useContext(AlertDialogContext)
  
  return (
    <button onClick={() => setOpen(true)} {...props}>
      {children}
    </button>
  )
}

export const AlertDialogContent = ({ children, ...props }) => {
  const { open, setOpen } = useContext(AlertDialogContext)
  
  if (!open) return null
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={() => setOpen(false)} />
      <div className="relative bg-white rounded-lg p-6 shadow-lg" {...props}>
        {children}
      </div>
    </div>
  )
}

export const AlertDialogHeader = ({ children, ...props }) => (
  <div className="flex flex-col space-y-2 text-center sm:text-left" {...props}>
    {children}
  </div>
)

export const AlertDialogTitle = ({ children, ...props }) => (
  <h2 className="text-lg font-semibold" {...props}>
    {children}
  </h2>
)

export const AlertDialogDescription = ({ children, ...props }) => (
  <p className="text-sm text-gray-600" {...props}>
    {children}
  </p>
)

export const AlertDialogFooter = ({ children, ...props }) => (
  <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2" {...props}>
    {children}
  </div>
)

export const AlertDialogAction = ({ children, ...props }) => {
  const { setOpen } = useContext(AlertDialogContext)
  
  return (
    <button 
      className="bg-gray-900 text-white px-4 py-2 rounded-md hover:bg-gray-800"
      onClick={() => setOpen(false)}
      {...props}
    >
      {children}
    </button>
  )
}

export const AlertDialogCancel = ({ children, ...props }) => {
  const { setOpen } = useContext(AlertDialogContext)
  
  return (
    <button 
      className="border border-gray-300 px-4 py-2 rounded-md hover:bg-gray-50"
      onClick={() => setOpen(false)}
      {...props}
    >
      {children}
    </button>
  )
}