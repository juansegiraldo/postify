"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { toast } from "sonner"

interface InstagramAccount {
  id: string
  username: string
  displayName: string
  url?: string
}

interface InstagramAccountContextType {
  accounts: InstagramAccount[]
  activeAccount: InstagramAccount | null
  setActiveAccount: (account: InstagramAccount) => void
  addAccount: (account: Omit<InstagramAccount, "id">) => void
  updateAccount: (id: string, account: Omit<InstagramAccount, "id">) => void
  deleteAccount: (id: string) => void
  resetAccounts: () => void
}

const InstagramAccountContext = createContext<InstagramAccountContextType | undefined>(undefined)

// Función para generar IDs únicos
const generateId = () => Math.random().toString(36).substring(2, 9)

// Cuentas por defecto
const defaultAccounts: InstagramAccount[] = [
  {
    id: "1",
    username: "juansegiraldom",
    displayName: "Juan Giraldo",
    url: "https://instagram.com/juansegiraldom"
  },
  {
    id: "2",
    username: "cafelote32",
    displayName: "Cafelote",
    url: "https://instagram.com/cafelote32"
  },
  {
    id: "3",
    username: "esenciauarea",
    displayName: "Esencia Uare",
    url: "https://instagram.com/esenciauarea"
  },
  {
    id: "4",
    username: "lauralbinov",
    displayName: "Laura Albinov",
    url: "https://instagram.com/lauralbinov"
  }
]

// Claves para localStorage
const STORAGE_KEYS = {
  ACCOUNTS: "instagramAccounts_v2",
  ACTIVE_ACCOUNT: "activeInstagramAccount_v2"
}

export function InstagramAccountProvider({ children }: { children: React.ReactNode }) {
  // Inicializar el estado con valores por defecto
  const [accounts, setAccounts] = useState<InstagramAccount[]>(defaultAccounts)
  const [activeAccount, setActiveAccount] = useState<InstagramAccount | null>(defaultAccounts[0])
  const [isInitialized, setIsInitialized] = useState(false)
  
  // Cargar datos del localStorage solo en el cliente después del montaje
  useEffect(() => {
    try {
      // Limpiar datos antiguos si existen
      localStorage.removeItem("instagramAccounts")
      localStorage.removeItem("activeInstagramAccount")
      
      const savedAccounts = localStorage.getItem(STORAGE_KEYS.ACCOUNTS)
      if (savedAccounts) {
        const parsedAccounts = JSON.parse(savedAccounts)
        setAccounts(parsedAccounts)
      }
      
      const savedActiveAccount = localStorage.getItem(STORAGE_KEYS.ACTIVE_ACCOUNT)
      if (savedActiveAccount) {
        const parsedActiveAccount = JSON.parse(savedActiveAccount)
        setActiveAccount(parsedActiveAccount)
      }
      
      setIsInitialized(true)
    } catch (error) {
      console.error("Error loading accounts from localStorage:", error)
      setIsInitialized(true)
    }
  }, [])

  // Guardar en localStorage cuando cambien los datos
  useEffect(() => {
    if (!isInitialized) return
    
    try {
      localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(accounts))
      console.log("Accounts saved to localStorage:", accounts)
    } catch (error) {
      console.error("Error saving accounts to localStorage:", error)
    }
  }, [accounts, isInitialized])

  useEffect(() => {
    if (!isInitialized) return
    
    if (activeAccount) {
      try {
        localStorage.setItem(STORAGE_KEYS.ACTIVE_ACCOUNT, JSON.stringify(activeAccount))
        console.log("Active account saved to localStorage:", activeAccount)
      } catch (error) {
        console.error("Error saving active account to localStorage:", error)
      }
    }
  }, [activeAccount, isInitialized])

  const addAccount = (newAccount: Omit<InstagramAccount, "id">) => {
    const accountWithId = {
      ...newAccount,
      id: generateId()
    }
    setAccounts((prev) => [...prev, accountWithId])
    toast.success("Cuenta añadida correctamente")
  }

  const updateAccount = (id: string, updatedAccount: Omit<InstagramAccount, "id">) => {
    setAccounts((prev) =>
      prev.map((account) =>
        account.id === id
          ? { ...account, ...updatedAccount }
          : account
      )
    )
    if (activeAccount?.id === id) {
      setActiveAccount({ ...activeAccount, ...updatedAccount })
    }
    toast.success("Cuenta actualizada correctamente")
  }

  const deleteAccount = (id: string) => {
    setAccounts((prev) => prev.filter((account) => account.id !== id))
    if (activeAccount?.id === id) {
      setActiveAccount(accounts.find(account => account.id !== id) || null)
    }
    toast.success("Cuenta eliminada correctamente")
  }

  const resetAccounts = () => {
    setAccounts(defaultAccounts)
    setActiveAccount(defaultAccounts[0])
    localStorage.removeItem(STORAGE_KEYS.ACCOUNTS)
    localStorage.removeItem(STORAGE_KEYS.ACTIVE_ACCOUNT)
    toast.success("Cuentas restablecidas a los valores predeterminados")
  }

  return (
    <InstagramAccountContext.Provider
      value={{
        accounts,
        activeAccount,
        setActiveAccount,
        addAccount,
        updateAccount,
        deleteAccount,
        resetAccounts
      }}
    >
      {children}
    </InstagramAccountContext.Provider>
  )
}

export function useInstagramAccount() {
  const context = useContext(InstagramAccountContext)
  if (context === undefined) {
    throw new Error("useInstagramAccount must be used within an InstagramAccountProvider")
  }
  return context
} 