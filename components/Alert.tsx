'use client'

import React from 'react'

interface AlertProps {
  type: 'success' | 'error' | 'info' | 'warning'
  message: string
  onClose?: () => void
}

const alertStyles = {
  success: 'bg-green-100 text-green-800 border-green-300',
  error: 'bg-red-100 text-red-800 border-red-300',
  info: 'bg-blue-100 text-blue-800 border-blue-300',
  warning: 'bg-yellow-100 text-yellow-800 border-yellow-300',
}

export function Alert({ type, message, onClose }: AlertProps) {
  return (
    <div className={`border-l-4 p-4 rounded ${alertStyles[type]}`}>
      <div className="flex justify-between items-center">
        <p>{message}</p>
        {onClose && (
          <button onClick={onClose} className="font-bold cursor-pointer">
            ×
          </button>
        )}
      </div>
    </div>
  )
}
