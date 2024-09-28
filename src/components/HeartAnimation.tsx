import React from 'react'

interface HeartAnimationProps {
  className?: string
}

export const HeartAnimation: React.FC<HeartAnimationProps> = ({ className }) => {
  return (
    <div className={`heart-animation ${className || ''}`}>
      {/* Implementação da animação do coração */}
    </div>
  )
}