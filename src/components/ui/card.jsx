import React from 'react'

export const Card = ({ children, className = '', ...props }) => {
  return (
    <div {...props} className={"rounded-2xl p-6 bg-white shadow " + className}>
      {children}
    </div>
  )
}

export const CardHeader = ({ children, className = '', ...props }) => {
  return (
    <div {...props} className={"pb-2 " + className}>
      {children}
    </div>
  )
}

export const CardTitle = ({ children, className = '', ...props }) => {
  return (
    <h3 {...props} className={"text-lg font-semibold " + className}>
      {children}
    </h3>
  )
}

export const CardContent = ({ children, className = '', ...props }) => {
  return (
    <div {...props} className={"p-2 " + className}>
      {children}
    </div>
  )
}

export default Card
