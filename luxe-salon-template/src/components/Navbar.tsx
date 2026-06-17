import React, { useState, useEffect } from 'react';
import { Menu, X, Scissors } from 'lucide-react';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-[#1C1917] text-white py-4 shadow-lg' : 'bg-transparent text-white py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        {/* Brand */}
        <a href="#" className="flex items-center gap-2 group">
          <Scissors className="w-6 h-6 text-[#C4A47C]" />
          <span className="font-serif text-2xl font-bold tracking-wider">LUXM</span>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium tracking-wide">
          <a href="#services" className="hover:text-[#C4A47C] transition-colors">SERVICES</a>
          <a href="#reviews" className="hover:text-[#C4A47C] transition-colors">REVIEWS</a>
          <a href="#about" className="hover:text-[#C4A47C] transition-colors">ABOUT</a>
          <a href="#contact" className="hover:text-[#C4A47C] transition-colors">CONTACT</a>
          <a 
            href="#booking" 
            className="border border-[#C4A47C] text-[#C4A47C] px-6 py-2 rounded-sm hover:bg-[#C4A47C] hover:text-white transition-all"
          >
            BOOK NOW
          </a>
        </nav>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden text-white"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Nav overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-[#1C1917] flex flex-col items-center py-8 gap-6 shadow-xl border-t border-gray-800">
          <a href="#services" onClick={() => setMobileMenuOpen(false)} className="text-white hover:text-[#C4A47C] transition-colors">SERVICES</a>
          <a href="#reviews" onClick={() => setMobileMenuOpen(false)} className="text-white hover:text-[#C4A47C] transition-colors">REVIEWS</a>
          <a href="#about" onClick={() => setMobileMenuOpen(false)} className="text-white hover:text-[#C4A47C] transition-colors">ABOUT</a>
          <a href="#contact" onClick={() => setMobileMenuOpen(false)} className="text-white hover:text-[#C4A47C] transition-colors">CONTACT</a>
          <a 
            href="#booking" 
            onClick={() => setMobileMenuOpen(false)}
            className="bg-[#C4A47C] text-white px-8 py-3 rounded-sm font-medium mt-2"
          >
            BOOK APPOINTMENT
          </a>
        </div>
      )}
    </header>
  );
}
