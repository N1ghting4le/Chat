import '../styles/globals.css'

export const metadata = {
  title: 'Social media'
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
