import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'sonner'
import { AuthProvider } from '@/lib/auth-context'
import { NotificationsProvider } from '@/lib/notifications-context'
import { RoleThemeProvider } from '@/components/theme/RoleThemeProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ProcureLink - B2B Procurement Platform',
  description: 'Streamline your B2B procurement process. Connect buyers with suppliers, request quotes, compare prices, and manage orders all in one platform.',
  keywords: ['B2B', 'procurement', 'RFQ', 'quotes', 'suppliers', 'inventory management', 'purchase orders'],
  authors: [{ name: 'ProcureLink' }],
  openGraph: {
    title: 'ProcureLink - B2B Procurement Platform',
    description: 'Streamline your B2B procurement process with our all-in-one platform',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ProcureLink - B2B Procurement Platform',
    description: 'Streamline your B2B procurement process with our all-in-one platform',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <RoleThemeProvider>
            <NotificationsProvider>
              {children}
              <Toaster position="bottom-right" />
            </NotificationsProvider>
          </RoleThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
