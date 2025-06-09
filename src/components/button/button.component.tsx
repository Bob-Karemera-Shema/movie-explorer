// import React from 'react';
import type { ButtonHTMLAttributes, PropsWithChildren } from 'react'
import './button.component.css'

type ButtonProps = PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>>;

const Button: React.FC<ButtonProps> = ({children, ...props}) => {
  return (
    <button {...props}>
        {children}
    </button>
  )
}

export default Button;