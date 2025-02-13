// @@@ pwned by 1m4unkn0wn @@@
export const OnboardingStepTypes = ["text", "gallery", "form"] as const;
export type OnboardingStepType = (typeof OnboardingStepTypes)[number];
