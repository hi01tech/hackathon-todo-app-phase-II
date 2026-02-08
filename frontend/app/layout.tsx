import './globals.css'

export const metadata = {
  title: 'TaskFlow - Modern Todo Management',
  description: 'A beautiful, modern todo application with authentication and real-time sync',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen antialiased font-sans">
        <div className="min-h-screen">
          {children}
        </div>
      </body>
    </html>
  )
}