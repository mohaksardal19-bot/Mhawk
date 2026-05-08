import { motion } from "motion/react";
import React, { useState } from "react";
import { ChevronLeft } from "lucide-react";

interface GenderScreenProps {
  key?: string;
  onNext: (gender: string) => void;
  onBack: () => void;
}

export function GenderScreen({ onNext, onBack }: GenderScreenProps) {
  const [selectedGender, setSelectedGender] = useState<string | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex flex-col bg-black overflow-hidden"
    >
      {/* Back Button */}
      <div className="absolute top-8 left-6 z-[110]">
        <button 
          onClick={onBack}
          className="w-10 h-10 rounded-full bg-[#8a2be2] flex items-center justify-center text-white hover:bg-[#8a2be2]/80 transition-colors"
        >
          <ChevronLeft size={24} />
        </button>
      </div>

      <div className="relative z-10 flex flex-col items-center pt-24 pb-8 flex-1 w-full max-w-sm mx-auto px-6">
        <h2 className="text-[#00e5ff] text-2xl tracking-widest uppercase italic font-serif mb-12 text-center" style={{ textShadow: "0 0 10px rgba(0,229,255,0.5)"}}>
          Tell Us About You
        </h2>

        <div className="flex flex-col items-center gap-8 w-full flex-1">
          {/* Male Option */}
          <div className="flex flex-col items-center gap-4 cursor-pointer group" onClick={() => setSelectedGender("male")}>
            <motion.div 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              animate={{ 
                boxShadow: selectedGender === "male" ? "0 0 20px rgba(0,229,255,0.8)" : "0 0 0px rgba(0,0,0,0)",
                borderColor: selectedGender === "male" ? "#00e5ff" : "white"
              }}
              className={`w-40 h-40 rounded-full bg-white flex items-center justify-center border-[4px] transition-colors`}
            >
              <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-black">
                <circle cx="10" cy="14" r="6" />
                <path d="M14 10l5-5" />
                <path d="M19 10V5h-5" />
              </svg>
            </motion.div>
            <span className={`text-xl italic font-serif tracking-widest uppercase ${selectedGender === "male" ? "text-white" : "text-[#00e5ff]"}`} style={{ textShadow: selectedGender === "male" ? "0 0 10px rgba(255,255,255,0.8)" : "0 0 10px rgba(0,229,255,0.5)"}}>
              Male
            </span>
          </div>

          {/* Female Option */}
          <div className="flex flex-col items-center gap-4 cursor-pointer group" onClick={() => setSelectedGender("female")}>
            <motion.div 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              animate={{ 
                boxShadow: selectedGender === "female" ? "0 0 20px rgba(0,229,255,0.8)" : "0 0 0px rgba(0,0,0,0)",
                borderColor: selectedGender === "female" ? "#00e5ff" : "white"
              }}
              className={`w-40 h-40 rounded-full bg-white flex items-center justify-center border-[4px] transition-colors`}
            >
              <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-black">
                <circle cx="12" cy="10" r="6" />
                <path d="M12 16v6" />
                <path d="M9 19h6" />
              </svg>
            </motion.div>
            <span className={`text-xl italic font-serif tracking-widest uppercase ${selectedGender === "female" ? "text-white" : "text-[#00e5ff]"}`} style={{ textShadow: selectedGender === "female" ? "0 0 10px rgba(255,255,255,0.8)" : "0 0 10px rgba(0,229,255,0.5)"}}>
              Female
            </span>
          </div>
        </div>

        {/* Next Button */}
        <div className="w-full mt-auto pt-8 flex justify-center pb-8">
          <button 
            onClick={() => {
              if(selectedGender) {
                onNext(selectedGender);
              }
            }}
            className={`text-[#00e5ff] uppercase tracking-widest font-serif text-lg py-2 px-8 transition-opacity ${selectedGender ? "opacity-100 hover:text-white" : "opacity-30 cursor-not-allowed"}`}
            style={{ textShadow: selectedGender ? "0 0 10px rgba(0,229,255,0.5)" : "none" }}
            disabled={!selectedGender}
          >
            Next
          </button>
        </div>
      </div>
    </motion.div>
  );
}
