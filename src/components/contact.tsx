'use client';

import React from "react";
import { motion } from "framer-motion";
import { ChevronRight, Phone, Mail, User2 } from "lucide-react";
import { FaLinkedin } from "react-icons/fa";
import Image from "next/image";

export function Contact() {
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
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="mx-auto mt-12 w-full max-w-4xl"
    >
      <div className="bg-accent rounded-3xl px-6 py-10 sm:px-12 md:py-14 shadow-xl">
        <div className="mb-8 text-center">
          <h2 className="text-foreground text-3xl font-bold md:text-4xl">Get in Touch</h2>
          <p className="text-muted-foreground mt-2 text-sm">I'd love to connect with you! Feel free to reach out.</p>
        </div>

        {/* Profile Picture */}
        <div className="flex justify-center mb-6">
          <div className="relative h-32 w-32 rounded-full overflow-hidden border-4 border-blue-400 shadow-md">
            <Image
              src={contactInfo.imageUrl}
              alt={contactInfo.name}
              fill
              className="object-cover"
            />
          </div>
        </div>

        <div className="space-y-5">
          <div className="flex items-center gap-3">
            <User2 className="text-blue-600" />
            <span className="text-base font-medium text-foreground">{contactInfo.name}</span>
          </div>
          <div
            className="group flex items-center gap-3 cursor-pointer"
            onClick={() => openLink(`mailto:${contactInfo.email}`)}
          >
            <Mail className="text-blue-600" />
            <span className="text-blue-500 hover:underline text-sm">{contactInfo.email}</span>
            <ChevronRight className="h-5 w-5 text-blue-500 group-hover:translate-x-1 transition-transform" />
          </div>
          <div
            className="group flex items-center gap-3 cursor-pointer"
            onClick={() => openLink(`tel:${contactInfo.phone}`)}
          >
            <Phone className="text-blue-600" />
            <span className="text-blue-500 hover:underline text-sm">{contactInfo.phone}</span>
            <ChevronRight className="h-5 w-5 text-blue-500 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        <div className="mt-10">
          <h3 className="text-lg font-semibold text-foreground mb-3">Socials</h3>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => openLink(contactInfo.linkedin)}
              className="flex items-center gap-2 rounded-full bg-blue-600 text-white px-4 py-2 text-sm font-medium hover:bg-blue-700 transition-colors shadow-md"
            >
              <FaLinkedin />
              LinkedIn
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default Contact;
