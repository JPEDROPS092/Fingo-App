"use client"

import { useState, useEffect } from "react"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Plus, Eye, Edit } from "lucide-react"
import { formatCurrency } from "@/lib/utils"

interface Project {
  id: string
  name: string
  description: string
  status: string
  budget: number
  budget_spent: number
  budget_remaining: number
  budget_percentage: number
  start_date: string
  end_date: string | null
}

interface ProjectsListProps {
  organizationId: string | null
}

export function ProjectsList({ organizationId }: ProjectsListProps) {
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true)
      try {
        const params = new URLSearchParams()
        if (organizationId) {
          params.append('organization', organizationId)
        }
        
        const response = await fetch(`/api/organizations/projects/?${params.toString()}`, {
          headers: {
            'Authorization': `Token ${localStorage.getItem('token')}`
          }
        })
        
        if (response.ok) {
          const data = await response.json()
          setProjects(data.results || [])
        }
      } catch (error) {
        console.error('Error fetching projects:', error)
      }
      setIsLoading(false)
    }
    
    fetchProjects()
  }, [organizationId])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planning':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      case 'on_hold':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
      case 'completed':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
    }
  }

  const formatStatus = (status: string) => {
    return status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
  }

  if (isLoading) {
    return <div className="flex justify-center p-4">Loading projects...</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Active Projects</h3>
        <Button size="sm" className="flex items-center gap-1">
          <Plus className="h-4 w-4" />
          <span>New Project</span>
        </Button>
      </div>
      
      {projects.length === 0 ? (
        <div className="text-center p-6 border rounded-lg bg-muted/20">
          <p className="text-muted-foreground">No projects found. Create your first project to start tracking finances.</p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Project</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Budget</TableHead>
              <TableHead>Progress</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.map((project) => (
              <TableRow key={project.id}>
                <TableCell className="font-medium">
                  <div>
                    <div>{project.name}</div>
                    <div className="text-xs text-muted-foreground">{project.description}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={getStatusColor(project.status)} variant="outline">
                    {formatStatus(project.status)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="font-medium">{formatCurrency(project.budget)}</div>
                  <div className="text-xs text-muted-foreground">
                    {formatCurrency(project.budget_spent)} spent
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <Progress value={project.budget_percentage} className="h-2" />
                    <div className="text-xs text-muted-foreground">
                      {project.budget_percentage}% of budget used
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  )
}
