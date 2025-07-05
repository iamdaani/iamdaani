'use client';

import { motion } from 'framer-motion';
import { Briefcase, BookOpen, Rocket, Award } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { SiUpwork, SiFiverr } from 'react-icons/si';

const journey = [
  {
    icon: <Briefcase className="h-6 w-6 text-blue-500" />,
    title: '🛍️ Shopify Assistant (2023)',
    description: (
      <ul className="list-disc pl-5 space-y-1 text-muted-foreground text-sm">
        <li>Conducted deep product research for trending items.</li>
        <li>Built Shopify themes and customized storefronts.</li>
        <li>Managed product listings, orders, and store analytics.</li>
        <li>Occasionally broke themes (and got scolded 😅).</li>
      </ul>
    ),
  },
  {
    icon: <BookOpen className="h-6 w-6 text-green-500" />,
    title: '📚 Skill Uplift – Self-Taught Phase',
    description: (
      <ul className="list-disc pl-5 space-y-1 text-muted-foreground text-sm">
        <li>Completed Cloud Data Analytics training via CloudBoost.</li>
        <li>Learned and applied Python, SQL, JSON, and JavaScript.</li>
        <li>Designed impactful dashboards using Excel & Power BI.</li>
        <li>Built, cleaned, and automated data pipelines solo.</li>
      </ul>
    ),
  },
  {
    icon: <Rocket className="h-6 w-6 text-purple-500" />,
    title: '🚀 Freelance Journey Begins (2025)',
    description: (
      <ul className="list-disc pl-5 space-y-1 text-muted-foreground text-sm">
        <li>Started offering services on Upwork and Fiverr.</li>
        <li>Specialized in API integrations and workflow automation.</li>
        <li>Delivered projects using Make.com and n8n platforms.</li>
        <li>Built scalable solutions for small businesses and teams.</li>
        <li className="mt-2">
          <Link
            href="https://ahmadyar.site/#projects"
            className="text-blue-600 hover:underline text-sm font-medium"
            target="_blank"
            rel="noopener noreferrer"
          >
            📁 Click here to see my Projects
          </Link>
        </li>
      </ul>
    ),
    links: [
      {
        label: <div className="flex items-center gap-2"><SiUpwork className="text-green-600" /> Upwork</div>,
        href: 'https://www.upwork.com/freelancers/ahamdyaar',
      },
      {
        label: <div className="flex items-center gap-2"><SiFiverr className="text-[#1DBF73]" /> Fiverr</div>,
        href: 'https://www.fiverr.com/ahmad_yxr',
      },
    ],
  },
  {
    icon: <Award className="h-6 w-6 text-yellow-500" />,
    title: '🎓 Certified & Dangerous (2024)',
    description: (
      <ul className="list-disc pl-5 space-y-1 text-muted-foreground text-sm">
        <li>Google Cloud Data Analytics Certificate – strong foundation in cloud-based data handling and reporting.</li>
        <li>Make.com Expert Certificate – advanced knowledge in no-code automations and system integrations.</li>
        <li>Real proof of skills you can actually trust 👀</li>
      </ul>
    ),
    certificates: [
      '/google-cloud-data-analytics-certificate.png',
      '/make-com-certificate.png'
    ]
  },
];

const Experience = () => {
  return (
    <div className="relative z-10 mx-auto w-full max-w-5xl px-6 py-20 font-sans">
      {/* Subtle animated background particles */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ duration: 2, ease: 'easeInOut' }}
        className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-white via-gray-100 to-white animate-pulse"
      />

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
            <div className="bg-card/70 shadow-lg rounded-xl p-6 backdrop-blur-md">
              <h3 className="text-xl font-semibold text-foreground mb-4">
                {item.title}
              </h3>
              <div>{item.description}</div>

              {item.links && (
                <div className="mt-6 flex justify-center gap-6">
                  {item.links.map((link, i) => (
                    <Link
                      key={i}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full bg-muted px-4 py-2 text-sm font-medium text-foreground hover:underline"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              )}

              {item.certificates && (
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {item.certificates.map((src, i) => (
                    <div key={i} className="flex items-center justify-center">
                      <Image
                        src={src}
                        alt={`Certificate ${i + 1}`}
                        width={500}
                        height={350}
                        className="rounded-lg border shadow-md object-contain max-h-[300px]"
                      />
                    </div>
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

export default Experience;
