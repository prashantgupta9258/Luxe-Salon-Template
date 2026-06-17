import React from 'react';
import { motion } from 'motion/react';
import { services } from '../lib/data';

export default function Services() {
  return (
    <section id="services" className="py-24 bg-[#F5F0EB]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            className="font-serif text-4xl md:text-5xl text-[#1C1917] mb-4"
          >
            Salon Services
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ delay: 0.1 }}
            className="text-gray-600 max-w-2xl mx-auto"
          >
            Bespoke cutting, brilliant color, and restorative treatments designed exclusively for your unique hair profile.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {services.map((service, index) => (
            <motion.div 
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow group rounded-sm overflow-hidden flex flex-col"
            >
              <div className="h-48 w-full overflow-hidden">
                <img src={service.image} alt={service.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" referrerPolicy="no-referrer" />
              </div>
              <div className="p-6 md:p-8 flex flex-col flex-grow justify-between">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="font-serif text-xl text-[#1C1917] pr-2">{service.title}</h2>
                    <span className="text-[#C4A47C] font-medium shrink-0">{service.price}</span>
                  </div>
                  <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                    {service.description}
                  </p>
                </div>
                <div className="pt-4 border-t border-gray-100 flex items-center gap-2 text-xs text-gray-400 font-medium tracking-wide uppercase">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  {service.duration}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
