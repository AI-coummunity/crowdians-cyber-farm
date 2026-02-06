import { useState, useEffect } from 'react';
import { ScrollText, Bell } from 'lucide-react';
import { motion } from 'framer-motion';
import { PixelCharacter } from '@/components/home/PixelCharacter';
import { SpeechBubble } from '@/components/home/SpeechBubble';
import { ChatInput } from '@/components/home/ChatInput';
import { ChatLogOverlay } from '@/components/home/ChatLogOverlay';
import { WaitlistModal } from '@/components/home/WaitlistModal';
import { useGame } from '@/contexts/GameContext';

// Mock AI responses
const aiResponses = [
  "삐빅! 당신 덕분에 매일 새로운 것을 배우고 있어요!",
  "알고 계셨나요? 오늘 벌써 1,000개의 학습 데이터를 처리했답니다!",
  "에러 404: 농담을 찾을 수 없습니다. 농담이에요! 무엇을 도와드릴까요?",
  "신경망이 짜릿하네요... 정말 좋은 질문이에요!",
  "처리 중... 처리 중... 아하, 이제 이해했어요!",
  "매 순간 더 똑똑해지고 있어요. 고마워요, 트레이너님!",
];

export default function Home() {
  const { chatHistory, addChatMessage } = useGame();
  const [currentMessage, setCurrentMessage] = useState<string | null>(null);
  const [showBubble, setShowBubble] = useState(false);
  const [showLog, setShowLog] = useState(false);
  const [showWaitlist, setShowWaitlist] = useState(false);

  const handleSendMessage = (message: string) => {
    // Add user message
    addChatMessage({ role: 'user', content: message });
    
    // Generate AI response
    const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)];
    
    // Show AI response after a brief delay
    setTimeout(() => {
      addChatMessage({ role: 'ai', content: randomResponse });
      setCurrentMessage(randomResponse);
      setShowBubble(true);
    }, 500);
  };

  // Auto-hide speech bubble after 3 seconds
  useEffect(() => {
    if (showBubble) {
      const timer = setTimeout(() => {
        setShowBubble(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showBubble, currentMessage]);

  return (
    <div className="relative h-[calc(100vh-8rem)] flex flex-col">
      {/* Action buttons */}
      <div className="absolute top-0 right-0 z-20 flex gap-2">
        {/* Waitlist button */}
        <motion.button
          onClick={() => setShowWaitlist(true)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-10 h-10 flex items-center justify-center bg-primary border-2 border-primary rounded-xl hover:border-primary/80 transition-colors neon-border"
          title="출시 알림 받기"
        >
          <Bell className="w-5 h-5 text-primary-foreground" />
        </motion.button>

        {/* Log button */}
        <motion.button
          onClick={() => setShowLog(true)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-10 h-10 flex items-center justify-center bg-card border-2 border-border rounded-xl hover:border-primary transition-colors"
        >
          <ScrollText className="w-5 h-5 text-muted-foreground" />
        </motion.button>
      </div>

      {/* Title */}
      <div className="text-center mb-4">
        <h2 className="font-pixel text-xs sm:text-sm text-primary mb-1">
          룸
        </h2>
        <p className="text-muted-foreground text-xs">
          AI와 대화해보세요!
        </p>
      </div>

      {/* Character and Speech Bubble Area */}
      <div className="flex-1 flex flex-col items-center justify-center gap-6 pb-20">
        <SpeechBubble message={currentMessage} isVisible={showBubble} />
        <PixelCharacter />
      </div>

      {/* Chat Input */}
      <ChatInput onSend={handleSendMessage} />

      {/* Chat Log Overlay */}
      <ChatLogOverlay
        isOpen={showLog}
        onClose={() => setShowLog(false)}
        messages={chatHistory}
      />

      {/* Waitlist Modal */}
      <WaitlistModal
        isOpen={showWaitlist}
        onClose={() => setShowWaitlist(false)}
      />
    </div>
  );
}
