'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { Zap, Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })
    if (result?.error) {
      setError('Invalid email or password')
      setLoading(false)
    } else {
      router.push('/dashboard')
    }
  }

  return (
    <div className="flex min-h-screen">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 gradient-dark flex-col justify-between p-12">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent">
            <Zap className="h-6 w-6 text-white" />
          </div>
          <span className="text-2xl font-bold text-white">RallyIQ</span>
        </div>
        <div>
          <h2 className="text-4xl font-bold text-white leading-tight">
            The all-in-one platform<br />for winning teams.
          </h2>
          <p className="mt-4 text-lg text-gray-400">
            Manage practices, track players, run tournaments, and grow your organization — all in one place.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-4">
            {['Coach Tools', 'Team Management', 'Player Profiles', 'Fundraising', 'Scouting', 'Analytics'].map((f) => (
              <div key={f} className="flex items-center gap-2 text-sm text-gray-300">
                <div className="h-1.5 w-1.5 rounded-full bg-accent" />
                {f}
              </div>
            ))}
          </div>
        </div>
        <p className="text-sm text-gray-600">© 2025 RallyIQ. All rights reserved.</p>
      </div>

      {/* Right panel */}
      <div className="flex flex-1 items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-dark">RallyIQ</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome back</h1>
          <p className="mt-2 text-gray-500">Sign in to your RallyIQ account</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            {error && (
              <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-600">
                {error}
              </div>
            )}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Email</label>
              <Input
                type="email"
                placeholder="coach@rallyiq.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Password</label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="font-medium text-primary hover:text-primary-700">
              Create one
            </Link>
          </p>

          {/* Demo credentials */}
          <div className="mt-6 rounded-lg bg-blue-50 border border-blue-200 p-4">
            <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide mb-2">Demo Access</p>
            <p className="text-sm text-blue-600">Email: <code className="font-mono">admin@rallyiq.com</code></p>
            <p className="text-sm text-blue-600">Password: <code className="font-mono">demo123</code></p>
          </div>
        </div>
      </div>
    </div>
  )
}
