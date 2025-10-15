import type React from "react"
import type { Metadata } from "next"
import { Space_Grotesk, DM_Sans } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/lib/auth-context"
import { SettingsProvider } from "@/lib/settings-context"
import { I18nProvider } from "@/lib/i18n-context"
import Script from "next/script"
import { Analytics } from "@vercel/analytics/next"

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-space-grotesk",
})

const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-dm-sans",
})

export const metadata: Metadata = {
  title: {
    default: "TezYoz - Tez yozish testi",
    template: "%s | TezYoz",
  },
  description:
    "TezYoz — bu tez yozish mahoratingizni sinovdan o‘tkazadigan interaktiv o‘yin! Reyting, natijalar va doimiy rivojlanish uchun mukammal joy.",
  keywords: [
    "tez yozish",
    "tez yozish testi",
    "typing test",
    "typing speed",
    "tez yozuv",
    "tez yozish o‘yin",
    "TezYoz",
  ],
  authors: [{ name: "TezYoz Team" }],
  creator: "TezYoz Team",
  publisher: "TezYoz",
  metadataBase: new URL("https://tezyoz.uz"), //domain
  alternates: {
    canonical: "https://tezyoz.uz",
  },
  openGraph: {
    title: "TezYoz - Tez yozish testi",
    description:
      "Zamonaviy tez yozish testi ilovasi reyting va batafsil statistika bilan. O‘zingizni sinab ko‘ring!",
    url: "https://tezyoz.uz",
    siteName: "TezYoz",
    images: [
      {
        url: "/keyboard-o.png", // ✅ replace with your actual image
        width: 1200,
        height: 630,
        alt: "TezYoz - Tez yozish testi ilovasi",
      },
    ],
    locale: "uz_UZ",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TezYoz - Tez yozish testi",
    description:
      "Zamonaviy tez yozish testi ilovasi reyting va batafsil statistika bilan.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/keyboard.png",
    shortcut: "/keyboard.png",
    apple: "/keyboard.png",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  generator: "Next.js",
  category: "Typing Test",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="uz" className={`${spaceGrotesk.variable} ${dmSans.variable}`} suppressHydrationWarning>
      <head>

        {/* Google Analytics  */}
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-853GEGD913"
          strategy="afterInteractive"
        />

        <Script id="google-analytics" strategy="afterInteractive" >
          {`
          window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-853GEGD913');
  `}
        </Script>
        {/* Yandex.Metrika */}
        <Script id="yandex-metrika" strategy="afterInteractive">
          {`
            (function(m,e,t,r,i,k,a){
              m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
              m[i].l=1*new Date();
              for (var j = 0; j < document.scripts.length; j++) {
                if (document.scripts[j].src === r) { return; }
              }
              k=e.createElement(t),
              a=e.getElementsByTagName(t)[0],
              k.async=1,
              k.src=r,
              a.parentNode.insertBefore(k,a)
            })(window, document, 'script', 'https://mc.yandex.ru/metrika/tag.js?id=104371658', 'ym');

            ym(104371658, 'init', {
              ssr:true,
              webvisor:true,
              clickmap:true,
              ecommerce:"dataLayer",
              accurateTrackBounce:true,
              trackLinks:true
            });
          `}
        </Script>
        <meta name="yandex-verification" content="78d52e227473b116" />
        <meta name="yandex-verification" content="3629b58c537ea0c4" />
        {/* Optional fallback for no-JS users */}
        <noscript>
          <div>
            <img
              src="https://mc.yandex.ru/watch/104371658"
              style={{ position: "absolute", left: "-9999px" }}
              alt=""
            />
          </div>
        </noscript>
      </head>
      <body className="font-sans antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <I18nProvider>
            <AuthProvider>
              <SettingsProvider>
                <div className="min-h-screen bg-background text-foreground">
                  {children}
                  <Analytics />
                </div>
              </SettingsProvider>
            </AuthProvider>
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
