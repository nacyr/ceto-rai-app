'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '@/app/lib/supabase'
import { Database } from '@/types/database'

type Profile = Database['public']['Tables']['profiles']['Row']

type AuthContextType = {
  user: User | null
  profile: Profile | null
  loading: boolean
  signUp: (email: string, password: string) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  updateProfile: (updates: Partial<Profile>) => Promise<void>
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for changes on auth state
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    // Fetch profile when user changes
    if (user?.id) {
      supabase
        .from('profiles')
        .select()
        .eq('id', user.id)
        .single()
        .then(({ data, error }) => {
          if (!error && data) {
            setProfile(data)
          }
        })
    } else {
      setProfile(null)
    }
  }, [user])

  const signUp = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`
        }
      })
      
      if (error) {
        console.error('Supabase signUp error:', error)
        throw error
      }
      
       // Create profile for new user
       if (data.user) {
         const { error: profileError } = await supabase
           .from('profiles')
           .insert({
             id: data.user.id,
             email: data.user.email!,
             full_name: null,
             avatar_url: null,
           created_at: new Date().toISOString()
         })
         if (profileError) {
           console.error('Profile creation error:', profileError)
           throw profileError
         }
       }
     } catch (error) {
       console.error('SignUp process error:', error)
       throw error
     }
   }

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw error
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) throw new Error('No user logged in')

    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)

    if (error) throw error
    
    setProfile((prev) => prev ? { ...prev, ...updates } : null)
  }

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      loading,
      signUp,
      signIn,
      signOut,
      updateProfile
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  return useContext(AuthContext)
}