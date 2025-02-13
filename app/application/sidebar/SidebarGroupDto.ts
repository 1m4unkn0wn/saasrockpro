// @@@ pwned by 1m4unkn0wn @@@
import { SideBarItem } from "./SidebarItem";

export type SidebarGroupDto = {
  items: SideBarItem[];
  title?: string;
  type?: "main" | "secondary" | "quick-link";
};
