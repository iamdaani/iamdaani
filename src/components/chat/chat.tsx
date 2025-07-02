'use client';

import { useChat } from '@ai-sdk/react';
import { AnimatePresence, motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';

import ChatBottombar from '@/components/chat/chat-bottombar';
import ChatLanding from '@/components/chat/chat-landing';
import ChatMessageContent from '@/components/chat/chat-message-content';
import { SimplifiedChatView } from '@/components/chat/simple-chat-view';
import {
  ChatBubble,
  ChatBubbleMessage,
} from '@/components/ui/chat/chat-bubble';
import WelcomeModal from '@/components/welcome-modal';
import HelperBoost from './HelperBoost';
import { Info } from 'lucide-react';
import GitHubButton from 'react-github-btn';

// ──────────────────────────────────────────────
// 💡 ClientOnly component to avoid hydration mismatch
// ──────────────────────────────────────────────
const ClientOnly = ({ children }: { children: React.ReactNode }) => {
  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => setHasMounted(true), []);
  return hasMounted ? <>{children}</> : null;
};

interface AvatarProps {
  hasActiveTool: boolean;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  isTalking: boolean;
}

// ──────────────────────────────────────────────
// 🧠 Dynamically loaded Avatar (video or img)
// ──────────────────────────────────────────────
const Avatar = dynamic<AvatarProps>(
  () =>
    Promise.resolve(({ hasActiveTool, videoRef, isTalking }) => {
      const isIOS = () => {
        const ua = navigator.userAgent;
        const platform = navigator.platform;
        const touchPoints = navigator.maxTouchPoints || 0;
        return (
          /iPhone|iPad|iPod/.test(ua) ||
          /iPhone|iPad|iPod/.test(platform) ||
          (platform === 'MacIntel' && touchPoints > 1)
        );
      };

      return (
        <div
          className={`flex items-center justify-center rounded-full transition-all duration-300 ${hasActiveTool ? 'h-20 w-20' : 'h-28 w-28'}`}
        >
          <div className="relative cursor-pointer" onClick={() => (window.location.href = '/')}>
            {isIOS() ? (
              <img
                src="/landing-memojis.png"
                alt="iOS avatar"
                className="h-full w-full scale-[1.8] object-contain"
              />
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

// ──────────────────────────────────────────────
// 🎬 Motion config
// ──────────────────────────────────────────────
const MOTION_CONFIG = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 },
  transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] as const },
};

// ──────────────────────────────────────────────
// 💬 Main Chat Component
// ──────────────────────────────────────────────
const Chat = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('query');

  const [autoSubmitted, setAutoSubmitted] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [isTalking, setIsTalking] = useState(false);

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    stop,
    setMessages,
    setInput,
    reload,
    addToolResult,
    append,
  } = useChat({
    onResponse: () => {
      setIsTalking(true);
      setLoadingSubmit(false);
      videoRef.current?.play().catch((err) => console.warn('Video play failed:', err));
    },
    onFinish: () => {
      setIsTalking(false);
      setLoadingSubmit(false);
      videoRef.current?.pause();
    },
    onError: (err) => {
      setIsTalking(false);
      setLoadingSubmit(false);
      videoRef.current?.pause();
      console.error('Chat error:', err);
      toast.error(`Error: ${err.message}`);
    },
    onToolCall: (tool) => {
      console.log('Tool call:', tool.toolCall.toolName);
    },
  });

  // Extract current state
  const { currentAIMessage, latestUserMessage, hasActiveTool } = useMemo(() => {
    const aiIndex = messages.findLastIndex((m) => m.role === 'assistant');
    const userIndex = messages.findLastIndex((m) => m.role === 'user');

    const result = {
      currentAIMessage: aiIndex !== -1 ? messages[aiIndex] : null,
      latestUserMessage: userIndex !== -1 ? messages[userIndex] : null,
      hasActiveTool: false,
    };

    if (result.currentAIMessage?.parts?.some((p: any) => p.type === 'tool-invocation' && p.toolInvocation?.state === 'result')) {
      result.hasActiveTool = true;
    }

    if (aiIndex < userIndex) result.currentAIMessage = null;

    return result;
  }, [messages]);

  const isToolInProgress = messages.some(
    (m) =>
      m.role === 'assistant' &&
      m.parts?.some(
        (p: any) =>
          p.type === 'tool-invocation' && p.toolInvocation?.state !== 'result'
      )
  );

  // 🔁 Initial query from URL (e.g. /chat?query=hello)
  useEffect(() => {
    if (initialQuery && !autoSubmitted) {
      setAutoSubmitted(true);
      setInput('');
      append({ role: 'user', content: initialQuery });
      setLoadingSubmit(true);
    }
  }, [initialQuery, autoSubmitted]);

  useEffect(() => {
    if (videoRef.current) {
      if (isTalking) {
        videoRef.current.play().catch(() => {});
      } else {
        videoRef.current.pause();
      }
    }
  }, [isTalking]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isToolInProgress) return;
    append({ role: 'user', content: input });
    setInput('');
    setLoadingSubmit(true);
  };

  const handleStop = () => {
    stop();
    setIsTalking(false);
    setLoadingSubmit(false);
    videoRef.current?.pause();
  };

  const isEmptyState = !currentAIMessage && !latestUserMessage && !loadingSubmit;
  const headerHeight = hasActiveTool ? 100 : 180;

  return (
    <div className="relative h-screen overflow-hidden">
      {/* Header */}
      <div className="absolute top-6 right-8 z-50 flex flex-col-reverse items-center gap-1 md:flex-row">
        <WelcomeModal
          trigger={
            <div className="hover:bg-accent cursor-pointer rounded-2xl px-3 py-1.5">
              <Info className="h-8 text-accent-foreground" />
            </div>
          }
        />
        <div className="pt-2">
          <GitHubButton
            href="https://github.com/toukoum/portfolio"
            data-size="large"
            data-show-count="true"
            aria-label="Star portfolio on GitHub"
          >
            Star
          </GitHubButton>
        </div>
      </div>

      {/* Avatar */}
      <div
        className="fixed top-0 right-0 left-0 z-40"
        style={{
          background:
            'linear-gradient(to bottom, rgba(255,255,255,1), rgba(255,255,255,0.9), rgba(255,255,255,0))',
        }}
      >
        <div className={`transition-all ${hasActiveTool ? 'pt-6 pb-0' : 'py-6'}`}>
          <div className="flex justify-center">
            <ClientOnly>
              <Avatar hasActiveTool={hasActiveTool} videoRef={videoRef} isTalking={isTalking} />
            </ClientOnly>
          </div>

          {/* Display user message while AI is thinking */}
          <AnimatePresence>
            {latestUserMessage && !currentAIMessage && (
              <motion.div {...MOTION_CONFIG} className="mx-auto flex max-w-3xl px-4">
                <ChatBubble variant="sent">
                  <ChatBubbleMessage>
                    <ChatMessageContent
                      message={latestUserMessage}
                      isLast
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

      {/* Main Chat View */}
      <div className="container mx-auto flex h-full max-w-3xl flex-col">
        <div className="flex-1 overflow-y-auto px-2" style={{ paddingTop: `${headerHeight}px` }}>
          <AnimatePresence mode="wait">
            {isEmptyState ? (
              <motion.div key="landing" className="flex h-full items-center justify-center" {...MOTION_CONFIG}>
                <ChatLanding submitQuery={(q) => append({ role: 'user', content: q })} />
              </motion.div>
            ) : currentAIMessage ? (
              <div className="pb-4">
                <SimplifiedChatView
                  message={currentAIMessage}
                  isLoading={isLoading}
                  reload={reload}
                  addToolResult={addToolResult}
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

        {/* Footer */}
        <div className="sticky bottom-0 bg-white px-2 pt-3 md:px-0 md:pb-4">
          <div className="relative flex flex-col items-center gap-3">
            <HelperBoost submitQuery={(q) => append({ role: 'user', content: q })} setInput={setInput} />
            <ChatBottombar
              input={input}
              handleInputChange={handleInputChange}
              handleSubmit={onSubmit}
              isLoading={isLoading}
              stop={handleStop}
              isToolInProgress={isToolInProgress}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
