// APPROVED CONTACT PAGE — DO NOT MODIFY WITHOUT OWNER'S WRITTEN PERMISSION
'use client';

import { Card, Button } from "@/components/ui/card";
import { waChatHref } from "@/lib/wa";
import ContactForm from "./components/ContactForm";
import { generateStructuredData } from "@/lib/seo";
import Span from '@/components/span';
import LocationMap from '@/components/LocationMap';

const COUNTRY_CODES = [
  { code: "LK", name: "Sri Lanka", dial: "+94" },
  { code: "GB", name: "United Kingdom", dial: "+44" },
  { code: "US", name: "United States", dial: "+1" },
  { code: "AE", name: "United Arab Emirates", dial: "+971" },
  { code: "AU", name: "Australia", dial: "+61" },
  { code: "SG", name: "Singapore", dial: "+65" },
];



function ContactContent() {
  const structuredData = generateStructuredData('localBusiness');
  const groupUrl = "https://chat.whatsapp.com/GwGdVgl0nVtAS36pZ8sfRw";
  const fallback = process.env.NEXT_PUBLIC_WA_MANAGER || "+94717765780";
  const waHref = groupUrl;

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 space-y-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <Span
        id="contact-page-title"
        element="h1"
        className="text-2xl font-semibold"
      >
        Contact Us
      </Span>

      {/* Quick Contact Options */}
      <Card>
        <Span
          id="quick-contact-title"
          element="h2"
          className="text-lg font-semibold mb-3"
        >
          Quick Contact
        </Span>
        <Span
          id="quick-contact-description"
          element="p"
          className="text-sm text-gray-600 mb-4"
        >
          For immediate assistance, join our WhatsApp group conversation or call our manager directly.
        </Span>
        <div className="flex gap-3 justify-center">
          <Button href={waHref} variant="solid" size="sm">WhatsApp Group</Button>
          <Button href={`tel:${fallback}`} variant="outline" size="sm">Call Manager</Button>
        </div>
        <p className="text-xs text-gray-500 mt-3 text-center">Sri Lanka time (GMT+5:30). For fastest response, join our WhatsApp group conversation.</p>
      </Card>

      {/* People */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <h3 className="font-semibold">General Manager</h3>
          <p className="mt-1 text-gray-700">+94 71 776 5780</p>
          <div className="mt-4 flex gap-2 justify-center">
            <Button href="tel:+94717765780" variant="outline" size="sm">Call</Button>
            <Button href={waChatHref({ fallbackPhone: "+94717765780", message: "Hello, I'd like to make a booking." })} size="sm">WhatsApp</Button>
          </div>
        </Card>
        <Card>
          <h3 className="font-semibold">Villa Team Lead (Sinhala speaker)</h3>
          <p className="mt-1 text-gray-700">+94 77 315 0602</p>
          <div className="mt-4 flex gap-2 justify-center">
            <Button href="tel:+94773150602" variant="outline" size="sm">Call</Button>
            <Button href={waChatHref({ fallbackPhone: "+94773150602", message: "Hello, I'd like to make a booking." })} size="sm">WhatsApp</Button>
          </div>
        </Card>
        <Card className="sm:col-span-2">
          <h3 className="font-semibold">Owner</h3>
          <p className="mt-1 text-gray-700">+94 71 173 0345</p>
          <div className="mt-4 flex gap-2 justify-center">
            <Button href="tel:+94711730345" variant="outline" size="sm">Call</Button>
            <Button href={waChatHref({ fallbackPhone: "+94711730345", message: "Hello, I'd like to make a booking." })} size="sm">WhatsApp</Button>
          </div>
        </Card>
      </div>



      {/* Contact Form */}
      <ContactForm />

      {/* Dialing tips */}
      <Card>
        <h3 className="font-semibold mb-2">International Dialing Tips</h3>
        <ul className="list-disc ml-5 text-sm text-gray-700 space-y-1">
          <li>Example Sri Lanka format: +94&nbsp;xx&nbsp;xxx&nbsp;xxxx</li>
          <li>If calling from abroad, ensure your plan allows international calls.</li>
          <li>WhatsApp is preferred for fastest response and lower cost.</li>
        </ul>
      </Card>

      {/* Travel Times */}
      <Card>
        <h3 className="font-semibold mb-4">Travel Times to Ko Lake Villa</h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <div className="text-sm">
            <p className="font-medium text-gray-900">Colombo Airport</p>
            <p className="text-gray-600">2:30 hours</p>
          </div>
          <div className="text-sm">
            <p className="font-medium text-gray-900">Colombo</p>
            <p className="text-gray-600">2 hours</p>
          </div>
          <div className="text-sm">
            <p className="font-medium text-gray-900">Galle</p>
            <p className="text-gray-600">30 minutes</p>
          </div>
          <div className="text-sm">
            <p className="font-medium text-gray-900">Ahangama</p>
            <p className="text-gray-600">15 minutes</p>
          </div>
          <div className="text-sm">
            <p className="font-medium text-gray-900">Yala National Park</p>
            <p className="text-gray-600">2:30 hours</p>
          </div>
        </div>
      </Card>

      {/* Location & Map */}
      <Card>
        <h3 className="font-semibold mb-4">Location & Directions</h3>

        {/* Address */}
        <div className="mb-4">
          <p className="text-sm font-medium text-gray-900 mb-2">Address</p>
          <div className="text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded space-y-1">
            <p><strong>Ko Lake Villa</strong></p>
            <p>Madolduwa Road</p>
            <p>Kathaluwa West</p>
            <p>Ahangama 80650</p>
            <p>Sri Lanka</p>
          </div>
        </div>

        {/* What3Words Location */}
        <div className="mb-4">
          <p className="text-sm font-medium text-gray-900 mb-2">What3Words Location</p>
          <div className="text-sm text-muted-foreground" dangerouslySetInnerHTML={{
            __html: `<a href="https://what3words.com/wifely.rebuff.vented" target="_blank" rel="noopener noreferrer" class="font-mono text-emerald-600 hover:text-emerald-700">///wifely.rebuff.vented</a>`
          }} />
          <p className="text-xs text-gray-500 mt-1">
            Use the What3Words app for precise navigation to our entrance
          </p>
        </div>

        {/* Google Map */}
        <div className="mt-4">
          <p className="text-sm font-medium text-gray-900 mb-3">Google Map & Directions</p>
          <div className="mb-3">
            <a
              href="https://maps.app.goo.gl/n2Q7QGk63sJ43U7y9"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-lg font-medium transition-colors px-4 py-2 text-sm bg-emerald-600 text-white hover:bg-emerald-700"
            >
              Open in Google Maps
            </a>
          </div>
          <LocationMap />
          <p className="text-xs text-gray-500 mt-2">
            Click "Open in Google Maps" for turn-by-turn directions to Ko Lake Villa
          </p>
        </div>
      </Card>
    </main>
  );
}

export default function ContactPage() {
  return (
      <ContactContent />
  );
}