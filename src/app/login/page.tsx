"use client"

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { z } from 'zod'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Coffee, User, Lock, Eye, EyeOff, LogIn } from 'lucide-react'

const schema = z.object({
  identifier: z.string().min(3, 'Wajib diisi'),
  password: z.string().min(6, 'Minimal 6 karakter'),
  rememberMe: z.boolean().optional()
})

function LoginForm() {
  const [loading, setLoading] = useState(false)
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const { toast } = useToast()
  const router = useRouter()
  const search = useSearchParams()
  const redirect = search.get('redirect') || '/dashboard'

  async function onSubmit (e: React.FormEvent) {
    e.preventDefault()
    const parsed = schema.safeParse({ identifier, password, rememberMe })
    if (!parsed.success) {
      toast({ title: 'Login gagal', description: parsed.error.issues[0]?.message, variant: 'destructive' })
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password, rememberMe })
      })
      if (!res.ok) {
        let msg = 'Gagal masuk'
        try { const data = await res.json(); if (data?.error) msg = data.error } catch {}
        throw new Error(msg)
      }
      router.replace(redirect)
      router.refresh()
    } catch (err: any) {
      toast({ title: 'Login gagal', description: err?.message || 'Email/username atau password salah', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen grid place-items-center p-6 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background">
      <Card className="w-full max-w-md shadow-lg border-muted/40 backdrop-blur supports-[backdrop-filter]:bg-background/70">
        <CardHeader className="space-y-2 text-center pb-2">
          <div className="mx-auto size-12 rounded-full bg-primary/10 text-primary grid place-items-center">
            <Coffee className="size-6" />
          </div>
          <CardTitle className="text-3xl font-headline tracking-tight">SimplePOS</CardTitle>
          <CardDescription className="text-base">Masuk untuk melanjutkan</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="identifier">Email atau Username</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  id="identifier"
                  value={identifier}
                  onChange={e => setIdentifier(e.target.value)}
                  placeholder="you@example.com"
                  className="pl-9 h-11"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="pl-9 pr-10 h-11"
                />
                <button
                  type="button"
                  aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Checkbox id="remember" checked={rememberMe} onCheckedChange={v => setRememberMe(!!v)} />
                <Label htmlFor="remember" className="text-sm text-muted-foreground">Ingat saya</Label>
              </div>
              <a href="#" className="text-sm text-primary hover:underline">Lupa password?</a>
            </div>

            <Button type="submit" disabled={loading} className="w-full h-11 text-base">
              {loading ? (
                <span className="inline-flex items-center gap-2"><LogIn className="size-4 animate-pulse" /> Masuk...</span>
              ) : (
                <span className="inline-flex items-center gap-2"><LogIn className="size-4" /> Masuk</span>
              )}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Gunakan akun admin bawaan untuk uji coba: admin@example.com / Admin#123
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen grid place-items-center p-6 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background">
        <Card className="w-full max-w-md shadow-lg border-muted/40 backdrop-blur supports-[backdrop-filter]:bg-background/70">
          <CardHeader className="space-y-2 text-center pb-2">
            <div className="mx-auto size-12 rounded-full bg-primary/10 text-primary grid place-items-center">
              <Coffee className="size-6" />
            </div>
            <CardTitle className="text-3xl font-headline tracking-tight">SimplePOS</CardTitle>
            <CardDescription className="text-base">Loading...</CardDescription>
          </CardHeader>
        </Card>
      </div>
    }>
      <LoginForm />
    </Suspense>
  )
}


