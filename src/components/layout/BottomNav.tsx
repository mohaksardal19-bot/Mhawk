import { Activity, LayoutDashboard, Shield, Sword } from "lucide-react";
import { cn } from "../../lib/utils";

interface BottomNavProps {
  activeTab: string;
  onChange: (tab: string) => void;
}

export function BottomNav({ activeTab, onChange }: BottomNavProps) {
  const tabs = [
    { id: "status", label: "Status", icon: Activity },
    { id: "quests", label: "Quests", icon: Sword },
    { id: "skills", label: "Skills", icon: Shield },
    { id: "analytics", label: "Stats", icon: LayoutDashboard },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 h-16 bg-dark-indigo border-t border-system-blue/20 pb-safe">
      <div className="max-w-md mx-auto px-6 h-full flex items-center justify-between">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={cn(
                "flex flex-col items-center justify-center w-16 h-full gap-1 transition-all duration-300 relative",
                isActive ? "text-system-blue" : "text-white/40 hover:text-white"
              )}
            >
              {isActive && (
                <div className="absolute top-0 left-2 right-2 h-[2px] bg-system-blue shadow-[0_0_8px_#00E5FF]" />
              )}
              <div className="p-1">
                <Icon size={20} className={cn(isActive ? "drop-shadow-[0_0_8px_rgba(0,229,255,0.8)]" : "")} />
              </div>
              <span
                className={cn(
                  "text-[9px] uppercase tracking-[0.2em] italic font-black",
                  isActive ? "text-system-blue" : "text-white/40"
                )}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
