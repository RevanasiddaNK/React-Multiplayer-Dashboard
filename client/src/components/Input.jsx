import React from 'react'

export const Input = ({name,placeholder, handleInput}) => {
  return (
    <input 
    name = {name} 
    onChange={handleInput}
    className="input-field"
    placeholder={placeholder}
    />
  )
}
