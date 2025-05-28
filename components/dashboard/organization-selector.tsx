"use client"

import { useState, useEffect } from "react"
import { Check, ChevronsUpDown, Building2, RefreshCw } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandLoading
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { api } from "@/lib/api"

interface Organization {
  id: string
  name: string
  org_type: string
  slug?: string
}

interface OrganizationSelectorProps {
  onOrganizationChange: (orgId: string | null) => void
}

export function OrganizationSelector({ onOrganizationChange }: OrganizationSelectorProps) {
  const [open, setOpen] = useState(false)
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [selectedOrg, setSelectedOrg] = useState<string | null>(null)
  const [selectedOrgName, setSelectedOrgName] = useState<string>("Pessoal")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Função para buscar as organizações da API
  const fetchOrganizations = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await api.get('/organizations/')
      
      if (response.data) {
        setOrganizations(response.data.results || [])
      }
    } catch (error) {
      console.error('Erro ao buscar organizações:', error)
      setError('Falha ao carregar organizações')
    } finally {
      setIsLoading(false)
    }
  }
  
  // Buscar organizações ao carregar o componente
  useEffect(() => {
    fetchOrganizations()
  }, [])

  const handleSelect = (orgId: string, orgName: string) => {
    if (orgId === "personal") {
      setSelectedOrg(null)
      setSelectedOrgName("Pessoal")
      onOrganizationChange(null)
    } else {
      setSelectedOrg(orgId)
      setSelectedOrgName(orgName)
      onOrganizationChange(orgId)
    }
    setOpen(false)
  }
  
  // Traduzir o tipo de organização
  const translateOrgType = (type: string) => {
    switch (type.toLowerCase()) {
      case 'business': return 'Negócio';
      case 'nonprofit': return 'Sem fins lucrativos';
      case 'personal': return 'Pessoal';
      default: return type;
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            <span>{selectedOrgName}</span>
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[250px] p-0">
        <Command>
          <CommandInput placeholder="Buscar organização..." />
          {isLoading ? (
            <CommandLoading>
              <div className="flex items-center justify-center py-6">
                <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                <span>Carregando...</span>
              </div>
            </CommandLoading>
          ) : error ? (
            <div className="py-6 text-center">
              <p className="text-sm text-red-500">{error}</p>
              <Button 
                variant="link" 
                size="sm"
                onClick={fetchOrganizations}
                className="mt-2"
              >
                Tentar novamente
              </Button>
            </div>
          ) : (
            <>
              <CommandEmpty>Nenhuma organização encontrada.</CommandEmpty>
              <CommandGroup>
                <CommandItem
                  key="personal"
                  value="personal"
                  onSelect={() => handleSelect("personal", "Pessoal")}
                  className="cursor-pointer"
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedOrg === null ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <span>Pessoal</span>
                </CommandItem>
                {organizations.map((org) => (
                  <CommandItem
                    key={org.id}
                    value={org.name}
                    onSelect={() => handleSelect(org.id, org.name)}
                    className="cursor-pointer"
                  >
                    <div className="flex items-center">
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          selectedOrg === org.id ? "opacity-100" : "opacity-0"
                        )}
                      />
                      <div>
                        <span>{org.name}</span>
                        {org.org_type && (
                          <span className="ml-2 text-xs text-muted-foreground">
                            ({translateOrgType(org.org_type)})
                          </span>
                        )}
                      </div>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
              <div className="border-t p-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full justify-start text-sm"
                  onClick={() => {
                    // Aqui poderia redirecionar para criar nova organização
                    alert('Função para criar nova organização')
                  }}
                >
                  <span className="mr-2">+</span>
                  Nova Organização
                </Button>
              </div>
            </>
          )}
        </Command>
      </PopoverContent>
    </Popover>
  )
}
