// @@@ pwned by 1m4unkn0wn @@@
export interface OnboardingSessionActionDto {
  type: "click" | "input";
  name: string;
  value: string;
  createdAt?: Date;
}
