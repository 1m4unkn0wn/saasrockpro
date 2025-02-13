// @@@ pwned by 1m4unkn0wn @@@
"use client";

import { ChevronRight, type LucideIcon } from "lucide-react";
import { Fragment } from "react/jsx-runtime";
import { SidebarGroupDto } from "~/application/sidebar/SidebarGroupDto";

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "~/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "~/components/ui/sidebar";
import SidebarIcon from "../../icons/SidebarIcon";
import { Link } from "react-router";

export function NavMain({
  items,
}: {
  // items: {
  //   title: string;
  //   url: string;
  //   icon: LucideIcon;
  //   isActive?: boolean;
  //   items?: {
  //     title: string;
  //     url: string;
  //   }[];
  // }[];
  items: SidebarGroupDto[];
}) {
  return (
    <Fragment>
      {/* <SidebarGroup>
        <SidebarGroupLabel>Platform</SidebarGroupLabel>
        <SidebarMenu>
          {items.map((item) => (
            <Collapsible key={item.title} asChild defaultOpen={item.isActive}>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip={item.title}>
                  <a href={item.url}>
                    <item.icon />
                    <span>{item.title}</span>
                  </a>
                </SidebarMenuButton>
                {item.items?.length ? (
                  <>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuAction className="data-[state=open]:rotate-90">
                        <ChevronRight />
                        <span className="sr-only">Toggle</span>
                      </SidebarMenuAction>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.items?.map((subItem) => (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton asChild>
                              <a href={subItem.url}>
                                <span>{subItem.title}</span>
                              </a>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </>
                ) : null}
              </SidebarMenuItem>
            </Collapsible>
          ))}
        </SidebarMenu>
      </SidebarGroup> */}

      {items.map((group) => (
        <SidebarGroup key={group.title}>
          {group.title && <SidebarGroupLabel>{group.title}</SidebarGroupLabel>}
          <SidebarMenu>
            {group.items.map((item) => (
              <Fragment>
                {!item.items?.length ? (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link to={item.path}>
                        {/* <item.icon /> */}
                        {(item.icon !== undefined || item.entityIcon !== undefined) && <SidebarIcon className="h-5 w-5 " item={item} />}
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ) : (
                  <Collapsible key={item.title} asChild defaultOpen={item.isActive} className="group/collapsible">
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton tooltip={item.title}>
                          {/* <Link to={item.path}> */}
                          {/* <item.icon /> */}
                          {(item.icon !== undefined || item.entityIcon !== undefined) && <SidebarIcon className="h-5 w-5" item={item} />}
                          <span>{item.title}</span>
                          <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />

                          {/* </Link> */}
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      {item.items?.length ? (
                        <>
                          {/* <CollapsibleTrigger asChild>
                            <SidebarMenuAction className="data-[state=open]:rotate-90"> */}
                          {/* <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                          <span className="sr-only">Toggle</span> */}
                          {/* </SidebarMenuAction>
                          </CollapsibleTrigger> */}
                          <CollapsibleContent>
                            <SidebarMenuSub>
                              {item.items?.map((subItem) => (
                                <SidebarMenuSubItem key={subItem.title}>
                                  <SidebarMenuSubButton asChild>
                                    <Link to={subItem.path}>
                                      <span>{subItem.title}</span>
                                    </Link>
                                  </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                              ))}
                            </SidebarMenuSub>
                          </CollapsibleContent>
                        </>
                      ) : null}
                    </SidebarMenuItem>
                  </Collapsible>
                )}
              </Fragment>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      ))}
    </Fragment>
  );
}
