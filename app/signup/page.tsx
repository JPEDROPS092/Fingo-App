"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { authService } from "@/lib/api"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/lib/authContext"
import { Eye, EyeOff } from "lucide-react"

export default function SignupPage() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    password2: "",
    firstName: "",
    lastName: ""
  })
  const [errors, setErrors] = useState<{[key: string]: string}>({})
  const [formError, setFormError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const router = useRouter()
  const { isAuthenticated } = useAuth()

  // Verificar se o usuário já está logado ao carregar o componente
  useEffect(() => {
    if (isAuthenticated) {
      // Já está logado, redirecionar para o dashboard
      router.replace('/dashboard')
    }
  }, [isAuthenticated, router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Limpar erro do campo quando o usuário editar
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = {...prev}
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {}
    
    // Validar campos obrigatórios
    if (!formData.username.trim()) {
      newErrors.username = "Nome de usuário é obrigatório"
    } else if (formData.username.length < 3) {
      newErrors.username = "Nome de usuário deve ter pelo menos 3 caracteres"
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "Email é obrigatório"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email inválido"
    }
    
    if (!formData.password) {
      newErrors.password = "Senha é obrigatória"
    } else if (formData.password.length < 8) {
      newErrors.password = "Senha deve ter pelo menos 8 caracteres"
    }
    
    if (formData.password !== formData.password2) {
      newErrors.password2 = "As senhas não correspondem"
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError("")
    
    // Validar formulário antes de enviar
    if (!validateForm()) {
      return
    }
    
    setIsLoading(true)

    try {
      await authService.register(
        formData.username,
        formData.email,
        formData.password,
        formData.password2,
        formData.firstName,
        formData.lastName
      )
      
      // Redirecionar para dashboard após cadastro bem-sucedido
      setTimeout(() => {
        window.location.href = '/dashboard'
      }, 500)
    } catch (err: any) {
      console.error('Erro de registro:', err)
      const errorData = err.response?.data || {}
      
      // Tratar diferentes tipos de respostas de erro
      if (typeof errorData === 'object') {
        // Verificar se temos erros específicos para campos
        const fieldErrors: {[key: string]: string} = {}
        let hasFieldErrors = false
        
        Object.entries(errorData).forEach(([field, messages]) => {
          if (field !== 'non_field_errors') {
            fieldErrors[field] = Array.isArray(messages) ? messages[0] : messages as string
            hasFieldErrors = true
          }
        })
        
        if (hasFieldErrors) {
          setErrors(fieldErrors)
        } else if (errorData.non_field_errors) {
          // Erro geral não associado a um campo específico
          setFormError(Array.isArray(errorData.non_field_errors) 
            ? errorData.non_field_errors[0] 
            : errorData.non_field_errors as string
          )
        } else {
          // Fallback para qualquer outro formato de erro
          setFormError("Falha no cadastro. Por favor, tente novamente.")
        }
      } else {
        setFormError("Erro ao processar o cadastro. Verifique sua conexão.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-[#0F0F12] px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <img 
              src="/placeholder-logo.svg" 
              alt="FinanceAPP" 
              className="h-12 w-auto" 
            />
          </div>
          <CardTitle className="text-2xl font-bold text-center">Criar uma conta</CardTitle>
          <CardDescription className="text-center">Preencha as informações para criar sua conta</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {formError && (
              <Alert variant="destructive" className="border-red-500 bg-red-50 dark:bg-red-900/20">
                <AlertDescription>
                  {formError}
                </AlertDescription>
              </Alert>
            )}
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">Nome</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  placeholder="João"
                  value={formData.firstName}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Sobrenome</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  placeholder="Silva"
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="username">Nome de usuário</Label>
              <Input
                id="username"
                name="username"
                placeholder="joaosilva"
                value={formData.username}
                onChange={handleChange}
                required
                className={errors.username ? "border-red-500" : ""}
              />
              {errors.username && (
                <p className="text-sm text-red-500">{errors.username}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="joao.silva@exemplo.com"
                value={formData.email}
                onChange={handleChange}
                required
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Crie uma senha"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className={`pr-10 ${errors.password ? "border-red-500" : ""}`}
                />
                <button 
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password2">Confirmar Senha</Label>
              <div className="relative">
                <Input
                  id="password2"
                  name="password2"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirme sua senha"
                  value={formData.password2}
                  onChange={handleChange}
                  required
                  className={`pr-10 ${errors.password2 ? "border-red-500" : ""}`}
                />
                <button 
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.password2 && (
                <p className="text-sm text-red-500">{errors.password2}</p>
              )}
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Criando conta..." : "Criar conta"}
            </Button>
            <div className="text-center text-sm">
              Já tem uma conta?{" "}
              <Link
                href="/login"
                className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Entrar
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
