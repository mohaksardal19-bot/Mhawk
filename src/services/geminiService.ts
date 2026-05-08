import { GoogleGenAI, Type } from "@google/genai";

let ai: GoogleGenAI;

export function getGenAIClient(): GoogleGenAI {
  if (!ai) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not set. Please configure it in the AI Studio Secrets panel.");
    }
    ai = new GoogleGenAI({ apiKey });
  }
  return ai;
}

export interface WorkoutExercise {
  name: string;
  reps: string;
  weight: string;
  xp_reward: number;
}

export async function generateAIWorkout(bodyPart: string, playerLevel: number): Promise<WorkoutExercise[]> {
  const client = getGenAIClient();
  
  const exerciseDict: Record<string, string[]> = {
    "Chest": ["Bench press normal", "Bench press inclined", "Bench press declined", "Barbell bench press", "Weighted dips", "Cable Crossovers", "Chest Dips", "Dumbbell pullover", "Dumbbell Flys", "Peck Deck", "Standing Cable Fly"],
    "Back": ["Cable Lat pull down", "High row machine", "bent-over rows barbell", "landmine row", "Upright barbell row", "one arm dumbbell row", "Cable pullover", "Lever seated reverse fly", "Pull ups", "assisted pull ups", "seated cable rows"],
    "Legs": ["Squats", "Deadlift", "Bridges", "Donkey kick", "Sumo Squats", "Lunges", "Bulgarian split squat", "Calf Raises", "Leg Extensions", "Leg Press", "Leg Curls", "Adduction Machine"],
    "Shoulders": ["Dumbbell lateral raises", "Overhead barbell press", "Bent over low pulley rear delt fly", "Standing Dumbbell raises", "Seated Dumbbell raises", "Arnold press", "Cable Face pull", "Smith machine shoulder press", "Dumbell front raises", "Standing cable reverse fly", "machine reverse fly", "single arm cable raises", "Cable lateral raises"],
    "Arms": ["Barbell curls", "Dumbbell curls", "Incline dumbbell curls", "Dumbbell hammer curls", "Cable curls", "Concentration curls", "EZ Bar Preacher curl", "Machine curl", "lying dumbbell curl", "Standing high pulley cable curl"],
    "Core": ["Floor leg raises", "Weighted crunches", "Sit ups", "Cable crunch", "Hanging leg raises", "Plank", "Ab crunches", "Side plank", "Abdominal air bike", "Decline bench sit ups", "Mountain climber", "Shoulder taps", "Russian twist", "Roman chair leg curls"]
  };

  const allowedExercises = exerciseDict[bodyPart] || [];

  const prompt = `You are the System from Solo Leveling. Given the target body part (${bodyPart}) and the hunter's level (${playerLevel}), generate a daily quest workout instance (a Dungeon).
Select exactly 10 exercises ONLY from this approved list: ${allowedExercises.join(", ")}. If there are fewer than 10 exercises available in the list, use all of them.
Provide the workout as a JSON list of exercises. Each exercise should have a name (the exact name from the list, or slightly thematicized but recognizable), reps (string like "12", "5-8", or "Failure"), and suggested weight (in kg, or "Bodyweight" if no weight needed). Make them appropriate for the level. The XP reward should scale with difficulty.`;

  const response = await client.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      systemInstruction: "You are an RPG system assigning fitness quests. Only output the requested JSON structure.",
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
             name: { type: Type.STRING },
             reps: { type: Type.STRING },
             weight: { type: Type.STRING },
             xp_reward: { type: Type.NUMBER }
          },
          required: ["name", "reps", "weight", "xp_reward"]
        }
      }
    }
  });

  return JSON.parse(response.text || "[]");
}
