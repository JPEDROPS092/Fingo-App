"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function DashboardWrapper({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = () => {
      try {
        const token = localStorage.getItem('financeAppToken')
        
        if (!token) {
          console.log('No token found, redirecting to login')
          window.location.href = '/login'
          return
        }
        
        setIsAuthenticated(true)
        setIsLoading(false)
      } catch (error) {
        console.error('Auth check error:', error)
        window.location.href = '/login'
      }
    }
    
    // Small delay to ensure the component is fully mounted
    const timer = setTimeout(() => {
      checkAuth()
    }, 100)
    
    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-white dark:bg-[#0F0F12]">
        <div className="flex flex-col items-center">
          <div className="h-16 w-16 animate-spin rounded-full border-t-4 border-b-4 border-blue-600 dark:border-blue-400 mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300 text-sm">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return <>{children}</>
}
