{/*
  Card Atom

  A re-usable card component
  for showing any item or items.
  The main content of each cart
  is provided dynamically where it
  is called through the children prop.
*/}

import React, {
  PropsWithChildren,
  ReactNode,
} from "react"


interface CardProps extends PropsWithChildren {
    className?: string
    children?: ReactNode
  }
  
const Card: React.FC<CardProps> = (props: CardProps): React.JSX.Element => {
  const { className, children } = props

  return (
    <div
      className={`
        flex-[20%]
        p-3
        rounded-xl
        shadow-md
        border-1
        border-black
        bg-white
        min-h-[150px]

        ${className}
      `}
    >
      {children}
    </div>
  )
}

export default Card