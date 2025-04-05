"use client"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ChevronDown, ExternalLink } from "lucide-react"
import { useInstagramAccount } from "@/app/contexts/InstagramAccountContext"

export function InstagramAccountSelector() {
  const { activeAccount, setActiveAccount, accounts } = useInstagramAccount();

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="p-0 h-auto font-bold text-blue-600 flex items-center">
            {activeAccount.username}
            <ChevronDown className="h-4 w-4 ml-1" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {accounts.map((account) => (
            <DropdownMenuItem
              key={account.id}
              onClick={() => setActiveAccount(account)}
              className={account.id === activeAccount.id ? "bg-blue-50" : ""}
            >
              {account.username}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      
      {activeAccount.url && (
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" asChild>
          <a href={activeAccount.url} target="_blank" rel="noopener noreferrer" title="Ver perfil en Instagram">
            <ExternalLink className="h-4 w-4" />
          </a>
        </Button>
      )}
    </div>
  );
} 