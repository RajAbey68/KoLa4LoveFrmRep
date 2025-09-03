import { Metadata } from 'next';
import CampaignLanding from './components/CampaignLanding';

export const metadata: Metadata = {
  title: 'Special Offers - Ko Lake Villa | Luxury Sri Lankan Getaway',
  description: 'Discover exclusive deals and special offers at Ko Lake Villa. Luxury lakeside accommodation with personalized packages for couples, families, and corporate retreats.',
  keywords: 'Ko Lake Villa deals, Sri Lanka luxury villa offers, lakeside resort packages, exclusive villa discounts',
  openGraph: {
    title: 'Special Offers - Ko Lake Villa',
    description: 'Exclusive packages and deals for your luxury Sri Lankan getaway',
    images: ['/images/villa-hero.jpg'],
  }
};

export default function CampaignsPage() {
  return <CampaignLanding />;
}