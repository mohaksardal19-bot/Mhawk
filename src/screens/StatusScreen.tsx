import { motion, AnimatePresence } from "motion/react";
import { Dumbbell, Shield, Swords, Trophy, Activity, CalendarDays, LogOut } from "lucide-react";
import React, { useState } from "react";
import { usePlayer } from "../context/PlayerContext";

interface StatusScreenProps {
  key?: string;
  onBack?: () => void;
}

export function StatusScreen({ onBack }: StatusScreenProps = {}) {
  const [activeTab, setActiveTab] = useState<'overview' | 'history'>('overview');
  const { playerState } = usePlayer();

  const historyData = playerState.dungeonsHistory.length > 0 
    ? playerState.dungeonsHistory.map(h => ({
        id: h.id, date: h.date, dungeon: h.title, target: h.type, xp: h.xp, time: h.time || "30m" 
      }))
    : [];

  const getWeeklyYieldData = () => {
    const days = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const isSunday = d.getDay() === 0;
      const dateStr = d.toLocaleDateString();
      
      const xpForDay = playerState.dungeonsHistory
        .filter(record => record.date === dateStr)
        .reduce((sum, record) => sum + record.xp, 0);
        
      days.push({
        day: d.toLocaleDateString('en-US', { weekday: 'short' }),
        date: d.getDate(),
        isSunday,
        xp: xpForDay,
        isToday: i === 0
      });
    }
    return days;
  };

  const weeklyData = getWeeklyYieldData();

  const xpProgress = Math.min((playerState.xp / (playerState.level * 1000 + 1000)) * 100, 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="p-8 pb-32"
    >
      <div className="flex flex-col gap-6">
        <header className="py-2 border-b border-system-blue/20 pb-4 relative">
          <p className="font-bold text-system-blue tracking-[0.3em] text-[10px] uppercase mb-1">
            System Interface
          </p>
          <div className="flex justify-between items-center w-full">
            <h1 className="text-2xl font-black italic uppercase tracking-tighter text-[#e0e0e0]">
              Player Profile
            </h1>
            {onBack && (
              <button onClick={onBack} className="text-white/40 hover:text-white/80 transition-colors flex items-center justify-center bg-white/5 p-2 rounded-full border border-white/10 shadow-[0_0_10px_rgba(0,0,0,0.5)]">
                <LogOut size={16} />
              </button>
            )}
          </div>
        </header>

        {/* Profile Card - Always on top */}
        <div className="glass-panel relative">
          <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-system-blue"></div>
          <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-system-blue"></div>
          <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-system-blue"></div>
          <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-system-blue"></div>

          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 border border-system-blue flex items-center justify-center rotate-45 shrink-0 bg-dark-indigo shadow-[0_0_15px_rgba(0,229,255,0.2)]">
              <div className="w-14 h-14 border border-system-blue flex items-center justify-center text-system-blue font-black italic -rotate-45 text-2xl">{playerState.rank}</div>
            </div>
            <div className="flex-1 ml-2">
              <div className="flex flex-col">
                <span className="text-[10px] text-system-blue font-bold uppercase tracking-widest mb-1">Hunter Name</span>
                <h2 className="font-black text-xl italic uppercase tracking-tight">Sung Jin-Woo</h2>
                <div className="text-[10px] text-white/40 mt-1 uppercase tracking-widest leading-tight">Title: Demon Hunter</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-[10px] text-white/60 tracking-widest uppercase mb-1">Rank</div>
              <div className="text-3xl font-black italic text-system-blue drop-shadow-[0_0_8px_rgba(0,229,255,0.6)]">{playerState.rank}</div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-[11px] mb-1 font-bold italic">
                <span className="uppercase text-white/60">Current Level</span>
                <span className="text-system-blue font-mono">LV. {playerState.level}</span>
              </div>
              <div className="h-[3px] bg-white/5 w-full overflow-hidden relative">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${xpProgress}%` }}
                  transition={{ delay: 0.5, duration: 1.5, ease: "easeOut" }}
                  className="absolute inset-y-0 left-0 bg-system-blue shadow-[0_0_10px_rgba(0,229,255,0.6)]"
                />
              </div>
              <div className="text-[9px] text-right mt-1 font-mono text-white/40 tracking-wider">
                {playerState.xp} / {(playerState.level * 1000) + 1000} XP
              </div>
            </div>

            <div className="pt-4 border-t border-white/5 mt-4 grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Swords size={16} className="text-system-red" />
                <div className="flex flex-col">
                  <span className="text-[9px] text-white/40 uppercase tracking-widest">Strength</span>
                  <span className="text-system-red font-mono font-bold text-sm">{playerState.stats.strength}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Shield size={16} className="text-system-blue" />
                <div className="flex flex-col">
                  <span className="text-[9px] text-white/40 uppercase tracking-widest">Vitality</span>
                  <span className="text-system-blue font-mono font-bold text-sm">{playerState.stats.vitality}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-white/10">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`flex-1 py-3 text-[10px] font-bold uppercase tracking-widest transition-colors ${activeTab === 'overview' ? 'text-system-blue border-b-2 border-system-blue' : 'text-white/40 hover:text-white/70'}`}
          >
            <div className="flex items-center justify-center gap-2">
              <Activity size={14} /> Daily Overview
            </div>
          </button>
          <button 
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-3 text-[10px] font-bold uppercase tracking-widest transition-colors ${activeTab === 'history' ? 'text-system-blue border-b-2 border-system-blue' : 'text-white/40 hover:text-white/70'}`}
          >
            <div className="flex items-center justify-center gap-2">
              <CalendarDays size={14} /> Dungeon History
            </div>
          </button>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'overview' ? (
            <motion.div
              key="overview"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-6"
            >
              {/* Daily Status */}
              <div className="grid grid-cols-2 gap-4">
                <div className="glass-panel p-5 relative">
                  <h2 className="text-system-red text-[10px] font-bold uppercase tracking-widest mb-3">Health (HP)</h2>
                  <div className="flex items-end gap-2 mb-2">
                    <span className="text-2xl font-black italic text-[#e0e0e0]">{playerState.health[0]}</span>
                    <span className="text-[10px] text-system-red/60 mb-1 uppercase font-mono">/ {playerState.health[1]}</span>
                  </div>
                  <div className="h-[3px] bg-white/5 w-full overflow-hidden relative">
                    <div className="absolute inset-y-0 left-0 bg-system-red shadow-[0_0_10px_rgba(255,42,42,0.4)]" style={{ width: `${(playerState.health[0] / playerState.health[1]) * 100}%` }} />
                  </div>
                  <div className="text-[9px] text-white/40 mt-2 uppercase tracking-widest">Recovery: Optimal</div>
                </div>
                
                <div className="glass-panel p-5 relative">
                  <h2 className="text-system-blue text-[10px] font-bold uppercase tracking-widest mb-3">Energy (MP)</h2>
                  <div className="flex items-end gap-2 mb-2">
                    <span className="text-2xl font-black italic text-[#e0e0e0]">{playerState.energy[0]}</span>
                    <span className="text-[10px] text-system-blue/60 mb-1 uppercase font-mono">/ {playerState.energy[1]}</span>
                  </div>
                  <div className="h-[3px] bg-white/5 w-full overflow-hidden relative">
                    <div className="absolute inset-y-0 left-0 bg-system-blue shadow-[0_0_10px_rgba(0,229,255,0.4)]" style={{ width: `${(playerState.energy[0] / playerState.energy[1]) * 100}%` }} />
                  </div>
                  <div className="text-[9px] text-white/40 mt-2 uppercase tracking-widest">Streak: {playerState.dungeonsHistory.length} Days</div>
                </div>
              </div>

              {/* Weekly Yield Calendar */}
              <div className="glass-panel p-5 relative">
                <h2 className="text-system-blue text-[10px] font-bold uppercase tracking-widest mb-4">Weekly Yield</h2>
                <div className="flex justify-between items-end gap-1">
                  {weeklyData.map((d, i) => (
                    <div key={i} className="flex flex-col items-center flex-1">
                      <div className={`text-[8px] font-bold uppercase tracking-widest mb-2 ${d.isSunday ? 'text-system-red/80' : 'text-white/40'}`}>
                        {d.day}
                      </div>
                      <div className={`w-full max-w-[32px] aspect-square rounded-sm flex flex-col items-center justify-center border font-mono transition-all
                        ${d.isSunday 
                          ? 'bg-system-red/5 border-system-red/30' 
                          : d.xp > 0 
                            ? 'bg-system-blue/10 border-system-blue border-b-2 border-b-system-blue shadow-[0_0_10px_rgba(0,229,255,0.2)]'
                            : 'bg-black/40 border-white/10'
                        }
                        ${d.isToday ? 'border-2 ring-2 ring-system-blue/20 ring-offset-1 ring-offset-black' : ''}
                      `}>
                        <span className={`text-[12px] font-bold ${d.isSunday ? 'text-system-red/60' : d.xp > 0 ? 'text-system-blue drop-shadow-[0_0_2px_rgba(0,229,255,0.8)]' : 'text-white/40'}`}>
                          {d.date}
                        </span>
                      </div>
                      <div className={`mt-2 text-[8px] font-bold ${d.isSunday ? 'text-system-red/60' : d.xp > 0 ? 'text-system-blue' : 'text-transparent'}`}>
                        {d.isSunday ? 'REST' : d.xp > 0 ? `+${d.xp}` : '-'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Today's Activity Status based on selected Dungeon */}
              <div className="glass-panel p-5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-system-blue/10 rounded-full blur-xl pointer-events-none" />
                <h2 className="text-system-blue text-[10px] font-bold uppercase tracking-widest mb-4">Current Daily Activity</h2>
                <div className="bg-black/40 border border-white/10 p-4 rounded-sm">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="text-[9px] text-white/40 uppercase tracking-widest font-bold mb-1">Active Assignment</div>
                      <div className="text-lg font-black italic text-[#e0e0e0] leading-none">Chest Awakening</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[9px] text-system-blue uppercase tracking-widest font-bold mb-1">Status</div>
                      <div className="text-xs font-mono font-bold text-white/80">In Progress</div>
                    </div>
                  </div>
                  
                  <div className="space-y-2 pt-3 border-t border-white/5">
                    <div className="flex justify-between text-[10px]">
                      <span className="text-white/40 uppercase tracking-widest">Exercises Completed</span>
                      <span className="font-mono text-system-blue">1 / 4</span>
                    </div>
                    <div className="h-[2px] bg-white/5 w-full relative">
                      <div className="absolute left-0 top-0 bottom-0 w-[25%] bg-system-blue shadow-[0_0_8px_rgba(0,229,255,0.5)]"></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="glass-panel p-5">
                 <div className="flex justify-between items-center mb-4">
                   <h2 className="text-system-blue text-[10px] font-bold uppercase tracking-widest">Recent Achievements</h2>
                   <span className="text-[9px] text-white/40 uppercase tracking-widest">See All</span>
                 </div>
                 
                 <div className="space-y-3">
                   <div className="flex items-center gap-3 p-3 bg-system-red/5 border border-system-red/20 rounded-sm relative overflow-hidden">
                     <div className="absolute left-0 top-0 bottom-0 w-1 bg-system-red"></div>
                     <div className="w-10 h-10 rounded-full bg-system-red/10 border border-system-red flex items-center justify-center shrink-0">
                        <Trophy size={16} className="text-system-red" />
                     </div>
                     <div className="flex-1">
                       <div className="text-[9px] text-system-red uppercase tracking-widest font-bold mb-0.5">Boss Defeated</div>
                       <div className="text-sm font-black italic tracking-tight text-[#e0e0e0]">New 1RM: Target Chest</div>
                       <div className="text-[10px] text-white/50 font-mono mt-1">Bench Press @ 100kg</div>
                     </div>
                   </div>

                   <div className="flex items-center gap-3 p-3 bg-system-blue/5 border border-system-blue/20 rounded-sm relative overflow-hidden">
                     <div className="absolute left-0 top-0 bottom-0 w-1 bg-system-blue"></div>
                     <div className="w-10 h-10 rounded-full bg-system-blue/10 border border-system-blue flex items-center justify-center shrink-0">
                        <Dumbbell size={16} className="text-system-blue" />
                     </div>
                     <div className="flex-1">
                       <div className="text-[9px] text-system-blue uppercase tracking-widest font-bold mb-0.5">Dungeon Cleared</div>
                       <div className="text-sm font-black italic tracking-tight text-[#e0e0e0]">Leg Day Massacre</div>
                       <div className="text-[10px] text-white/50 font-mono mt-1">+14,000 Total XP</div>
                     </div>
                   </div>
                 </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="history"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="glass-panel p-5 relative">
                <h2 className="text-system-blue text-[10px] font-bold uppercase tracking-widest mb-4">Dungeon History (Day 1 - Present)</h2>
                
                <div className="space-y-4">
                  {historyData.map((record) => (
                    <div key={record.id} className="relative pl-6 pb-4 border-l border-system-blue/30 last:border-0 last:pb-0">
                      <div className="absolute left-[-5px] top-0 w-2 h-2 rounded-full bg-system-blue shadow-[0_0_8px_rgba(0,229,255,0.8)]"></div>
                      <div className="bg-black/30 border border-white/5 p-3 rounded-sm flex flex-col gap-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[9px] text-system-blue font-bold font-mono tracking-widest">{record.date}</span>
                            <h3 className="text-sm font-black italic text-[#e0e0e0] uppercase leading-tight mt-0.5">{record.dungeon}</h3>
                          </div>
                          <div className="text-right">
                            <span className="text-[9px] text-white/40 uppercase tracking-widest block mb-0.5">Yield</span>
                            <span className="text-xs font-mono text-system-blue font-bold">+{record.xp} XP</span>
                          </div>
                        </div>
                        <div className="flex gap-4 border-t border-white/5 pt-2 mt-1">
                          <div className="flex flex-col">
                            <span className="text-[8px] text-white/40 uppercase tracking-widest">Target</span>
                            <span className="text-[10px] font-bold text-white/80 uppercase">{record.target}</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[8px] text-white/40 uppercase tracking-widest">Duration</span>
                            <span className="text-[10px] font-bold font-mono text-white/80">{record.time}</span>
                          </div>
                          <div className="flex flex-col ml-auto text-right">
                            <span className="text-[8px] text-white/40 uppercase tracking-widest">Status</span>
                            <span className="text-[10px] font-bold text-system-blue uppercase">Cleared</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </motion.div>
  );
}
