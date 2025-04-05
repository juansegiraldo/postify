"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Instagram, Home, Calendar, BarChart2, Settings, Plus, Users } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { InstagramAccountSelector } from "@/components/InstagramAccountSelector"
import { InstagramAccountManager } from "@/components/InstagramAccountManager"
import { useState } from "react"

export default function HomePage() {
  const [showAccountManager, setShowAccountManager] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-sm h-screen sticky top-0">
        <div className="p-4">
          <div className="flex items-center gap-2 mb-6">
            <Instagram className="h-6 w-6 text-pink-500" />
            <h1 className="text-lg font-medium text-gray-900">Postify</h1>
          </div>

          <div className="space-y-1 mb-6">
            <Link href="/" className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-md">
              <Home className="h-4 w-4" />
              <span>Inicio</span>
            </Link>
            <Link href="/feed" className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-md">
              <Instagram className="h-4 w-4" />
              <span>Feed</span>
            </Link>
            <Link href="/calendar" className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-md">
              <Calendar className="h-4 w-4" />
              <span>Calendario</span>
            </Link>
            <Link href="/analytics" className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-md">
              <BarChart2 className="h-4 w-4" />
              <span>Analíticas</span>
            </Link>
          </div>

          <div className="space-y-4">
            <div className="px-3">
              <InstagramAccountSelector />
            </div>

            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => setShowAccountManager(true)}
            >
              <Users className="h-4 w-4 mr-2" />
              Gestionar cuentas
            </Button>

            <Link href="/settings" className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-md">
              <Settings className="h-4 w-4" />
              <span>Configuración</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main content */}
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
          <>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Posts programados</CardTitle>
                  <Calendar className="h-4 w-4 text-gray-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">12</div>
                  <p className="text-xs text-gray-500">+2 desde ayer</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Engagement total</CardTitle>
                  <BarChart2 className="h-4 w-4 text-gray-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">2,345</div>
                  <p className="text-xs text-gray-500">+12% desde el mes pasado</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Mejor hora para publicar</CardTitle>
                  <Instagram className="h-4 w-4 text-gray-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">18:00</div>
                  <p className="text-xs text-gray-500">Basado en engagement</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Crecimiento de seguidores</CardTitle>
                  <Users className="h-4 w-4 text-gray-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">+234</div>
                  <p className="text-xs text-gray-500">Este mes</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2 mb-6">
              <Card>
                <CardHeader>
                  <CardTitle>Acciones rápidas</CardTitle>
                  <CardDescription>Gestiona tus publicaciones</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button className="w-full justify-start">
                    <Plus className="h-4 w-4 mr-2" />
                    Crear nuevo post
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Calendar className="h-4 w-4 mr-2" />
                    Programar contenido
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Posts recientes</CardTitle>
                  <CardDescription>Últimas publicaciones</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarImage src="/placeholder.svg" alt="Post" />
                      <AvatarFallback>PO</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Nuevo producto en stock</p>
                      <p className="text-xs text-gray-500">Publicado hace 2 horas</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">1.2k</p>
                      <p className="text-xs text-gray-500">Me gusta</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarImage src="/placeholder.svg" alt="Post" />
                      <AvatarFallback>PO</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Behind the scenes</p>
                      <p className="text-xs text-gray-500">Publicado hace 5 horas</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">856</p>
                      <p className="text-xs text-gray-500">Me gusta</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

