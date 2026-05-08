import { motion } from "motion/react";
import { Dumbbell, Target } from "lucide-react";
import { usePlayer } from "../context/PlayerContext";

export function SkillsScreen() {
  const { playerState } = usePlayer();
  const muscles = playerState.skills;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="p-8 pb-24"
    >
      <header className="py-2 border-b border-system-blue/20 pb-4 mb-6">
        <p className="font-bold text-system-blue tracking-[0.3em] text-[10px] uppercase mb-1">
          Anatomy & Progression
        </p>
        <h1 className="text-2xl font-black italic uppercase tracking-tighter text-[#e0e0e0]">
          Muscle Rankings
        </h1>
      </header>

      <div className="glass-panel p-5 flex flex-col gap-6">
        <h2 className="text-system-blue text-[10px] font-bold uppercase tracking-widest flex items-center justify-between">
          <span>Skill Mastery</span>
          <span className="text-white/40">Total Levels: {muscles.reduce((acc, m) => acc + m.level, 0)}</span>
        </h2>
        
        <div className="space-y-6">
          {muscles.map((muscle) => {
            const progress = (muscle.exp / muscle.nextExp) * 100;
            return (
              <div key={muscle.name} className="flex items-start gap-4">
                <div className={`w-14 h-14 border flex items-center justify-center text-2xl font-black italic shadow-inner
                  ${muscle.rank === 'E' ? 'bg-black/40 border-white/10 text-white/20' : ''}
                  ${muscle.rank === 'D' ? 'bg-gray-900 border-gray-500/30 text-gray-400' : ''}
                  ${muscle.rank === 'C' ? 'bg-system-blue/10 border-system-blue/30 text-system-blue/70' : ''}
                  ${muscle.rank === 'B' ? 'bg-system-blue/20 border-system-blue/60 text-system-blue drop-shadow-[0_0_8px_rgba(0,229,255,0.8)]' : ''}
                  ${muscle.rank === 'A' ? 'bg-purple-900/40 border-purple-500/60 text-purple-400 drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]' : ''}
                  ${muscle.rank === 'S' ? 'bg-yellow-900/40 border-yellow-500/60 text-yellow-500 drop-shadow-[0_0_8px_rgba(234,179,8,0.8)]' : ''}
                `}>
                  {muscle.rank}
                </div>
                <div className="flex-1 pt-1">
                  <div className="flex justify-between items-end mb-1">
                    <div className="flex flex-col">
                      <span className="text-[9px] text-system-blue uppercase tracking-widest font-bold mb-0.5">{muscle.target}</span>
                      <span className="text-sm font-bold uppercase tracking-widest leading-none text-[#e0e0e0]">{muscle.name}</span>
                    </div>
                    <div className="text-right flex flex-col">
                      <span className="text-white/40 font-mono text-[9px] tracking-wider mb-0.5">{muscle.exp} / {muscle.nextExp} XP</span>
                      <span className="text-system-blue font-bold font-mono text-sm leading-none">Lv. {muscle.level}</span>
                    </div>
                  </div>
                  <div className="h-[3px] bg-white/5 w-full mt-2 overflow-hidden relative border border-white/5">
                     <motion.div 
                       initial={{ width: 0 }}
                       animate={{ width: `${progress}%` }}
                       transition={{ duration: 1, ease: "easeOut" }}
                       className={`absolute inset-y-0 left-0 shadow-[0_0_10px_rgba(0,229,255,0.4)]
                         ${['B', 'A', 'S'].includes(muscle.rank) ? 'bg-system-blue' : 'bg-system-blue/40'}
                       `} 
                     />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-4 pt-6 border-t border-white/5">
           <div className="bg-gradient-to-r from-system-blue/10 to-transparent p-4 rounded-sm border-l-2 border-system-blue">
             <div className="flex items-center gap-2 text-[10px] text-system-blue uppercase font-bold mb-1 tracking-widest">
               <Target size={12} />
               Highest Synergy
             </div>
             <p className="text-xs text-white/70">Your Arms and Back are highly developed (Rank B & C). Consider focusing on Legs to maintain aesthetic and functional balance according to System recommendations.</p>
           </div>
        </div>
      </div>
    </motion.div>
  );
}
