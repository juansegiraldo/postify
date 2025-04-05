"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { ChevronLeft, Instagram, Facebook, Twitter, Linkedin, Youtube, Plus, Users } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { InstagramAccountManager } from "@/components/InstagramAccountManager"
import { useState } from "react"

export default function SettingsPage() {
  const [showAccountManager, setShowAccountManager] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Panel izquierdo */}
      <div className="w-64 bg-white shadow-sm h-screen sticky top-0">
        <div className="p-4">
          <Link href="/" className="flex items-center text-gray-600 hover:text-gray-900 mb-6">
            <ChevronLeft className="h-5 w-5 mr-2" />
            <span>Volver</span>
          </Link>
          
          <h2 className="text-lg font-medium text-gray-900 mb-4">Configuración</h2>
          
          <div className="space-y-2">
            <Button 
              variant={showAccountManager ? "default" : "ghost"} 
              className="w-full justify-start"
              onClick={() => setShowAccountManager(true)}
            >
              <Users className="h-4 w-4 mr-2" />
              Gestionar cuentas
            </Button>
            
            <Button 
              variant={!showAccountManager ? "default" : "ghost"} 
              className="w-full justify-start"
              onClick={() => setShowAccountManager(false)}
            >
              <Avatar className="h-4 w-4 mr-2" />
              Perfil
            </Button>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="flex-1 p-6">
        {showAccountManager ? (
          <div className="max-w-3xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Gestionar cuentas de Instagram</CardTitle>
                <CardDescription>Añade, edita o elimina tus cuentas de Instagram</CardDescription>
              </CardHeader>
              <CardContent>
                <InstagramAccountManager />
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Perfil</CardTitle>
                <CardDescription>Actualiza tu información de perfil</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src="/placeholder.svg" alt="Profile" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <Button>Cambiar avatar</Button>
                </div>
                <div className="grid gap-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Nombre
                    </Label>
                    <Input id="name" defaultValue="Juan Doe" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="email" className="text-right">
                      Email
                    </Label>
                    <Input id="email" type="email" defaultValue="juan@example.com" className="col-span-3" />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button>Guardar cambios</Button>
              </CardFooter>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}

