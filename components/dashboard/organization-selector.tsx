"use client"

import { useState, useEffect } from "react"
import { Check, ChevronsUpDown, Building2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface Organization {
  id: string
  name: string
  org_type: string
}

interface OrganizationSelectorProps {
  onOrganizationChange: (orgId: string | null) => void
}

export function OrganizationSelector({ onOrganizationChange }: OrganizationSelectorProps) {
  const [open, setOpen] = useState(false)
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [selectedOrg, setSelectedOrg] = useState<string | null>(null)
  const [selectedOrgName, setSelectedOrgName] = useState<string>("Personal")

  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const response = await fetch('/api/organizations/organizations/', {
          headers: {
            'Authorization': `Token ${localStorage.getItem('token')}`
          }
        })
        
        if (response.ok) {
          const data = await response.json()
          setOrganizations(data.results || [])
        }
      } catch (error) {
        console.error('Error fetching organizations:', error)
      }
    }
    
    fetchOrganizations()
  }, [])

  const handleSelect = (orgId: string, orgName: string) => {
    if (orgId === "personal") {
      setSelectedOrg(null)
      setSelectedOrgName("Personal")
      onOrganizationChange(null)
    } else {
      setSelectedOrg(orgId)
      setSelectedOrgName(orgName)
      onOrganizationChange(orgId)
    }
    setOpen(false)
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
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search organization..." />
          <CommandEmpty>No organization found.</CommandEmpty>
          <CommandGroup>
            <CommandItem
              key="personal"
              value="personal"
              onSelect={() => handleSelect("personal", "Personal")}
              className="cursor-pointer"
            >
              <Check
                className={cn(
                  "mr-2 h-4 w-4",
                  selectedOrg === null ? "opacity-100" : "opacity-0"
                )}
              />
              Personal
            </CommandItem>
            {organizations.map((org) => (
              <CommandItem
                key={org.id}
                value={org.name}
                onSelect={() => handleSelect(org.id, org.name)}
                className="cursor-pointer"
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    selectedOrg === org.id ? "opacity-100" : "opacity-0"
                  )}
                />
                {org.name}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
