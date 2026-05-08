import React, { createContext, useContext, useState, ReactNode } from "react";

export interface DungeonRecord {
  id: string;
  title: string;
  type: string;
  date: string;
  time?: string;
  xp: number;
}

export interface PlayerStats {
  strength: number;
  agility: number;
  sense: number;
  vitality: number;
  intelligence: number;
}

export interface Skill {
  name: string;
  level: number;
  exp: number;
  nextExp: number;
  rank: string;
  target: string;
}

interface PlayerState {
  level: number;
  xp: number;
  rank: string;
  stats: PlayerStats;
  health: [number, number]; // current, max
  energy: [number, number]; // current, max
  dungeonsHistory: DungeonRecord[];
  skills: Skill[];
}

interface PlayerContextType {
  playerState: PlayerState;
  addXP: (xpToAdd: number) => void;
  addDungeonRecord: (record: DungeonRecord, bodyPartTarget?: string) => void;
  addStat: (statName: keyof PlayerStats, amount: number) => void;
  levelUp: (levels: number) => void;
}

const defaultState: PlayerState = {
  level: 0,
  xp: 0,
  rank: "E",
  stats: {
    strength: 0,
    agility: 0,
    sense: 0,
    vitality: 0,
    intelligence: 0,
  },
  health: [1000, 1000],
  energy: [200, 200],
  dungeonsHistory: [],
  skills: [
    { name: "Chest", level: 0, exp: 0, nextExp: 1000, rank: "E", target: "Pectoralis Major" },
    { name: "Back", level: 0, exp: 0, nextExp: 1000, rank: "E", target: "Latissimus Dorsi" },
    { name: "Shoulders", level: 0, exp: 0, nextExp: 1000, rank: "E", target: "Deltoids" },
    { name: "Arms", level: 0, exp: 0, nextExp: 1000, rank: "E", target: "Biceps/Triceps" },
    { name: "Legs", level: 0, exp: 0, nextExp: 1000, rank: "E", target: "Quadriceps/Hamstrings" },
    { name: "Core", level: 0, exp: 0, nextExp: 1000, rank: "E", target: "Abdominals" },
  ]
};

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [playerState, setPlayerState] = useState<PlayerState>(defaultState);

  const getRankFromLevel = (level: number) => {
    if (level < 10000) return "E";
    if (level < 20000) return "D";
    if (level < 30000) return "C";
    if (level < 40000) return "B";
    if (level < 50000) return "A";
    return "S";
  };

  const levelUp = (levels: number) => {
    setPlayerState((prev) => {
      const newLevel = prev.level + levels;
      const newRank = getRankFromLevel(newLevel);
      return {
        ...prev,
        level: newLevel,
        rank: newRank,
      };
    });
  };

  const addXP = (xpToAdd: number) => {
    setPlayerState((prev) => {
      let newXP = prev.xp + xpToAdd;
      return { ...prev, xp: newXP };
    });
  };

  const addDungeonRecord = (record: DungeonRecord, bodyPartTarget?: string) => {
    setPlayerState((prev) => {
      const newLevel = prev.level + 10;
      const newRank = getRankFromLevel(newLevel);
      
      const newSkills = prev.skills.map(skill => {
        if (skill.name === bodyPartTarget) {
          let newExp = skill.exp + record.xp;
          let newSkillLevel = skill.level;
          let newNextExp = skill.nextExp;
          let newSkillRank = skill.rank;
          
          while (newExp >= newNextExp) {
            newExp -= newNextExp;
            newSkillLevel += 1;
            newNextExp = Math.floor(newNextExp * 1.5);
          }
          
          if (newSkillLevel < 10) newSkillRank = "E";
          else if (newSkillLevel < 20) newSkillRank = "D";
          else if (newSkillLevel < 30) newSkillRank = "C";
          else if (newSkillLevel < 40) newSkillRank = "B";
          else if (newSkillLevel < 50) newSkillRank = "A";
          else newSkillRank = "S";
          
          return { ...skill, exp: newExp, level: newSkillLevel, nextExp: newNextExp, rank: newSkillRank };
        }
        return skill;
      });

      return {
        ...prev,
        dungeonsHistory: [record, ...prev.dungeonsHistory],
        xp: prev.xp + record.xp,
        level: newLevel,
        rank: newRank,
        skills: newSkills,
      };
    });
  };

  const addStat = (statName: keyof PlayerStats, amount: number) => {
    setPlayerState((prev) => ({
      ...prev,
      stats: {
        ...prev.stats,
        [statName]: prev.stats[statName] + amount,
      },
    }));
  };

  return (
    <PlayerContext.Provider
      value={{
        playerState,
        addXP,
        addDungeonRecord,
        addStat,
        levelUp,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (context === undefined) {
    throw new Error("usePlayer must be used within a PlayerProvider");
  }
  return context;
};
