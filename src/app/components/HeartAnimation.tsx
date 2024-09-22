import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

function FacebookHeart() {
    const [position, setPosition] = useState({ x: 0, y: 0 })

    useEffect(() => {
        setPosition({
            x: Math.random() * 80 + 10, // Entre 10% e 90% da largura
            y: Math.random() * 80 + 10  // Entre 10% e 90% da altura
        })
    }, [])

    return (
        <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
                scale: [0, 1.2, 1],
                opacity: [0, 0.6, 0.6],
                y: [0, -20, -30]
            }}
            transition={{
                duration: 1.5, // Aumentada a duração para 1.5 segundos
                ease: "easeInOut", // Mudado para easeInOut para uma transição mais suave
                times: [0, 0.3, 1] // Ajustado para que o pico da animação ocorra mais cedo
            }}
            className="absolute"
            style={{
                left: `${position.x}%`,
                top: `${position.y}%`,
            }}
        >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="#E0245E"/>
            </svg>
        </motion.div>
    )
}

export function HeartAnimation() {
    const [hearts, setHearts] = useState<number[]>([])

    useEffect(() => {
        const interval = setInterval(() => {
            setHearts(prev => [...prev, Date.now()])
            setTimeout(() => {
                setHearts(prev => prev.slice(1))
            }, 1500) // Aumentado para 1500ms para corresponder à nova duração da animação
        }, 700) // Aumentado o intervalo para 700ms para reduzir ainda mais a quantidade de corações

        return () => clearInterval(interval)
    }, [])

    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {hearts.map(key => (
                <FacebookHeart key={key} />
            ))}
        </div>
    )
}