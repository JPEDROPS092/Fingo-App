"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, ArrowRight, Wallet, PieChart, Target, Bell } from "lucide-react"
import Link from "next/link"

export default function WelcomePage() {
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [currentStep, setCurrentStep] = useState(0)
  const router = useRouter()
  
  // Steps for the onboarding process
  const steps = [
    {
      title: "Bem-vindo ao FinanceAPP",
      description: "Sua jornada para uma vida financeira organizada começa aqui. Vamos configurar sua conta em poucos passos.",
      icon: <Wallet className="h-12 w-12 text-blue-500" />,
    },
    {
      title: "Configure suas contas",
      description: "Adicione suas contas bancárias, cartões de crédito e outros ativos para começar a rastrear seu dinheiro.",
      icon: <PieChart className="h-12 w-12 text-blue-500" />,
    },
    {
      title: "Defina suas metas",
      description: "Estabeleça metas financeiras para economizar para grandes compras, aposentadoria ou fundo de emergência.",
      icon: <Target className="h-12 w-12 text-blue-500" />,
    },
    {
      title: "Configure notificações",
      description: "Receba alertas sobre faturas, metas atingidas e dicas para melhorar sua saúde financeira.",
      icon: <Bell className="h-12 w-12 text-blue-500" />,
    }
  ]

  useEffect(() => {
    // Check if user is authenticated
    try {
      const userJson = localStorage.getItem('financeAppUser')
      if (userJson) {
        const userData = JSON.parse(userJson)
        setCurrentUser(userData)
      } else {
        // Redirect to login if no user found
        router.replace('/login')
      }
    } catch (error) {
      console.error('Error loading user data:', error)
      router.replace('/login')
    }
  }, [router])

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      // Completed all steps, redirect to dashboard
      router.push('/dashboard')
    }
  }

  const handleSkip = () => {
    // Skip onboarding and go directly to dashboard
    router.push('/dashboard')
  }

  if (!currentUser) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-white dark:bg-[#0F0F12]">
        <div className="flex flex-col items-center">
          <div className="h-16 w-16 animate-spin rounded-full border-t-4 border-b-4 border-blue-600 dark:border-blue-400 mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300 text-sm">Carregando...</p>
        </div>
      </div>
    )
  }

  const currentStepData = steps[currentStep]
  const isLastStep = currentStep === steps.length - 1

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-[#0F0F12] p-4">
      <div className="w-full max-w-md">
        <Card className="border-none shadow-lg">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4">
              {currentStepData.icon}
            </div>
            <CardTitle className="text-2xl font-bold">{currentStepData.title}</CardTitle>
            <CardDescription className="text-gray-500 dark:text-gray-400">
              {currentStepData.description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center space-x-2 mb-6">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 w-16 rounded-full ${
                    index <= currentStep ? 'bg-blue-500' : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                />
              ))}
            </div>

            {currentStep === 0 && (
              <div className="space-y-4">
                <p className="text-center">
                  Olá, <span className="font-bold">{currentUser.username}</span>! Estamos felizes em tê-lo conosco.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Check className="mr-2 h-5 w-5 text-green-500" />
                    <span>Rastreie suas despesas e receitas</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="mr-2 h-5 w-5 text-green-500" />
                    <span>Visualize relatórios detalhados</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="mr-2 h-5 w-5 text-green-500" />
                    <span>Defina e acompanhe metas financeiras</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="mr-2 h-5 w-5 text-green-500" />
                    <span>Receba dicas personalizadas</span>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 1 && (
              <div className="space-y-4">
                <p>
                  Conecte suas contas bancárias para começar a rastrear automaticamente suas finanças.
                  Você também pode adicionar contas manualmente.
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" className="h-24 flex flex-col items-center justify-center">
                    <span className="font-bold mb-1">Banco</span>
                    <span className="text-xs text-gray-500">Conectar conta</span>
                  </Button>
                  <Button variant="outline" className="h-24 flex flex-col items-center justify-center">
                    <span className="font-bold mb-1">Cartão</span>
                    <span className="text-xs text-gray-500">Adicionar cartão</span>
                  </Button>
                  <Button variant="outline" className="h-24 flex flex-col items-center justify-center">
                    <span className="font-bold mb-1">Investimento</span>
                    <span className="text-xs text-gray-500">Rastrear ativos</span>
                  </Button>
                  <Button variant="outline" className="h-24 flex flex-col items-center justify-center">
                    <span className="font-bold mb-1">Outros</span>
                    <span className="text-xs text-gray-500">Adicionar manualmente</span>
                  </Button>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-4">
                <p>
                  Defina metas financeiras para ajudá-lo a economizar para o que é importante.
                </p>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-between">
                    <span>Fundo de emergência</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" className="w-full justify-between">
                    <span>Viagem dos sonhos</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" className="w-full justify-between">
                    <span>Aposentadoria</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" className="w-full justify-between">
                    <span>Criar meta personalizada</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-4">
                <p>
                  Configure notificações para manter-se informado sobre sua situação financeira.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span>Alertas de faturas</span>
                    <div className="flex items-center">
                      <input type="checkbox" id="bills" className="mr-2" defaultChecked />
                      <label htmlFor="bills">Ativar</label>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Alertas de orçamento</span>
                    <div className="flex items-center">
                      <input type="checkbox" id="budget" className="mr-2" defaultChecked />
                      <label htmlFor="budget">Ativar</label>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Dicas financeiras</span>
                    <div className="flex items-center">
                      <input type="checkbox" id="tips" className="mr-2" defaultChecked />
                      <label htmlFor="tips">Ativar</label>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Relatórios semanais</span>
                    <div className="flex items-center">
                      <input type="checkbox" id="reports" className="mr-2" defaultChecked />
                      <label htmlFor="reports">Ativar</label>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="ghost" onClick={handleSkip}>
              Pular
            </Button>
            <Button onClick={handleNext}>
              {isLastStep ? "Concluir" : "Próximo"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
