'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Phone, Mail, User2 } from 'lucide-react';
import { FaLinkedin } from 'react-icons/fa';
import Image from 'next/image';
import Particles from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';

export function Contact() {
  const contactInfo = {
    name: 'Ahmad Yar',
    email: 'ahamdjin34@gmail.com',
    phone: '+92 326-6255946',
    linkedin: 'https://www.linkedin.com/in/ahamd-yar/',
    imageUrl: '/ahmad.jpg',
  };

  const openLink = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="relative mx-auto mt-12 w-full max-w-4xl"
    >
      {/* Background Particles */}
      <Particles
        id="tsparticles"
        options={{
          fullScreen: false,
          background: { color: { value: 'transparent' } },
          particles: {
            color: { value: '#60a5fa' },
            links: { enable: true, color: '#93c5fd' },
            move: { enable: true, speed: 0.5 },
            number: { value: 30 },
            opacity: { value: 0.4 },
            shape: { type: 'circle' },
            size: { value: 2 },
          },
        }}
        className="absolute inset-0 -z-10"
      />

      <div className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-3xl px-6 py-10 sm:px-12 md:py-14 relative z-10">
        <div className="mb-10 text-center">
          <h2 className="text-foreground text-3xl font-bold md:text-4xl">Get in Touch</h2>
          <p className="text-muted-foreground mt-2 text-sm">
            I'd love to connect with you! Feel free to reach out.
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-16">
          {/* Profile Image */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-blue-500 shadow-lg ring-2 ring-blue-400/50"
          >
            <Image
              src={contactInfo.imageUrl}
              alt={contactInfo.name}
              fill
              className="object-cover"
            />
          </motion.div>

          <div className="flex-1 space-y-6">
            {/* Name */}
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ repeat: Infinity, duration: 3 }}
                className="text-blue-600"
              >
                <User2 />
              </motion.div>
              <span className="text-base font-medium text-white">{contactInfo.name}</span>
            </div>

            {/* Email */}
            <div
              className="group flex items-center gap-3 cursor-pointer"
              onClick={() => openLink(`mailto:${contactInfo.email}`)}
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="text-blue-400"
              >
                <Mail />
              </motion.div>
              <span className="text-blue-300 hover:underline text-sm">
                {contactInfo.email}
              </span>
              <ChevronRight className="h-5 w-5 text-blue-300 group-hover:translate-x-1 transition-transform" />
            </div>

            {/* Phone */}
            <div
              className="group flex items-center gap-3 cursor-pointer"
              onClick={() => openLink(`tel:${contactInfo.phone}`)}
            >
              <motion.div
                animate={{ y: [0, -2, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="text-blue-400"
              >
                <Phone />
              </motion.div>
              <span className="text-blue-300 hover:underline text-sm">{contactInfo.phone}</span>
              <ChevronRight className="h-5 w-5 text-blue-300 group-hover:translate-x-1 transition-transform" />
            </div>

            {/* LinkedIn */}
            <div className="mt-6">
              <motion.button
                whileHover={{
                  scale: 1.05,
                  boxShadow: '0 0 10px #3b82f6, 0 0 20px #60a5fa',
                }}
                onClick={() => openLink(contactInfo.linkedin)}
                className="inline-flex items-center gap-2 rounded-full bg-blue-600 text-white px-5 py-2 font-medium hover:bg-blue-700 transition-all shadow-md"
              >
                <FaLinkedin className="h-5 w-5" />
                Connect on LinkedIn
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default Contact;
