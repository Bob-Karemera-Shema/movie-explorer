import type { PropsWithChildren } from 'react'
import './button.component.css'

const Button: React.FC<PropsWithChildren> = ({children}) => {
  return (
    <button className='button'>
        {children}
    </button>
  )
}

export default Button;