import React, { useState } from 'react';
import { motion } from 'motion/react';
import { MapPin, Phone, Mail, Clock, Calendar, Check } from 'lucide-react';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    service: '',
    date: '',
    time: '',
    notes: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'appointments'), {
        ...formData,
        createdAt: serverTimestamp()
      });
    } catch (e: any) {
      console.error('Failed to add appointment to Firebase, falling back locally', e);
      const updatedAppts = JSON.parse(localStorage.getItem('luxm_appointments') || '[]');
      updatedAppts.push({ ...formData, id: Date.now().toString(), createdAt: Date.now() });
      localStorage.setItem('luxm_appointments', JSON.stringify(updatedAppts));
    }
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
    setFormData({ name: '', phone: '', email: '', service: '', date: '', time: '', notes: '' });
  };

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-8">
          
          {/* Booking Form */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            id="booking"
          >
            <h2 className="font-serif text-4xl md:text-5xl text-[#1C1917] mb-4">Book Your Appointment Today</h2>
            <p className="text-gray-600 mb-8">Select your service, preferred date and time. We will confirm your appointment shortly.</p>
            
            {submitted ? (
              <div className="bg-green-50 border border-green-200 text-green-800 p-8 rounded-sm text-center">
                <Check className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-2xl font-serif mb-2">Request Received</h3>
                <p>Thank you! We have received your appointment request and will contact you shortly to confirm.</p>
              </div>
            ) : (
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="name" className="text-sm font-medium text-gray-700">Full Name *</label>
                    <input type="text" id="name" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="border-b border-gray-300 py-2 focus:outline-none focus:border-[#C4A47C] bg-transparent transition-colors" placeholder="Jane Doe" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="phone" className="text-sm font-medium text-gray-700">Phone Number *</label>
                    <input type="tel" id="phone" required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="border-b border-gray-300 py-2 focus:outline-none focus:border-[#C4A47C] bg-transparent transition-colors" placeholder="(555) 000-0000" />
                  </div>
                </div>
                
                <div className="flex flex-col gap-2">
                  <label htmlFor="email" className="text-sm font-medium text-gray-700">Email Address</label>
                  <input type="email" id="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="border-b border-gray-300 py-2 focus:outline-none focus:border-[#C4A47C] bg-transparent transition-colors" placeholder="jane@example.com" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="date" className="text-sm font-medium text-gray-700">Preferred Date *</label>
                    <input type="date" id="date" required value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="border-b border-gray-300 py-2 focus:outline-none focus:border-[#C4A47C] bg-transparent transition-colors text-gray-700" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="time" className="text-sm font-medium text-gray-700">Preferred Time *</label>
                    <input type="time" id="time" required value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} className="border-b border-gray-300 py-2 focus:outline-none focus:border-[#C4A47C] bg-transparent transition-colors text-gray-700" />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="service" className="text-sm font-medium text-gray-700">Service Required *</label>
                  <select id="service" required value={formData.service} onChange={e => setFormData({...formData, service: e.target.value})} className="border-b border-gray-300 py-2 focus:outline-none focus:border-[#C4A47C] bg-transparent transition-colors text-gray-700">
                    <option value="" disabled>Select a service</option>
                    <option value="Women's Haircut">Women's Haircut</option>
                    <option value="Men's Haircut">Men's Classic Cut</option>
                    <option value="Balayage & Highlights">Balayage & Highlights</option>
                    <option value="Full Color">Full Color Renewal</option>
                    <option value="Keratin Treatment">Keratin Smoothing Treatment</option>
                    <option value="Bridal">Bridal Services</option>
                    <option value="Other">Other / Consultation</option>
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="message" className="text-sm font-medium text-gray-700">Additional Notes</label>
                  <textarea id="message" rows={3} value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} className="border-b border-gray-300 py-2 focus:outline-none focus:border-[#C4A47C] bg-transparent transition-colors resize-none" placeholder="Specific stylist requests, condition of hair..."></textarea>
                </div>

                <button type="submit" className="w-full bg-[#1C1917] text-white py-4 font-medium tracking-wide hover:bg-[#C4A47C] transition-colors rounded-sm mt-4">
                  REQUEST APPOINTMENT
                </button>
              </form>
            )}
          </motion.div>

          {/* Location & Map */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            className="flex flex-col"
            id="contact"
          >
            <div className="mb-8 p-8 bg-[#F5F0EB] text-[#1C1917] rounded-sm">
              <h3 className="font-serif text-2xl mb-6">Salon Details</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <MapPin className="text-[#C4A47C] w-5 h-5 shrink-0 mt-1" />
                  <p className="text-sm">Luxm Salon<br/>Near Taj Mahal, Agra<br/>Uttar Pradesh 282001, India</p>
                </div>
                <div className="flex items-center gap-4">
                  <Phone className="text-[#C4A47C] w-5 h-5 shrink-0" />
                  <p className="text-sm">+91 98765 43210</p>
                </div>
                <div className="flex items-center gap-4">
                  <Mail className="text-[#C4A47C] w-5 h-5 shrink-0" />
                  <p className="text-sm">hello@luxmsalon.in</p>
                </div>
                <div className="flex items-start gap-4 pt-4 border-t border-gray-300/50 mt-4">
                  <Clock className="text-[#C4A47C] w-5 h-5 shrink-0 mt-1" />
                  <div className="text-sm space-y-1">
                    <p className="flex w-32 justify-between"><span>Tue - Fri</span> <span>10am - 8pm</span></p>
                    <p className="flex w-32 justify-between"><span>Saturday</span> <span>9am - 6pm</span></p>
                    <p className="flex w-32 justify-between text-gray-500"><span>Sun - Mon</span> <span>Closed</span></p>
                  </div>
                </div>
              </div>
            </div>

            {/* Google Maps iframe */}
            <div className="flex-grow min-h-[300px] w-full bg-gray-200 rounded-sm overflow-hidden">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d113554.45524859942!2d77.925501861033!3d27.176274482025735!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39740d857c2f41d9%3A0x784aef38a9523b42!2sAgra%2C%20Uttar%20Pradesh!5e0!3m2!1sen!2sin!4v1715082400000!5m2!1sen!2sin" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={false} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                className="grayscale contrast-125 opacity-90"
              ></iframe>
            </div>

          </motion.div>
        </div>
      </div>
    </section>
  );
}
