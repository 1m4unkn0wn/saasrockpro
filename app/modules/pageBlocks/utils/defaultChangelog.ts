// @@@ pwned by 1m4unkn0wn @@@
import { TFunction } from "i18next";
import { ChangelogItem } from "~/components/changelog/ChangelogIssues";
import { getDefaultSiteTags } from "./defaultSeoMetaTags";

export function defaultChangelog({ t }: { t: TFunction }): ChangelogItem[] {
  const items: ChangelogItem[] = [
    {
      date: "Sep 31th, 2024",
      title: "SaasRock v1.4.0 🎉",
      url: "https://saasrock.com/changelog",
      description: "Your description here",
      videos: [
        {
          title: "SaasRock Channel",
          url: "https://www.youtube.com/@saasrock",
          target: "_blank",
        },
      ],
      closed: [
        {
          title: "Added new feature",
          img: [
            {
              title: "SaasRock Cover",
              img: getDefaultSiteTags().image,
            },
          ],
        },
      ],
    },
  ];
  return items;
}
