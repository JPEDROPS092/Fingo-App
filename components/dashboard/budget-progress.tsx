"use client"

import { useState } from "react"
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { 
  Plus, 
  Filter, 
  Calendar, 
  Tag, 
  Briefcase, 
  Building2 
} from "lucide-react"
import { formatCurrency } from "@/lib/utils"

interface Budget {
  id: string
  title: string
  amount: number
  spent: number
  remaining: number
  percentage_used: number
  category_name: string
  period: string
  organization_name: string | null
  project_name: string | null
}

interface BudgetProgressProps {
  budgets: Budget[]
}

export function BudgetProgress({ budgets }: BudgetProgressProps) {
  const [filter, setFilter] = useState<string | null>(null)
  
  // Get color based on percentage used
  const getProgressColor = (percentage: number) => {
    if (percentage < 50) return "bg-green-500"
    if (percentage < 80) return "bg-yellow-500"
    return "bg-red-500"
  }

  // Get icon based on category name
  const getCategoryIcon = (categoryName: string) => {
    const lowerCaseName = categoryName?.toLowerCase() || ""
    
    if (lowerCaseName.includes("food") || lowerCaseName.includes("grocery")) {
      return "🍔"
    } else if (lowerCaseName.includes("transport") || lowerCaseName.includes("travel")) {
      return "🚗"
    } else if (lowerCaseName.includes("housing") || lowerCaseName.includes("rent")) {
      return "🏠"
    } else if (lowerCaseName.includes("entertainment") || lowerCaseName.includes("leisure")) {
      return "🎬"
    } else if (lowerCaseName.includes("health") || lowerCaseName.includes("medical")) {
      return "🏥"
    } else if (lowerCaseName.includes("education") || lowerCaseName.includes("school")) {
      return "📚"
    } else if (lowerCaseName.includes("shopping") || lowerCaseName.includes("clothing")) {
      return "🛍️"
    } else if (lowerCaseName.includes("utility") || lowerCaseName.includes("bill")) {
      return "💡"
    } else {
      return "💰"
    }
  }

  // Filter budgets if needed
  const filteredBudgets = filter 
    ? budgets.filter(budget => {
        if (filter === 'monthly') return budget.period === 'Monthly'
        if (filter === 'quarterly') return budget.period === 'Quarterly'
        if (filter === 'yearly') return budget.period === 'Yearly'
        return true
      })
    : budgets

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-medium">Budget Management</h3>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Filter className="h-3.5 w-3.5" />
            <div className="flex gap-1">
              <Button 
                variant={filter === null ? "secondary" : "ghost"} 
                size="sm" 
                onClick={() => setFilter(null)}
              >
                All
              </Button>
              <Button 
                variant={filter === 'monthly' ? "secondary" : "ghost"} 
                size="sm" 
                onClick={() => setFilter('monthly')}
              >
                Monthly
              </Button>
              <Button 
                variant={filter === 'quarterly' ? "secondary" : "ghost"} 
                size="sm" 
                onClick={() => setFilter('quarterly')}
              >
                Quarterly
              </Button>
              <Button 
                variant={filter === 'yearly' ? "secondary" : "ghost"} 
                size="sm" 
                onClick={() => setFilter('yearly')}
              >
                Yearly
              </Button>
            </div>
          </div>
        </div>
        <Button size="sm" className="flex items-center gap-1">
          <Plus className="h-4 w-4" />
          <span>New Budget</span>
        </Button>
      </div>
      
      {filteredBudgets.length === 0 ? (
        <div className="text-center p-6 border rounded-lg bg-muted/20">
          <p className="text-muted-foreground">No budgets found. Create your first budget to start tracking expenses.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredBudgets.map((budget) => (
            <Card key={budget.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-base">{budget.title}</CardTitle>
                    <CardDescription className="flex items-center gap-1 mt-1">
                      <Tag className="h-3.5 w-3.5" />
                      <span>{budget.category_name || 'General'}</span>
                      <span className="mx-1">•</span>
                      <Calendar className="h-3.5 w-3.5" />
                      <span>{budget.period}</span>
                    </CardDescription>
                  </div>
                  <div className="text-2xl">{getCategoryIcon(budget.category_name)}</div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Budget</span>
                    <span className="font-medium">{formatCurrency(budget.amount)}</span>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Spent</span>
                      <span className="font-medium">{formatCurrency(budget.spent)}</span>
                    </div>
                    <Progress 
                      value={budget.percentage_used} 
                      className={`h-2 ${getProgressColor(budget.percentage_used)}`} 
                    />
                    <div className="flex justify-between text-xs">
                      <span>{budget.percentage_used}% used</span>
                      <span>{formatCurrency(budget.remaining)} remaining</span>
                    </div>
                  </div>
                  
                  {(budget.organization_name || budget.project_name) && (
                    <div className="pt-2 text-xs text-muted-foreground border-t flex flex-col gap-1">
                      {budget.organization_name && (
                        <div className="flex items-center gap-1">
                          <Building2 className="h-3 w-3" />
                          <span>{budget.organization_name}</span>
                        </div>
                      )}
                      {budget.project_name && (
                        <div className="flex items-center gap-1">
                          <Briefcase className="h-3 w-3" />
                          <span>{budget.project_name}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
