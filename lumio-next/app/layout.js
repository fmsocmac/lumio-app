import { Playfair_Display, Instrument_Sans } from 'next/font/google'
import './globals.css'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
})

const instrument = Instrument_Sans({
  subsets: ['latin'],
  variable: '--font-instrument',
})

export const metadata = {
  title: 'Lumio',
  description: 'Finally understand your money.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${playfair.variable} ${instrument.variable}`}>
        {children}
      </body>
    </html>
  )
}