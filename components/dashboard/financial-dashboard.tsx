"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Building2, 
  Briefcase, 
  PieChart, 
  FileText, 
  CreditCard, 
  Wallet, 
  TrendingUp, 
  BarChart3,
  DollarSign
} from "lucide-react"
import { Overview } from "@/components/dashboard/overview"
import { RecentTransactions } from "@/components/dashboard/recent-transactions"
import { BudgetProgress } from "@/components/dashboard/budget-progress"
import { OrganizationSelector } from "@/components/dashboard/organization-selector"
import { ProjectsList } from "@/components/dashboard/projects-list"

export function FinancialDashboard() {
  const [activeOrg, setActiveOrg] = useState<string | null>(null)
  const [summaryData, setSummaryData] = useState({
    income: 0,
    expenses: 0,
    balance: 0,
    top_expense_categories: [],
    recent_transactions: []
  })
  const [budgetData, setBudgetData] = useState({
    total_budget: 0,
    total_spent: 0,
    total_remaining: 0,
    percentage_used: 0,
    budgets: []
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Fetch financial summary data
    const fetchSummaryData = async () => {
      setIsLoading(true)
      try {
        const params = new URLSearchParams()
        params.append('period', 'month')
        if (activeOrg) {
          params.append('organization', activeOrg)
        }
        
        const response = await fetch(`/api/transactions/summary/?${params.toString()}`, {
          headers: {
            'Authorization': `Token ${localStorage.getItem('token')}`
          }
        })
        
        if (response.ok) {
          const data = await response.json()
          setSummaryData(data)
        }
      } catch (error) {
        console.error('Error fetching summary data:', error)
      }
      
      // Fetch budget data
      try {
        const params = new URLSearchParams()
        if (activeOrg) {
          params.append('organization', activeOrg)
        }
        
        const response = await fetch(`/api/budgets/summary/?${params.toString()}`, {
          headers: {
            'Authorization': `Token ${localStorage.getItem('token')}`
          }
        })
        
        if (response.ok) {
          const data = await response.json()
          setBudgetData(data)
        }
      } catch (error) {
        console.error('Error fetching budget data:', error)
      }
      
      setIsLoading(false)
    }
    
    fetchSummaryData()
  }, [activeOrg])

  const handleOrganizationChange = (orgId: string | null) => {
    setActiveOrg(orgId)
  }

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Financial Dashboard</h2>
        <OrganizationSelector onOrganizationChange={handleOrganizationChange} />
      </div>
      
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <PieChart className="h-4 w-4" />
            <span>Overview</span>
          </TabsTrigger>
          <TabsTrigger value="projects" className="flex items-center gap-2">
            <Briefcase className="h-4 w-4" />
            <span>Projects</span>
          </TabsTrigger>
          <TabsTrigger value="budgets" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            <span>Budgets</span>
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span>Reports</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Income
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${summaryData.income.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">
                  This month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Expenses
                </CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${summaryData.expenses.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">
                  This month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Net Balance
                </CardTitle>
                <Wallet className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${summaryData.balance.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">
                  This month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Budget Usage
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{budgetData.percentage_used}%</div>
                <p className="text-xs text-muted-foreground">
                  Of total budget
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Income vs Expenses</CardTitle>
                <CardDescription>
                  Financial overview for the current month
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <Overview />
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>
                  Latest financial activity
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RecentTransactions transactions={summaryData.recent_transactions} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="projects" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Projects</CardTitle>
              <CardDescription>
                Manage your project finances
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ProjectsList organizationId={activeOrg} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="budgets" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Budget Management</CardTitle>
              <CardDescription>
                Track your budget allocations and spending
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BudgetProgress budgets={budgetData.budgets} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Financial Reports</CardTitle>
              <CardDescription>
                Generate and view financial reports
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card className="cursor-pointer hover:bg-muted/50">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0">
                    <CardTitle className="text-sm font-medium">
                      Income Statement
                    </CardTitle>
                    <FileText className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground">
                      View income, expenses, and profit/loss
                    </p>
                  </CardContent>
                </Card>
                <Card className="cursor-pointer hover:bg-muted/50">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0">
                    <CardTitle className="text-sm font-medium">
                      Expense Report
                    </CardTitle>
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground">
                      Analyze expense categories and spending
                    </p>
                  </CardContent>
                </Card>
                <Card className="cursor-pointer hover:bg-muted/50">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0">
                    <CardTitle className="text-sm font-medium">
                      Cash Flow
                    </CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground">
                      Track money movement over time
                    </p>
                  </CardContent>
                </Card>
                <Card className="cursor-pointer hover:bg-muted/50">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0">
                    <CardTitle className="text-sm font-medium">
                      Budget Analysis
                    </CardTitle>
                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground">
                      Compare budgets with actual spending
                    </p>
                  </CardContent>
                </Card>
                <Card className="cursor-pointer hover:bg-muted/50">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0">
                    <CardTitle className="text-sm font-medium">
                      Project Finance
                    </CardTitle>
                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground">
                      Financial analysis by project
                    </p>
                  </CardContent>
                </Card>
                <Card className="cursor-pointer hover:bg-muted/50">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0">
                    <CardTitle className="text-sm font-medium">
                      Tax Report
                    </CardTitle>
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground">
                      Track tax-deductible expenses
                    </p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
