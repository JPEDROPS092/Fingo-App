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
  DollarSign,
  RefreshCw
} from "lucide-react"
import { Overview } from "@/components/dashboard/overview"
import { RecentTransactions } from "@/components/dashboard/recent-transactions"
import { BudgetProgress } from "@/components/dashboard/budget-progress"
import { OrganizationSelector } from "@/components/dashboard/organization-selector"
import { ProjectsList } from "@/components/dashboard/projects-list"
import { accountsService, transactionsService, goalsService } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

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
  const [accountsData, setAccountsData] = useState({
    accounts: [],
    total_balance: 0
  })
  const [goalsData, setGoalsData] = useState({
    goals: [],
    completed_goals: 0,
    in_progress_goals: 0
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Função para buscar todos os dados necessários para o dashboard
  const fetchDashboardData = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      // Buscar estatísticas de transações
      const transactionsResponse = await transactionsService.getStats();
      if (transactionsResponse.success) {
        setSummaryData({
          income: transactionsResponse.data.income || 0,
          expenses: transactionsResponse.data.expenses || 0,
          balance: transactionsResponse.data.balance || 0,
          top_expense_categories: transactionsResponse.data.top_expense_categories || [],
          recent_transactions: transactionsResponse.data.recent_transactions || []
        });
      } else {
        console.error('Erro ao buscar estatísticas de transações:', transactionsResponse.error);
        setError('Não foi possível carregar os dados de transações');
      }
      
      // Buscar informações de contas
      const accountsResponse = await accountsService.getStats();
      if (accountsResponse.success) {
        setAccountsData({
          accounts: accountsResponse.data.accounts || [],
          total_balance: accountsResponse.data.total_balance || 0
        });
      } else {
        console.error('Erro ao buscar dados de contas:', accountsResponse.error);
      }
      
      // Buscar resumo de metas
      const goalsResponse = await goalsService.getSummary();
      if (goalsResponse.success && goalsResponse.data) {
        setGoalsData({
          goals: goalsResponse.data.goals || [],
          completed_goals: goalsResponse.data.completed_goals || 0,
          in_progress_goals: goalsResponse.data.in_progress_goals || 0
        });
      }
      
    } catch (err) {
      console.error('Erro ao buscar dados do dashboard:', err);
      setError('Ocorreu um erro ao carregar os dados do dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Buscar dados do dashboard ao montar o componente ou quando a organização ativa muda
    fetchDashboardData();
  }, [activeOrg]);

  const handleOrganizationChange = (orgId: string | null) => {
    setActiveOrg(orgId);
  };

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Painel Financeiro</h2>
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            onClick={fetchDashboardData} 
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Atualizar</span>
          </Button>
          <OrganizationSelector onOrganizationChange={handleOrganizationChange} />
        </div>
      </div>
      
      {error && (
        <Alert variant="destructive" className="my-4">
          <AlertTitle>Erro</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <PieChart className="h-4 w-4" />
            <span>Visão Geral</span>
          </TabsTrigger>
          <TabsTrigger value="projects" className="flex items-center gap-2">
            <Briefcase className="h-4 w-4" />
            <span>Projetos</span>
          </TabsTrigger>
          <TabsTrigger value="budgets" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            <span>Orçamentos</span>
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span>Relatórios</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Receita Total
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">R$ {summaryData.income.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">
                  Este mês
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Despesas Totais
                </CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">R$ {summaryData.expenses.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">
                  Este mês
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Saldo Líquido
                </CardTitle>
                <Wallet className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${summaryData.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  R$ {summaryData.balance.toFixed(2)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Este mês
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Uso do Orçamento
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{budgetData.percentage_used}%</div>
                <p className="text-xs text-muted-foreground">
                  Do orçamento total
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Receitas vs Despesas</CardTitle>
                <CardDescription>
                  Visão geral financeira para o mês atual
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <Overview isLoading={isLoading} />
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Transações Recentes</CardTitle>
                <CardDescription>
                  Atividade financeira mais recente
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RecentTransactions 
                  transactions={summaryData.recent_transactions} 
                  isLoading={isLoading} 
                />
              </CardContent>
            </Card>
          </div>
          
          {/* Seção de Metas Financeiras */}
          <Card>
            <CardHeader>
              <CardTitle>Metas Financeiras</CardTitle>
              <CardDescription>
                Acompanhamento do progresso das suas metas financeiras
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                {goalsData.goals.slice(0, 3).map((goal: any) => (
                  <Card key={goal.id}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">{goal.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-2">
                        <div className="text-xs text-muted-foreground mb-1">
                          Progresso: {goal.progress}%
                        </div>
                        <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                          <div 
                            className="h-2 bg-blue-600 rounded-full" 
                            style={{ width: `${goal.progress}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="flex justify-between text-xs mt-2">
                        <span>R$ {goal.current_amount}</span>
                        <span>Meta: R$ {goal.target_amount}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                {goalsData.goals.length === 0 && !isLoading && (
                  <div className="col-span-3 text-center py-6 text-muted-foreground">
                    Você ainda não criou nenhuma meta financeira.
                  </div>
                )}
                
                {isLoading && (
                  <div className="col-span-3 flex justify-center py-6">
                    <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="projects" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Projetos</CardTitle>
              <CardDescription>
                Gerencie suas finanças de projetos
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
              <CardTitle>Gerenciamento de Orçamento</CardTitle>
              <CardDescription>
                Acompanhe suas alocações e gastos de orçamento
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BudgetProgress budgets={budgetData.budgets} isLoading={isLoading} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Relatórios Financeiros</CardTitle>
              <CardDescription>
                Gere e visualize relatórios financeiros
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0">
                    <CardTitle className="text-sm font-medium">
                      Demonstrativo de Resultados
                    </CardTitle>
                    <FileText className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground">
                      Visualize receitas, despesas e lucro/prejuízo
                    </p>
                  </CardContent>
                </Card>
                <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0">
                    <CardTitle className="text-sm font-medium">
                      Relatório de Despesas
                    </CardTitle>
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground">
                      Analise categorias de despesas e gastos
                    </p>
                  </CardContent>
                </Card>
                <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0">
                    <CardTitle className="text-sm font-medium">
                      Fluxo de Caixa
                    </CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground">
                      Acompanhe a movimentação de dinheiro ao longo do tempo
                    </p>
                  </CardContent>
                </Card>
                <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0">
                    <CardTitle className="text-sm font-medium">
                      Análise de Orçamento
                    </CardTitle>
                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground">
                      Compare orçamentos com gastos reais
                    </p>
                  </CardContent>
                </Card>
                <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0">
                    <CardTitle className="text-sm font-medium">
                      Finanças do Projeto
                    </CardTitle>
                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground">
                      Análise financeira por projeto
                    </p>
                  </CardContent>
                </Card>
                <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0">
                    <CardTitle className="text-sm font-medium">
                      Relatório Fiscal
                    </CardTitle>
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground">
                      Acompanhe despesas dedutíveis de impostos
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
