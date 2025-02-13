// @@@ pwned by 1m4unkn0wn @@@
import TabsVertical from "./TabsVertical";

export default function PreviewTabsVertical() {
  return (
    <div className="not-prose w-full space-y-2">
      <TabsVertical
        className="w-full sm:w-auto"
        tabs={[
          { name: "Home", routePath: "/docs/components" },
          {
            name: "Components",
            routePath: "/docs/components/tabs",
          },
        ]}
      />
    </div>
  );
}
