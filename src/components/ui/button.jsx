import React from 'react'

export const Button = ({ children, className = '', ...props }) => {
  return (
    <button
      {...props}
      className={
        'px-4 py-2 rounded-xl bg-blue-500 text-white hover:bg-blue-600 transition disabled:opacity-50 ' +
        className
      }
    >
      {children}
    </button>
  )
}
