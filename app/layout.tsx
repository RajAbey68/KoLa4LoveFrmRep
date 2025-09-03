import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import GlobalHeader from '@/components/navigation/GlobalHeader';
import WhatsAppButtons from '@/components/WhatsAppButtons';
import ContactDialog from '@/components/ContactDialog';
import { LightboxProvider } from '@/components/gallery/Lightbox';
import { AuthProvider } from '@/components/auth/AuthProvider';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: "Ko Lake Villa - Luxury Lakefront Accommodation in Sri Lanka",
  description: "Ko Lake Villa - Relax, Revive, Reconnect. Luxury lakefront accommodation in Sri Lanka with stunning views and premium amenities.",
  metadataBase: new URL(process.env.CUSTOM_DOMAIN ? `https://${process.env.CUSTOM_DOMAIN}` :
                      process.env.NODE_ENV === 'production' ? 'https://kolakevilla.replit.app' : 'http://localhost:5000'),
  other: {
        // Business contact information
        "business:contact_data:street_address": "Middolduwa Road, Kathaluwa West",
        "business:contact_data:locality": "Ahangama",
        "business:contact_data:postal_code": "80650",
        "business:contact_data:country_name": "Sri Lanka",
        "business:contact_data:phone_number": "+94 71 123 4567",
        "business:contact_data:website": "https://www.kolakevilla.com",
        // Custom geo meta tags
        "geo.region": "LK-2",
        "geo.placename": "Ahangama",
        "geo.position": "5.975486;80.361694",
        "ICBM": "5.975486, 80.361694",
        // Place information
        "place:location:latitude": "5.975486",
        "place:location:longitude": "80.361694",
        // Additional SEO meta tags
        "rating": "4.9",
        "review_count": "150",
        "price_range": "$$$$"
  },
  // Meta tags for Google preview
  openGraph: {
    title: "Ko Lake Villa - Luxury Accommodation in Ahangama, Sri Lanka",
    description: "Experience luxury accommodation at Ko Lake Villa, Ahangama, Sri Lanka. Premium lakeside villa with stunning views and world-class amenities.",
    type: "website",
    url: "https://www.kolakevilla.com",
    images: [
      {
        url: "https://www.kolakevilla.com/images/hero/drone-villa.jpg",
        width: 1200,
        height: 630,
      },
    ],
    siteName: "Ko Lake Villa",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
  },
  // Additional meta tags for Google Search Console and SEO
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true
    }
  },
  // Existing meta tags
  keywords: "Ko Lake Villa, Sri Lanka accommodation, Ahangama villa, luxury hotel, lakeside villa, Sri Lanka tourism",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <LightboxProvider>
          <AuthProvider>
            <GlobalHeader />
            <main>
              {children}
            </main>
          </AuthProvider>
        </LightboxProvider>
      </body>
    </html>
  )
}