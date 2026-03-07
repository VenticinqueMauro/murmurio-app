import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Murmurio — El puente entre tu consciente y tu subconsciente',
  description:
    'Escritura terapéutica con análisis de latencia e inteligencia artificial para descubrir lo que tu subconsciente quiere comunicar.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        {/* Anti-flash: aplica el tema antes de que React hidrate */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('murmurio-theme');if(t==='light')document.documentElement.setAttribute('data-theme','light');}catch(e){}})()`,
          }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}>
        {children}
      </body>
    </html>
  );
}
