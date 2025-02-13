// @@@ pwned by 1m4unkn0wn @@@
"use client";

import { Folder, MoreHorizontal, Share, Trash2, type LucideIcon } from "lucide-react";
import { SidebarGroupDto } from "~/application/sidebar/SidebarGroupDto";

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "~/components/ui/dropdown-menu";
import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuAction, SidebarMenuButton, SidebarMenuItem, useSidebar } from "~/components/ui/sidebar";
import SidebarIcon from "../../icons/SidebarIcon";
import { useTranslation } from "react-i18next";

export function NavQuickLinks({
  item,
}: {
  // items: {
  //   name: string;
  //   url: string;
  //   icon: LucideIcon;
  // }[];
  item: SidebarGroupDto;
}) {
  const { t } = useTranslation();
  const { isMobile } = useSidebar();

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
      <SidebarMenu>
        {item.items.map((item) => (
          <SidebarMenuItem key={item.path}>
            <SidebarMenuButton asChild>
              <a href={item.path}>
                {/* <item.icon /> */}
                {(item.icon !== undefined || item.entityIcon !== undefined) && <SidebarIcon className="h-5 w-5 " item={item} />}
                <span>{item.title}</span>
              </a>
            </SidebarMenuButton>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuAction showOnHover>
                  <MoreHorizontal />
                  <span className="sr-only">{t("shared.more")}</span>
                </SidebarMenuAction>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48" side={isMobile ? "bottom" : "right"} align={isMobile ? "end" : "start"}>
                <DropdownMenuItem>
                  <Folder className="text-muted-foreground" />
                  <span>View Project</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Share className="text-muted-foreground" />
                  <span>Share Project</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Trash2 className="text-muted-foreground" />
                  <span>Delete Project</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        ))}
        <SidebarMenuItem>
          <SidebarMenuButton>
            <MoreHorizontal />
            <span>More</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  );
}
