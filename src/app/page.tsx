'use client';

import { Button } from '@/components/ui/button';
import WelcomeModal from '@/components/welcome-modal';
import FluidCursor from '@/components/FluidCursor';
import {
  ArrowRight,
  BriefcaseBusiness,
  Laugh,
  Layers,
  PartyPopper,
  UserRoundSearch,
} from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

/* ---------- Question data ---------- */
const questions = {
  Me: 'Who are you? I want to know more about you.',
  Projects: 'What are your projects? What are you working on right now?',
  Skills: 'What are your skills? Give me a list of your soft and hard skills.',
  Fun: 'Show me your Gaming Highlights? What are your hobbies?',
  Contact: 'How can I reach you? Can I get your contact info?',
} as const;

const questionConfig = [
  { key: 'Me', color: '#329696', icon: Laugh },
  { key: 'Projects', color: '#3E9858', icon: BriefcaseBusiness },
  { key: 'Skills', color: '#856ED9', icon: Layers },
  { key: 'Fun', color: '#B95F9D', icon: PartyPopper },
  { key: 'Contact', color: '#C19433', icon: UserRoundSearch },
] as const;

/* ---------- Main component ---------- */
export default function Home() {
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const goToChat = (query: string) =>
    router.push(`/chat?query=${encodeURIComponent(query)}`);

  // Animation variants
  const topVariants = {
    hidden: { opacity: 0, y: -60 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { ease: [0.4, 0, 0.2, 1], duration: 0.8 },
    },
  };

  const bottomVariants = {
    hidden: { opacity: 0, y: 80 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { ease: [0.4, 0, 0.2, 1], duration: 0.8, delay: 0.2 },
    },
  };

  useEffect(() => {
    const preloadImg = new Image();
    preloadImg.src = '/landing-memojis.png';

    const linkWebm = document.createElement('link');
    linkWebm.rel = 'preload';
    linkWebm.as = 'video';
    linkWebm.href = '/final_memojis.webm';
    document.head.appendChild(linkWebm);

    const linkMp4 = document.createElement('link');
    linkMp4.rel = 'prefetch';
    linkMp4.as = 'video';
    linkMp4.href = '/final_memojis_ios.mp4';
    document.head.appendChild(linkMp4);
  }, []);

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 pb-10 md:pb-20">
      {/* Blurred Footer Label */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center overflow-hidden z-0">
        <div
          className="hidden sm:block text-transparent font-black select-none text-[10rem] lg:text-[16rem] bg-gradient-to-b from-neutral-500/10 to-neutral-500/0 bg-clip-text leading-none"
          style={{ marginBottom: '-2.5rem' }}
        >
          Ahmad Yar
        </div>
      </div>

      {/* Internship Button */}
      <div className="absolute top-6 left-6 z-20">
        <button
          onClick={() => goToChat('Are you looking for an internship?')}
          className="flex items-center gap-2 px-4 py-1.5 text-sm font-medium text-black border rounded-full shadow-md backdrop-blur-lg bg-white/30 hover:bg-white/60"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
          </span>
          need an intern?
        </button>
      </div>

      {/* Hero Title Section */}
      <motion.div
        className="z-10 mt-24 mb-8 text-center md:mt-4 md:mb-12 flex flex-col items-center"
        initial="hidden"
        animate="visible"
        variants={topVariants}
      >
        <WelcomeModal />
        <h2 className="text-xl md:text-2xl font-semibold mt-1 text-secondary-foreground">
          Hey, I'm Ahmad 👋
        </h2>
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold">
          AI Portfolio
        </h1>
      </motion.div>

      {/* Center Avatar */}
      <div className="relative z-10 h-52 w-48 sm:h-72 sm:w-72 overflow-hidden">
        <Image
          src="/landing-memojis.png"
          alt="Hero memoji"
          width={2000}
          height={2000}
          priority
          className="translate-y-14 scale-[2] object-cover"
        />
      </div>

      {/* Search + Quick Questions */}
      <motion.div
        className="z-10 mt-6 w-full flex flex-col items-center"
        initial="hidden"
        animate="visible"
        variants={bottomVariants}
      >
        {/* Freeform input */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (input.trim()) goToChat(input.trim());
          }}
          className="relative w-full max-w-lg"
        >
          <div className="flex items-center px-6 py-2.5 border border-neutral-200 bg-white/30 backdrop-blur-lg rounded-full transition-all hover:border-neutral-300">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything…"
              className="w-full bg-transparent text-base text-neutral-800 placeholder:text-neutral-500 focus:outline-none"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              aria-label="Submit"
              className="p-2.5 rounded-full bg-[#0171E3] text-white hover:bg-blue-600 disabled:opacity-70"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </form>

        {/* Quick-ask buttons */}
        <div className="mt-4 grid w-full max-w-2xl grid-cols-1 gap-3 sm:grid-cols-3 md:grid-cols-5">
          {questionConfig.map(({ key, color, icon: Icon }) => (
            <Button
              key={key}
              onClick={() => goToChat(questions[key])}
              variant="outline"
              className="aspect-square w-full py-8 md:p-10 rounded-2xl border border-border backdrop-blur-lg bg-white/30 hover:bg-border/30 active:scale-95 shadow-none"
            >
              <div className="flex flex-col items-center justify-center h-full gap-1 text-gray-700">
                <Icon size={22} strokeWidth={2} color={color} />
                <span className="text-xs sm:text-sm font-medium">{key}</span>
              </div>
            </Button>
          ))}
        </div>
      </motion.div>

      <FluidCursor />
    </div>
  );
}
