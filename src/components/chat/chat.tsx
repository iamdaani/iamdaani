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
  videoRef: React.RefObject<HTMLVideoElement>;
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
        <div className={`flex items-center justify-center rounded-full transition-all duration-300 ${hasActiveTool ? 'h-20 w-20' : 'h-28 w-28'}`}>
          <div className="relative cursor-pointer" onClick={() => (window.location.href = '/')}>
            {isiOS() ? (
              <img src="/landing-memojis.png" alt="iOS avatar" className="h-full w-full scale-[1.8] object-contain" />
            ) : (
              <video
                ref={videoRef}
                className="h-full w-full scale-[1.8] object-contain"
                muted
                playsInline
                loop
              >
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

const MOTION_CONFIG = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 },
  transition: { duration: 0.3, ease: "easeInOut" as const },
};

const Chat = () => {
  const videoRef = useRef<HTMLVideoElement>(null) as React.RefObject<HTMLVideoElement>;
  const searchParams = useSearchParams();
  const initial = searchParams.get('query') || '';
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
      videoRef.current?.play().catch((error) => {
        console.error('Failed to play video:', error);
      });
    },
    onFinish() {
      setLoadingSubmit(false);
      setIsTalking(false);
      videoRef.current?.pause();
    },
    onError(error) {
      setLoadingSubmit(false);
      setIsTalking(false);
      videoRef.current?.pause();
      console.error('Chat error:', error.message, error.cause);
      toast.error(`Error: ${error.message}`);
    },
    onToolCall(tool) {
      const toolName = tool.toolCall.toolName;
      console.log('Tool call:', toolName);
    },
  });

  // Memoized message state (modern variable names)
  const { latestAI, latestUser, hasTool } = useMemo(() => {
    const li = messages.findLast((m) => m.role === 'assistant') || null;
    const lu = messages.findLast((m) => m.role === 'user') || null;
    const tool = !!li?.parts?.some((p) => p.type === 'tool-invocation');
    return { latestAI: li, latestUser: lu, hasTool: tool };
  }, [messages]);

  // Check if this is the initial empty state (no messages)
  const isEmpty = !latestAI && !latestUser && !loadingSubmit;
  const headerHeight = hasTool ? 100 : 180;

  // Auto-submit initial query once
  useEffect(() => {
    if (initial && !auto) {
      setAuto(true);
      setInput('');
      append({ role: 'user', content: initial });
    }
  }, [initial, auto, append, setInput]);

  // Setup video element
  useEffect(() => {
    const v = videoRef.current;
    if (v) {
      v.loop = true;
      v.muted = true;
      v.playsInline = true;
      v.pause();
    }
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      if (isTalking) {
        videoRef.current.play().catch((error) => {
          console.error('Failed to play video:', error);
        });
      } else {
        videoRef.current.pause();
      }
    }
  }, [isTalking]);

  // Submit handler
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    setLoadingSubmit(true);
    append({ role: 'user', content: input });
    setInput('');
  };

  const handleStop = () => {
    stop();
    setLoadingSubmit(false);
    setIsTalking(false);
    videoRef.current?.pause();
  };

  return (
    <div className="relative h-screen overflow-hidden">
      {/* Top controls */}
      <div className="absolute top-6 right-8 z-51 flex flex-col-reverse items-center justify-center gap-1 md:flex-row">
        <WelcomeModal
          trigger={
            <div className="hover:bg-accent cursor-pointer rounded-2xl px-3 py-1.5">
              <Info className="text-accent-foreground h-8" />
            </div>
          }
        />
        <div className="pt-2">
          <GitHubButton
            href="https://github.com/toukoum/portfolio"
            data-color-scheme="no-preference: light; light: light; dark: light_high_contrast;"
            data-size="large"
            data-show-count="true"
            aria-label="Star toukoum/portfolio on GitHub"
          >
            Star
          </GitHubButton>
        </div>
      </div>

      {/* Fixed Avatar Header with Gradient */}
      <div
        className="fixed top-0 right-0 left-0 z-50"
        style={{
          background:
            'linear-gradient(to bottom, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0.95) 30%, rgba(255, 255, 255, 0.8) 50%, rgba(255, 255, 255, 0) 100%)',
        }}
      >
        <div className={`transition-all duration-300 ease-in-out ${hasTool ? 'pt-6 pb-0' : 'py-6'}`}>
          <div className="flex justify-center">
            <ClientOnly>
              <Avatar hasActiveTool={hasTool} videoRef={videoRef} isTalking={isTalking} />
            </ClientOnly>
          </div>

          <AnimatePresence>
            {latestUser && !latestAI && (
              <motion.div {...MOTION_CONFIG} className="mx-auto flex max-w-3xl px-4">
                <ChatBubble variant="sent">
                  <ChatBubbleMessage>
                    <ChatMessageContent
                      message={latestUser}
                      isLast={true}
                      isLoading={false}
                      reload={() => Promise.resolve(null)}
                    />
                  </ChatBubbleMessage>
                </ChatBubble>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="container mx-auto flex h-full max-w-3xl flex-col">
        {/* Scrollable Chat Content */}
        <div className="flex-1 overflow-y-auto px-2" style={{ paddingTop: `${headerHeight}px` }}>
          <AnimatePresence mode="wait">
            {isEmpty ? (
              <motion.div key="landing" className="flex min-h-full items-center justify-center" {...MOTION_CONFIG}>
                <ChatLanding submitQuery={(query: string) => append({ role: 'user', content: query })} />
              </motion.div>
            ) : latestAI ? (
              <div className="pb-4">
                <SimplifiedChatView
                  message={latestAI}
                  isLoading={isLoading}
                  reload={() => Promise.resolve(null)}
                  addToolResult={(res) =>
                    append({
                      role: 'data',
                      content: JSON.stringify(res)
                    })
                  }
                />
              </div>
            ) : (
              loadingSubmit && (
                <motion.div key="loading" {...MOTION_CONFIG} className="px-4 pt-18">
                  <ChatBubble variant="received">
                    <ChatBubbleMessage isLoading />
                  </ChatBubble>
                </motion.div>
              )
            )}
          </AnimatePresence>
        </div>

        {/* Fixed Bottom Bar */}
        <div className="sticky bottom-0 bg-white px-2 pt-3 md:px-0 md:pb-4">
          <div className="relative flex flex-col items-center gap-3">
            <HelperBoost submitQuery={(query: string) => append({ role: 'user', content: query })} setInput={setInput} />
            <ChatBottombar
              input={input}
              handleInputChange={handleInputChange}
              handleSubmit={onSubmit}
              isLoading={isLoading}
              stop={handleStop}
              isToolInProgress={false}
            />
          </div>
        </div>
        <a
          href="https://x.com/toukoumcode"
          target="_blank"
          rel="noopener noreferrer"
          className="fixed right-3 bottom-0 z-10 mb-4 hidden cursor-pointer items-center gap-2 rounded-xl px-4 py-2 text-sm hover:underline md:block"
        >
          @toukoum
        </a>
      </div>
    </div>
  );
};

export default Chat;