import React, { useState } from "react"

export const Accordion = ({ children, type = "single", collapsible = false, ...props }) => {
  const [openItems, setOpenItems] = useState(new Set())
  
  const toggleItem = (value) => {
    const newOpenItems = new Set(openItems)
    if (newOpenItems.has(value)) {
      newOpenItems.delete(value)
    } else {
      if (type === "single") {
        newOpenItems.clear()
      }
      newOpenItems.add(value)
    }
    setOpenItems(newOpenItems)
  }

  return (
    <div {...props}>
      {React.Children.map(children, child =>
        React.cloneElement(child, { openItems, toggleItem })
      )}
    </div>
  )
}

export const AccordionItem = ({ value, children, openItems, toggleItem, ...props }) => (
  <div className="border-b" {...props}>
    {React.Children.map(children, child =>
      React.cloneElement(child, { value, isOpen: openItems?.has(value), toggleItem })
    )}
  </div>
)

export const AccordionTrigger = ({ children, value, isOpen, toggleItem, ...props }) => (
  <button
    className="flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline"
    onClick={() => toggleItem(value)}
    {...props}
  >
    {children}
    <span className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}>▼</span>
  </button>
)

export const AccordionContent = ({ children, isOpen, ...props }) => (
  isOpen ? (
    <div className="pb-4 pt-0" {...props}>
      {children}
    </div>
  ) : null
)