'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { User, Session, WeakPassword } from '@supabase/supabase-js'

export function useSupabase() {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [initialized, setInitialized] = useState(false)
  const router = useRouter()

  const initializeAuth = useCallback(async () => {
    if (!isSupabaseConfigured() || !supabase) {
      setError('Supabase is not properly configured. Please check your environment variables.')
      setLoading(false)
      setInitialized(true)
      return
    }

    try {
      // Get the current session
      const { data: { session: currentSession }, error: sessionError } = await supabase.auth.getSession()
      
      if (sessionError) {
        console.error('Session error:', sessionError)
        setError(`Session error: ${sessionError.message}`)
        setLoading(false)
        setInitialized(true)
        return
      }

      // Update session and user state
      setSession(currentSession)
      setUser(currentSession?.user || null)
      
      // Set up auth state change listener
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, newSession) => {
          console.log('Auth state change:', event, newSession?.user?.id)
          
          // Always update the session
          setSession(newSession)
          
          switch (event) {
            case 'SIGNED_IN':
              setUser(newSession?.user || null)
              router.refresh() // Refresh the page to update server-side data
              break
            case 'SIGNED_OUT':
              setUser(null)
              setSession(null)
              router.push('/auth/login')
              break
            case 'USER_UPDATED':
              setUser(newSession?.user || null)
              break
            case 'INITIAL_SESSION':
              setUser(newSession?.user || null)
              break
            case 'TOKEN_REFRESHED':
              setSession(newSession)
              break
          }
        }
      )

      // Set initialized and loading states
      setInitialized(true)
      setLoading(false)

      return () => {
        subscription.unsubscribe()
      }
    } catch (err: any) {
      console.error('Auth initialization error:', err)
      setError(`Unexpected error: ${err.message || 'Unknown error'}`)
      setLoading(false)
      setInitialized(true)
    }
  }, [router])

  useEffect(() => {
    let mounted = true
    let cleanup: (() => void) | undefined
    
    const setup = async () => {
      if (mounted && !initialized) {
        cleanup = await initializeAuth()
      }
    }
    
    setup()
    
    return () => {
      mounted = false
      if (cleanup) {
        cleanup()
      }
    }
  }, [initializeAuth, initialized])

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      setLoading(true)
      setError(null)
      
      if (!isSupabaseConfigured() || !supabase) {
        const configError = 'Supabase is not properly configured'
        console.error(configError)
        setError(configError)
        return { error: configError }
      }
      
      console.log('Attempting to sign in with Supabase...', email)
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      
      if (error) {
        console.error('Authentication error:', error)
        setError(error.message)
        return { error: error.message }
      }
      
      if (!data?.user) {
        const noUserError = 'No user data received from authentication'
        console.error(noUserError)
        setError(noUserError)
        return { error: noUserError }
      }
      
      console.log('Authentication successful:', data.user)
      setUser(data.user)
      return { data }
      
    } catch (err: any) {
      const errorMessage = err.message || 'An unexpected error occurred during sign in'
      console.error('Sign in error:', err)
      setError(errorMessage)
      return { error: errorMessage }
    } finally {
      setLoading(false)
    }
  }, [supabase])

  const signUp = useCallback(async (email: string, password: string) => {
    try {
      setLoading(true)
      setError(null)
      
      if (!isSupabaseConfigured() || !supabase) {
        return { error: 'Supabase is not properly configured' }
      }
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      
      if (error) {
        setError(error.message)
        return { error: error.message }
      }
      
      return { data }
    } catch (err: any) {
      const errorMessage = err.message || 'An unexpected error occurred'
      setError(errorMessage)
      return { error: errorMessage }
    } finally {
      setLoading(false)
    }
  }, [])

  const signOut = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      if (!isSupabaseConfigured() || !supabase) {
        return { error: 'Supabase is not properly configured' }
      }
      
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        setError(error.message)
        return { error: error.message }
      }
      
      router.push('/')
      return { data: null }
    } catch (err: any) {
      const errorMessage = err.message || 'An unexpected error occurred'
      setError(errorMessage)
      return { error: errorMessage }
    } finally {
      setLoading(false)
    }
  }, [router])

  return {
    supabase,
    user,
    session,
    loading,
    error,
    initialized,
    signIn,
    signUp,
    signOut,
  }
} 