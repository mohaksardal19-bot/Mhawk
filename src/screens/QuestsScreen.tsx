import { motion, AnimatePresence } from "motion/react";
import { Plus, Check, Play, Sparkles, Loader2, X } from "lucide-react";
import { useState } from "react";
import { generateAIWorkout, WorkoutExercise } from "../services/geminiService";
import { usePlayer } from "../context/PlayerContext";

export function QuestsScreen() {
  const [exercises, setExercises] = useState<WorkoutExercise[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedBodyPart, setSelectedBodyPart] = useState("Chest");
  const [currentDungeonType, setCurrentDungeonType] = useState<"strength" | "cardio" | "outdoor">("strength");
  const [showGenerator, setShowGenerator] = useState(false);
  const [showRewardPopup, setShowRewardPopup] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);

  const { playerState, addDungeonRecord, addStat } = usePlayer();

  const bodyParts = ["Chest", "Back", "Legs", "Shoulders", "Arms", "Core", "Cardio", "Outdoor"];

  // State for tracked sets of the currently active exercise
  const [activeExerciseIndex, setActiveExerciseIndex] = useState(0);
  const [sets, setSets] = useState([
    { id: 1, weight: 0, reps: 0, minutes: 0, completed: false, xp: 0 },
  ]);

  const [weightInput, setWeightInput] = useState("0");
  const [repInput, setRepInput] = useState("0");
  const [minutesInput, setMinutesInput] = useState("0");

  const recentDungeons = playerState.dungeonsHistory.slice(0, 1);
  const allDungeons = playerState.dungeonsHistory;

  const generateDungeon = async () => {
    setIsGenerating(true);
    try {
      if (selectedBodyPart === "Cardio") {
         const cardioWorkout = [
           { name: "Running", reps: "-", weight: "-", xp_reward: 100 },
           { name: "Walking", reps: "-", weight: "-", xp_reward: 100 },
           { name: "Cycling", reps: "-", weight: "-", xp_reward: 100 },
           { name: "Swimming", reps: "-", weight: "-", xp_reward: 100 }
         ];
         setExercises(cardioWorkout);
         setActiveExerciseIndex(0);
         setSets([{ id: 1, weight: 0, reps: 0, minutes: 0, completed: false, xp: 0 }]);
         setCurrentDungeonType("cardio");
         setShowGenerator(false);
         setStartTime(Date.now());
      } else if (selectedBodyPart === "Outdoor") {
         const outdoorWorkout = [
           { name: "Basketball", reps: "-", weight: "-", xp_reward: 100 },
           { name: "Football", reps: "-", weight: "-", xp_reward: 100 },
           { name: "Cricket", reps: "-", weight: "-", xp_reward: 100 },
           { name: "Badminton", reps: "-", weight: "-", xp_reward: 100 }
         ];
         setExercises(outdoorWorkout);
         setActiveExerciseIndex(0);
         setSets([{ id: 1, weight: 0, reps: 0, minutes: 0, completed: false, xp: 0 }]);
         setCurrentDungeonType("outdoor");
         setShowGenerator(false);
         setStartTime(Date.now());
      } else {
        const workout = await generateAIWorkout(selectedBodyPart, 24);
        setExercises(workout);
        setActiveExerciseIndex(0);
        setSets([{ id: 1, weight: parseInt(workout[0]?.weight) || 0, reps: parseInt(workout[0]?.reps) || 0, minutes: 0, completed: false, xp: 0 }]);
        setCurrentDungeonType("strength");
        setShowGenerator(false);
        setStartTime(Date.now());
      }
    } catch (error) {
      console.error(error);
      alert("System Error: Failed to generate dungeon.");
    } finally {
      setIsGenerating(false);
    }
  };

  const completeSet = (id: number) => {
    setSets(sets.map(s => {
      if (s.id === id) {
        if (currentDungeonType === "strength") {
          return { 
            ...s, 
            completed: true, 
            reps: parseInt(repInput) || s.reps, 
            weight: parseInt(weightInput) || s.weight, 
            xp: (parseInt(weightInput) || Math.max(s.weight, 10)) * (parseInt(repInput) || Math.max(s.reps, 1)) * 0.15 
          };
        } else {
          const mins = parseInt(minutesInput) || s.minutes || 0;
          return {
            ...s,
            completed: true,
            minutes: mins,
            xp: mins * 5
          };
        }
      }
      return s;
    }));
  };

  const addSet = () => {
    setSets([...sets, { 
      id: sets.length + 1, 
      weight: parseInt(weightInput) || 0, 
      reps: parseInt(repInput) || 0, 
      minutes: parseInt(minutesInput) || 0,
      completed: false, 
      xp: 0 
    }]);
  };

  const nextExercise = () => {
    if (activeExerciseIndex < exercises.length - 1) {
      const nextIndex = activeExerciseIndex + 1;
      setActiveExerciseIndex(nextIndex);
      const nextEx = exercises[nextIndex];
      setSets([{ id: 1, weight: parseInt(nextEx.weight) || 0, reps: parseInt(nextEx.reps) || 0, minutes: 0, completed: false, xp: 0 }]);
      setWeightInput(parseInt(nextEx.weight)?.toString() || "0");
      setRepInput(parseInt(nextEx.reps)?.toString() || "0");
      setMinutesInput("0");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="p-8 pb-32 relative min-h-screen"
    >
      <header className="py-2 border-b border-system-blue/20 pb-4 mb-6 flex justify-between items-end">
        <div>
          <p className="font-bold text-system-red tracking-[0.3em] text-[10px] uppercase mb-1 drop-shadow-[0_0_8px_rgba(255,42,42,0.8)]">
            Dungeon Gate
          </p>
          <h1 className="text-2xl font-black italic uppercase tracking-tighter text-[#e0e0e0]">
            System Quests
          </h1>
        </div>
        <button 
          onClick={() => setShowGenerator(true)}
          className="bg-system-blue/10 border border-system-blue text-system-blue p-2 rounded-sm shadow-[0_0_10px_rgba(0,229,255,0.2)] hover:bg-system-blue hover:text-black transition-colors"
        >
          <Sparkles size={20} />
        </button>
      </header>

      {exercises.length === 0 && !showGenerator && (
        <>
          <div className="glass-panel p-8 text-center flex flex-col items-center justify-center min-h-[300px] border-dashed border-white/20">
            <Sparkles size={48} className="text-white/20 mb-4" />
            <h2 className="text-white/60 font-bold uppercase tracking-widest text-sm mb-2">No Active Dungeon</h2>
            <p className="text-xs text-white/40 mb-6">Create an AI-generated workout instance using a Dungeon Key.</p>
            <button 
              onClick={() => setShowGenerator(true)}
              className="w-full bg-system-blue text-black font-black italic uppercase tracking-widest py-3 border border-system-blue shadow-[0_0_15px_rgba(0,229,255,0.3)] hover:scale-[1.02] transition-transform"
            >
              Create Dungeon
            </button>
          </div>

          {/* Dungeon History */}
          <div className="w-full mt-10">
            <div className="border-b border-system-blue/20 pb-2 mb-4">
              <h2 className="text-xl font-black italic uppercase tracking-widest text-[#e0e0e0]">Dungeon History</h2>
            </div>

            <div className="mb-6">
              <h3 className="text-[10px] text-system-blue font-bold uppercase tracking-[0.2em] mb-3 drop-shadow-[0_0_5px_rgba(0,229,255,0.5)]">Recent Completion</h3>
              {recentDungeons.slice(0, 1).map(d => (
                <div key={d.id} className="glass-panel p-4 flex justify-between items-center bg-white/5 border border-white/10 rounded-sm hover:border-system-blue/30 transition-colors cursor-pointer">
                  <div>
                     <p className="text-sm font-bold text-white uppercase tracking-widest">{d.title}</p>
                     <p className="text-[10px] text-white/40 uppercase tracking-widest mt-1">{d.date}</p>
                  </div>
                  <div className="text-right">
                     <p className="text-sm text-system-blue font-bold tracking-widest text-glow-blue">+{d.xp} XP</p>
                     <p className="text-[10px] text-system-blue/60 uppercase tracking-widest">{d.type}</p>
                  </div>
                </div>
              ))}
            </div>

            <div>
              <h3 className="text-[10px] text-system-blue font-bold uppercase tracking-[0.2em] mb-3 drop-shadow-[0_0_5px_rgba(0,229,255,0.5)]">All Clear Records</h3>
              <div className="space-y-3">
              {allDungeons.map(d => (
                <div key={d.id} className="glass-panel p-4 flex justify-between items-center bg-white/5 border border-white/10 rounded-sm hover:border-system-blue/30 transition-colors cursor-pointer">
                  <div>
                     <p className="text-sm font-bold text-white uppercase tracking-widest">{d.title}</p>
                     <p className="text-[10px] text-white/40 uppercase tracking-widest mt-1">{d.date}</p>
                  </div>
                  <div className="text-right">
                     <p className="text-sm text-system-blue font-bold tracking-widest text-glow-blue">+{d.xp} XP</p>
                     <p className="text-[10px] text-system-blue/60 uppercase tracking-widest">{d.type}</p>
                  </div>
                </div>
              ))}
              </div>
            </div>
          </div>
        </>
      )}

      {exercises.map((exercise, index) => {
        if (index < activeExerciseIndex) return null; // Hide finished ones completely or show collapsed
        if (index > activeExerciseIndex) {
          // Queued exercise
          return (
            <div key={index} className="glass-panel p-5 relative opacity-40 mb-4 grayscale pointer-events-none">
              <div className="mb-2">
                <h3 className="text-xl font-black italic tracking-tighter uppercase leading-none mb-1 text-[#e0e0e0]">{exercise.name}</h3>
                {currentDungeonType === "strength" && (
                   <p className="text-[10px] text-system-blue font-bold uppercase tracking-[0.2em]">{exercise.reps} Reps | {exercise.weight} kg</p>
                )}
              </div>
              <div className="mt-4 border border-white/20 text-white/40 py-2 px-6 text-[10px] uppercase font-black tracking-widest w-full text-center">
                Locked
              </div>
            </div>
          );
        }

        // Active Exercise
        return (
          <div key={index} className="glass-panel-active p-6 relative group mb-8 border border-system-blue/30 shadow-[0_0_20px_rgba(0,229,255,0.1)]">
            <div className="absolute -inset-0.5 border border-system-blue opacity-50 blur-sm pointer-events-none" />
            <div className="absolute top-4 right-4 flex gap-2">
              <div className="w-2 h-2 rounded-full bg-system-blue shadow-[0_0_8px_#00E5FF] animate-pulse"></div>
              <div className="text-[9px] text-system-blue uppercase tracking-[0.2em] font-bold">In Progress</div>
            </div>
            
            <div className="mb-6 mt-2 relative z-10">
              <h3 className="text-2xl font-black italic tracking-tighter uppercase leading-none mb-2 text-[#e0e0e0] drop-shadow-md">{exercise.name}</h3>
              {currentDungeonType === "strength" && (
                <p className="text-xs text-system-blue font-bold uppercase tracking-[0.2em] drop-shadow-[0_0_5px_rgba(0,229,255,0.5)]">Target: {exercise.reps} | Weight: {exercise.weight}</p>
              )}
            </div>

            <div className="space-y-3 mb-6 relative z-10">
              <div className="grid grid-cols-12 gap-2 text-[10px] text-white/40 uppercase tracking-widest font-bold px-2">
                <div className="col-span-2 text-center">Session</div>
                {currentDungeonType === "strength" ? (
                  <>
                    <div className="col-span-3 text-center">kg</div>
                    <div className="col-span-3 text-center">Reps</div>
                  </>
                ) : (
                  <div className="col-span-6 text-center">Minutes</div>
                )}
                <div className="col-span-4 text-right">Action</div>
              </div>

              {sets.map((set, setIndex) => (
                <div key={set.id} className={`grid grid-cols-12 gap-2 items-center p-2 rounded-sm border ${set.completed ? 'bg-system-blue/10 border-system-blue/40 shadow-[inset_0_0_10px_rgba(0,229,255,0.1)]' : 'bg-black/40 border-white/10'}`}>
                  <div className="col-span-2 text-center font-black italic text-white/60">{setIndex + 1}</div>
                  
                  {set.completed ? (
                    <>
                      {currentDungeonType === "strength" ? (
                        <>
                          <div className="col-span-3 text-center font-mono text-system-blue">{set.weight}</div>
                          <div className="col-span-3 text-center font-mono text-system-blue">{set.reps}</div>
                        </>
                      ) : (
                        <div className="col-span-6 text-center font-mono text-system-blue">{set.minutes}</div>
                      )}
                      <div className="col-span-4 text-right flex items-center justify-end gap-2">
                        <span className="text-[10px] text-system-blue font-bold tracking-widest text-glow-blue">+{Math.round(set.xp)} XP</span>
                        <Check size={14} className="text-system-blue drop-shadow-[0_0_5px_rgba(0,229,255,0.8)]" />
                      </div>
                    </>
                  ) : (
                    <>
                      {currentDungeonType === "strength" ? (
                        <>
                          <div className="col-span-3">
                            <input 
                              type="number" 
                              value={weightInput}
                              onChange={(e) => setWeightInput(e.target.value)}
                              className="w-full bg-black/60 border border-system-blue/30 rounded-sm text-center py-1 font-mono text-sm focus:border-system-blue focus:shadow-[0_0_10px_rgba(0,229,255,0.3)] focus:outline-none text-white"
                            />
                          </div>
                          <div className="col-span-3">
                            <input 
                              type="number" 
                              value={repInput}
                              onChange={(e) => setRepInput(e.target.value)}
                              className="w-full bg-black/60 border border-system-blue/30 rounded-sm text-center py-1 font-mono text-sm focus:border-system-blue focus:shadow-[0_0_10px_rgba(0,229,255,0.3)] focus:outline-none text-white"
                            />
                          </div>
                        </>
                      ) : (
                        <div className="col-span-6">
                          <input 
                            type="number" 
                            value={minutesInput}
                            onChange={(e) => setMinutesInput(e.target.value)}
                            placeholder="Mins"
                            className="w-full bg-black/60 border border-system-blue/30 rounded-sm text-center py-1 font-mono text-sm focus:border-system-blue focus:shadow-[0_0_10px_rgba(0,229,255,0.3)] focus:outline-none text-white"
                          />
                        </div>
                      )}
                      <div className="col-span-4 flex justify-end">
                        <button 
                          onClick={() => completeSet(set.id)}
                          className="bg-system-blue/20 hover:bg-system-blue border border-system-blue text-system-blue hover:text-black py-1 px-3 rounded-sm transition-all flex items-center justify-center italic font-black uppercase text-[10px] tracking-widest w-full hover:shadow-[0_0_15px_rgba(0,229,255,0.6)]"
                        >
                           Done
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>

            <button 
              onClick={addSet}
              className="w-full relative z-10 border border-dashed border-system-blue/30 hover:border-system-blue hover:bg-system-blue/5 text-system-blue/70 hover:text-system-blue py-3 rounded-sm flex justify-center items-center gap-2 text-[10px] uppercase font-bold tracking-widest transition-colors mb-4"
            >
              <Plus size={14} /> {currentDungeonType === "strength" ? "Add Set" : "Add Session"}
            </button>
            
            {sets.some(s => s.completed) && activeExerciseIndex < exercises.length - 1 && (
               <button 
                onClick={nextExercise}
                className="w-full relative z-10 bg-system-blue text-black font-black italic uppercase tracking-widest py-3 border border-system-blue shadow-[0_0_15px_rgba(0,229,255,0.3)] hover:scale-[1.02] transition-transform flex items-center justify-center gap-2"
              >
                Next Exercise <Play size={14} fill="currentColor" />
              </button>
            )}
          </div>
        );
      })}

      {exercises.length > 0 && activeExerciseIndex === exercises.length - 1 && sets.some(s => s.completed) && (
        <div className="fixed bottom-20 left-0 right-0 p-4 bg-gradient-to-t from-dark-indigo via-dark-indigo/90 to-transparent z-40 max-w-md mx-auto">
          <button onClick={() => setShowRewardPopup(true)} className="w-full bg-system-blue text-black font-black italic uppercase tracking-widest py-4 border border-system-blue shadow-[0_0_20px_rgba(0,229,255,0.6)] animate-pulse">
            Complete Dungeon Instance
          </button>
        </div>
      )}

      {/* AI Generator Modal */}
      <AnimatePresence>
        {showGenerator && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="w-full max-w-sm glass-panel p-6 border-system-blue shadow-[0_0_40px_rgba(0,229,255,0.15)] relative overflow-hidden"
            >
              {/* Animated scanning line overlay */}
              <motion.div 
                animate={{ top: ['-10%', '110%'] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                className="absolute left-0 right-0 h-[2px] bg-system-blue/30 shadow-[0_0_20px_#00E5FF] z-0 blur-[1px]"
              />

              <button 
                onClick={() => !isGenerating && setShowGenerator(false)}
                className="absolute top-4 right-4 text-white/40 hover:text-white z-10"
              >
                <X size={20} />
              </button>

              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 border border-system-blue flex items-center justify-center text-system-blue bg-system-blue/10">
                    <Sparkles size={20} />
                  </div>
                  <div>
                    <h2 className="text-xl font-black italic uppercase tracking-tight text-[#e0e0e0]">Dungeon Setup</h2>
                    <p className="text-[9px] text-system-blue font-bold uppercase tracking-[0.2em]">Select Target Parameter</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-8">
                  {bodyParts.map(part => (
                    <button
                      key={part}
                      onClick={() => setSelectedBodyPart(part)}
                      disabled={isGenerating}
                      className={`py-3 px-2 border rounded-sm text-[11px] font-bold uppercase tracking-widest transition-all
                        ${selectedBodyPart === part 
                          ? 'border-system-blue bg-system-blue/20 text-system-blue shadow-[0_0_10px_rgba(0,229,255,0.3)]' 
                          : 'border-white/10 bg-black/40 text-white/40 hover:border-white/30'}`}
                    >
                      {part}
                    </button>
                  ))}
                </div>

                <button
                  onClick={generateDungeon}
                  disabled={isGenerating}
                  className="w-full bg-system-blue text-black font-black italic uppercase tracking-widest py-4 border border-system-blue shadow-[0_0_15px_rgba(0,229,255,0.4)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 hover:bg-white transition-colors"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 size={18} className="animate-spin" /> Analyzing Target...
                    </>
                  ) : (
                    <>
                      Create Instance
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reward Modal */}
      <AnimatePresence>
        {showRewardPopup && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="w-full max-w-sm glass-panel border border-system-blue shadow-[0_0_40px_rgba(0,229,255,0.2)] p-6 flex flex-col items-center relative overflow-hidden"
            >
              <h2 className="text-system-blue font-bold tracking-[0.2em] uppercase text-center mb-6">System Message</h2>
              <p className="text-white text-center font-bold tracking-wider mb-4 leading-relaxed">
                [The Daily Quest has been completed.]<br/>
                <span className="text-white/60 text-sm italic font-normal mt-2 inline-block">Rewards for completing the quest have arrived.</span>
              </p>
              
              <div className="w-full space-y-3 mb-8">
                <div className="bg-system-blue/10 border border-system-blue/30 p-3 flex justify-between items-center shadow-[inset_0_0_10px_rgba(0,229,255,0.1)]">
                  <span className="text-sm font-bold uppercase tracking-widest text-[#e0e0e0]">Reward 1</span>
                  <span className="text-system-blue font-mono text-sm leading-none drop-shadow-[0_0_5px_rgba(0,229,255,0.5)]">Status Recovery</span>
                </div>
                <div className="bg-system-blue/10 border border-system-blue/30 p-3 flex justify-between items-center shadow-[inset_0_0_10px_rgba(0,229,255,0.1)]">
                  <span className="text-sm font-bold uppercase tracking-widest text-[#e0e0e0]">Reward 2</span>
                  <span className="text-system-blue font-mono text-sm leading-none drop-shadow-[0_0_5px_rgba(0,229,255,0.5)]">Ability Points +3</span>
                </div>
                <div className="bg-system-blue/10 border border-system-blue/30 p-3 flex justify-between items-center shadow-[inset_0_0_10px_rgba(0,229,255,0.1)]">
                  <span className="text-sm font-bold uppercase tracking-widest text-[#e0e0e0]">Reward 3</span>
                  <span className="text-system-blue font-mono text-sm leading-none drop-shadow-[0_0_5px_rgba(0,229,255,0.5)]">Loot Box (1)</span>
                </div>
              </div>

              <button 
                onClick={() => { 
                  setShowRewardPopup(false); 
                  
                  const endTime = Date.now();
                  const timeDiff = startTime ? Math.floor((endTime - startTime) / 60000) : 0;
                  const timeFormatted = timeDiff > 0 ? `${timeDiff}m` : `<1m`;

                  // Calculate total XP for this dungeon based on sets completed (mocked here or maybe calculate properly)
                  addDungeonRecord({
                    id: Math.random().toString(),
                    title: `${currentDungeonType === "strength" ? selectedBodyPart : "Activity"} Dungeon`,
                    type: currentDungeonType,
                    date: new Date().toLocaleDateString(),
                    time: timeFormatted,
                    xp: 500, // Let's simplify and give 500 base XP + 10x level later. Or we can just calculate from sets. Let's just say 1000.
                  }, currentDungeonType === "strength" ? selectedBodyPart : undefined);

                  if (currentDungeonType === "strength") addStat("strength", 5);
                  if (currentDungeonType === "cardio") addStat("vitality", 5);
                  if (currentDungeonType === "outdoor") addStat("agility", 5);

                  setExercises([]); 
                  setActiveExerciseIndex(0);
                  setStartTime(null);
                }} 
                className="w-full bg-system-blue text-black font-black italic uppercase tracking-widest py-3 border border-system-blue hover:bg-white transition-colors"
              >
                Accept Rewards
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}

