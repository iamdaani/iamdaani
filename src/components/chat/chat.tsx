// app/chat/page.tsx
'use client';

import { useChat } from 'ai/react';
import { AnimatePresence, motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';

import ChatBottombar from '@/components/chat/chat-bottombar';
import ChatLanding from '@/components/chat/chat-landing';
import ChatMessageContent from '@/components/chat/chat-message-content';
import { SimplifiedChatView } from '@/components/chat/simple-chat-view';
import { ChatBubble, ChatBubbleMessage } from '@/components/ui/chat/chat-bubble';
import WelcomeModal from '@/components/welcome-modal';
import { Info } from 'lucide-react';
import GitHubButton from 'react-github-btn';
import HelperBoost from './HelperBoost';

const ClientOnly = ({ children }: { children: React.ReactNode }) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted ? <>{children}</> : null;
};

interface AvatarProps {
  isTalking: boolean;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  hasActiveTool: boolean;
}

const Avatar = dynamic<AvatarProps>(
  () =>
    Promise.resolve(({ isTalking, videoRef, hasActiveTool }) => {
      const isiOS = () => {
        const ua = navigator.userAgent;
        const pf = navigator.platform;
        const mt = navigator.maxTouchPoints || 0;
        return /iPad|iPhone|iPod/.test(ua) || (pf === 'MacIntel' && mt > 1);
      };
      return (
        <div className={`flex ${hasActiveTool ? 'h-20 w-20' : 'h-28 w-28'} rounded-full`}>
          <div onClick={() => (location.href = '/')} className="cursor-pointer">
            {isiOS() ? (
              <img src="/landing-memojis.png" className="h-full w-full" />
            ) : (
              <video ref={videoRef} className="h-full w-full" muted playsInline loop>
                <source src="/final_memojis.webm" type="video/webm" />
                <source src="/final_memojis_ios.mp4" type="video/mp4" />
              </video>
            )}
          </div>
        </div>
      );
    }),
  { ssr: false }
);

const MOTION = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 },
  transition: { duration: 0.3, ease: "easeInOut" as const },
};

export default function ChatPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const params = useSearchParams();
  const initial = params.get('query') || '';
  const [auto, setAuto] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [isTalking, setIsTalking] = useState(false);

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    stop,
    append,
    setInput,
  } = useChat({
    api: '/api/chat',
    onResponse() {
      setLoadingSubmit(false);
      setIsTalking(true);
      videoRef.current?.play().catch(console.warn);
    },
    onFinish() {
      setLoadingSubmit(false);
      setIsTalking(false);
      videoRef.current?.pause();
    },
    onError(err) {
      setLoadingSubmit(false);
      setIsTalking(false);
      videoRef.current?.pause();
      toast.error(`Error: ${err.message}`);
    },
    onToolCall(tool) {
      console.log('🔧 tool call:', tool.toolCall.toolName);
    },
  });

  const { latestUser, latestAI, hasTool } = useMemo(() => {
    const li = messages.findLast((m) => m.role === 'assistant') || null;
    const lu = messages.findLast((m) => m.role === 'user') || null;
    const tool = !!li?.parts?.some((p) => p.type === 'tool-invocation');
    return { latestAI: li, latestUser: lu, hasTool: tool };
  }, [messages]);

  const isEmpty = !latestAI && !latestUser && !loadingSubmit;
  const headerHt = hasTool ? 100 : 180;

  // Auto-submit initial query once
  useEffect(() => {
    if (initial && !auto) {
      setAuto(true);
      append({ role: 'user', content: initial });
    }
  }, [initial, auto, append]);

  // Setup video element
  useEffect(() => {
    const v = videoRef.current;
    if (v) {
      v.loop = true; v.muted = true; v.playsInline = true; v.pause();
    }
  }, []);

  return (
    <div className="relative h-screen overflow-hidden">
      {/* Top controls */}
      <div className="absolute top-6 right-8 flex gap-2 z-50">
        <WelcomeModal trigger={<Info className="h-8 cursor-pointer" />} />
        <GitHubButton href="https://github.com/toukoum/portfolio" data-size="large" />
      </div>

      {/* Avatar Header */}
      <div className="fixed top-0 left-0 right-0 bg-gradient-to-b from-white via-white/80 to-transparent z-40">
        <div className={`py-6 transition-all ${hasTool ? 'pt-6 pb-0' : 'py-6'}`}>
          <div className="flex justify-center">
            <ClientOnly>
              <Avatar isTalking={isTalking} videoRef={videoRef} hasActiveTool={hasTool} />
            </ClientOnly>
          </div>
          <AnimatePresence>
            {latestUser && !latestAI && (
              <motion.div {...MOTION} className="mx-auto max-w-3xl px-4">
                <ChatBubble variant="sent">
                  <ChatBubbleMessage>
                    <ChatMessageContent message={latestUser} />
                  </ChatBubbleMessage>
                </ChatBubble>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Chat body */}
      <div className="container mx-auto max-w-3xl flex flex-col h-full" style={{ paddingTop: headerHt }}>
        <div className="flex-1 overflow-y-auto px-2">
          <AnimatePresence mode="wait">
            {isEmpty ? (
              <motion.div {...MOTION} className="flex items-center justify-center h-full">
                <ChatLanding submitQuery={(query: string) => append({ role: 'user', content: query })} />
              </motion.div>
            ) : latestAI ? (
              <div className="pb-4">
                <SimplifiedChatView
                  message={latestAI}
                  isLoading={isLoading}
                  reload={async (_opts) => {
                    await handleSubmit();
                    return undefined;
                  }}
                  addToolResult={(res) =>
                    append({
                      role: 'tool',
                      content: res.result,
                      toolCallId: res.toolCallId,
                    } as any)
                  }
                />
              </div>
            ) : loadingSubmit ? (
              <motion.div {...MOTION} className="px-4 pt-18">
                <ChatBubble variant="received">
                  <ChatBubbleMessage isLoading />
                </ChatBubble>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>

        {/* Bottom bar */}
        <div className="sticky bottom-0 bg-white py-3 px-2">
          <HelperBoost submitQuery={(query: string) => append({ role: 'user', content: query })} setInput={setInput} />
          <ChatBottombar
            input={input}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
            isLoading={isLoading}
            stop={stop}
            isToolInProgress={false}
          />
        </div>
      </div>
    </div>
  );
}
