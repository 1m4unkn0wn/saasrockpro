// @@@ pwned by 1m4unkn0wn @@@
import { OnboardingSessionFilterMatch, OnboardingFilter } from "@prisma/client";

export type OnboardingMatchingFilterDto = OnboardingSessionFilterMatch & {
  onboardingFilter: OnboardingFilter;
};
