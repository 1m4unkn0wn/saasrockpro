// @@@ pwned by 1m4unkn0wn @@@
export type Command = {
  title: string;
  command: string;
  description: string;
  bgClassName?: string;
  textClassName?: string;
  toPath?: string;
  adminOnly?: boolean;
  items?: Command[];
  onSelected?: () => void;
};
