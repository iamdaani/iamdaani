'use client';

import { motion } from 'framer-motion';
import { Briefcase, BookOpen, Rocket, Award } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const journey = [
  {
    icon: <Briefcase className="h-5 w-5 text-blue-500" />,
    title: 'Shopify Assistant (2023)',
    description: `Started my journey with product research, theme building, and store management. As a lazy rookie, I often got roasted by my brother and had to redo things from scratch. Character building, you could say.`,
  },
  {
    icon: <BookOpen className="h-5 w-5 text-green-500" />,
    title: 'Skill Uplift – Self-Taught Phase',
    description: `Dove into cloud analytics through CloudBoost. Learned Python, SQL, JSON, JavaScript, and how to build sexy dashboards and clean data like a digital janitor with vision.`,
  },
  {
    icon: <Rocket className="h-5 w-5 text-purple-500" />,
    title: 'Freelance Journey Begins (2025)',
    description: `Jumped into freelance 2 months ago. Built data pipelines, API integrations, and automation flows.`,
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
    icon: <Award className="h-5 w-5 text-yellow-500" />,
    title: 'Certified & Dangerous (2024)',
    description: `Earned certificates in Google Cloud Data Analytics and Make.com Expert. Can’t show the links, but trust me, they look shiny.`,
    certificates: [
      '/cert-placeholder1.png',
      '/cert-placeholder2.png'
    ]
  },
];

const ExperienceJourney = () => {
  return (
    <div className="mx-auto w-full max-w-4xl py-12 font-sans">
      <h2 className="text-foreground mb-10 text-center text-4xl font-bold">
        My Experience Journey 🚀
      </h2>

      <div className="relative space-y-10 border-l-2 border-muted pl-6">
        {journey.map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: idx * 0.1 }}
            viewport={{ once: true }}
            className="relative pl-8"
          >
            <div className="absolute -left-5 top-0 rounded-full bg-background shadow p-2">
              {item.icon}
            </div>
            <h3 className="text-lg font-semibold text-foreground">
              {item.title}
            </h3>
            <p className="mt-2 text-muted-foreground text-sm leading-relaxed">
              {item.description}
            </p>
            {item.links && (
              <div className="mt-3 flex flex-wrap gap-4">
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
              <div className="mt-4 flex flex-wrap gap-4">
                {item.certificates.map((src, i) => (
                  <Image
                    key={i}
                    src={src}
                    alt={`Certificate ${i + 1}`}
                    width={200}
                    height={120}
                    className="rounded-xl border shadow"
                  />
                ))}
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ExperienceJourney;
