// @@@ pwned by 1m4unkn0wn @@@
import { Separator } from "~/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "../../../ui/sidebar";
import { ShadcnAppSidebar } from "./app-sidebar";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "~/components/ui/breadcrumb";
import { SideBarItem } from "~/application/sidebar/SidebarItem";
import { useParams } from "react-router";
import { useTitleData } from "~/utils/data/useTitleData";
import { useRef, useState } from "react";
import { NavActions } from "./nav-actions";
import { useKBar } from "kbar";
import OnboardingSession from "~/modules/onboarding/components/OnboardingSession";

export default function ShadcnSidebarLayout({
  children,
  layout,
  menuItems,
}: {
  children: React.ReactNode;
  layout: "app" | "admin" | "docs";
  menuItems?: SideBarItem[];
}) {
  const params = useParams();
  const title = useTitleData() ?? "";

  const mainElement = useRef<HTMLElement>(null);

  const { query } = useKBar();

  const [onboardingModalOpen, setOnboardingModalOpen] = useState(false);

  function onOpenCommandPalette() {
    query.toggle();
  }
  return (
    <SidebarProvider>
      <OnboardingSession open={onboardingModalOpen} setOpen={setOnboardingModalOpen} />
      <div className="dark">
        <ShadcnAppSidebar layout={layout} menuItems={menuItems} />
      </div>
      <SidebarInset className="overflow-hidden">
        <header className="flex h-16 shrink-0 items-center gap-2 border-b border-gray-200 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            {title && <Separator orientation="vertical" className="mr-2 h-4" />}
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbPage>{title}</BreadcrumbPage>
                </BreadcrumbItem>
                {/* <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                </BreadcrumbItem> */}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="ml-auto px-3">
            <NavActions layout={layout} onOpenCommandPalette={onOpenCommandPalette} setOnboardingModalOpen={setOnboardingModalOpen} />
          </div>
        </header>
        {/* <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <div className="bg-muted/50 aspect-video rounded-xl" />
            <div className="bg-muted/50 aspect-video rounded-xl" />
            <div className="bg-muted/50 aspect-video rounded-xl" />
          </div>
        </div> */}
        <main ref={mainElement} className="flex-1 bg-gray-50 focus:outline-none" tabIndex={0}>
          <div key={params.tenant} className="pb-20 sm:pb-0">
            {children}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
