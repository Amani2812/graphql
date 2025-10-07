import React from "react"

export const Toaster = ({ ...props }) => {
  return (
    <div id="toaster-container" {...props} />
  )
}

export const toast = {
  success: (message) => {
    console.log('SUCCESS:', message)
  },
  error: (message) => {
    console.error('ERROR:', message)
  },
  info: (message) => {
    console.log('INFO:', message)
  }
}