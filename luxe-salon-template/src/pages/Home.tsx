import React from 'react';
import { motion } from 'motion/react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Services from '../components/Services';
import Reviews from '../components/Reviews';
import Contact from '../components/Contact';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#F5F0EB]">
      <Navbar />
      <Hero />
      <Services />
      <Reviews />
      {/* We add a dummy About section to fix the anchor */}
      <section id="about" className="py-24 bg-white">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto px-6 text-center"
        >
          <h2 className="font-serif text-4xl md:text-5xl text-[#1C1917] mb-6">Why Choose Luxm Salon?</h2>
          <p className="text-gray-600 text-lg leading-relaxed">
            Founded with a passion for luxury and style, Luxm Salon represents the pinnacle of modern hair design in Agra. Our team of expert stylists are dedicated to bringing out your natural beauty through personalized consultations, bespoke treatments, and precision techniques. We believe every appointment should be an experience of relaxation, transformation, and pure indulgence.
          </p>
        </motion.div>
      </section>
      <Contact />
      <Footer />
    </div>
  );
}
