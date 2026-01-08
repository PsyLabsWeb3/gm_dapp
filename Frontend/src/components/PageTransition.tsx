/**
 * PageTransition - Serpiente Emplumada (Quetzalcóatl) animation
 * Sinuous, undulating movement like a feathered serpent
 */

import { useLocation } from 'react-router-dom'
import { useEffect, useState, type ReactNode } from 'react'

interface PageTransitionProps {
    children: ReactNode
}

export function PageTransition({ children }: PageTransitionProps) {
    const location = useLocation()
    const [isAnimating, setIsAnimating] = useState(true)
    const [displayChildren, setDisplayChildren] = useState(children)

    useEffect(() => {
        // Start animation on route change
        setIsAnimating(true)

        // Small delay to ensure animation starts fresh
        const timer = setTimeout(() => {
            setDisplayChildren(children)
        }, 50)

        // Reset animation after it completes
        const animationTimer = setTimeout(() => {
            setIsAnimating(false)
        }, 600)

        return () => {
            clearTimeout(timer)
            clearTimeout(animationTimer)
        }
    }, [location.pathname, children])

    return (
        <div
            className="w-full h-full"
            style={{
                animation: isAnimating ? 'serpentEnter 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards' : 'none',
            }}
        >
            {displayChildren}
        </div>
    )
}
