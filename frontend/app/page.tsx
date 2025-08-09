"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Check, BarChart, PieChart, Wallet, Shield } from "lucide-react"

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = () => {
      try {
        const token = localStorage.getItem('financeAppToken')
        if (token) {
          setIsAuthenticated(true)
          router.replace('/dashboard')
        } else {
          setIsAuthenticated(false)
          setIsLoading(false)
        }
      } catch (error) {
        console.error('Auth check error:', error)
        setIsAuthenticated(false)
        setIsLoading(false)
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
          <p className="text-gray-600 dark:text-gray-300 text-sm">Carregando...</p>
        </div>
      </div>
    )
  }

  if (isAuthenticated) {
    return null // Will redirect in useEffect
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header/Navigation */}
      <header className="sticky top-0 z-40 w-full border-b bg-white dark:bg-[#0F0F12] dark:border-gray-800">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <Wallet className="h-6 w-6 text-blue-600" />
            <span className="text-xl font-bold">FinanceAPP</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="#features" className="text-sm font-medium hover:text-blue-600 transition-colors">
              Recursos
            </Link>
            <Link href="#testimonials" className="text-sm font-medium hover:text-blue-600 transition-colors">
              Depoimentos
            </Link>
            <Link href="#pricing" className="text-sm font-medium hover:text-blue-600 transition-colors">
              Planos
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="outline" size="sm">
                Entrar
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="sm">
                Cadastrar
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-[#0F0F12]">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:gap-16">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Organize suas finanças com facilidade
                </h1>
                <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                  Acompanhe seus gastos, defina metas e tome decisões financeiras inteligentes com o FinanceAPP.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/signup">
                  <Button size="lg" className="gap-1">
                    Comece Agora
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/login">
                  <Button size="lg" variant="outline">
                    Já tenho uma conta
                  </Button>
                </Link>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="relative w-full max-w-[500px] aspect-video overflow-hidden rounded-xl border bg-white shadow-xl dark:border-gray-800 dark:bg-gray-950">
                <div className="p-6 flex flex-col gap-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-bold">Resumo Financeiro</h3>
                      <p className="text-sm text-gray-500">Abril 2025</p>
                    </div>
                    <div className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 px-3 py-1 rounded-full text-sm font-medium">
                      Saldo: R$ 5.280,00
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Receitas</p>
                      <p className="text-xl font-bold text-green-600 dark:text-green-400">R$ 8.500,00</p>
                    </div>
                    <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Despesas</p>
                      <p className="text-xl font-bold text-red-600 dark:text-red-400">R$ 3.220,00</p>
                    </div>
                  </div>
                  <div className="h-32 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                    <BarChart className="h-24 w-24 text-gray-400" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-blue-100 px-3 py-1 text-sm dark:bg-blue-800">
                Recursos
              </div>
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                Tudo o que você precisa para gerenciar suas finanças
              </h2>
              <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                Nossa plataforma oferece ferramentas poderosas para ajudá-lo a controlar seus gastos, economizar dinheiro e alcançar seus objetivos financeiros.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mt-8">
            <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm dark:border-gray-800">
              <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900/20">
                <Wallet className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-bold">Controle de Gastos</h3>
              <p className="text-center text-gray-500 dark:text-gray-400">
                Acompanhe todas as suas despesas e receitas em um só lugar, com categorização automática.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm dark:border-gray-800">
              <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900/20">
                <PieChart className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-bold">Relatórios Detalhados</h3>
              <p className="text-center text-gray-500 dark:text-gray-400">
                Visualize gráficos e relatórios personalizados para entender melhor seus hábitos financeiros.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm dark:border-gray-800">
              <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900/20">
                <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-bold">Segurança Total</h3>
              <p className="text-center text-gray-500 dark:text-gray-400">
                Seus dados financeiros estão protegidos com a mais alta tecnologia de criptografia e segurança.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="w-full py-12 md:py-24 lg:py-32 bg-gray-50 dark:bg-gray-900">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-blue-100 px-3 py-1 text-sm dark:bg-blue-800">
                Depoimentos
              </div>
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                O que nossos usuários dizem
              </h2>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mt-8">
            <div className="flex flex-col space-y-2 rounded-lg border p-6 shadow-sm dark:border-gray-800 bg-white dark:bg-gray-950">
              <p className="text-gray-500 dark:text-gray-400">
                "Desde que comecei a usar o FinanceAPP, consegui economizar mais de R$ 500 por mês identificando gastos desnecessários."
              </p>
              <div className="flex items-center space-x-2 mt-2">
                <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-800"></div>
                <div>
                  <p className="text-sm font-medium">Ana Silva</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Professora</p>
                </div>
              </div>
            </div>
            <div className="flex flex-col space-y-2 rounded-lg border p-6 shadow-sm dark:border-gray-800 bg-white dark:bg-gray-950">
              <p className="text-gray-500 dark:text-gray-400">
                "A interface é intuitiva e os relatórios me ajudam a entender para onde está indo meu dinheiro. Recomendo!"
              </p>
              <div className="flex items-center space-x-2 mt-2">
                <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-800"></div>
                <div>
                  <p className="text-sm font-medium">Carlos Oliveira</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Engenheiro</p>
                </div>
              </div>
            </div>
            <div className="flex flex-col space-y-2 rounded-lg border p-6 shadow-sm dark:border-gray-800 bg-white dark:bg-gray-950">
              <p className="text-gray-500 dark:text-gray-400">
                "Finalmente consegui organizar minhas finanças e estou no caminho certo para comprar minha casa própria."
              </p>
              <div className="flex items-center space-x-2 mt-2">
                <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-800"></div>
                <div>
                  <p className="text-sm font-medium">Juliana Santos</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Designer</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-blue-100 px-3 py-1 text-sm dark:bg-blue-800">
                Planos
              </div>
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                Escolha o plano ideal para você
              </h2>
              <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                Oferecemos opções flexíveis para atender às suas necessidades financeiras.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3 mt-8">
            <div className="flex flex-col rounded-lg border p-6 shadow-sm dark:border-gray-800">
              <div className="space-y-2">
                <h3 className="text-2xl font-bold">Básico</h3>
                <p className="text-gray-500 dark:text-gray-400">Para quem está começando</p>
              </div>
              <div className="mt-4">
                <span className="text-4xl font-bold">Grátis</span>
              </div>
              <ul className="mt-6 space-y-2">
                <li className="flex items-center">
                  <Check className="mr-2 h-4 w-4 text-green-500" />
                  <span>Controle de despesas básico</span>
                </li>
                <li className="flex items-center">
                  <Check className="mr-2 h-4 w-4 text-green-500" />
                  <span>Até 3 contas</span>
                </li>
                <li className="flex items-center">
                  <Check className="mr-2 h-4 w-4 text-green-500" />
                  <span>Relatórios mensais</span>
                </li>
              </ul>
              <div className="mt-6">
                <Link href="/signup">
                  <Button className="w-full">Começar Grátis</Button>
                </Link>
              </div>
            </div>
            <div className="flex flex-col rounded-lg border border-blue-600 p-6 shadow-sm dark:border-blue-400">
              <div className="space-y-2">
                <h3 className="text-2xl font-bold">Premium</h3>
                <p className="text-gray-500 dark:text-gray-400">Para uso pessoal avançado</p>
              </div>
              <div className="mt-4">
                <span className="text-4xl font-bold">R$19,90</span>
                <span className="text-gray-500 dark:text-gray-400">/mês</span>
              </div>
              <ul className="mt-6 space-y-2">
                <li className="flex items-center">
                  <Check className="mr-2 h-4 w-4 text-green-500" />
                  <span>Controle de despesas completo</span>
                </li>
                <li className="flex items-center">
                  <Check className="mr-2 h-4 w-4 text-green-500" />
                  <span>Contas ilimitadas</span>
                </li>
                <li className="flex items-center">
                  <Check className="mr-2 h-4 w-4 text-green-500" />
                  <span>Relatórios avançados</span>
                </li>
                <li className="flex items-center">
                  <Check className="mr-2 h-4 w-4 text-green-500" />
                  <span>Metas financeiras</span>
                </li>
              </ul>
              <div className="mt-6">
                <Link href="/signup">
                  <Button className="w-full">Experimente Grátis</Button>
                </Link>
              </div>
            </div>
            <div className="flex flex-col rounded-lg border p-6 shadow-sm dark:border-gray-800">
              <div className="space-y-2">
                <h3 className="text-2xl font-bold">Empresarial</h3>
                <p className="text-gray-500 dark:text-gray-400">Para pequenas empresas</p>
              </div>
              <div className="mt-4">
                <span className="text-4xl font-bold">R$49,90</span>
                <span className="text-gray-500 dark:text-gray-400">/mês</span>
              </div>
              <ul className="mt-6 space-y-2">
                <li className="flex items-center">
                  <Check className="mr-2 h-4 w-4 text-green-500" />
                  <span>Todas as funções Premium</span>
                </li>
                <li className="flex items-center">
                  <Check className="mr-2 h-4 w-4 text-green-500" />
                  <span>Múltiplos usuários</span>
                </li>
                <li className="flex items-center">
                  <Check className="mr-2 h-4 w-4 text-green-500" />
                  <span>Integração contábil</span>
                </li>
                <li className="flex items-center">
                  <Check className="mr-2 h-4 w-4 text-green-500" />
                  <span>Suporte prioritário</span>
                </li>
              </ul>
              <div className="mt-6">
                <Link href="/signup">
                  <Button className="w-full">Fale Conosco</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full border-t bg-white py-6 dark:bg-[#0F0F12] dark:border-gray-800">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="flex items-center gap-2">
              <Wallet className="h-6 w-6 text-blue-600" />
              <span className="text-xl font-bold">FinanceAPP</span>
            </div>
            <div className="flex gap-4">
              <Link href="#" className="text-sm text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400">
                Termos de Uso
              </Link>
              <Link href="#" className="text-sm text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400">
                Política de Privacidade
              </Link>
              <Link href="#" className="text-sm text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400">
                Contato
              </Link>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              © 2025 FinanceAPP. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

