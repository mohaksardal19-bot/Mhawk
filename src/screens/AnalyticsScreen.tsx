import { motion } from "motion/react";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts";
import { Activity, Dumbbell, Zap, Target, Clock, CalendarDays } from "lucide-react";

const data = [
  { subject: "Strength", A: 80, fullMark: 100 },
  { subject: "Agility", A: 45, fullMark: 100 },
  { subject: "Vitality", A: 60, fullMark: 100 },
  { subject: "Endurance", A: 50, fullMark: 100 },
  { subject: "Willpower", A: 85, fullMark: 100 },
];

const dailyStats = {
  totalXPEarned: 14500,
  dungeonsCleared: 1,
  totalVolume: 4200, // kg
  activeTime: "45m"
};

const completedDungeons = [
  {
    id: 1,
    name: "Chest Awakening",
    target: "Chest (Pectoralis Major)",
    timeCompleted: "08:30 AM",
    xpGained: 14500,
    exercises: [
      { name: "Barbell bench press", sets: 4, reps: "8-12", volume: 2400 },
      { name: "Bench press inclined", sets: 3, reps: "10", volume: 1200 },
      { name: "Cable Crossovers", sets: 3, reps: "15", volume: 600 }
    ]
  }
];

export function AnalyticsScreen() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="p-8 pb-32 flex flex-col gap-6"
    >
      <header className="py-2 border-b border-system-blue/20 pb-4">
        <p className="font-bold text-system-blue tracking-[0.3em] text-[10px] uppercase mb-1">
          Player Data Hub
        </p>
        <h1 className="text-2xl font-black italic uppercase tracking-tighter text-[#e0e0e0]">
          Daily Log & Stats
        </h1>
      </header>

      {/* Daily Progress */}
      <div className="glass-panel p-5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-system-blue/5 rounded-bl-full blur-2xl"></div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-system-blue text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
            <CalendarDays size={14} /> Today's Yield
          </h2>
          <span className="text-[10px] font-mono text-white/40">Log #{new Date().getDate().toString().padStart(2, '0')}{(new Date().getMonth()+1).toString().padStart(2, '0')}</span>
        </div>
        
        <div className="grid grid-cols-2 gap-3 z-10 relative">
          <div className="bg-black/40 border border-white/5 p-3 rounded-sm flex items-center gap-3">
            <div className="w-8 h-8 rounded-full border border-system-blue/30 bg-system-blue/10 flex items-center justify-center">
              <Zap size={14} className="text-system-blue drop-shadow-[0_0_5px_rgba(0,229,255,0.8)]" />
            </div>
            <div>
              <div className="text-[9px] text-white/40 uppercase tracking-widest">XP Gained</div>
              <div className="text-system-blue font-mono font-bold text-sm">+{dailyStats.totalXPEarned}</div>
            </div>
          </div>
          <div className="bg-black/40 border border-white/5 p-3 rounded-sm flex items-center gap-3">
            <div className="w-8 h-8 rounded-full border border-system-blue/30 bg-system-blue/10 flex items-center justify-center">
              <Dumbbell size={14} className="text-system-blue drop-shadow-[0_0_5px_rgba(0,229,255,0.8)]" />
            </div>
            <div>
              <div className="text-[9px] text-white/40 uppercase tracking-widest">Total Volume</div>
              <div className="text-white/80 font-mono font-bold text-sm">{dailyStats.totalVolume} kg</div>
            </div>
          </div>
          <div className="bg-black/40 border border-white/5 p-3 rounded-sm flex items-center gap-3">
            <div className="w-8 h-8 rounded-full border border-system-blue/30 bg-system-blue/10 flex items-center justify-center">
              <Target size={14} className="text-system-blue drop-shadow-[0_0_5px_rgba(0,229,255,0.8)]" />
            </div>
            <div>
              <div className="text-[9px] text-white/40 uppercase tracking-widest">Dungeons</div>
              <div className="text-white/80 font-mono font-bold text-sm">{dailyStats.dungeonsCleared} Cleared</div>
            </div>
          </div>
          <div className="bg-black/40 border border-white/5 p-3 rounded-sm flex items-center gap-3">
            <div className="w-8 h-8 rounded-full border border-system-blue/30 bg-system-blue/10 flex items-center justify-center">
              <Clock size={14} className="text-system-blue drop-shadow-[0_0_5px_rgba(0,229,255,0.8)]" />
            </div>
            <div>
              <div className="text-[9px] text-white/40 uppercase tracking-widest">Active Time</div>
              <div className="text-white/80 font-mono font-bold text-sm">{dailyStats.activeTime}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Completed Dungeons */}
      <div>
        <h2 className="text-white/40 text-[10px] font-bold uppercase tracking-[0.2em] mb-3 ml-1">Completed Dungeons</h2>
        <div className="space-y-4">
          {completedDungeons.map(dungeon => (
            <div key={dungeon.id} className="glass-panel p-5 border-l-2 border-l-system-blue/60 relative overflow-hidden">
               <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-black italic uppercase tracking-tight text-[#e0e0e0]">{dungeon.name}</h3>
                    <p className="text-[10px] text-system-blue font-bold uppercase tracking-[0.2em] mt-0.5">{dungeon.target}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-[9px] text-white/40 font-mono mb-1">{dungeon.timeCompleted}</div>
                    <div className="text-[10px] text-system-blue font-bold tracking-widest">+{dungeon.xpGained} XP</div>
                  </div>
               </div>

               {/* Exercise breakdown */}
               <div className="space-y-2 mt-4 pt-4 border-t border-white/5">
                 <div className="grid grid-cols-12 gap-2 text-[8px] text-white/40 uppercase tracking-widest font-bold px-1 mb-1">
                    <div className="col-span-6">Exercise</div>
                    <div className="col-span-2 text-center">Sets</div>
                    <div className="col-span-4 text-right">Volume</div>
                 </div>
                 {dungeon.exercises.map((ex, idx) => (
                   <div key={idx} className="grid grid-cols-12 gap-2 items-center px-1 py-1.5 bg-black/20 rounded-sm">
                      <div className="col-span-6 text-[10px] font-bold text-white/80 truncate pr-2">{ex.name}</div>
                      <div className="col-span-2 text-center text-system-blue font-mono text-[10px]">{ex.sets}</div>
                      <div className="col-span-4 text-right text-white/60 font-mono text-[10px]">{ex.volume} kg</div>
                   </div>
                 ))}
               </div>
            </div>
          ))}
        </div>
      </div>

      {/* Base Attributes */}
      <div className="glass-panel p-6 flex flex-col gap-4">
        <h2 className="text-system-blue text-[10px] font-bold uppercase tracking-widest flex items-center justify-between">
          <span>Base Attributes</span>
          <Activity size={14} />
        </h2>
        
        <div className="w-full h-56 -my-4 relative">
          <div className="absolute inset-0 top-8 bg-system-blue/5 rounded-full blur-[40px] pointer-events-none" />
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="65%" data={data}>
              <PolarGrid stroke="rgba(0, 229, 255, 0.15)" strokeDasharray="3 3" />
              <PolarAngleAxis 
                dataKey="subject" 
                tick={{ fill: '#e0e0e0', fontSize: 10, fontFamily: 'Orbitron', fontWeight: 'bold' }} 
              />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
              <Radar
                name="Stats"
                dataKey="A"
                stroke="#00E5FF"
                strokeWidth={1}
                fill="url(#colorGlow)"
                fillOpacity={1}
                isAnimationActive={true}
              />
              <defs>
                <linearGradient id="colorGlow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00E5FF" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#00E5FF" stopOpacity={0.05}/>
                </linearGradient>
              </defs>
            </RadarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="grid grid-cols-1 gap-2 mt-4 pt-4 border-t border-white/5">
           {data.map((stat) => (
             <div key={stat.subject} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
                <span className="text-[11px] font-bold italic tracking-widest uppercase text-white/80">{stat.subject}</span>
                <span className="font-mono text-system-blue shadow-none text-sm">{stat.A}</span>
             </div>
           ))}
        </div>
      </div>
    </motion.div>
  );
}
