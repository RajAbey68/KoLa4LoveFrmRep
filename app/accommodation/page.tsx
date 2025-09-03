/* eslint-disable react/no-unescaped-entities */
'use client';

import React from 'react';
import AccommodationCard from '@/components/AccommodationCard';
import { EditableText } from '@/components/EditableText';
import { EditableImage } from '@/components/EditableImage';
// Admin mode disabled for production pages
// import { useAdminMode } from '@/hooks/useAdminMode';
import { airbnbUrl } from '@/lib/airbnb';

const WHATSAPP = "https://wa.me/94717765780?text=Hello%20from%20Ko%20Lake%20Villa%20website";
const MANAGER_TEL = "tel:+94717765780";

function AccommodationContent() {
  // Admin mode disabled for production pages
  const adminMode = false;

  const handleContentSave = async (id: string, value: string) => {
    try {
      await fetch('/api/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, type: 'text', value })
      });
    } catch (error) {
      console.error('Error saving content:', error);
    }
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 space-y-10">
      {/* Top contact strip */}
      <section className="rounded-xl border bg-white p-4 flex flex-wrap items-center gap-3">
        <div className="text-sm">
          <span className="font-semibold">Manager:</span> +94 71 776 5780
          <span className="ml-2 text-gray-500">(Sri Lanka, GMT+5:30)</span>
        </div>
        <div className="ml-auto flex gap-3">
          <a href={MANAGER_TEL} className="rounded-lg border px-3 py-1.5 text-sm hover:bg-gray-50">
            Call
          </a>
          <a href={WHATSAPP} target="_blank" rel="noopener" className="rounded-lg bg-green-600 text-white px-3 py-1.5 text-sm hover:opacity-90">
            WhatsApp
          </a>
        </div>
      </section>

      {/* Airbnb copy/paste panel */}
      <section className="rounded-2xl border bg-white p-5">
        <EditableText 
          id="accommodation-title"
          initialValue="Accommodation"
          element="h1"
          className="text-2xl font-semibold mb-2"
          onSave={handleContentSave}
          adminMode={adminMode}
        />
        <EditableText 
          id="accommodation-subtitle"
          initialValue="Open the Airbnb listing if you prefer to book there, or book direct below and save."
          element="p"
          className="text-gray-600 mb-4"
          onSave={handleContentSave}
          adminMode={adminMode}
        />
        {/* Airbnb Listings Grid */}
        <div className="grid md:grid-cols-2 gap-4 mt-4">
          {[
            { id: 'entire-villa', label: 'Entire Villa', url: 'villa', code: 'eklv', description: 'Complete 7-bedroom lakeside villa' },
            { id: 'master-suite', label: 'Master Family Suite', url: 'master', code: 'klv6', description: 'Spacious master bedroom with lake views' },
            { id: 'triple-twin', label: 'Triple/Twin Rooms', url: 'triple', code: 'klv2or3', description: 'Flexible room configurations' },
            { id: 'pool-room', label: 'Pool Room Modal Duwa View', url: 'poolroom', code: 'klvr4', description: 'Pool-side room with stunning lake views' },
            { id: 'birds-eye', label: 'Birds Eye Lake View', url: 'birdseye', code: 'klvr5', description: 'Elevated room with panoramic lake views' },
            { id: 'left-wing', label: 'Birds Eye Left Wing', url: 'leftwing', code: 'klvr6', description: 'Private wing with lake access' }
          ].map((listing) => (
            <div key={listing.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-gradient-to-br from-white to-gray-50">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <EditableText 
                    id={`${listing.id}-label`}
                    initialValue={listing.label}
                    element="h3"
                    className="font-semibold text-lg text-gray-800 mb-1"
                    onSave={handleContentSave}
                    adminMode={adminMode}
                  />
                  <p className="text-gray-600 text-sm mb-3">{listing.description}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-medium">
                      airbnb.co.uk/h/{listing.code}
                    </span>
                  </div>
                </div>
                <a 
                  href={airbnbUrl(listing.url as any)} 
                  target="_blank" 
                  rel="noopener"
                  className="ml-3 bg-[#FF5A5F] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#E00007] transition-colors flex items-center gap-2"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.1,2C6.6,2,2.1,6.5,2.1,12c0,8.1,9.3,15.5,9.6,15.8c0.2,0.1,0.3,0.1,0.5,0c0.3-0.3,9.6-7.7,9.6-15.8C21.8,6.5,17.3,2,12.1,2z M12.1,15.5c-1.9,0-3.5-1.6-3.5-3.5s1.6-3.5,3.5-3.5s3.5,1.6,3.5,3.5S14,15.5,12.1,15.5z"/>
                  </svg>
                  View
                </a>
              </div>
            </div>
          ))}
        </div>
        
        {/* Additional room - Lake & Roof Verandah */}
        <div className="mt-4 border rounded-lg p-4 bg-gradient-to-br from-emerald-50 to-teal-50">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <EditableText 
                id="lake-verandah-label"
                initialValue="Lake & Roof Verandah"
                element="h3"
                className="font-semibold text-lg text-emerald-800 mb-1"
                onSave={handleContentSave}
                adminMode={adminMode}
              />
              <p className="text-emerald-700 text-sm mb-3">Premium outdoor spaces with lake and rooftop access</p>
              <div className="flex items-center gap-2">
                <span className="text-xs bg-emerald-200 text-emerald-800 px-2 py-1 rounded-full font-medium">
                  airbnb.co.uk/h/klvr7
                </span>
                <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">
                  Special Features
                </span>
              </div>
            </div>
            <a 
              href={airbnbUrl('lakeverandah')} 
              target="_blank" 
              rel="noopener"
              className="ml-3 bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.1,2C6.6,2,2.1,6.5,2.1,12c0,8.1,9.3,15.5,9.6,15.8c0.2,0.1,0.3,0.1,0.5,0c0.3-0.3,9.6-7.7,9.6-15.8C21.8,6.5,17.3,2,12.1,2z M12.1,15.5c-1.9,0-3.5-1.6-3.5-3.5s1.6-3.5,3.5-3.5s3.5,1.6,3.5,3.5S14,15.5,12.1,15.5z"/>
              </svg>
              View
            </a>
          </div>
        </div>
        
        <p className="text-xs text-gray-500 mt-4 text-center">
          💡 Tip: Click "View" buttons to open Airbnb listings in new tabs
        </p>
      </section>

      {/* Pricing disclaimer */}
      <section className="rounded-2xl border-2 border-emerald-200 bg-emerald-50 p-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">💰</span>
            </div>
          </div>
          <div className="flex-1">
            <EditableText 
              id="pricing-title"
              initialValue="Direct Booking Savings"
              element="h3"
              className="text-lg font-semibold text-emerald-800 mb-2"
              onSave={handleContentSave}
              adminMode={adminMode}
            />
            <EditableText 
              id="pricing-description"
              initialValue="Prices shown below are current Airbnb rates. Book direct with us and save automatically:"
              element="p"
              className="text-emerald-700 mb-4"
              onSave={handleContentSave}
              adminMode={adminMode}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="bg-white rounded-lg p-3 border border-emerald-200">
                <EditableText 
                  id="standard-booking-title"
                  initialValue="Standard Direct Booking"
                  element="div"
                  className="text-sm font-medium text-emerald-800"
                  onSave={handleContentSave}
                  adminMode={adminMode}
                />
                <EditableText 
                  id="standard-booking-discount"
                  initialValue="Save 10%"
                  element="div"
                  className="text-2xl font-bold text-emerald-600"
                  onSave={handleContentSave}
                  adminMode={adminMode}
                />
                <EditableText 
                  id="standard-booking-availability"
                  initialValue="Always available"
                  element="div"
                  className="text-xs text-emerald-600"
                  onSave={handleContentSave}
                  adminMode={adminMode}
                />
              </div>
              <div className="bg-white rounded-lg p-3 border border-emerald-200">
                <EditableText 
                  id="lastminute-booking-title"
                  initialValue="Last-Minute Special"
                  element="div"
                  className="text-sm font-medium text-emerald-800"
                  onSave={handleContentSave}
                  adminMode={adminMode}
                />
                <EditableText 
                  id="lastminute-booking-discount"
                  initialValue="Save 25%"
                  element="div"
                  className="text-2xl font-bold text-emerald-600"
                  onSave={handleContentSave}
                  adminMode={adminMode}
                />
                <EditableText 
                  id="lastminute-booking-conditions"
                  initialValue="Sun-Wed, booked within 3 days"
                  element="div"
                  className="text-xs text-emerald-600"
                  onSave={handleContentSave}
                  adminMode={adminMode}
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <a 
                href="/deals" 
                className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium"
              >
                <EditableText 
                  id="calculate-savings-button-text"
                  initialValue="Calculate Your Savings →"
                  element="span"
                  onSave={handleContentSave}
                  adminMode={adminMode}
                />
              </a>
              <div className="flex gap-2">
                <a 
                  href={airbnbUrl('villa')} 
                  target="_blank" 
                  rel="noopener" 
                  className="inline-flex items-center px-3 py-2 border border-emerald-300 text-emerald-700 rounded-lg hover:bg-emerald-100 transition-colors text-sm"
                >
                  <EditableText 
                    id="compare-airbnb-button-text"
                    initialValue="Compare on Airbnb"
                    element="span"
                    onSave={handleContentSave}
                    adminMode={adminMode}
                  />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cards */}
      <section className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        <AccommodationCard
          kind="villa"
          title="Entire Villa Exclusive"
          guests="16 guests (up to 24)"
          baseNight={431}
          perks={['Private pool', 'Lake views']}
          image="/images/rooms/villa.jpg"
        />
        <AccommodationCard
          kind="master"
          title="Master Family Suite"
          guests="3 guests (up to 6)"
          baseNight={119}
          perks={['Lake view', 'Private balcony']}
          image="/images/rooms/master.jpg"
        />
        <AccommodationCard
          kind="triple"
          title="Triple/Twin Rooms"
          guests="3 guests (up to 4)"
          baseNight={70}
          perks={['Garden view', 'Twin/Triple beds']}
          image="/images/rooms/triple.jpg"
        />
        <AccommodationCard
          kind="group"
          title="Group Room"
          guests="5 guests (up to 8)"
          baseNight={119}
          perks={['Multiple beds', 'Shared space']}
          image="/images/rooms/group.jpg"
        />
      </section>

      {/* Benefits Section */}
      <section className="rounded-2xl border-2 border-emerald-200 bg-emerald-50 p-6">
        <div className="text-center mb-8">
          <EditableText 
            id="benefits-title"
            initialValue="Why Book Direct with Ko Lake Villa?"
            element="h2"
            className="text-2xl font-semibold text-emerald-800 mb-3"
            onSave={handleContentSave}
            adminMode={adminMode}
          />
          <EditableText 
            id="benefits-subtitle"
            initialValue="Skip the middleman and enjoy exclusive benefits unavailable on booking platforms"
            element="p"
            className="text-emerald-700 text-lg"
            onSave={handleContentSave}
            adminMode={adminMode}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-5 border border-emerald-200">
            <div className="w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center mb-4">
              <span className="text-white text-xl">💰</span>
            </div>
            <h3 className="text-lg font-semibold text-emerald-800 mb-2">Best Price Guarantee</h3>
            <ul className="text-emerald-700 text-sm space-y-1">
              <li>• 10% below best Airbnb rates</li>
              <li>• Up to 25% total savings</li>
              <li>• No booking fees or hidden charges</li>
              <li>• Last-minute specials (Sun-Wed)</li>
            </ul>
          </div>
          <div className="bg-white rounded-xl p-5 border border-emerald-200">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mb-4">
              <span className="text-white text-xl">🤝</span>
            </div>
            <h3 className="text-lg font-semibold text-emerald-800 mb-2">Personal Service</h3>
            <ul className="text-emerald-700 text-sm space-y-1">
              <li>• Direct communication with villa management</li>
              <li>• Personalized check-in and concierge service</li>
              <li>• Custom meal planning and dietary accommodations</li>
              <li>• Local activity recommendations and bookings</li>
            </ul>
          </div>
          <div className="bg-white rounded-xl p-5 border border-emerald-200">
            <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mb-4">
              <span className="text-white text-xl">🎯</span>
            </div>
            <h3 className="text-lg font-semibold text-emerald-800 mb-2">Flexible Terms</h3>
            <ul className="text-emerald-700 text-sm space-y-1">
              <li>• Flexible cancellation policy</li>
              <li>• Extended stay discounts</li>
              <li>• Customizable booking dates and times</li>
              <li>• Special occasion arrangements</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Book Now Section */}
      <section className="rounded-2xl border-2 border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 p-8 text-center">
        <h2 className="text-2xl font-bold text-amber-800 mb-4">Ready to Experience Ko Lake Villa?</h2>
        <p className="text-amber-700 text-lg mb-6">
          Save 10% with direct booking • Personal service • Best rate guarantee
        </p>
        <div className="flex gap-4 justify-center items-center">
          <a 
            href="/contact" 
            className="inline-flex items-center px-8 py-4 bg-amber-600 text-white rounded-xl hover:bg-amber-700 transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Book Now
          </a>
          <span className="text-gray-400 text-sm">or</span>
          <a 
            href={WHATSAPP} 
            target="_blank" 
            rel="noopener" 
            className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            Chat on WhatsApp
          </a>
        </div>
        <p className="text-amber-600 text-sm mt-4">
          Direct bookings include flexible cancellation and personalized service
        </p>
      </section>
    </main>
  );
}

export default function AccommodationPage() {
  return (
      <AccommodationContent />
  );
}