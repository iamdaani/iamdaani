'use client';

import { motion } from 'framer-motion';
import { Briefcase, BookOpen, Rocket, Award } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const journey = [
  {
    icon: <Briefcase className="h-6 w-6 text-blue-500" />,
    title: '🛍️ Shopify Assistant (2023)',
    description: `Started my professional journey as a Shopify Assistant — doing product research, creating listings, managing stores, and occasionally (accidentally) breaking the theme. My brother, a firm yet lovable QA lead, ensured I never got too comfortable. Character building, indeed.`,
  },
  {
    icon: <BookOpen className="h-6 w-6 text-green-500" />,
    title: '📚 Skill Uplift – Self-Taught Phase',
    description: `Discovered the Cloud. Enrolled in Google Cloud Skill Boost and started learning cloud data analytics. Taught myself Python, SQL, JSON, JavaScript — and learned to build dashboards, process data, and even speak Excel fluently.`,
  },
  {
    icon: <Rocket className="h-6 w-6 text-purple-500" />,
    title: '🚀 Freelance Journey Begins (2025)',
    description: `Entered the freelancing world with confidence and curiosity. Built a complete data pipeline for Ringba call tracking — automated reporting, cloud storage, dashboards, the works. Currently offering services in API integration, data automation, and workflow engineering.`,
    links: [
      {
        label: '📁 Click here to see my Projects',
        href: 'https://ahmadyar.site/#projects',
      },
      {
        label: '🧑‍💻 Upwork',
        href: 'https://www.upwork.com/freelancers/ahamdyaar',
      },
      {
        label: '🎯 Fiverr',
        href: 'https://www.fiverr.com/ahmad_yxr',
      },
    ],
  },
  {
    icon: <Award className="h-6 w-6 text-yellow-500" />,
    title: '🎓 Certified & Dangerous (2024)',
    description: `Achieved Google Cloud Data Analyst and Make.com Expert certifications. While I can’t link them here, I assure you — they’re real and they’re spectacular. Below are visual placeholders until I upload the real ones.`,
    certificates: [
      '/cert-placeholder1.png',
      '/cert-placeholder2.png'
    ]
  },
];

const ExperienceJourney = () => {
  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-16 font-sans">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center text-4xl font-bold text-foreground mb-12"
      >
        My Experience Journey 🚀
      </motion.h2>

      <div className="relative border-l-2 border-muted pl-6 space-y-16">
        {journey.map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: idx * 0.1 }}
            viewport={{ once: true }}
            className="relative pl-10"
          >
            {/* Timeline Dot */}
            <div className="absolute left-[-1.2rem] top-1 bg-background p-2 rounded-full shadow-md">
              {item.icon}
            </div>

            {/* Content */}
            <div className="bg-card shadow-lg rounded-xl p-6">
              <h3 className="text-xl font-semibold text-foreground mb-2">
                {item.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {item.description}
              </p>

              {item.links && (
                <div className="mt-4 flex flex-wrap gap-4">
                  {item.links.map((link, i) => (
                    <Link
                      key={i}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline text-sm font-medium"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              )}

              {item.certificates && (
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {item.certificates.map((src, i) => (
                    <Image
                      key={i}
                      src={src}
                      alt={`Certificate ${i + 1}`}
                      width={600}
                      height={400}
                      className="rounded-lg border shadow-md object-contain"
                    />
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ExperienceJourney;
