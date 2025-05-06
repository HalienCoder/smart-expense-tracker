import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../services/supabaseClient'

// Create the AuthContext
const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Fetch the session (called on initial load)
  useEffect(() => {
    const getSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Error getting session:', error);
      } else {
        setUser(data.session?.user ?? null);
        setLoading(false);
      }
    };
  
    getSession();
  
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });
  
    return () => subscription.unsubscribe();
  }, []);
  
  const logout = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }
  
  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// Custom hook to access the auth context
export const useAuth = () => useContext(AuthContext)
