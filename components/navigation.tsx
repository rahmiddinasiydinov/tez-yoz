"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Keyboard, Trophy, Settings, User, LogOut, Sun, Moon, Monitor, Globe } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { useI18n } from "@/lib/i18n-context"
import { useTheme } from "@/components/theme-provider"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function Navigation() {
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const { t, language, setLanguage } = useI18n()
  const { theme, setTheme } = useTheme()

  const navItems = [
    { href: "/", label: t('test'), icon: Keyboard },
    {href: "/leaderboard", label: t('leaderboard'), icon: Trophy},
    {href: "/settings", label: t('settings'), icon: Settings},
    {href: "/profile", label: t('profile'), icon: User},
  ]

  const languages = [
    { code: "uz" as const, name: "O'zbek" },
    { code: "en" as const, name: "English" },
    { code: "ru" as const, name: "Русский" },
  ]

  const themes = [
    { value: "light", label: t('lightMode'), icon: Sun },
    {value: "dark", label: t('darkMode'), icon: Moon},
    {value: "system", label: t('systemMode'), icon: Monitor},
  ]

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          <Link href="/" className="flex items-center space-x-2 min-w-0">
            <Keyboard className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
            <span className="font-heading font-bold text-base sm:text-lg truncate">TezYoz</span>
          </Link>

          <div className="md:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <div className="flex flex-col space-y-1">
                    <div className="w-4 h-0.5 bg-current"></div>
                    <div className="w-4 h-0.5 bg-current"></div>
                    <div className="w-4 h-0.5 bg-current"></div>
                  </div>
                  <span className="sr-only">Menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {navItems.map((item) => {
                  const Icon = item.icon
                  const isActive = pathname === item.href
                  return (
                    <DropdownMenuItem key={item.href} asChild>
                      <Link href={item.href} className={cn(isActive && "bg-accent")}>
                        <Icon className="h-4 w-4 mr-2" />
                        {item.label}
                      </Link>
                    </DropdownMenuItem>
                  )
                })}
                <DropdownMenuSeparator />
                {/* Mobile theme switcher */}
                {themes.map((themeOption) => {
                  const Icon = themeOption.icon
                  return (
                    <DropdownMenuItem
                      key={themeOption.value}
                      onClick={() => setTheme(themeOption.value as any)}
                      className={cn(theme === themeOption.value && "bg-accent")}
                    >
                      <Icon className="h-4 w-4 mr-2" />
                      {themeOption.label}
                    </DropdownMenuItem>
                  )
                })}
                <DropdownMenuSeparator />
                {/* Mobile language switcher */}
                {languages.map((lang) => (
                  <DropdownMenuItem
                    key={lang.code}
                    onClick={() => setLanguage(lang.code)}
                    className={cn(language === lang.code && "bg-accent")}
                  >
                    <Globe className="h-4 w-4 mr-2" />
                    {lang.name}
                  </DropdownMenuItem>
                ))}
                {user && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout} className="text-destructive">
                      <LogOut className="h-4 w-4 mr-2" />
                      {t('signOut')}
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href

              return (
                <Button key={item.href} variant={isActive ? "secondary" : "ghost"} size="sm" asChild className="h-8">
                  <Link href={item.href}>
                    <Icon className="h-4 w-4 mr-2" />
                    <span className="text-sm">{item.label}</span>
                  </Link>
                </Button>
              )
            })}
          </div>

          <div className="hidden md:flex items-center space-x-2">
            {/* Theme Switcher */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                  <span className="sr-only">{t('theme')}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {themes.map((themeOption) => {
                  const Icon = themeOption.icon
                  return (
                    <DropdownMenuItem
                      key={themeOption.value}
                      onClick={() => setTheme(themeOption.value as any)}
                      className={cn(theme === themeOption.value && "bg-accent")}
                    >
                      <Icon className="h-4 w-4 mr-2" />
                      {themeOption.label}
                    </DropdownMenuItem>
                  )
                })}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Language Switcher */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Globe className="h-4 w-4" />
                  <span className="sr-only">{t('interfaceLanguage')}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {languages.map((lang) => (
                  <DropdownMenuItem
                    key={lang.code}
                    onClick={() => setLanguage(lang.code)}
                    className={cn(language === lang.code && "bg-accent")}
                  >
                    {lang.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User Menu */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 px-2">
                    <User className="h-4 w-4 mr-2" />
                    <span className="text-sm">{user.username}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href="/profile">{t('viewProfile')}</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings">{t('settings')}</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="text-destructive">
                    <LogOut className="h-4 w-4 mr-2" />
                    {t('signOut')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" asChild className="h-8">
                  <Link href="/login">{t('login')}</Link>
                </Button>
                <Button size="sm" asChild className="h-8">
                  <Link href="/signup">{t('signup')}</Link>
                </Button>
              </div>
            )}
          </div>

          {!user && (
            <div className="md:hidden flex items-center space-x-1">
              <Button variant="ghost" size="sm" asChild className="h-8 text-xs px-2">
                <Link href="/login">{t('login')}</Link>
              </Button>
              <Button size="sm" asChild className="h-8 text-xs px-2">
                <Link href="/signup">{t('signup')}</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
