'use client';

import { Card } from "@/components/ui/card";
import { generateStructuredData } from "@/lib/seo";
import Span from '@/components/span';

const FAQ_SECTIONS = [
  {
    title: "Booking & Reservations",
    faqs: [
      {
        question: "How do I make a reservation?",
        answer: "You can book directly by contacting us via WhatsApp at +94 71 776 5780, calling us, or using our contact form. We also have listings on Airbnb for your convenience."
      },
      {
        question: "What is your cancellation policy?",
        answer: "We offer flexible cancellation terms for direct bookings. Please contact us to discuss specific cancellation policies based on your booking dates and duration."
      },
      {
        question: "Do I need to pay a deposit?",
        answer: "Yes, we typically require a deposit to secure your reservation. The amount and payment terms will be confirmed when you make your booking."
      },
      {
        question: "Can I modify my booking dates?",
        answer: "Subject to availability, we're happy to accommodate date changes. Please contact us as early as possible to discuss modifications."
      }
    ]
  },
  {
    title: "Accommodation & Amenities",
    faqs: [
      {
        question: "How many guests can the villa accommodate?",
        answer: "Ko Lake Villa can accommodate up to 16-24 guests with various room configurations including the entire villa, master family suite, and triple/twin rooms."
      },
      {
        question: "What amenities are included?",
        answer: "The villa features a private infinity pool, direct lake access, fully equipped kitchen, outdoor dining areas, BBQ facilities, modern furnishings, and stunning lake views from most rooms."
      },
      {
        question: "Is there WiFi and air conditioning?",
        answer: "Yes, the villa provides complimentary WiFi and air conditioning in all indoor areas for your comfort."
      },
      {
        question: "Can I use the kitchen facilities?",
        answer: "Absolutely! We welcome guests to use our shared kitchen facilities for self-catering. Please request access when booking or give us 48 hours' notice. Our pantry is stocked with Sri Lankan and Western staples including spices, oils, rice, and dhal. Our experienced chef and helper will provide orientation on equipment and food safety procedures. Please label personal items clearly and maintain cleanliness after use."
      },
      {
        question: "Do you offer cooking classes with Chef Madhu?",
        answer: "Absolutely! Chef Madhu specializes in Sri Lankan and Western fusion cuisine. Book private or group cooking classes with 48 hours' notice. Classes feature market-fresh local ingredients like fish, prawns, crab, pork, or seasonal fruits. Chef Madhu can also accompany you to local markets for an authentic farm-to-table experience. We occasionally invite local specialists for traditional dishes like hoppers (Appa) and regional curries."
      },
      {
        question: "What are the kitchen usage guidelines?",
        answer: "Our shared kitchen is available to all villa guests with proper notice. Guidelines include: request access 48 hours in advance, receive safety orientation from our staff, use provided equipment properly, label personal food items, clean all surfaces after use, and respect the shared nature of the space. Our chef and helper are available to assist with equipment use and food handling procedures."
      }
    ]
  },
  {
    title: "Location & Transportation",
    faqs: [
      {
        question: "Where is Ko Lake Villa located?",
        answer: "Ko Lake Villa is located at Madolduwa Road, Kathaluwa West, Ahangama 80650, Sri Lanka. We're situated on a beautiful lakefront with stunning natural surroundings and privacy. Use What3Words: ///wifely.rebuff.vented for precise navigation."
      },
      {
        question: "How do I get to the villa?",
        answer: "We can provide detailed directions and arrange airport transfers upon booking. The villa is accessible by car and we can assist with transportation arrangements."
      },
      {
        question: "Is parking available?",
        answer: "Yes, there is ample parking space available at the villa for guests' vehicles."
      },
      {
        question: "What's nearby the villa?",
        answer: "The area offers local restaurants, cultural sites, nature attractions, and traditional markets within a short drive. We're happy to provide recommendations."
      }
    ]
  },
  {
    title: "Services & Policies",
    faqs: [
      {
        question: "Do you provide housekeeping?",
        answer: "Yes, housekeeping services can be arranged. Please discuss your requirements when booking to confirm availability and arrangements."
      },
      {
        question: "Can you arrange a private chef?",
        answer: "We can help arrange private chef services to prepare authentic Sri Lankan cuisine during your stay. This service is available upon request."
      },
      {
        question: "What is your check-in/check-out time?",
        answer: "Standard check-in is typically in the afternoon and check-out in the morning. Exact times will be confirmed with your booking and can be flexible based on availability."
      },
      {
        question: "Are pets allowed?",
        answer: "Please contact us to discuss pet policies as this may depend on specific circumstances and other guest considerations."
      }
    ]
  }
];

function FAQContent() {

  const structuredData = generateStructuredData('localBusiness');

  return (
    <main className="mx-auto max-w-4xl px-4 py-10 space-y-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div>
        <h1
          id="faq-page-title"
          className="text-3xl font-bold mb-4"
        >
          Frequently Asked Questions
        </h1>
        <p
          id="faq-page-subtitle"
          className="text-lg text-gray-600"
        >
          Find answers to common questions about Ko Lake Villa, our accommodations, amenities, and booking process.
        </p>
      </div>

      {FAQ_SECTIONS.map((section, sectionIndex) => (
        <section key={section.title}>
          <h2
            id={`faq-section-title-${sectionIndex}`}
            className="text-2xl font-semibold mb-6 text-gray-800"
          >
            {section.title}
          </h2>
          <div className="space-y-4">
            {section.faqs.map((faq, faqIndex) => (
              <Card key={faq.question} className="p-6">
                <h3
                  id={`faq-question-${sectionIndex}-${faqIndex}`}
                  className="text-lg font-semibold mb-3 text-gray-800"
                >
                  {faq.question}
                </h3>
                <p
                  id={`faq-answer-${sectionIndex}-${faqIndex}`}
                  className="text-gray-600 leading-relaxed"
                >
                  {faq.answer}
                </p>
              </Card>
            ))}
          </div>
        </section>
      ))}

      {/* Contact Section */}
      <Card className="p-6">
        <div className="text-center space-y-4">
          <h3
            id="faq-contact-title"
            className="text-xl font-semibold"
          >
            Still Have Questions?
          </h3>
          <p
            id="faq-contact-description"
            className="text-gray-600"
          >
            We're here to help! Contact us for personalized assistance with your booking and stay.
          </p>
          <div className="space-y-3">
            <div className="flex gap-3 justify-center">
              <a href="/contact" className="inline-flex items-center justify-center rounded-lg font-medium transition-colors px-4 py-2 text-sm bg-emerald-600 text-white hover:bg-emerald-700">
                <span id="faq-contact-form-text">Contact Form</span>
              </a>
              <a href="https://wa.me/94717765780?text=Hi%20Ko%20Lake%20Villa%2C%20I%20have%20a%20question%20about%20booking"
                 target="_blank"
                 rel="noopener"
                 className="inline-flex items-center justify-center rounded-lg font-medium transition-colors px-4 py-2 text-sm border border-gray-300 text-gray-700 hover:bg-gray-50">
                <span id="faq-whatsapp-text">WhatsApp</span>
              </a>
            </div>
            <div className="text-sm text-muted-foreground">
              <div id="faq-manager-info" dangerouslySetInnerHTML={{ __html: 'General Manager: +94 71 776 5780' }} />
              <div id="faq-timezone-info" dangerouslySetInnerHTML={{ __html: 'Available in Sri Lanka time (GMT+5:30)' }} />
            </div>
          </div>
        </div>
      </Card>
    </main>
  );
}

export default function FAQPage() {
  return (
      <FAQContent />
  );
}