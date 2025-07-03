"use client";

import { motion, easeInOut } from "framer-motion";
import Image from "next/image";
import React from "react";

export function Presentation() {
  const profile = {
    name: "Ahmad Yar",
    age: "20 years old",
    location: "Lahore, Pakistan",
    description:
      "Cloud Data Engineer & AI Whisperer. I automate the internet, build pipelines in the cloud ☁️, and my n8n workflows probably have consciousness by now. AI runs through my veins 💉🤖.",
    src: "/ahmad.jpg",
    fallbackSrc:
      "https://images.unsplash.com/photo-1610216705422-caa3fcb6d158?q=80&w=3560&auto=format&fit=crop&ixlib=rb-4.0.3",
    funFact:
      "At night, I look like a character who just escaped a horror movie. Still debugging errors in the dark...",
  };

  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: easeInOut },
    },
  };

  const paragraphAnimation = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: easeInOut, delay: 0.2 },
    },
  };

  const tags = [
    "Cloud Engineering",
    "n8n Wizard",
    "AI Automator 🤖",
    "Data Pipeline Architect",
    "Bug Hunter by Night",
    "Chai-Fueled Coder ☕",
  ];

  return (
    <div className="mx-auto w-full max-w-5xl py-6 font-sans">
      <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-2">
        {/* Image Section */}
        <div className="relative mx-auto aspect-square w-full max-w-sm">
          <div className="relative h-full w-full overflow-hidden rounded-2xl shadow-xl">
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
              className="h-full w-full"
            >
              <Image
                src={profile.src}
                alt={profile.name}
                width={500}
                height={500}
                className="h-full w-full object-cover object-center"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = profile.fallbackSrc;
                }}
              />
              {/* Glowing effect */}
              <div className="absolute inset-0 rounded-2xl border-2 border-transparent bg-gradient-to-t from-zinc-900 via-transparent to-transparent opacity-70 blur-sm"></div>
            </motion.div>
          </div>
        </div>

        {/* Text Content */}
        <div className="flex flex-col space-y">
          <motion.div initial="hidden" animate="visible" variants={textVariants}>
            <h1 className="from-foreground to-muted-foreground bg-gradient-to-r bg-clip-text text-xl font-bold text-transparent md:text-3xl">
              {profile.name}
            </h1>
            <div className="mt-1 flex flex-col gap-1 md:flex-row md:items-center md:gap-4">
              <p className="text-muted-foreground">{profile.age}</p>
              <div className="bg-border hidden h-1.5 w-1.5 rounded-full md:block" />
              <p className="text-muted-foreground">{profile.location}</p>
            </div>
          </motion.div>

          <motion.p
            initial="hidden"
            animate="visible"
            variants={paragraphAnimation}
            className="text-foreground mt-6 leading-relaxed whitespace-pre-line"
          >
            {profile.description}
          </motion.p>

          <motion.p
            initial="hidden"
            animate="visible"
            variants={paragraphAnimation}
            className="text-muted-foreground text-sm italic mt-2"
          >
            {profile.funFact}
          </motion.p>

          {/* Floating Animated Tags */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={textVariants}
            className="mt-4 flex flex-wrap gap-3"
          >
            {tags.map((tag, index) => (
              <motion.span
                key={tag}
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 + index * 0.1, type: "spring" }}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md rounded-full px-4 py-1.5 text-xs font-medium"
              >
                {tag}
              </motion.span>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default Presentation;
