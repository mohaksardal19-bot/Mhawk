import { motion, AnimatePresence } from "motion/react";
import React, { useState, useRef, useEffect } from "react";
import { ChevronLeft } from "lucide-react";

interface WeightScreenProps {
  key?: string;
  onNext: (weight: number) => void;
  onBack: () => void;
}

export function WeightScreen({ onNext, onBack }: WeightScreenProps) {
  const weights = Array.from({ length: 150 }, (_, i) => i + 30); // 30kg to 179kg
  const [selectedWeight, setSelectedWeight] = useState<number>(70);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    if (scrollRef.current) {
      setTimeout(() => {
        if (scrollRef.current) {
            const index = weights.indexOf(selectedWeight);
            const selectedEl = scrollRef.current.children[index] as HTMLElement;
            if (selectedEl) {
               scrollRef.current.scrollTop = selectedEl.offsetTop - scrollRef.current.clientHeight / 2 + selectedEl.clientHeight / 2;
            }
        }
      }, 50);
    }
  }, []);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const centerPosition = container.scrollTop + container.clientHeight / 2;
    
    let closestWeight = selectedWeight;
    let minDistance = Infinity;

    Array.from(container.children).forEach((child, index) => {
      const childEl = child as HTMLElement;
      if (childEl.tagName !== "STYLE") {
          const childCenter = childEl.offsetTop + childEl.clientHeight / 2;
          const distance = Math.abs(centerPosition - childCenter);
          
          if (distance < minDistance) {
            minDistance = distance;
            // First child is <style> so adjust mapping
            closestWeight = weights[index - 1] || weights[0];
          }
      }
    });

    if (closestWeight !== selectedWeight) {
      setSelectedWeight(closestWeight);
    }
  };

  const handleNext = () => {
    setShowWelcome(true);
    setTimeout(() => {
      onNext(selectedWeight);
    }, 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex flex-col bg-black overflow-hidden"
    >
      <AnimatePresence>
        {showWelcome && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.2 }}
            className="absolute inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-sm"
          >
            <div className="flex flex-col items-center">
              <h1 className="text-4xl text-[#00e5ff] font-serif italic tracking-widest uppercase mb-4 text-center px-4" style={{ textShadow: "0 0 20px rgba(0,229,255,0.8)" }}>
                Welcome Player
              </h1>
              <div className="w-16 h-1 bg-[#8a2be2] rounded-full shadow-[0_0_10px_#8a2be2]" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Back Button */}
      <div className="absolute top-8 left-6 z-[110]">
        <button 
          onClick={onBack}
          className="w-10 h-10 rounded-full bg-[#8a2be2]/60 flex items-center justify-center text-white hover:bg-[#8a2be2]/80 transition-colors shadow-[0_0_15px_rgba(138,43,226,0.5)] border border-[#8a2be2]"
        >
          <ChevronLeft size={24} />
        </button>
      </div>

      <div className="relative z-10 flex flex-col items-center pt-24 pb-8 flex-1 w-full max-w-sm mx-auto px-6">
        <h2 className="text-[#00e5ff] text-2xl tracking-widest uppercase italic font-serif mb-12 text-center" style={{ textShadow: "0 0 10px rgba(0,229,255,0.5)"}}>
          What is your weight?
        </h2>

        {/* Weight Picker */}
        <div className="relative w-full flex-1 flex flex-col justify-center items-center max-h-[400px] overflow-hidden">
            {/* Selection Highlight Lines */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-[60px] pointer-events-none z-10 flex flex-col justify-between">
                <div className="w-full h-[5px] bg-[#a855f7] rounded-full shadow-[0_0_10px_rgba(168,85,247,0.8)]"></div>
                <div className="w-full h-[5px] bg-[#a855f7] rounded-full shadow-[0_0_10px_rgba(168,85,247,0.8)]"></div>
            </div>

            <div 
              ref={scrollRef}
              onScroll={handleScroll}
              className="w-full h-[300px] overflow-y-auto snap-y snap-mandatory hide-scrollbar flex flex-col items-center py-[120px]"
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none'
              }}
            >
              <style>{`.hide-scrollbar::-webkit-scrollbar { display: none; }`}</style>
              
              {weights.map((weight) => {
                const isSelected = weight === selectedWeight;
                const distance = Math.abs(weight - selectedWeight);
                
                let fontSize = "text-xl";
                let opacity = "opacity-20";
                
                if (distance === 0) {
                  fontSize = "text-[2.5rem]";
                  opacity = "opacity-100";
                } else if (distance === 1) {
                  fontSize = "text-3xl";
                  opacity = "opacity-70";
                } else if (distance === 2) {
                  fontSize = "text-2xl";
                  opacity = "opacity-40";
                } else if (distance === 3) {
                  fontSize = "text-xl";
                  opacity = "opacity-20";
                } else {
                  opacity = "opacity-0"; 
                }

                return (
                  <div 
                    key={weight}
                    className={`snap-center shrink-0 w-full h-[60px] flex items-center justify-center cursor-pointer transition-all duration-200 ${fontSize} ${opacity}`}
                    onClick={() => {
                        setSelectedWeight(weight);
                        if (scrollRef.current) {
                            const index = weights.indexOf(weight);
                            const selectedEl = scrollRef.current.children[index + 1] as HTMLElement; 
                            scrollRef.current.scrollTo({
                                top: selectedEl.offsetTop - scrollRef.current.clientHeight / 2 + selectedEl.clientHeight / 2,
                                behavior: 'smooth'
                            });
                        }
                    }}
                  >
                    <span className="text-[#00e5ff] italic font-serif tracking-widest" style={{ textShadow: isSelected ? "0 0 10px rgba(0,229,255,0.5)" : "none" }}>
                      {weight} Kg
                    </span>
                  </div>
                );
              })}
            </div>
        </div>

        {/* Next Button */}
        <div className="w-full mt-auto pt-8 flex justify-center pb-8">
          <button 
            onClick={handleNext}
            disabled={showWelcome}
            className={`text-[#00e5ff] uppercase tracking-widest font-serif text-lg py-2 px-8 transition-opacity opacity-100 hover:text-white ${showWelcome ? 'cursor-not-allowed opacity-50' : ''}`}
            style={{ textShadow: "0 0 10px rgba(0,229,255,0.5)" }}
          >
            Next
          </button>
        </div>
      </div>
    </motion.div>
  );
}
