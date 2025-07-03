'use client';

import React from "react";
import { motion } from "framer-motion";
import { ChevronRight, Phone, Mail, User2 } from "lucide-react";
import { FaLinkedin } from "react-icons/fa";
import Image from "next/image";

const Contact = () => {
  const contactInfo = {
    name: "Ahmad Yar",
    email: "ahamdjin34@gmail.com",
    phone: "+92 326-6255946",
    linkedin: "https://www.linkedin.com/in/ahamd-yar/",
    imageUrl: "/ahmad.jpg",
  };

  const openLink = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="relative mx-auto mt-12 w-full max-w-4xl overflow-hidden"
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute -top-20 right-4 h-64 w-64 rounded-full bg-blue-300 opacity-20 blur-3xl pointer-events-none"
      />

      <div className="bg-accent rounded-3xl px-6 py-10 sm:px-12 md:py-14 shadow-xl border border-muted">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-14 mb-10">
          <motion.div
            whileHover={{ scale: 1.04 }}
            className="relative rounded-full border-4 border-blue-400 shadow-lg overflow-hidden w-40 h-40"
          >
            <Image
              src={contactInfo.imageUrl}
              alt={contactInfo.name}
              fill
              className="object-cover"
            />
          </motion.div>

          <div className="text-center md:text-left space-y-2">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">Let's Connect 👋</h2>
            <p className="text-muted-foreground max-w-md">
              I’m <span className="font-semibold text-blue-600">{contactInfo.name}</span> — a passionate automation and data expert. Whether it's n8n, AI voice flows, or workflow systems, let’s build something remarkable together.
            </p>
          </div>
        </div>

        <div className="border-t border-muted my-6" />

        <div className="grid gap-6 sm:grid-cols-2">
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

          <motion.div whileHover={{ scale: 1.02 }} className="group flex items-center gap-3">
            <div className="bg-emerald-100 text-emerald-600 p-2 rounded-full">
              <Phone className="h-5 w-5" />
            </div>
            <span className="text-muted-foreground font-medium text-base">
              {contactInfo.phone}
            </span>
          </motion.div>

          <motion.div whileHover={{ scale: 1.03 }} className="group flex items-center gap-3">
            <button
              onClick={() => openLink(contactInfo.linkedin)}
              className="inline-flex items-center gap-2 rounded-full bg-blue-600 text-white px-5 py-2 font-medium hover:bg-blue-700 transition-all shadow-md"
              title="Visit LinkedIn"
            >
              <FaLinkedin className="h-5 w-5" />
              Connect on LinkedIn
            </button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default Contact;
