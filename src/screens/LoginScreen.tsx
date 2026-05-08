import { motion } from "motion/react";
import React, { useState } from "react";

interface LoginScreenProps {
  key?: string;
  onLogin: () => void;
  onSignUpClick: () => void;
}

export function LoginScreen({ onLogin, onSignUpClick }: LoginScreenProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex flex-col bg-[#0a0a0f] overflow-hidden"
    >
      {/* Dark magical aura background effects */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[10%] left-[50%] -translate-x-[50%] w-[300px] h-[500px] bg-[#8a2be2]/30 blur-[100px] rounded-full" />
        <div className="absolute bottom-[30%] left-[50%] -translate-x-[50%] w-[400px] h-[300px] bg-[#9333ea]/20 blur-[120px] rounded-full" />
        <div className="absolute top-[30%] left-[50%] -translate-x-[50%] w-[200px] h-[600px] bg-black blur-[50px] rounded-full transform rotate-12" />
        
        {/* Silhouette shape simulation */}
        <div className="absolute top-[20%] left-[50%] -translate-x-[50%] w-[250px] h-[80%] bg-black rounded-t-[100px] blur-[15px]" />
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 z-0 opacity-50 pointer-events-none">
        {[...Array(15)].map((_, i) => (
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

      <div className="relative z-10 flex flex-col items-center pt-24 pb-8 flex-1">
        {/* Logo Text - scaled down slightly from welcome screen */}
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative text-center drop-shadow-[0_0_20px_rgba(0,0,0,0.8)]"
        >
          <h1 className="text-5xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-[#e2e8f0] via-[#cbd5e1] to-[#8a2be2] relative z-10" style={{ fontFamily: "serif" }}>
            Solo
          </h1>
          <h1 className="text-5xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-[#e2e8f0] via-[#cbd5e1] to-[#8a2be2] relative z-10 -mt-2" style={{ fontFamily: "serif" }}>
            Leveling
          </h1>
          {/* Logo glow effect behind */}
          <div className="absolute inset-0 bg-white/10 blur-[15px] z-0 rounded-full mix-blend-overlay"></div>
          {/* Slash accent lines simulating the logo's sharp edges */}
          <div className="absolute top-[40%] left-[-20px] w-6 h-1 bg-[#8a2be2] rotate-45 shadow-[0_0_10px_#8a2be2]"></div>
          <div className="absolute bottom-[30%] right-[-10px] w-10 h-1 bg-[#8a2be2] -rotate-12 shadow-[0_0_10px_#8a2be2]"></div>
        </motion.div>
      </div>

      {/* Login Form Panel */}
      <motion.div 
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 200, delay: 0.2 }}
        className="relative z-20 bg-white/80 backdrop-blur-md w-full rounded-t-[50px] px-8 pt-12 pb-16 flex flex-col shadow-[0_-10px_40px_rgba(138,43,226,0.15)]"
      >
        <h2 className="text-3xl text-center mb-8 text-[#1a1a2e]" style={{ fontFamily: "serif", fontStyle: "italic" }}>
          Player Login
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input 
            type="text" 
            placeholder="Enter Email/Number" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-transparent border border-[#1a1a2e]/30 rounded-lg px-4 py-3 outline-none focus:border-[#8a2be2] text-[#1a1a2e] placeholder-[#1a1a2e]/50 font-medium transition-colors"
            required
          />
          <input 
            type="password" 
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-transparent border border-[#1a1a2e]/30 rounded-lg px-4 py-3 outline-none focus:border-[#8a2be2] text-[#1a1a2e] placeholder-[#1a1a2e]/50 font-medium transition-colors"
            required
          />
          
          <div className="flex justify-end mb-2">
            <button type="button" className="text-sm font-medium text-[#1a1a2e]/80 hover:text-[#1a1a2e]">
              Forget Password?
            </button>
          </div>

          <div className="flex flex-col gap-3">
            <button 
              type="submit" 
              className="w-full bg-[#0a0a0f] text-white rounded-lg py-4 font-bold tracking-wider hover:bg-[#1a1a2e] transition-colors shadow-lg active:scale-[0.98]"
            >
              Sign-In
            </button>
            <button 
              type="button" 
              onClick={onSignUpClick}
              className="w-full bg-transparent border-2 border-[#0a0a0f]/20 text-[#0a0a0f] rounded-lg py-4 font-bold tracking-wider hover:bg-[#0a0a0f]/5 transition-colors active:scale-[0.98]"
            >
              Sign-Up
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
