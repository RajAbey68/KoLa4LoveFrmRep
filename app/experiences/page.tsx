'use client';

import { Card } from "@/components/ui/card";
// Removed editing functionality - only available in admin console
import KoLakeLifeSection from "@/components/ko-lake-life-section";
import TickerTape from "@/components/TickerTape";

const VILLA_EXPERIENCES = [
  {
    title: "Private Pool & Lake Access",
    description: "Enjoy exclusive use of our infinity pool with direct lake access for swimming and water activities",
    features: ["Infinity pool", "Direct lake access", "Pool loungers", "Poolside service"]
  },
  {
    title: "Luxury Accommodation",
    description: "Stay in elegantly appointed rooms with modern amenities and stunning lake views",
    features: ["Lake view rooms", "Modern furnishing", "Private balconies", "Premium bedding"]
  },
  {
    title: "Outdoor Living Spaces",
    description: "Relax in beautiful outdoor areas designed for entertainment and peaceful moments",
    features: ["Garden terraces", "Outdoor dining", "BBQ facilities", "Sunset viewing areas"]
  },
  {
    title: "Water Sports & Activities",
    description: "Make the most of our lakefront location with various water-based activities",
    features: ["Swimming", "Kayaking", "Fishing", "Boat excursions"]
  },
  {
    title: "Culinary Experience with Chef Madhu",
    description: "Learn authentic Sri Lankan cooking with our skilled chef who specializes in Sri Lankan and Western fusion cuisine",
    features: ["Private cooking classes", "Market-to-table experiences", "Traditional hoppers & curries", "Fresh seafood preparation", "Local ingredient sourcing", "Kitchen access for guests"]
  }
];

const LOCAL_EXPERIENCES = [
  {
    title: "Cultural Tours",
    description: "Explore Sri Lankan heritage with visits to ancient temples and cultural sites",
    location: "Nearby temples and historical sites"
  },
  {
    title: "Nature Excursions",
    description: "Discover the natural beauty of the region with guided nature walks and wildlife spotting",
    location: "National parks and nature reserves"
  },
  {
    title: "Local Markets & Crafts",
    description: "Experience authentic Sri Lankan culture through local markets and traditional crafts",
    location: "Village markets and artisan workshops"
  },
  {
    title: "Sri Lankan Food Experience with Chef Madhu",
    description: "Learn authentic Sri Lankan and Western fusion cuisine with our talented chef Madhu. From market visits to hands-on cooking classes featuring local specialties like fish curry, hoppers, and wild boar dishes.",
    location: "Villa kitchen and local markets"
  }
];

function ExperiencesContent() {
  
  return (
    <>
    <main className="mx-auto max-w-6xl px-4 py-10 space-y-10">
      <div>
        <h1 className="text-3xl font-bold mb-4">
          Villa Experiences
        </h1>
        <p className="text-gray-600 text-lg">
          Create unforgettable memories at Ko Lake Villa with our exclusive amenities and local experiences
        </p>
      </div>

      {/* Villa Experiences */}
      <section>
        <h2 className="text-2xl font-semibold mb-6">
          At the Villa
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {VILLA_EXPERIENCES.map((experience, index) => (
            <Card key={index} className="p-6">
              <h3 className="text-xl font-semibold mb-3">
                {experience.title}
              </h3>
              <p className="text-gray-600 mb-4">
                {experience.description}
              </p>
              <ul className="space-y-1">
                {experience.features.map((feature, idx) => (
                  <li key={idx} className="text-sm text-gray-700 flex items-center">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full mr-3"></span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </section>

      {/* Local Experiences */}
      <section>
        <h2 
          id="experiences-local-section-title"
          className="text-2xl font-semibold mb-6"
        >
          Local Experiences
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {LOCAL_EXPERIENCES.map((experience, index) => (
            <Card key={index}>
              <h3 
                id={`local-experience-title-${index}`}
                className="text-xl font-semibold mb-3"
              >
                {experience.title}
              </h3>
              <p 
                id={`local-experience-desc-${index}`}
                className="text-gray-600 mb-3"
              >
                {experience.description}
              </p>
              <p 
                id={`local-experience-location-${index}`}
                className="text-sm text-emerald-600 font-medium"
              >
                {experience.location}
              </p>
            </Card>
          ))}
        </div>
      </section>

      {/* Contact for Experiences */}
      <Card>
        <div className="text-center space-y-4">
          <h3 className="text-xl font-semibold">Plan Your Perfect Stay</h3>
          <p className="text-gray-600">Contact us to arrange experiences and activities during your visit</p>
          <div className="flex gap-3 justify-center">
            <a href="/contact" className="inline-flex items-center justify-center rounded-lg font-medium transition-colors px-4 py-2 text-sm bg-emerald-600 text-white hover:bg-emerald-700">
              Contact Us
            </a>
            <a href="https://wa.me/94717765780?text=Hi%20Ko%20Lake%20Villa%2C%20I%27d%20like%20to%20plan%20activities%20for%20my%20stay" 
               target="_blank" 
               rel="noopener"
               className="inline-flex items-center justify-center rounded-lg font-medium transition-colors px-4 py-2 text-sm border border-gray-300 text-gray-700 hover:bg-gray-50">
              WhatsApp
            </a>
          </div>
        </div>
      </Card>
    </main>
    
    {/* Ko Lake Life Section */}
    <KoLakeLifeSection />
  </>
  );
}

export default function ExperiencesPage() {
  return (
      <ExperiencesContent />
  );
}