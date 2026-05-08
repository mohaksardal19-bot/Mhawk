import { motion } from "motion/react";
import { useEffect } from "react";

interface WelcomeScreenProps {
  key?: string;
  onComplete: () => void;
}

export function WelcomeScreen({ onComplete }: WelcomeScreenProps) {
  useEffect(() => {
    // Automatically transition after 3 seconds, or the user can tap
    const timer = setTimeout(() => {
      onComplete();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onComplete}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center cursor-pointer bg-[#0a0a0f] overflow-hidden"
    >
      {/* Dark magical aura background effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[20%] left-[50%] -translate-x-[50%] w-[300px] h-[500px] bg-[#8a2be2]/30 blur-[100px] rounded-full" />
        <div className="absolute bottom-[10%] left-[50%] -translate-x-[50%] w-[400px] h-[300px] bg-[#9333ea]/20 blur-[120px] rounded-full" />
        <div className="absolute top-[40%] left-[50%] -translate-x-[50%] w-[200px] h-[600px] bg-black blur-[50px] rounded-full transform rotate-12" />
        
        {/* Silhouette shape simulation (abstract anime protagonist) */}
        <div className="absolute bottom-0 left-[50%] -translate-x-[50%] w-[250px] h-[60%] bg-black rounded-t-[100px] blur-[15px]" />
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 z-0 opacity-50">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-[#c084fc]"
            initial={{
              x: Math.random() * window.innerWidth,
              y: window.innerHeight + 10,
              scale: Math.random() * 0.5 + 0.5,
              opacity: Math.random() * 0.5 + 0.2
            }}
            animate={{
              y: -50,
              opacity: 0,
              x: `+=${Math.random() * 50 - 25}`
            }}
            transition={{
              duration: Math.random() * 3 + 3,
              repeat: Infinity,
              ease: "linear",
              delay: Math.random() * 3
            }}
            style={{
              width: `${Math.random() * 4 + 2}px`,
              height: `${Math.random() * 15 + 10}px`,
            }}
          />
        ))}
      </div>

      <div className="z-10 flex flex-col items-center drop-shadow-[0_0_20px_rgba(0,0,0,0.8)]">
        {/* Logo Text */}
        <motion.div 
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
          className="relative text-center"
        >
          <h1 className="text-6xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-[#e2e8f0] via-[#cbd5e1] to-[#8a2be2] relative z-10" style={{ fontFamily: "serif" }}>
            Solo
          </h1>
          <h1 className="text-6xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-[#e2e8f0] via-[#cbd5e1] to-[#8a2be2] relative z-10 -mt-2" style={{ fontFamily: "serif" }}>
            Leveling
          </h1>
          {/* Logo glow effect behind */}
          <div className="absolute inset-0 bg-white/10 blur-[15px] z-0 rounded-full mix-blend-overlay"></div>
          {/* Slash accent lines simulating the logo's sharp edges */}
          <div className="absolute top-[40%] left-[-20px] w-8 h-1 bg-[#8a2be2] rotate-45 shadow-[0_0_10px_#8a2be2]"></div>
          <div className="absolute bottom-[30%] right-[-10px] w-12 h-1 bg-[#8a2be2] -rotate-12 shadow-[0_0_10px_#8a2be2]"></div>
        </motion.div>

        {/* Subtitle */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="mt-6 text-[#ff00ff] font-serif text-lg tracking-widest drop-shadow-[0_0_5px_rgba(255,0,255,0.8)]"
        >
          Level up your game
        </motion.div>
      </div>
      
      {/* Tap indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 1 }}
        className="absolute bottom-12 text-white/30 text-xs font-mono uppercase tracking-widest animate-pulse z-10"
      >
        Tap anywhere to start
      </motion.div>
    </motion.div>
  );
}
