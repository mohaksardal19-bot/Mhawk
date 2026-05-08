/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { BottomNav } from "./components/layout/BottomNav";
import { StatusScreen } from "./screens/StatusScreen";
import { QuestsScreen } from "./screens/QuestsScreen";
import { SkillsScreen } from "./screens/SkillsScreen";
import { AnalyticsScreen } from "./screens/AnalyticsScreen";
import { WelcomeScreen } from "./screens/WelcomeScreen";
import { LoginScreen } from "./screens/LoginScreen";
import { SignUpScreen } from "./screens/SignUpScreen";
import { GenderScreen } from "./screens/GenderScreen";
import { AgeScreen } from "./screens/AgeScreen";
import { WeightScreen } from "./screens/WeightScreen";
import { AnimatePresence } from "motion/react";

export default function App() {
  const [appState, setAppState] = useState<"welcome" | "login" | "signup" | "gender" | "age" | "weight" | "main">("welcome");
  const [activeTab, setActiveTab] = useState("status");

  return (
    <div className="min-h-screen text-[#e0e0e0] relative max-w-md mx-auto bg-abyss border-x border-white/5 overflow-hidden selection:bg-system-blue selection:text-black">
      <AnimatePresence mode="wait">
        {appState === "welcome" && (
          <WelcomeScreen key="welcome" onComplete={() => setAppState("login")} />
        )}
        {appState === "login" && (
          <LoginScreen key="login" onLogin={() => setAppState("main")} onSignUpClick={() => setAppState("signup")} />
        )}
        {appState === "signup" && (
          <SignUpScreen key="signup" onSignUp={() => setAppState("gender")} onBack={() => setAppState("login")} />
        )}
        {appState === "gender" && (
          <GenderScreen key="gender" onNext={() => setAppState("age")} onBack={() => setAppState("signup")} />
        )}
        {appState === "age" && (
          <AgeScreen key="age" onNext={() => setAppState("weight")} onBack={() => setAppState("gender")} />
        )}
        {appState === "weight" && (
          <WeightScreen key="weight" onNext={() => setAppState("main")} onBack={() => setAppState("age")} />
        )}
      </AnimatePresence>

      {appState === "main" && (
        <>
          {/* Outer framing from design */}
          <div className="absolute inset-0 pointer-events-none border-[12px] border-dark-indigo z-50"></div>

          <main className="min-h-screen relative z-10 pt-4 pb-20">
            <AnimatePresence mode="wait">
              {activeTab === "status" && <StatusScreen key="status" onBack={() => setAppState("login")} />}
              {activeTab === "quests" && <QuestsScreen key="quests" />}
              {activeTab === "skills" && <SkillsScreen key="skills" />}
              {activeTab === "analytics" && <AnalyticsScreen key="analytics" />}
            </AnimatePresence>
          </main>

          <BottomNav activeTab={activeTab} onChange={setActiveTab} />
        </>
      )}
    </div>
  );
}
