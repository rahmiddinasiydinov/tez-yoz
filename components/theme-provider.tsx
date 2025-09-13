"use client";

import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import safeStorage from "@/lib/safe-storage";

type Theme = "dark" | "light" | "system";

type ThemeProviderProps = {
  children: React.ReactNode;
  attribute?: string;
  defaultTheme?: Theme;
  enableSystem?: boolean;
  disableTransitionOnChange?: boolean;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  attribute = "class",
  defaultTheme = "system",
  enableSystem = true,
  disableTransitionOnChange = false,
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(() => {
    // On the client, try to get the theme from safeStorage during SSR
    if (typeof window !== "undefined") {
      const stored = safeStorage.getItem("theme") as Theme;
      return stored || defaultTheme;
    }
    return defaultTheme;
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const root = window.document.documentElement;
    root.classList.remove("light", "dark");

    let resolvedTheme = theme;
    if (theme === "system" && enableSystem) {
      resolvedTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }

    root.classList.add(resolvedTheme);

    if (disableTransitionOnChange) {
      // Temporarily disable transitions to prevent flickering
      root.style.transition = "none";
      requestAnimationFrame(() => {
        root.style.transition = "";
      });
    }

    safeStorage.setItem("theme", theme);
  }, [theme, mounted, enableSystem, disableTransitionOnChange]);

  const value = { theme, setTheme };

  // Prevent rendering children until the theme is applied
  if (!mounted) {
    return null; // Or a loading spinner: <div>Loading...</div>
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);
  if (context === undefined) throw new Error("useTheme must be used within a ThemeProvider");
  return context;
};