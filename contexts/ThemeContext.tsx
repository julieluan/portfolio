'use client'
import { createContext, useContext, useState, ReactNode } from 'react'

const ThemeContext = createContext({ theme: 'light', setTheme: (t: string) => {} })

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState('light')
  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>
}

export const useTheme = () => useContext(ThemeContext)
