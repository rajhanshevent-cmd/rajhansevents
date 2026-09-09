import { 
  Playfair_Display, 
  Cormorant_Garamond, 
  Nunito_Sans, 
  Poppins 
} from 'next/font/google';
import { lazy, Suspense } from "react";
import Navbar from '@/component/Navbar';
import Footer from '@/component/Footer';

// --- HEADING FONTS ---
const playfair = Playfair_Display({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-playfair',
});

const cormorant = Cormorant_Garamond({ 
  weight: ['400', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-cormorant',
});

// --- BODY / VERSATILE FONTS ---
const nunito = Nunito_Sans({ 
  weight: ['300', '400', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-nunito',
});

const poppins = Poppins({
  weight: ['300', '400', '500', '600'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-poppins',
});

export const metadata = {
  title: "Raj Hansh Events | Premier Wedding & Event Management in Ranchi",
  description: "Professional wedding, birthday, and corporate luxury event planning in Ranchi, Jharkhand.",
};

const ChatWidget = lazy(() => import('@/component/WhatsAppWidget'));

export default function RootLayout({ children }) {
  return (
    <html 
      lang="en" 
      className={`${playfair.variable} ${cormorant.variable} ${nunito.variable} ${poppins.variable}`}
    >
      <head>
        <link rel="preconnect" href="https://pub-9013d6d8ce774b47b1bac90aa5326c3b.r2.dev" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://pub-9013d6d8ce774b47b1bac90aa5326c3b.r2.dev" />
        <link rel="preconnect" href="https://images.unsplash.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        <link rel="preconnect" href="https://assets.calendly.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://assets.calendly.com" />
      </head>
      <body>
        <Navbar /> 
        <main>{children}</main> {/* Ensures content is wrapped correctly[cite: 3] */}
        <Footer /> 

        

        <Suspense fallback={null}>
          <ChatWidget aria-label="Chat with us on WhatsApp"/>
        </Suspense>
      </body>
    </html>
  );
}