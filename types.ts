
export enum Gender {
  FEMALE = "Femme",
  MALE = "Homme",
  NONBINARY = "Non-binaire"
}

export enum AgeGroup {
  CHILD = "Enfant (4-12)",
  TEENAGER = "Adolescent (13-17)",
  YOUNGADULT = "Jeune Adulte (18-25)",
  ADULT = "Adulte (26-45)",
  MATURE = "Mature (46+)"
}

export enum BodyType {
  SLIM = "Svelte",
  ATHLETIC = "Athlétique",
  CURVY = "Rond",
  STANDARD = "Standard"
}

export enum SkinTone {
  LIGHT = "Clair",
  MEDIUM = "Moyen",
  DARK = "Foncé"
}

export enum Pose {
  STANDING = "Debout (bras le long du corps)",
  HAND_ON_HIP = "Main sur la hanche",
  WALKING = "En mouvement (marche)",
  SITTING = "Assis"
}

export enum Fit {
  TIGHT = "Serré",
  REGULAR = "Régulier",
  OVERSIZED = "Surtaillé"
}

export enum Background {
  CHIC_BOHO = "Intérieur Chic Bohème",
  BEDROOM = "Chambre",
  GARDEN = "Jardin",
  TERRACE = "Terrasse",
  BEACH = "Plage",
  URBAN = "Urbain",
  CUSTOM = "Personnalisé"
}

export interface ModelParams {
  gender: Gender;
  age: AgeGroup;
  bodyType: BodyType;
  pose: Pose;
  skinTone: SkinTone;
  fit: Fit;
  background: Background;
  customBackground?: string;
  keepSameModel: boolean;
  seed: number;
}

export interface GenerationState {
  isGenerating: boolean;
  generatedImage: string | null;
  error: string | null;
}
