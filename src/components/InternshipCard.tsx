'use client';

import { motion } from 'framer-motion';
import { CalendarDays, Code2, Globe } from 'lucide-react';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.2,
      duration: 0.6,
    },
  }),
};

const InternshipCard = () => {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        visible: {
          transition: {
            staggerChildren: 0.1,
          },
        },
      }}
      className="bg-accent mx-auto mt-8 w-full max-w-4xl rounded-3xl px-6 py-8 font-sans shadow-2xl backdrop-blur-md sm:px-10 md:px-16 md:py-12"
    >
      {/* Header */}
      <motion.div variants={fadeInUp} className="mb-6 flex flex-col items-center sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="relative h-16 w-16">
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 blur-xl opacity-30 animate-pulse" />
            <div className="bg-muted h-16 w-16 overflow-hidden rounded-full shadow-lg ring-2 ring-gray-300 relative z-10">
              <img
                src="/ahmad.jpg"
                alt="Ahmad Yar"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
          <div>
            <h2 className="text-foreground text-2xl font-semibold">Ahmad Yar</h2>
            <p className="text-muted-foreground text-sm">Internship Application</p>
          </div>
        </div>

        {/* Live badge */}
        <span className="mt-4 flex items-center gap-1 rounded-full border border-green-500 px-3 py-0.5 text-sm font-medium text-green-500 shadow-sm sm:mt-0">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
          </span>
          Live
        </span>
      </motion.div>

      {/* Internship Info */}
      <motion.div variants={fadeInUp} className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="flex items-start gap-3">
          <motion.div animate={{ y: [0, -4, 0] }} transition={{ duration: 2, repeat: Infinity }}>
            <CalendarDays className="mt-1 h-5 w-5 text-blue-500" />
          </motion.div>
          <div>
            <p className="text-foreground text-sm font-medium">Duration</p>
            <p className="text-muted-foreground text-sm">3–6 months (flexible)</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <motion.div animate={{ y: [0, -4, 0] }} transition={{ duration: 2.2, repeat: Infinity }}>
            <Globe className="mt-1 h-5 w-5 text-green-500" />
          </motion.div>
          <div>
            <p className="text-foreground text-sm font-medium">Location</p>
            <p className="text-muted-foreground text-sm">Remote / Hybrid (Pakistan)</p>
          </div>
        </div>
      </motion.div>

      {/* Tech stack */}
      <motion.div variants={fadeInUp} className="mt-8 flex items-start gap-3 sm:col-span-2">
        <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ repeat: Infinity, duration: 5 }}>
          <Code2 className="mt-1 h-5 w-5 text-purple-500" />
        </motion.div>
        <div className="w-full">
          <p className="text-foreground text-sm font-medium mb-2">Tech Stack</p>
          <div className="text-muted-foreground grid grid-cols-1 gap-y-1 text-sm sm:grid-cols-2">
            <ul className="list-disc space-y-1 pl-4">
              <li>Cloud Engineering (Serverless, APIs, IAM)</li>
              <li>n8n, Make.com, JavaScript, Python</li>
              <li>OpenAI, Vapi.ai, Ollama, AI Agents</li>
              <li>Shopify Store Automation, Liquid + GraphQL</li>
            </ul>
            <ul className="list-disc space-y-1 pl-4">
              <li>Power BI, Excel, Google Sheets API</li>
              <li>Voice + Data Flows into CRM & Dashboards</li>
              <li>RESTful APIs, Webhooks, JSON Transform</li>
              <li>
                <a
                  href="/chat?query=What%20are%20your%20skills%3F%20Give%20me%20a%20list%20of%20your%20soft%20and%20hard%20skills."
                  className="cursor-pointer items-center text-blue-500 underline hover:text-blue-700"
                >
                  See more
                </a>
              </li>
            </ul>
          </div>
        </div>
      </motion.div>

      {/* What I bring */}
      <motion.div variants={fadeInUp} className="mt-10">
        <p className="text-foreground mb-2 text-lg font-semibold">What I bring</p>
        <p className="text-foreground text-sm">
         Crafting end-to-end automation & data pipelines with the slickness of a modern AI ninja on cloud steroids! I’ve slung together full-stack systems that juggle voice, APIs, spreadsheets, dashboards, and sassy AI agents like a circus pro. Famous for rock-solid reliability, lightning-fast iteration, and delivering real-world wins with a side of chuckles!
        </p>
      </motion.div>

      {/* Goal */}
      <motion.div variants={fadeInUp} className="mt-8">
        <p className="text-foreground mb-2 text-lg font-semibold">Goal</p>
        <p className="text-foreground text-sm">
          Join a bold, innovative team building AI-powered tools that matter. I want to improve fast, contribute hard, and leave a mark. I’m fast, flexible, and HUNGRYYYYY 🔥
        </p>
      </motion.div>

      {/* Contact button */}
      <motion.div variants={fadeInUp} className="mt-10 flex justify-center">
        <a
          href="/chat?query=Can%20I%20get%20you%20contact%20info"
          className="cursor-pointer rounded-full bg-black px-6 py-3 font-semibold text-white transition-colors duration-300 hover:bg-zinc-800 shadow-md"
        >
          Contact me
        </a>
      </motion.div>
    </motion.div>
  );
};

export default InternshipCard;
