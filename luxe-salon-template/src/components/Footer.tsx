import React from 'react';
import { Scissors } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#1C1917] pt-16 pb-8 text-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center border-b border-gray-800 pb-12 mb-8 gap-8 text-center md:text-left">
          
          <div className="flex flex-col items-center md:items-start">
            <a href="#" className="flex items-center gap-2 mb-4">
              <Scissors className="w-5 h-5 text-[#C4A47C]" />
              <span className="font-serif text-xl font-bold tracking-wider">LUXM</span>
            </a>
            <p className="text-gray-400 text-sm max-w-xs leading-relaxed">
              Elevating the art of hair design in a welcoming, luxurious environment in Agra tailored exactly to you.
            </p>
          </div>

          <div className="flex gap-6">
            <a href="#" className="w-10 h-10 rounded-full border border-gray-800 flex items-center justify-center hover:bg-[#C4A47C] hover:border-[#C4A47C] transition-colors">
              <span className="text-xs">IG</span>
            </a>
            <a href="#" className="w-10 h-10 rounded-full border border-gray-800 flex items-center justify-center hover:bg-[#C4A47C] hover:border-[#C4A47C] transition-colors">
              <span className="text-xs">FB</span>
            </a>
            <a href="#" className="w-10 h-10 rounded-full border border-gray-800 flex items-center justify-center hover:bg-[#C4A47C] hover:border-[#C4A47C] transition-colors">
              <span className="text-xs">X</span>
            </a>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center text-xs text-gray-500 uppercase tracking-widest gap-4">
          <p>&copy; {new Date().getFullYear()} Luxm Salon. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
