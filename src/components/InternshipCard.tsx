'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { CalendarDays, Globe, Cpu } from 'lucide-react';
import Image from 'next/image';
import { useChat } from 'ai/react';

const InternshipCard = () => {
  // ① Destructure append from useChat
  const { append } = useChat();

  // ② On mount, append a message to trigger getInternship
  useEffect(() => {
    append({ role: 'user', content: 'getInternship' });
    // If you want to trigger a function call, ensure your backend handles this message appropriately.
    // Optionally, you can debounce or check if already sent.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ③ Handlers for the other two tools
  const seeMoreSkills = () =>
    append({ role: 'user', content: 'Want to know more about my Skills' });

  const getContactInfo = () =>
    append({ role: 'user', content: 'Want to know about my contact information' });

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-accent mx-auto mt-8 w-full max-w-4xl rounded-3xl px-6 py-8 font-sans sm:px-10 md:px-16 md:py-12"
    >
      {/* Header */}
      <div className="mb-6 flex flex-col items-center sm:flex-row sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-muted h-16 w-16 overflow-hidden rounded-full shadow-md">
            <Image
              src="/ahmad.jpg"
              alt="Ahmad Yar"
              width={64}
              height={64}
              className="object-cover"
            />
          </div>
          <div>
            <h2 className="text-foreground text-2xl font-semibold">Ahmad Yar</h2>
            <p className="text-muted-foreground text-sm">Internship Seeker</p>
          </div>
        </div>
        <span className="mt-4 flex items-center gap-2 rounded-full border border-green-500 px-3 py-0.5 text-sm font-medium text-green-500 sm:mt-0">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
          </span>
          Live
        </span>
      </div>

      {/* Meta info */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="flex items-start gap-3">
          <CalendarDays className="mt-1 h-5 w-5 text-blue-500" />
          <div>
            <p className="text-foreground text-sm font-medium">Duration</p>
            <p className="text-muted-foreground text-sm">6 months (Sept ’25)</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Globe className="mt-1 h-5 w-5 text-green-500" />
          <div>
            <p className="text-foreground text-sm font-medium">Location</p>
            <p className="text-muted-foreground text-sm">Remote / Hybrid (Pakistan)</p>
          </div>
        </div>
      </div>

      {/* Tech stack */}
      <div className="mt-8 flex items-start gap-3">
        <Cpu className="mt-1 h-5 w-5 text-purple-500" />
        <div className="w-full">
          <p className="text-foreground text-sm font-medium mb-2">Tech stack</p>
          <div className="text-muted-foreground grid grid-cols-1 gap-y-1 text-sm sm:grid-cols-2">
            <ul className="list-disc pl-4 space-y-1">
              <li>AWS Serverless & Data Warehousing</li>
              <li>ETL & Orchestration (Glue, Airflow, n8n)</li>
              <li>AI/ML & Prompt Engineering (OpenAI, Ollama)</li>
              <li>Shopify Liquid, GraphQL, Webhooks</li>
            </ul>
            <ul className="list-disc pl-4 space-y-1">
              <li>Power BI & Real‑Time Dashboards</li>
              <li>Google Sheets & Excel Automations</li>
              <li>Voice ➔ CRM ➔ BI Workflow Flows</li>
              <li>
                Upwork Freelance ·{' '}
                <button
                  onClick={seeMoreSkills}
                  className="text-blue-600 underline hover:text-blue-800 transition-colors"
                >
                  See more
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* What I Bring */}
      <div className="mt-10">
        <h3 className="text-foreground text-lg font-semibold">What I Bring</h3>
        <p className="text-foreground text-sm mt-2">
          End‑to‑end automation: data pipelines, AI agents, and dashboards—deployed as secure, scalable services.
        </p>
      </div>

      {/* Goal */}
      <div className="mt-8">
        <h3 className="text-foreground text-lg font-semibold">Goal</h3>
        <p className="text-foreground text-sm mt-2">
          Join a forward‑thinking team to build AI‑driven automation at scale and grow into a technical leadership role.
        </p>
      </div>

      {/* Contact button */}
      <div className="mt-10 flex justify-center">
        <button
          onClick={getContactInfo}
          className="rounded-full bg-black px-6 py-3 text-white font-semibold transition hover:bg-zinc-800"
        >
          Contact me
        </button>
      </div>
    </motion.div>
  );
};

export default InternshipCard;
