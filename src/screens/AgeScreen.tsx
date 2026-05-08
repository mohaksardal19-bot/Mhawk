import { motion } from "motion/react";
import React, { useState, useRef, useEffect } from "react";
import { ChevronLeft } from "lucide-react";

interface AgeScreenProps {
  key?: string;
  onNext: (age: number) => void;
  onBack: () => void;
}

export function AgeScreen({ onNext, onBack }: AgeScreenProps) {
  const ages = Array.from({ length: 100 }, (_, i) => i + 1);
  const [selectedAge, setSelectedAge] = useState<number>(34);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to initial selected age on mount
    if (scrollRef.current) {
      // Small timeout to ensure DOM is ready
      setTimeout(() => {
        if (scrollRef.current) {
            const selectedEl = scrollRef.current.children[selectedAge - 1] as HTMLElement;
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
    
    // Find the item closest to the center
    let closestAge = selectedAge;
    let minDistance = Infinity;

    Array.from(container.children).forEach((child, index) => {
      const childEl = child as HTMLElement;
      // Exclude the <style> element if present, our ages start from index + 1 (roughly)
      // Actually, since there's a style block, the index will be offset by 1. 
      // Better to use data attributes or check classnames.
      if (childEl.tagName !== "STYLE") {
          const childCenter = childEl.offsetTop + childEl.clientHeight / 2;
          const distance = Math.abs(centerPosition - childCenter);
          
          if (distance < minDistance) {
            minDistance = distance;
            // The first child is <style>, so we need to account for it when mapping back to age
            closestAge = index; 
          }
      }
    });

    if (closestAge !== selectedAge) {
      setSelectedAge(closestAge);
    }
  };

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
          className="w-10 h-10 rounded-full bg-[#8a2be2]/60 flex items-center justify-center text-white hover:bg-[#8a2be2]/80 transition-colors shadow-[0_0_15px_rgba(138,43,226,0.5)] border border-[#8a2be2]"
        >
          <ChevronLeft size={24} />
        </button>
      </div>

      <div className="relative z-10 flex flex-col items-center pt-24 pb-8 flex-1 w-full max-w-sm mx-auto px-6">
        <h2 className="text-[#00e5ff] text-2xl tracking-widest uppercase italic font-serif mb-12 text-center" style={{ textShadow: "0 0 10px rgba(0,229,255,0.5)"}}>
          How Old Are You
        </h2>

        {/* Age Picker */}
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
                scrollbarWidth: 'none', /* Firefox */
                msOverflowStyle: 'none'  /* Internet Explorer 10+ */
              }}
            >
              <style>{`.hide-scrollbar::-webkit-scrollbar { display: none; }`}</style>
              
              {ages.map((age) => {
                const isSelected = age === selectedAge;
                const distance = Math.abs(age - selectedAge);
                
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
                  opacity = "opacity-0"; // Hide items far away for cleaner look
                }

                return (
                  <div 
                    key={age}
                    className={`snap-center shrink-0 w-full h-[60px] flex items-center justify-center cursor-pointer transition-all duration-200 ${fontSize} ${opacity}`}
                    onClick={() => {
                        setSelectedAge(age);
                        if (scrollRef.current) {
                            const selectedEl = scrollRef.current.children[age] as HTMLElement; // age matches index+1 because of <style>
                            scrollRef.current.scrollTo({
                                top: selectedEl.offsetTop - scrollRef.current.clientHeight / 2 + selectedEl.clientHeight / 2,
                                behavior: 'smooth'
                            });
                        }
                    }}
                  >
                    <span className="text-[#00e5ff] italic font-serif tracking-widest" style={{ textShadow: isSelected ? "0 0 10px rgba(0,229,255,0.5)" : "none" }}>
                      {age}
                    </span>
                  </div>
                );
              })}
            </div>
        </div>

        {/* Next Button */}
        <div className="w-full mt-auto pt-8 flex justify-center pb-8">
          <button 
            onClick={() => {
              if(selectedAge) {
                onNext(selectedAge);
              }
            }}
            className={`text-[#00e5ff] uppercase tracking-widest font-serif text-lg py-2 px-8 transition-opacity opacity-100 hover:text-white`}
            style={{ textShadow: "0 0 10px rgba(0,229,255,0.5)" }}
          >
            Next
          </button>
        </div>
      </div>
    </motion.div>
  );
}
