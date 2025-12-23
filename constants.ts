
import { Gender, AgeGroup, BodyType, SkinTone, Pose, Fit, Background } from './types';

export const GENDER_OPTIONS = Object.values(Gender);
export const AGE_OPTIONS = Object.values(AgeGroup);
export const BODY_OPTIONS = Object.values(BodyType);
export const SKIN_OPTIONS = Object.values(SkinTone);
export const POSE_OPTIONS = Object.values(Pose);
export const FIT_OPTIONS = Object.values(Fit);
export const BG_OPTIONS = Object.values(Background);

export const DEFAULT_PARAMS = {
  gender: Gender.FEMALE,
  age: AgeGroup.YOUNGADULT,
  bodyType: BodyType.STANDARD,
  pose: Pose.STANDING,
  skinTone: SkinTone.MEDIUM,
  fit: Fit.REGULAR,
  background: Background.URBAN,
  keepSameModel: false,
  seed: Math.floor(Math.random() * 1000000)
};
