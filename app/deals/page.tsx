
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Users, Clock, Star, Gift, MapPin, Wifi, Car, Utensils, Coffee } from 'lucide-react';
import ClientOnly from '@/components/system/ClientOnly';
import ClientDealsWrapper from './client-deals-wrapper';

const FEATURED_DEALS = [
  {
    id: 'early-bird-2024',
    title: 'Early Bird Special',
    description: 'Book 60 days in advance and save big on your Ko Lake Villa experience',
    discount: '25% OFF',
    validUntil: '2024-12-31',
    features: ['Free airport transfer', 'Welcome fruit basket', 'Late checkout'],
    minNights: 3,
    type: 'advance-booking'
  },
  {
    id: 'weekly-luxury',
    title: 'Weekly Luxury Escape',
    description: 'Extended stays for the ultimate relaxation experience',
    discount: '30% OFF',
    validUntil: '2024-12-31', 
    features: ['Daily housekeeping', 'Private chef (3 meals)', 'Spa treatments'],
    minNights: 7,
    type: 'extended-stay'
  },
  {
    id: 'honeymoon-package',
    title: 'Honeymoon Paradise',
    description: 'Romantic getaway with special touches for newlyweds',
    discount: '20% OFF',
    validUntil: '2024-12-31',
    features: ['Couples massage', 'Candlelit dinner', 'Flower decoration'],
    minNights: 4,
    type: 'romantic'
  },
  {
    id: 'group-celebration',
    title: 'Group Celebration Package',
    description: 'Perfect for family reunions, corporate retreats, or friend gatherings',
    discount: '35% OFF',
    validUntil: '2024-12-31',
    features: ['Event planning', 'BBQ setup', 'Group activities'],
    minNights: 3,
    type: 'group'
  }
];

const AMENITIES = [
  { icon: Wifi, name: 'High-Speed WiFi' },
  { icon: Car, name: 'Free Parking' },
  { icon: Utensils, name: 'Fully Equipped Kitchen' },
  { icon: Coffee, name: 'Coffee & Tea Station' },
];

interface Deal {
  id: string;
  title: string;
  description: string;
  discount: string;
  validUntil: string;
  features: string[];
  minNights: number;
  type: string;
}

export default function DealsPage() {
  const [selectedDeal, setSelectedDeal] = useState<string | null>(null);
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [guests, setGuests] = useState(2);

  const getDealBadgeColor = (type: string) => {
    switch (type) {
      case 'advance-booking': return 'bg-blue-100 text-blue-800';
      case 'extended-stay': return 'bg-purple-100 text-purple-800';
      case 'romantic': return 'bg-pink-100 text-pink-800';
      case 'group': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const calculateSavings = (discount: string) => {
    const baseRate = 450; // Base nightly rate in USD
    const discountPercent = parseInt(discount.replace(/[^0-9]/g, ''));
    return Math.round(baseRate * (discountPercent / 100));
  };

  return (
    <ClientOnly>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        {/* Compact Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-8">
          <div className="container mx-auto px-6 text-center">
            <h1 className="text-3xl font-bold mb-3">Exclusive Deals</h1>
            <p className="text-lg mb-4 max-w-xl mx-auto">
              Book ASAP before these deals are removed due to booking occupancy
            </p>
            <div className="flex justify-center space-x-6 text-sm">
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1 text-yellow-300" />
                <span>Limited Time</span>
              </div>
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-1" />
                <span>High Demand</span>
              </div>
            </div>
          </div>
        </div>

        {/* RESTORE: Fantastic Dynamic Pricing Calculator with Airbnb Rates */}
        <div className="container mx-auto px-6 py-8">
          <ClientDealsWrapper />
        </div>

        {/* Deals Grid */}
        <div className="container mx-auto px-6 py-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 mb-16">
            {FEATURED_DEALS.map((deal) => (
              <div 
                key={deal.id} 
                className="cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                onClick={() => setSelectedDeal(selectedDeal === deal.id ? null : deal.id)}
              >
                <Card 
                  className={`h-full ${
                    selectedDeal === deal.id ? 'ring-4 ring-blue-500' : ''
                  }`}
                >
                <CardHeader className="bg-gradient-to-r from-white to-blue-50">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-2xl font-bold text-gray-800 mb-2">
                        {deal.title}
                      </CardTitle>
                      <Badge className={`${getDealBadgeColor(deal.type)} text-xs font-semibold`}>
                        {deal.type.replace('-', ' ').toUpperCase()}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-red-600 mb-1">
                        {deal.discount}
                      </div>
                      <div className="text-sm text-gray-600">
                        Save ${calculateSavings(deal.discount)}/night
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="p-6">
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {deal.description}
                  </p>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="w-4 h-4 mr-2" />
                      <span>Minimum {deal.minNights} nights</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>Valid until {new Date(deal.validUntil).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-800 mb-3">Package Includes:</h4>
                    <div className="grid grid-cols-1 gap-2">
                      {deal.features.map((feature, index) => (
                        <div key={index} className="flex items-center text-sm text-gray-600">
                          <Gift className="w-4 h-4 mr-2 text-green-600" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {selectedDeal === deal.id && (
                    <div className="bg-blue-50 p-4 rounded-lg mt-4">
                      <h5 className="font-semibold text-gray-800 mb-3">Quick Booking</h5>
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <input
                          type="date"
                          value={checkInDate}
                          onChange={(e) => setCheckInDate(e.target.value)}
                          className="px-3 py-2 border rounded text-sm"
                          placeholder="Check-in"
                        />
                        <input
                          type="date"
                          value={checkOutDate}
                          onChange={(e) => setCheckOutDate(e.target.value)}
                          className="px-3 py-2 border rounded text-sm"
                          placeholder="Check-out"
                        />
                      </div>
                      <div className="flex items-center gap-3 mb-4">
                        <Users className="w-4 h-4" />
                        <select
                          value={guests}
                          onChange={(e) => setGuests(parseInt(e.target.value))}
                          className="px-3 py-2 border rounded text-sm flex-1"
                        >
                          {[1,2,3,4,5,6,7,8,9,10,11,12].map(num => (
                            <option key={num} value={num}>{num} Guest{num > 1 ? 's' : ''}</option>
                          ))}
                        </select>
                      </div>
                      <Button className="w-full bg-blue-600 hover:bg-blue-700">
                        Book This Deal
                      </Button>
                    </div>
                  )}
                </CardContent>
                </Card>
              </div>
            ))}
          </div>

          {/* Amenities Section */}
          <div className="bg-white rounded-xl p-8 shadow-lg mb-16">
            <h3 className="text-3xl font-bold text-center mb-8 text-gray-800">
              Included with Every Stay
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {AMENITIES.map((amenity, index) => (
                <div key={index} className="text-center">
                  <amenity.icon className="w-12 h-12 mx-auto mb-3 text-blue-600" />
                  <span className="text-gray-700 font-medium">{amenity.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Call to Action */}
          <div className="bg-gradient-to-r from-indigo-600 to-blue-700 text-white rounded-xl p-12 text-center">
            <h3 className="text-3xl font-bold mb-4">Ready to Book Your Dream Vacation?</h3>
            <p className="text-lg mb-8 opacity-90">
              Contact us directly for personalized deals and instant booking confirmation
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-white text-indigo-700 hover:bg-gray-100 font-semibold"
                onClick={() => window.open('https://wa.me/94774005247', '_blank')}
              >
                WhatsApp Us Now
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white hover:text-indigo-700 font-semibold"
                onClick={() => window.location.href = 'mailto:stay@kolakevilla.com'}
              >
                Email for Custom Deal
              </Button>
            </div>
          </div>
        </div>
      </div>
    </ClientOnly>
  );
}
