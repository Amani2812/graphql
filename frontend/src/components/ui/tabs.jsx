import React, { useState, createContext, useContext } from "react"

const TabsContext = createContext()

export const Tabs = ({ defaultValue, children, className = '', ...props }) => {
  const [activeTab, setActiveTab] = useState(defaultValue)
  
  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className={`w-full ${className}`} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  )
}

export const TabsList = ({ className = '', children, ...props }) => (
  <div 
    className={`inline-flex h-9 items-center justify-center rounded-lg bg-gray-100 p-1 text-gray-600 ${className}`} 
    {...props}
  >
    {children}
  </div>
)

export const TabsTrigger = ({ value, className = '', children, ...props }) => {
  const { activeTab, setActiveTab } = useContext(TabsContext)
  const isActive = activeTab === value
  
  return (
    <button
      className={`inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 ${
        isActive 
          ? 'bg-white text-gray-900 shadow' 
          : 'hover:bg-gray-200'
      } ${className}`}
      onClick={() => setActiveTab(value)}
      {...props}
    >
      {children}
    </button>
  )
}

export const TabsContent = ({ value, className = '', children, ...props }) => {
  const { activeTab } = useContext(TabsContext)
  
  if (activeTab !== value) return null
  
  return (
    <div 
      className={`mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`} 
      {...props}
    >
      {children}
    </div>
  )
}
