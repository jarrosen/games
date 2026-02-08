import { GoogleGenAI, Type } from "@google/genai";
import { CardData, SportType } from "../types";

const generateCardSchema = {
  type: Type.OBJECT,
  properties: {
    name: { type: Type.STRING },
    team: { type: Type.STRING },
    rating: { type: Type.NUMBER },
    bio: { type: Type.STRING },
    badge: { type: Type.STRING },
    rarity: { type: Type.STRING },
    designTheme: { 
      type: Type.STRING, 
      enum: ['modern', 'retro', 'street', 'futuristic', 'classic', 'pixel'],
      description: "The visual style theme for the card name based on the player's persona."
    }
  },
  required: ["name", "team", "rating", "bio", "badge", "rarity", "designTheme"],
};

export const generateCardData = async (
  prompt: string,
  sport: SportType
): Promise<CardData> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const systemPrompt = `
    You are the "Master Card Smith," an expert sports analyst and creative world-builder. 
    Your goal is to transform user descriptions into highly collectible, professional-grade sports card data for the sport: ${sport}.

    ### CREATIVE GUIDELINES:
    1. TONE: Be evocative and professional. If the user prompt is realistic, use high-level sports terminology. If the user prompt is fantastical (e.g., "Space Basketball"), invent creative but intuitive team names.
    2. BIO: Write a punchy, 1-sentence bio (max 15 words) that sounds like it was written by a scout.
    3. RARITY & BADGE: Assign rarity based on the prompt's "vibe." Legendary players should have high ratings (95+) and badges like "MVP" or "GOAT." Rookies or niche players should be "Rare" with ratings in the 80s.
    4. DESIGN THEME: Choose a 'designTheme' that fits the player's vibe:
       - 'modern': Sleek, standard professional sports.
       - 'retro': 70s/80s vibe, bold, vintage.
       - 'street': Gritty, graffiti, urban, underground.
       - 'futuristic': Sci-fi, cyber, space, high-tech.
       - 'classic': Elegant, golden era, timeless, mythological.
       - 'pixel': 8-bit, video game, glitch.

    ### TECHNICAL REQUIREMENTS:
    Respond strictly in JSON format.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `${systemPrompt}\n\nUser Description: ${prompt}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: generateCardSchema as any,
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from Gemini");

    return JSON.parse(text) as CardData;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};

export const generateCardImage = async (
  prompt: string,
  sport: SportType,
  referenceImage?: string
): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  // 1. Augment the prompt using a text model first to get a better visual description
  let enhancedDescription = prompt;
  
  try {
    const augmentationResponse = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `
        You are a visionary sports artist and prompt engineer.
        Convert the following short user description into a rich, detailed visual art prompt for generating a sports card image.
        
        Sport: ${sport}
        User Description: "${prompt}"
        
        CRITICAL VISUAL INSTRUCTIONS:
        1. CAMERA DISTANCE & FRAMING (CRITICAL):
           - DISTANCE SHOTS (3-pointers, deep passes, midfield play, outside shots): Use an "Ultra-Wide Angle" or "High-Angle Wide Shot". The camera MUST ZOOM OUT significantly to show the player in relation to the environment (e.g., showing the 3-point line, the distance to the hoop, or the open field). We need to see the court/field context.
           - CLOSE ACTION (Dunks, tackles, headers, layups): Use "Low-Angle Dynamic Shot" or "Medium-Full Shot" that fills the frame with the player's intensity.
        2. ACTION ACCURACY: If the user describes a shooting action from a specific location (e.g. "shooting from half court", "shooting a 3-pointer", "corner shot"), describe the specific body mechanics of a JUMP SHOT (vertical leap, wrist follow-through, feet alignment). DO NOT describe a dunk or layup unless the user explicitly asks for it.
        3. POSITION PRESERVATION: If the user specifies a location (e.g. "from deep", "at the free throw line"), ensure the description places the player in that context, not under the rim.
        4. FULL BODY VISIBILITY: Regardless of zoom, the player's full body and the ball/equipment must be visible.
        5. AVOID CLOSE-UPS: Do not describe a portrait or headshot unless explicitly requested.
        
        Focus on:
        - The specific mechanic of the sport (e.g., wrist flick on a shot, extension on a catch).
        - Dramatic stadium or arena lighting (lens flares, spotlights).
        - Highly detailed uniform and equipment.
        - Intense atmosphere.
        
        Output ONLY the enhanced description paragraph. Do not add markdown or conversational filler.
      `,
    });
    
    if (augmentationResponse.text) {
      enhancedDescription = augmentationResponse.text;
    }
  } catch (error) {
    console.warn("Prompt augmentation failed, falling back to original prompt.", error);
  }

  // 2. Generate the image using the enhanced description
  const parts: any[] = [];

  // If a reference image is provided (user selfie), use it for face swapping logic
  if (referenceImage && referenceImage.startsWith('data:')) {
    const matches = referenceImage.match(/^data:(.+);base64,(.+)$/);
    if (matches && matches.length === 3) {
      parts.push({
        inlineData: {
          mimeType: matches[1],
          data: matches[2],
        },
      });
    }
  }

  // Construct the final image prompt
  const imagePrompt = `
    Generate a high-quality, realistic sports trading card illustration.
    Sport: ${sport}.
    Scene Description: ${enhancedDescription}
    Style: Dynamic action shot, cinematic lighting, hyper-realistic, 8k resolution, digital art style.
    Note: Ensure the player's pose accurately reflects the specific action described (e.g. a jump shot should look like a jump shot from distance, not a dunk at the rim).
    ${referenceImage 
      ? 'IMPORTANT: The player in the image MUST have the face of the person in the provided input image. However, do NOT use the background, clothing, or pose from the input image. Generate a completely new body, uniform, and action pose suitable for the sport. Only the facial features should be transferred.' 
      : 'Create a unique character face matching the description.'}
    Background: Stadium atmosphere or abstract energetic sports background.
  `;
  
  parts.push({ text: imagePrompt });

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: { parts },
    config: {
      imageConfig: {
        aspectRatio: "1:1",
      }
    }
  });

  // Extract the generated image from the response parts
  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
    }
  }

  throw new Error("No image generated.");
};