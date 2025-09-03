'use client';

import { Card } from "@/components/ui/card";
// Removed editing functionality - only available in admin console

const KITCHEN_FACILITIES = [
  "Fully equipped modern kitchen",
  "Gas stove and oven",
  "Large refrigerator and freezer",
  "Microwave and dishwasher",
  "Complete cookware and utensils",
  "Dining table for 12+ guests",
  "Outdoor BBQ facilities",
  "Coffee and tea making facilities"
];

const DINING_OPTIONS = [
  {
    title: "Self-Catering",
    description: "Prepare your own meals in our fully equipped kitchen with all modern amenities",
    features: ["Modern appliances", "Full cookware set", "Spacious dining area", "Outdoor BBQ"]
  },
  {
    title: "Private Chef Service with Chef Madhu",
    description: "Meet Chef Madhu, our talented chef specializing in Sri Lankan and Western fusion cuisine. He creates amazing dishes with fresh local ingredients and can accommodate most dietary preferences.",
    features: ["Sri Lankan & Western fusion", "Market-fresh ingredients", "Cooking classes available", "Traditional hoppers & curries", "Fresh seafood specialties", "Customized menus"],
    note: "Available with 48 hours' notice - contact us to arrange"
  },
  {
    title: "Local Restaurant Delivery",
    description: "Order from carefully selected local restaurants that deliver to the villa",
    features: ["Sri Lankan specialties", "International cuisine", "Fresh seafood", "Vegetarian options"]
  }
];

const LOCAL_DINING = [
  {
    name: "Lakeside Seafood Restaurant",
    type: "Traditional Sri Lankan",
    distance: "5 minutes drive",
    specialties: ["Fresh fish curry", "Prawn dishes", "Traditional rice & curry"]
  },
  {
    name: "Village Restaurant",
    type: "Authentic Local",
    distance: "10 minutes drive",
    specialties: ["Hoppers", "Kottu roti", "String hoppers", "Local vegetables"]
  },
  {
    name: "Hotel Restaurant",
    type: "International & Local",
    distance: "15 minutes drive",
    specialties: ["Continental breakfast", "Mixed cuisine", "Bar service"]
  }
];

function DiningContent() {

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 space-y-10">
      <div>
        <h1
          id="dining-page-title"
          className="text-3xl font-bold mb-4"
        >
          Dining at Ko Lake Villa
        </h1>
        <p
          id="dining-page-subtitle"
          className="text-gray-600 text-lg"
        >
          Enjoy delicious meals with flexible dining options to suit your preferences
        </p>
      </div>

      {/* Kitchen Facilities */}
      <section>
        <h2
          id="kitchen-facilities-title"
          className="text-2xl font-semibold mb-6"
        >
          Kitchen Facilities
        </h2>
        <Card>
          <p
            id="kitchen-facilities-description"
            className="text-gray-600 mb-4"
          >
            Our villa features a fully equipped modern kitchen perfect for preparing meals during your stay.
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            {KITCHEN_FACILITIES.map((facility, index) => (
              <div key={index} className="flex items-center">
                <span className="w-2 h-2 bg-emerald-500 rounded-full mr-3"></span>
                <span
                  id={`kitchen-facility-${index}`}
                  className="text-gray-700"
                >
                  {facility}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </section>

      {/* Dining Options */}
      <section>
        <h2
          id="dining-options-title"
          className="text-2xl font-semibold mb-6"
        >
          Dining Options
        </h2>
        <div className="grid lg:grid-cols-3 gap-6">
          {DINING_OPTIONS.map((option, index) => (
            <Card key={index} className="bg-white rounded-xl shadow-lg overflow-hidden">
              {/* Add dining images */}
              <div className="relative h-48 bg-gradient-to-br from-emerald-100 to-emerald-200 flex items-center justify-center">
                {index === 0 && (
                  <img 
                    src="/images/dining/breakfast.jpg" 
                    alt="Self-Catering Kitchen"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='250' viewBox='0 0 400 250'%3E%3Crect width='400' height='250' fill='%23f0fdf4'/%3E%3Cg transform='translate(200,125)'%3E%3Cg transform='translate(-40,-40)'%3E%3Crect x='10' y='10' width='60' height='40' rx='4' fill='%23059669' fill-opacity='0.1' stroke='%23059669' stroke-width='2'/%3E%3Cpath d='M20 25 L30 35 L60 20' stroke='%23059669' stroke-width='2' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/g%3E%3Ctext y='60' text-anchor='middle' font-family='Arial' font-size='14' fill='%23059669'%3ESelf-Catering Kitchen%3C/text%3E%3C/g%3E%3C/svg%3E";
                    }}
                  />
                )}
                {index === 1 && (
                  <img 
                    src="/images/dining/local-cuisine.jpg" 
                    alt="Private Chef Service"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='250' viewBox='0 0 400 250'%3E%3Crect width='400' height='250' fill='%23fef3c7'/%3E%3Cg transform='translate(200,125)'%3E%3Cg transform='translate(-40,-40)'%3E%3Ccircle cx='40' cy='30' r='20' fill='%23d97706' fill-opacity='0.2' stroke='%23d97706' stroke-width='2'/%3E%3Cpath d='M30 25 Q40 15 50 25 Q40 35 30 25' fill='%23d97706'/%3E%3C/g%3E%3Ctext y='60' text-anchor='middle' font-family='Arial' font-size='14' fill='%23d97706'%3EPrivate Chef Service%3C/text%3E%3C/g%3E%3C/svg%3E";
                    }}
                  />
                )}
                {index === 2 && (
                  <img 
                    src="/images/dining/delivery.jpg" 
                    alt="Local Restaurant Delivery"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='250' viewBox='0 0 400 250'%3E%3Crect width='400' height='250' fill='%23fef2f2'/%3E%3Cg transform='translate(200,125)'%3E%3Cg transform='translate(-40,-40)'%3E%3Crect x='15' y='20' width='50' height='30' rx='4' fill='%23dc2626' fill-opacity='0.1' stroke='%23dc2626' stroke-width='2'/%3E%3Cpath d='M25 30 L35 40 L55 25' stroke='%23dc2626' stroke-width='2' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/g%3E%3Ctext y='60' text-anchor='middle' font-family='Arial' font-size='14' fill='%23dc2626'%3ELocal Delivery%3C/text%3E%3C/g%3E%3C/svg%3E";
                    }}
                  />
                )}
              </div>
              <div className="p-6">
                <h3
                  id={`dining-option-title-${index}`}
                  className="text-xl font-semibold mb-3"
                >
                  {option.title}
                </h3>
                <p
                  id={`dining-option-desc-${index}`}
                  className="text-gray-600 mb-4"
                >
                  {option.description}
                </p>
                <ul className="space-y-2 mb-4">
                  {option.features.map((feature, idx) => (
                    <li key={idx} className="text-sm text-gray-700 flex items-center">
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-2"></span>
                      {feature}
                    </li>
                  ))}
                </ul>
                {option.note && (
                  <p className="text-sm text-emerald-600 font-medium">{option.note}</p>
                )}
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Local Restaurants */}
      <section>
        <h2 className="text-2xl font-semibold mb-6">Nearby Restaurants</h2>
        <div className="space-y-4">
          {LOCAL_DINING.map((restaurant, index) => (
            <Card key={index}>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="mb-3 md:mb-0">
                  <h3 className="text-lg font-semibold">{restaurant.name}</h3>
                  <p className="text-gray-600">{restaurant.type} • {restaurant.distance}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-700">Specialties:</p>
                  <p className="text-sm text-emerald-600">{restaurant.specialties.join(" • ")}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Guest Self-Service Facilities */}
      <Card>
        <h3 className="text-lg font-semibold mb-3">Guest Self-Service Facilities</h3>
        <div className="space-y-4 text-sm text-gray-700">
          <p>We have a Guest self-service area for snacks with:</p>
          <ul className="grid grid-cols-2 gap-2 ml-4">
            <li>• Microwave</li>
            <li>• Airfryer</li>
            <li>• Grill</li>
            <li>• Tea and Coffee machine (filter and espresso)</li>
            <li>• Toaster for Chucky bread waffles etc</li>
            <li>• Kettle</li>
          </ul>
          <p>We can get these set up in the veranda when you want to heat a snack or similar. All rooms have a kettle (hair dryer and Iron).</p>
          <p>There is a guest fridge/freezer as opposed to the kitchen fridge in the veranda. Guests can keep food, beers etc.</p>
          <p>There is a hot and cold water dispenser (American Water Company) in the same area.</p>
          <p>If you purchased frozen items, we can certainly store them in the Kitchen chest freezer.</p>
        </div>
      </Card>

      {/* Kitchen Usage Policy */}
      <Card>
        <h3 className="text-lg font-semibold mb-3">Kitchen Usage Policy</h3>
        <div className="space-y-3 text-sm text-gray-700">
          <p><strong>We do not promote guest use of the main kitchen.</strong> We can offer Chef, Helper and Kitchen hire at a charge - please contact us.</p>
          <p>For full cooking experiences, we offer:</p>
          <ul className="ml-4 space-y-1">
            <li>• Private or group cooking classes (48 hours' notice)</li>
            <li>• Chef-guided market tours for ingredient selection</li>
            <li>• Authentic Sri Lankan cooking experiences</li>
            <li>• Local specialist chefs for regional dishes</li>
          </ul>
          <p>Our pantry includes Sri Lankan and Western staples: olive oil, balsamic vinegar, rice, dhal, and spices like cinnamon, turmeric, curry leaves, cardamom, and galangal.</p>
        </div>
      </Card>

      {/* Contact for Dining */}
      <Card>
        <div className="text-center space-y-4">
          <h3 className="text-xl font-semibold">Dining Arrangements</h3>
          <p className="text-gray-600">Need help with meal planning or want to arrange a private chef? Contact us for assistance</p>
          <div className="flex gap-3 justify-center">
            <a href="/contact" className="inline-flex items-center justify-center rounded-lg font-medium transition-colors px-4 py-2 text-sm bg-emerald-600 text-white hover:bg-emerald-700">
              Contact Us
            </a>
            <a href="https://wa.me/94717765780?text=Hi%20Ko%20Lake%20Villa%2C%20I%27d%20like%20to%20arrange%20dining%20for%20my%20stay"
               target="_blank"
               rel="noopener"
               className="inline-flex items-center justify-center rounded-lg font-medium transition-colors px-4 py-2 text-sm border border-gray-300 text-gray-700 hover:bg-gray-50">
              WhatsApp
            </a>
          </div>
        </div>
      </Card>
    </main>
  );
}

export default function DiningPage() {
  return (
      <DiningContent />
  );
}