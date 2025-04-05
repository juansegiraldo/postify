"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useInstagramAccount } from "@/app/contexts/InstagramAccountContext"
import { Plus, Edit, Trash2, Instagram, ExternalLink } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export function InstagramAccountManager() {
  const { accounts, addAccount, updateAccount, deleteAccount } = useInstagramAccount()
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingAccount, setEditingAccount] = useState<string | null>(null)
  const [newAccount, setNewAccount] = useState({
    username: "",
    displayName: "",
    url: "",
  })
  const { toast } = useToast()

  const handleAddAccount = () => {
    if (!newAccount.username) {
      toast({
        title: "Error",
        description: "El nombre de usuario es obligatorio",
        variant: "destructive",
      })
      return
    }

    // Ensure username starts with @
    const username = newAccount.username.startsWith("@") 
      ? newAccount.username 
      : `@${newAccount.username}`

    addAccount({
      username,
      displayName: newAccount.displayName || username,
      url: newAccount.url,
    })

    toast({
      title: "Cuenta añadida",
      description: `La cuenta ${username} ha sido añadida correctamente`,
    })

    // Reset form
    setNewAccount({
      username: "",
      displayName: "",
      url: "",
    })
    setIsAddDialogOpen(false)
  }

  const handleEditAccount = (id: string) => {
    const account = accounts.find(a => a.id === id)
    if (account) {
      setEditingAccount(id)
      setNewAccount({
        username: account.username,
        displayName: account.displayName,
        url: account.url || "",
      })
      setIsEditDialogOpen(true)
    }
  }

  const handleUpdateAccount = () => {
    if (!editingAccount) return

    if (!newAccount.username) {
      toast({
        title: "Error",
        description: "El nombre de usuario es obligatorio",
        variant: "destructive",
      })
      return
    }

    // Ensure username starts with @
    const username = newAccount.username.startsWith("@") 
      ? newAccount.username 
      : `@${newAccount.username}`

    updateAccount(editingAccount, {
      username,
      displayName: newAccount.displayName || username,
      url: newAccount.url,
    })

    toast({
      title: "Cuenta actualizada",
      description: `La cuenta ${username} ha sido actualizada correctamente`,
    })

    // Reset form
    setNewAccount({
      username: "",
      displayName: "",
      url: "",
    })
    setEditingAccount(null)
    setIsEditDialogOpen(false)
  }

  const handleDeleteAccount = (id: string) => {
    const account = accounts.find(a => a.id === id)
    if (account) {
      deleteAccount(id)
      toast({
        title: "Cuenta eliminada",
        description: `La cuenta ${account.username} ha sido eliminada correctamente`,
      })
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Cuentas de Instagram</h3>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Añadir cuenta
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Añadir cuenta de Instagram</DialogTitle>
              <DialogDescription>
                Añade una nueva cuenta de Instagram para gestionar sus publicaciones.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="username" className="text-right">
                  Usuario
                </Label>
                <Input
                  id="username"
                  value={newAccount.username}
                  onChange={(e) => setNewAccount({ ...newAccount, username: e.target.value })}
                  className="col-span-3"
                  placeholder="@usuario"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="displayName" className="text-right">
                  Nombre
                </Label>
                <Input
                  id="displayName"
                  value={newAccount.displayName}
                  onChange={(e) => setNewAccount({ ...newAccount, displayName: e.target.value })}
                  className="col-span-3"
                  placeholder="Nombre para mostrar"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="url" className="text-right">
                  URL
                </Label>
                <Input
                  id="url"
                  value={newAccount.url}
                  onChange={(e) => setNewAccount({ ...newAccount, url: e.target.value })}
                  className="col-span-3"
                  placeholder="https://instagram.com/usuario"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleAddAccount}>Añadir</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-md">
        <div className="divide-y">
          {accounts.map((account) => (
            <div key={account.id} className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-pink-100 flex items-center justify-center">
                  <Instagram className="h-5 w-5 text-pink-500" />
                </div>
                <div>
                  <div className="font-medium">{account.username}</div>
                  <div className="text-sm text-gray-500">{account.displayName}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {account.url && (
                  <Button variant="ghost" size="sm" asChild>
                    <a href={account.url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                )}
                <Button variant="ghost" size="sm" onClick={() => handleEditAccount(account.id)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleDeleteAccount(account.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar cuenta de Instagram</DialogTitle>
            <DialogDescription>
              Modifica los detalles de la cuenta de Instagram.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-username" className="text-right">
                Usuario
              </Label>
              <Input
                id="edit-username"
                value={newAccount.username}
                onChange={(e) => setNewAccount({ ...newAccount, username: e.target.value })}
                className="col-span-3"
                placeholder="@usuario"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-displayName" className="text-right">
                Nombre
              </Label>
              <Input
                id="edit-displayName"
                value={newAccount.displayName}
                onChange={(e) => setNewAccount({ ...newAccount, displayName: e.target.value })}
                className="col-span-3"
                placeholder="Nombre para mostrar"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-url" className="text-right">
                URL
              </Label>
              <Input
                id="edit-url"
                value={newAccount.url}
                onChange={(e) => setNewAccount({ ...newAccount, url: e.target.value })}
                className="col-span-3"
                placeholder="https://instagram.com/usuario"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleUpdateAccount}>Guardar cambios</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 