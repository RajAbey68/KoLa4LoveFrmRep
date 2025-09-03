"use client";
import Image from "next/image";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import TickerTape from "@/components/TickerTape";

export default function GlobalHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const primaryNavigation = [
    { name: "Home", href: "/" },
    { name: "Accommodation", href: "/accommodation" },
    { name: "Gallery", href: "/gallery" },
    { name: "Contact", href: "/contact" }
  ];

  const secondaryNavigation = [
    { name: "Experiences", href: "/experiences" },
    { name: "Ko Lake Life", href: "/ko-lake-life" },
    { name: "Dining", href: "/dining" },
    { name: "Deals", href: "/deals" }
  ];

  return (
    <>
      {/* Ticker Tape */}
      <TickerTape />
      
      <nav className="bg-white shadow-sm border-b border-gray-100 relative z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Primary Navigation Row */}
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/">
              <Image
                src="/images/logo.jpeg"
                alt="Ko Lake Villa"
                width={120}
                height={40}
                className="h-10 w-auto object-contain cursor-pointer"
                style={{ width: 'auto', height: '2.5rem' }}
                priority
              />
            </Link>
          </div>

          {/* Primary Desktop Navigation */}
          <div className="hidden lg:block">
            <div className="flex items-center space-x-6">
              {primaryNavigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-gray-700 hover:text-amber-600 px-3 py-2 text-sm font-medium transition-colors"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Right side actions */}
          <div className="hidden lg:flex items-center space-x-4">
            <Link href="/admin" className="text-gray-600 hover:text-amber-600 text-sm flex items-center">
              👤 Admin
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-700 hover:text-amber-600 p-2"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Secondary Navigation Row - Desktop Only */}
        <div className="hidden lg:block border-t border-gray-100">
          <div className="flex justify-center items-center py-3">
            <div className="flex items-center space-x-8">
              {secondaryNavigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-gray-600 hover:text-amber-600 px-3 py-1 text-sm font-medium transition-colors"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-200 shadow-lg">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {/* Primary navigation items */}
              <div className="border-b border-gray-100 pb-2 mb-2">
                {primaryNavigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-gray-700 hover:text-amber-600 block px-3 py-2 text-base font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
              
              {/* Secondary navigation items */}
              <div className="pb-2">
                {secondaryNavigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-gray-600 hover:text-amber-600 block px-3 py-2 text-sm font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>

              {/* Admin link for mobile */}
              <div className="border-t border-gray-100 pt-2">
                <Link
                  href="/admin"
                  className="text-gray-500 hover:text-amber-600 block px-3 py-2 text-sm font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  👤 Admin
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
    </>
  );
}