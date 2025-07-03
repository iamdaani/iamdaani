'use client';

import { motion } from 'framer-motion';
import { CalendarDays, Code2, Globe } from 'lucide-react';
import Image from 'next/image';
import { useChat } from 'ai/react'; // assuming you use useChat or similar hook

const InternshipCard = () => {
  const { append } = useChat(); // this function sends a new user message into the chat flow

  const handleGetSkills = () => {
    append({ role: 'user', content: 'Show me more of your skills' }); // triggers getSkills tool
  };

  const handleGetContact = () => {
    append({ role: 'user', content: 'How can I contact you?' }); // triggers getContact tool
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-accent mx-auto mt-8 w-full max-w-4xl rounded-3xl px-6 py-8 font-sans sm:px-10 md:px-16 md:py-12"
    >
      {/* Header */}
      <div className="mb-6 flex flex-col items-center sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-muted h-16 w-16 overflow-hidden rounded-full shadow-md">
            <Image
              src="/ahmad.jpg"
              alt="Ahmad Yar avatar"
              width={64}
              height={64}
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <h2 className="text-foreground text-2xl font-semibold">Ahmad Yar</h2>
            <p className="text-muted-foreground text-sm">Internship Application</p>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2 sm:mt-0">
          <span className="flex items-center gap-1 rounded-full border border-green-500 px-3 py-0.5 text-sm font-medium text-green-500">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
            </span>
            Live
          </span>
        </div>
      </div>

      {/* Internship Info */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="flex items-start gap-3">
          <CalendarDays className="mt-1 h-5 w-5 text-blue-500" />
          <div>
            <p className="text-foreground text-sm font-medium">Duration</p>
            <p className="text-muted-foreground text-sm">3–6 months (flexible)</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Globe className="mt-1 h-5 w-5 text-green-500" />
          <div>
            <p className="text-foreground text-sm font-medium">Location</p>
            <p className="text-muted-foreground text-sm">Remote / Hybrid (PK)</p>
          </div>
        </div>

        {/* Tech stack */}
        <div className="flex items-start gap-3 sm:col-span-2">
          <Code2 className="mt-1 h-5 w-5 text-purple-500" />
          <div className="w-full">
            <p className="text-foreground text-sm font-medium">Tech Stack</p>
            <div className="text-muted-foreground grid grid-cols-1 gap-y-1 text-sm sm:grid-cols-2">
              <ul className="list-disc pl-4">
                <li>n8n, Make.com, JavaScript, Python</li>
                <li>OpenAI, Vapi.ai, Ollama, AI agents</li>
                <li>Shopify store automation, custom apps</li>
                <li>Prompt engineering, RESTful APIs</li>
              </ul>
              <ul className="list-disc pl-4">
                <li>Power BI, Excel, Google Sheets API</li>
                <li>Automation flows with voice + data</li>
                <li>Upwork & freelance experience</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* What I Bring */}
      <div className="mt-10">
        <p className="text-foreground mb-2 text-lg font-semibold">What I Bring</p>
        <p className="text-foreground text-sm">
          Automation specialist delivering real AI-powered solutions using n8n, Vapi, and OpenAI. Integrated workflows across APIs, voice calls, spreadsheets, and dashboards. Solving real-world business problems with practical systems that scale.
        </p>
      </div>

      {/* Goal */}
      <div className="mt-8">
        <p className="text-foreground mb-2 text-lg font-semibold">Goal</p>
        <p className="text-foreground text-sm">
          Looking to join a smart, fast-moving team building AI/automation tools where I can grow rapidly and contribute meaningfully.
        </p>
      </div>

      {/* Action buttons */}
      <div className="mt-10 flex flex-wrap justify-center gap-4">
        <button
          onClick={handleGetSkills}
          className="cursor-pointer rounded-full bg-gray-800 px-6 py-3 font-semibold text-white transition-colors duration-300 hover:bg-zinc-700"
        >
          See more skills
        </button>
        <button
          onClick={handleGetContact}
          className="cursor-pointer rounded-full bg-black px-6 py-3 font-semibold text-white transition-colors duration-300 hover:bg-zinc-800"
        >
          Contact me
        </button>
      </div>
    </motion.div>
  );
};

export default InternshipCard;
