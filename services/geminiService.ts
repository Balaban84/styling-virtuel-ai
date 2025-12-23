
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { ModelParams } from "../types";

const getAIClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("Clé API manquante. Veuillez configurer API_KEY.");
  }
  return new GoogleGenAI({ apiKey });
};

export const generateTryOnImage = async (
  clothingImageBase64: string, 
  params: ModelParams
): Promise<string> => {
  const ai = getAIClient();
  
  // Extract clean base64 data (strip prefix)
  const base64Data = clothingImageBase64.split(',')[1] || clothingImageBase64;

  const prompt = `
Génère une photo ultra-réaliste d'essayage de mode :

MODÈLE HUMAIN :
- Genre : ${params.gender}
- Âge : ${params.age}
- Morphologie : ${params.bodyType}
- Teint de peau : ${params.skinTone}
- Pose : ${params.pose}

VÊTEMENT :
- Porte exactement le vêtement fourni dans l'image jointe.
- Ajustement : ${params.fit}
- Le vêtement doit conserver ses couleurs, ses motifs et ses textures originaux.

ENVIRONNEMENT :
- Fond / Décor : ${params.background === 'Personnalisé' ? params.customBackground : params.background}
- Éclairage naturel et professionnel (qualité studio photo).

QUALITÉ :
- Photo très haute résolution.
- Texture de peau réaliste et naturelle.
- Style global : shooting de mode professionnel.

Instructions techniques :
L'image doit ressembler à une photo authentique. Maintiens le style global et la composition.
`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Data,
              mimeType: 'image/png'
            }
          },
          { text: prompt }
        ]
      },
      config: {
        seed: params.seed,
        imageConfig: {
          aspectRatio: "3:4"
        }
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    
    throw new Error("Aucune image n'a été générée par l'IA.");
  } catch (error: any) {
    console.error("Gemini Error:", error);
    if (error.message?.includes("API_KEY_INVALID")) {
      throw new Error("Erreur : La clé API est invalide.");
    }
    throw new Error(`Erreur : ${error.message || "Une erreur inconnue est survenue lors de la génération."}`);
  }
};

export const correctGeneratedImage = async (
  currentImageBase64: string,
  correctionPrompt: string
): Promise<string> => {
  const ai = getAIClient();
  const base64Data = currentImageBase64.split(',')[1] || currentImageBase64;

  const prompt = `
Veuillez modifier cette image selon l'instruction suivante : "${correctionPrompt}".
Conserve le même modèle et le même vêtement, n'applique que la modification demandée tout en maintenant une qualité de shooting de mode ultra-réaliste.
`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Data,
              mimeType: 'image/png'
            }
          },
          { text: prompt }
        ]
      },
      config: {
        imageConfig: {
          aspectRatio: "3:4"
        }
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    
    throw new Error("Aucune image corrigée n'a été générée.");
  } catch (error: any) {
    throw new Error(`Erreur de retouche : ${error.message || "Impossible d'appliquer la correction."}`);
  }
};
