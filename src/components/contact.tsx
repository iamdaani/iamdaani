'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, Linkedin } from 'lucide-react';

const Contact = () => {
  const contactInfo = {
    name: 'Ahmad Yar',
    email: 'ahamdjin34@gmail.com',
    phone: '+92 326-6255946',
    linkedin: 'https://www.linkedin.com/in/ahamd-yar/',
  };

  const openLink = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
      className="relative mx-auto mt-16 max-w-4xl overflow-hidden rounded-3xl bg-gradient-to-br from-sky-50 to-white shadow-xl border border-muted px-6 py-12 sm:px-12 md:py-16"
    >
      {/* Decorative animated shape */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        className="absolute -top-20 right-4 h-64 w-64 rounded-full bg-blue-300 opacity-20 blur-3xl pointer-events-none"
      />

      {/* Top: Headline */}
      <div className="text-center space-y-2 mb-10">
        <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
          Say Hello 👋
        </h2>
        <p className="text-muted-foreground max-w-xl mx-auto">
          I’m <span className="font-semibold text-blue-600">{contactInfo.name}</span> — a passionate automation and data expert. Whether it's n8n, AI voice flows, or workflow systems, let’s build something remarkable together.
        </p>
      </div>

      <div className="border-t border-muted my-6" />

      {/* Contact Details */}
      <div className="grid gap-6 sm:grid-cols-2">
        {/* Email */}
        <motion.div whileHover={{ scale: 1.02 }} className="group flex items-center gap-3 cursor-pointer">
          <div className="bg-blue-100 text-blue-600 p-2 rounded-full">
            <Mail className="h-5 w-5" />
          </div>
          <span
            className="text-blue-600 hover:underline font-medium text-base"
            onClick={() => openLink(`mailto:${contactInfo.email}`)}
          >
            {contactInfo.email}
          </span>
        </motion.div>

        {/* Phone */}
        <motion.div whileHover={{ scale: 1.02 }} className="group flex items-center gap-3">
          <div className="bg-emerald-100 text-emerald-600 p-2 rounded-full">
            <Phone className="h-5 w-5" />
          </div>
          <span className="text-muted-foreground font-medium text-base">
            {contactInfo.phone}
          </span>
        </motion.div>

        {/* LinkedIn */}
        <motion.div whileHover={{ scale: 1.03 }} className="group flex items-center gap-3">
          <button
            onClick={() => openLink(contactInfo.linkedin)}
            className="inline-flex items-center gap-2 rounded-full bg-blue-600 text-white px-5 py-2 font-medium hover:bg-blue-700 transition-all shadow-md"
            title="Visit LinkedIn"
          >
            <Linkedin className="h-5 w-5" />
            Connect on LinkedIn
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Contact;
