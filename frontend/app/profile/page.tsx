"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { User, Settings, Bell, Shield, LogOut } from "lucide-react"
import { authService } from "@/lib/api"

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const router = useRouter()
  
  // Form states
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  
  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [budgetAlerts, setBudgetAlerts] = useState(true)
  const [weeklyReports, setWeeklyReports] = useState(true)
  const [billReminders, setBillReminders] = useState(true)
  
  useEffect(() => {
    // Load user data
    const loadUserData = () => {
      try {
        const userJson = localStorage.getItem('financeAppUser')
        if (userJson) {
          const userData = JSON.parse(userJson)
          setUser(userData)
          
          // Populate form fields
          setEmail(userData.email || "")
          setFirstName(userData.first_name || "")
          setLastName(userData.last_name || "")
          
          setIsLoading(false)
        } else {
          // Redirect to login if no user found
          router.replace('/login')
        }
      } catch (error) {
        console.error('Error loading user data:', error)
        router.replace('/login')
      }
    }
    
    loadUserData()
  }, [router])
  
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    
    try {
      // Here you would call your API to update the profile
      // For example: await userService.updateProfile({ firstName, lastName, email })
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Update local storage with new data
      const updatedUser = { ...user, first_name: firstName, last_name: lastName, email: email }
      localStorage.setItem('financeAppUser', JSON.stringify(updatedUser))
      setUser(updatedUser)
      
      alert("Perfil atualizado com sucesso!")
    } catch (error) {
      console.error('Error updating profile:', error)
      alert("Erro ao atualizar perfil. Tente novamente.")
    } finally {
      setIsSaving(false)
    }
  }
  
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (newPassword !== confirmPassword) {
      alert("As senhas não coincidem!")
      return
    }
    
    setIsSaving(true)
    
    try {
      // Here you would call your API to change the password
      // For example: await userService.changePassword({ currentPassword, newPassword })
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Clear password fields
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
      
      alert("Senha alterada com sucesso!")
    } catch (error) {
      console.error('Error changing password:', error)
      alert("Erro ao alterar senha. Tente novamente.")
    } finally {
      setIsSaving(false)
    }
  }
  
  const handleSaveNotifications = async () => {
    setIsSaving(true)
    
    try {
      // Here you would call your API to update notification settings
      // For example: await userService.updateNotifications({ emailNotifications, budgetAlerts, ... })
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      alert("Configurações de notificação atualizadas!")
    } catch (error) {
      console.error('Error updating notifications:', error)
      alert("Erro ao atualizar notificações. Tente novamente.")
    } finally {
      setIsSaving(false)
    }
  }
  
  const handleLogout = () => {
    authService.logout()
  }
  
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-white dark:bg-[#0F0F12]">
        <div className="flex flex-col items-center">
          <div className="h-16 w-16 animate-spin rounded-full border-t-4 border-b-4 border-blue-600 dark:border-blue-400 mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300 text-sm">Carregando perfil...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Meu Perfil</h1>
      
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-8">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Perfil</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Segurança</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Notificações</span>
          </TabsTrigger>
          <TabsTrigger value="preferences" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">Preferências</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Informações Pessoais</CardTitle>
              <CardDescription>
                Atualize suas informações pessoais aqui. Estas informações serão exibidas em seu perfil.
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleUpdateProfile}>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Nome</Label>
                    <Input 
                      id="firstName" 
                      placeholder="Seu nome" 
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Sobrenome</Label>
                    <Input 
                      id="lastName" 
                      placeholder="Seu sobrenome" 
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="seu.email@exemplo.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="username">Nome de usuário</Label>
                  <Input 
                    id="username" 
                    value={user?.username || ""}
                    disabled
                    className="bg-gray-100 dark:bg-gray-800"
                  />
                  <p className="text-sm text-gray-500">O nome de usuário não pode ser alterado.</p>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? "Salvando..." : "Salvar Alterações"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
        
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Segurança da Conta</CardTitle>
              <CardDescription>
                Atualize sua senha e configure as opções de segurança da sua conta.
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleChangePassword}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Senha Atual</Label>
                  <Input 
                    id="currentPassword" 
                    type="password" 
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="newPassword">Nova Senha</Label>
                  <Input 
                    id="newPassword" 
                    type="password" 
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
                  <Input 
                    id="confirmPassword" 
                    type="password" 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
                
                <div className="pt-4">
                  <h3 className="font-medium mb-2">Sessões Ativas</h3>
                  <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">Este dispositivo</p>
                        <p className="text-sm text-gray-500">Último acesso: Hoje, 17:10</p>
                      </div>
                      <div className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 px-2 py-1 rounded text-xs">
                        Ativo
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? "Alterando..." : "Alterar Senha"}
                </Button>
                <Button type="button" variant="destructive" onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sair de Todos os Dispositivos
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Notificações</CardTitle>
              <CardDescription>
                Escolha quais notificações você deseja receber e como recebê-las.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Notificações por Email</Label>
                  <p className="text-sm text-gray-500">Receba atualizações importantes por email</p>
                </div>
                <Switch 
                  checked={emailNotifications} 
                  onCheckedChange={setEmailNotifications} 
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Alertas de Orçamento</Label>
                  <p className="text-sm text-gray-500">Seja notificado quando estiver próximo do limite do orçamento</p>
                </div>
                <Switch 
                  checked={budgetAlerts} 
                  onCheckedChange={setBudgetAlerts} 
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Relatórios Semanais</Label>
                  <p className="text-sm text-gray-500">Receba um resumo semanal das suas finanças</p>
                </div>
                <Switch 
                  checked={weeklyReports} 
                  onCheckedChange={setWeeklyReports} 
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Lembretes de Contas</Label>
                  <p className="text-sm text-gray-500">Seja lembrado quando uma conta estiver próxima do vencimento</p>
                </div>
                <Switch 
                  checked={billReminders} 
                  onCheckedChange={setBillReminders} 
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveNotifications} disabled={isSaving}>
                {isSaving ? "Salvando..." : "Salvar Preferências"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="preferences">
          <Card>
            <CardHeader>
              <CardTitle>Preferências da Aplicação</CardTitle>
              <CardDescription>
                Personalize a aparência e o comportamento da aplicação.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-medium">Tema</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="border rounded-lg p-4 flex flex-col items-center gap-2 cursor-pointer hover:border-blue-500">
                    <div className="w-full h-20 bg-white border rounded"></div>
                    <span>Claro</span>
                  </div>
                  <div className="border rounded-lg p-4 flex flex-col items-center gap-2 cursor-pointer hover:border-blue-500">
                    <div className="w-full h-20 bg-gray-900 border rounded"></div>
                    <span>Escuro</span>
                  </div>
                  <div className="border rounded-lg p-4 flex flex-col items-center gap-2 cursor-pointer hover:border-blue-500 border-blue-500">
                    <div className="w-full h-20 bg-gradient-to-b from-white to-gray-900 border rounded"></div>
                    <span>Sistema</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-medium">Moeda Padrão</h3>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                  <div className="border rounded-lg p-3 flex items-center justify-center cursor-pointer hover:border-blue-500 border-blue-500">
                    <span>R$ (BRL)</span>
                  </div>
                  <div className="border rounded-lg p-3 flex items-center justify-center cursor-pointer hover:border-blue-500">
                    <span>$ (USD)</span>
                  </div>
                  <div className="border rounded-lg p-3 flex items-center justify-center cursor-pointer hover:border-blue-500">
                    <span>€ (EUR)</span>
                  </div>
                  <div className="border rounded-lg p-3 flex items-center justify-center cursor-pointer hover:border-blue-500">
                    <span>£ (GBP)</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-medium">Formato de Data</h3>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                  <div className="border rounded-lg p-3 flex items-center justify-center cursor-pointer hover:border-blue-500 border-blue-500">
                    <span>DD/MM/AAAA</span>
                  </div>
                  <div className="border rounded-lg p-3 flex items-center justify-center cursor-pointer hover:border-blue-500">
                    <span>MM/DD/AAAA</span>
                  </div>
                  <div className="border rounded-lg p-3 flex items-center justify-center cursor-pointer hover:border-blue-500">
                    <span>AAAA-MM-DD</span>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button disabled={isSaving}>
                {isSaving ? "Salvando..." : "Salvar Preferências"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
