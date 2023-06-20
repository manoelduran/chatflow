import React, { InputHTMLAttributes, useEffect, useRef } from 'react'
import {  useField } from '@unform/core'


interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    name: string;
  }

 const Input: React.FC<InputProps> = ({name, onChange, ...rest}) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const { fieldName, defaultValue, registerField, error } = useField(name)

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: inputRef,
      getValue: ref => {
        return ref.current.value
      },
      setValue: (ref, value) => {
        ref.current.value = value
      },
      clearValue: ref => {
        ref.current.value = ''
      },
    })
  }, [fieldName, registerField])

  return <input ref={inputRef}  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500" onChange={onChange} defaultValue={defaultValue} {...rest} />
}

export {Input}