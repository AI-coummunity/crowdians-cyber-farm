import { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Vote } from 'lucide-react';
import { QuestCard } from '@/components/academy/QuestCard';
import { QuestModal } from '@/components/academy/QuestModal';
import { VoteCard } from '@/components/academy/VoteCard';
import { SEO } from '@/components/SEO';
import { useGame } from '@/contexts/GameContext';
import { QuestItem } from '@/types/game';

type TabType = 'quest' | 'vote';

export default function Academy() {
  const { quests, votes, completeQuest, completeVote } = useGame();
  const [activeTab, setActiveTab] = useState<TabType>('quest');
  const [selectedQuest, setSelectedQuest] = useState<QuestItem | null>(null);

  const handleQuestSubmit = (questId: string, _answer: string) => {
    completeQuest(questId);
  };

  const handleVote = (voteId: string, _choice: 'A' | 'B') => {
    completeVote(voteId);
  };

  const tabs = [
    { id: 'quest' as TabType, label: 'Quest', icon: BookOpen },
    { id: 'vote' as TabType, label: 'Vote', icon: Vote },
  ];

  return (
    <>
      <SEO 
        title="아카데미"
        description="AI를 가르치고 평가하여 AI를 훈련시키세요. Quest를 완료하고 Vote를 통해 더 나은 AI 응답을 선택하세요."
        url="https://crowdians-cyber-farm.vercel.app/academy"
      />
      <div className="space-y-6">
      {/* Title */}
      <div className="text-center">
        <h2 className="font-pixel text-xs sm:text-sm text-primary neon-text mb-1">
          아카데미
        </h2>
        <p className="text-muted-foreground text-xs">
          AI를 가르치고 평가함으로써 AI를 훈련시킵니다.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-1 bg-muted rounded-xl">
        {tabs.map((tab) => (
          <motion.button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-pixel text-[10px] transition-all ${
              activeTab === tab.id
                ? 'bg-primary text-primary-foreground shadow-lg'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </motion.button>
        ))}
      </div>

      {/* Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="space-y-4 pb-20"
      >
        {activeTab === 'quest' ? (
          <>
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                AI의 실수를 수정하여 경험치를 얻습니다.
              </p>
              <span className="text-xs font-pixel text-primary">
                {quests.filter(q => q.isCompleted).length}/{quests.length}
              </span>
            </div>
            
            {quests.map((quest, index) => (
              <motion.div
                key={quest.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <QuestCard
                  quest={quest}
                  onClick={() => setSelectedQuest(quest)}
                />
              </motion.div>
            ))}
          </>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                더 좋은 AI 응답을 선택하여 경험치를 얻습니다.
              </p>
              <span className="text-xs font-pixel text-gold">
                {votes.filter(v => v.isCompleted).length}/{votes.length}
              </span>
            </div>
            
            {votes.map((vote, index) => (
              <motion.div
                key={vote.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <VoteCard vote={vote} onVote={handleVote} />
              </motion.div>
            ))}
          </>
        )}
      </motion.div>

      {/* Quest Modal */}
      <QuestModal
        quest={selectedQuest}
        isOpen={!!selectedQuest}
        onClose={() => setSelectedQuest(null)}
        onSubmit={handleQuestSubmit}
      />
      </div>
    </>
  );
}
