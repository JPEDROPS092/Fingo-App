"use client"

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const pathname = usePathname()

  // List of public routes that don't require authentication
  const publicRoutes = ['/login', '/signup', '/forgot-password']
  const isPublicRoute = publicRoutes.includes(pathname)

  useEffect(() => {
    const checkAuth = () => {
      try {
        // Check if we have a token in localStorage directly
        const token = typeof window !== 'undefined' ? localStorage.getItem('financeAppToken') : null
        
        // If we're on a protected route and have no token, redirect to login
        if (!isPublicRoute && !token) {
          console.log('No auth token found, redirecting to login')
          window.location.href = '/login'
          return
        }
        
        // Set authentication state
        setIsAuthenticated(!!token)
        // Allow rendering
        setLoading(false)
      } catch (error) {
        console.error('Auth check error:', error)
        // If there's an error, redirect to login for safety
        if (!isPublicRoute) {
          window.location.href = '/login'
        }
      }
    }
    
    // Small delay to ensure the component is fully mounted
    const timer = setTimeout(() => {
      checkAuth()
    }, 100)
    
    return () => clearTimeout(timer)
  }, [pathname, isPublicRoute])

  // Show loading spinner while checking auth
  if (loading && !isPublicRoute) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-white dark:bg-[#0F0F12]">
        <div className="flex flex-col items-center">
          <div className="h-16 w-16 animate-spin rounded-full border-t-4 border-b-4 border-blue-600 dark:border-blue-400 mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300 text-sm">Loading...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
