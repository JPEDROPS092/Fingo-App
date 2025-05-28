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
  Building2,
  RefreshCw
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
  isLoading?: boolean
}

export function BudgetProgress({ budgets, isLoading = false }: BudgetProgressProps) {
  const [filter, setFilter] = useState<string | null>(null)
  
  // Obter cor baseada na porcentagem utilizada
  const getProgressColor = (percentage: number) => {
    if (percentage < 50) return "bg-green-500"
    if (percentage < 80) return "bg-yellow-500"
    return "bg-red-500"
  }

  // Obter ícone baseado no nome da categoria
  const getCategoryIcon = (categoryName: string) => {
    const lowerCaseName = categoryName?.toLowerCase() || ""
    
    if (lowerCaseName.includes("food") || lowerCaseName.includes("grocery") || 
        lowerCaseName.includes("alimentação") || lowerCaseName.includes("comida") || 
        lowerCaseName.includes("mercado")) {
      return "🍔"
    } else if (lowerCaseName.includes("transport") || lowerCaseName.includes("travel") ||
               lowerCaseName.includes("transporte") || lowerCaseName.includes("viagem")) {
      return "🚗"
    } else if (lowerCaseName.includes("housing") || lowerCaseName.includes("rent") ||
               lowerCaseName.includes("moradia") || lowerCaseName.includes("aluguel")) {
      return "🏠"
    } else if (lowerCaseName.includes("entertainment") || lowerCaseName.includes("leisure") ||
               lowerCaseName.includes("entretenimento") || lowerCaseName.includes("lazer")) {
      return "🎬"
    } else if (lowerCaseName.includes("health") || lowerCaseName.includes("medical") ||
               lowerCaseName.includes("saúde") || lowerCaseName.includes("médico")) {
      return "🏥"
    } else if (lowerCaseName.includes("education") || lowerCaseName.includes("school") ||
               lowerCaseName.includes("educação") || lowerCaseName.includes("escola")) {
      return "📚"
    } else if (lowerCaseName.includes("shopping") || lowerCaseName.includes("clothing") ||
               lowerCaseName.includes("compras") || lowerCaseName.includes("roupa")) {
      return "🛍️"
    } else if (lowerCaseName.includes("utility") || lowerCaseName.includes("bill") ||
               lowerCaseName.includes("utilidade") || lowerCaseName.includes("conta")) {
      return "💡"
    } else {
      return "💰"
    }
  }

  // Traduzir o período do orçamento
  const translatePeriod = (period: string) => {
    switch (period.toLowerCase()) {
      case 'monthly':
        return 'Mensal';
      case 'quarterly':
        return 'Trimestral';
      case 'yearly':
        return 'Anual';
      case 'weekly':
        return 'Semanal';
      default:
        return period;
    }
  }

  // Filtrar orçamentos se necessário
  const filteredBudgets = filter 
    ? budgets.filter(budget => {
        if (filter === 'monthly') return budget.period.toLowerCase() === 'monthly'
        if (filter === 'quarterly') return budget.period.toLowerCase() === 'quarterly'
        if (filter === 'yearly') return budget.period.toLowerCase() === 'yearly'
        return true
      })
    : budgets

  // Se estiver carregando, mostrar indicador
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <RefreshCw className="h-10 w-10 animate-spin text-muted-foreground mb-4" />
        <p className="text-muted-foreground">Carregando orçamentos...</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-medium">Gerenciamento de Orçamentos</h3>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Filter className="h-3.5 w-3.5" />
            <div className="flex gap-1">
              <Button 
                variant={filter === null ? "secondary" : "ghost"} 
                size="sm" 
                onClick={() => setFilter(null)}
              >
                Todos
              </Button>
              <Button 
                variant={filter === 'monthly' ? "secondary" : "ghost"} 
                size="sm" 
                onClick={() => setFilter('monthly')}
              >
                Mensal
              </Button>
              <Button 
                variant={filter === 'quarterly' ? "secondary" : "ghost"} 
                size="sm" 
                onClick={() => setFilter('quarterly')}
              >
                Trimestral
              </Button>
              <Button 
                variant={filter === 'yearly' ? "secondary" : "ghost"} 
                size="sm" 
                onClick={() => setFilter('yearly')}
              >
                Anual
              </Button>
            </div>
          </div>
        </div>
        <Button size="sm" className="flex items-center gap-1">
          <Plus className="h-4 w-4" />
          <span>Novo Orçamento</span>
        </Button>
      </div>
      
      {filteredBudgets.length === 0 ? (
        <div className="text-center p-6 border rounded-lg bg-muted/20">
          <p className="text-muted-foreground">
            Nenhum orçamento encontrado. Crie seu primeiro orçamento para começar a acompanhar despesas.
          </p>
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
                      <span>{budget.category_name || 'Geral'}</span>
                      <span className="mx-1">•</span>
                      <Calendar className="h-3.5 w-3.5" />
                      <span>{translatePeriod(budget.period)}</span>
                    </CardDescription>
                  </div>
                  <div className="text-2xl">{getCategoryIcon(budget.category_name)}</div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Orçamento</span>
                    <span className="font-medium">R$ {formatCurrency(budget.amount)}</span>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Gasto</span>
                      <span className="font-medium">R$ {formatCurrency(budget.spent)}</span>
                    </div>
                    <Progress 
                      value={budget.percentage_used} 
                      className={`h-2 ${getProgressColor(budget.percentage_used)}`} 
                    />
                    <div className="flex justify-between text-xs">
                      <span>{budget.percentage_used}% utilizado</span>
                      <span>R$ {formatCurrency(budget.remaining)} restante</span>
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
