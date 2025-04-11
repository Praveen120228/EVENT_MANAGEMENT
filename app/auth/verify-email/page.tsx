'use client'

import Link from 'next/link'
import { CalendarRange, Mail } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

export default function VerifyEmailPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md space-y-8 px-4">
        <div className="flex flex-col items-center space-y-2 text-center">
          <Link href="/" className="flex items-center gap-2">
            <CalendarRange className="h-8 w-8 text-emerald-500" />
            <span className="text-2xl font-bold">Specyf</span>
          </Link>
          <h2 className="text-3xl font-bold tracking-tight">Check your email</h2>
          <p className="text-gray-500 dark:text-gray-400">
            We've sent you a verification link to complete your registration
          </p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-emerald-100 p-3">
                <Mail className="h-8 w-8 text-emerald-600" />
              </div>
            </div>
            <CardTitle className="text-center">Verify your email</CardTitle>
            <CardDescription className="text-center">
              We've sent a verification link to your email address. Please check your inbox and click the link to verify your account.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-md bg-gray-50 p-4 text-sm text-gray-500 dark:bg-gray-800 dark:text-gray-400">
              <p>If you don't see the email, check your spam folder.</p>
              <p className="mt-2">The verification link will expire in 24 hours.</p>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button asChild className="w-full bg-emerald-600 hover:bg-emerald-700">
              <Link href="/auth/login">Return to login</Link>
            </Button>
            <p className="text-center text-sm text-gray-500 dark:text-gray-400">
              Need help?{' '}
              <Link href="/contact" className="text-emerald-600 hover:text-emerald-700 dark:text-emerald-400">
                Contact support
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
} 