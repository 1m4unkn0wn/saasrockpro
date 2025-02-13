// @@@ pwned by 1m4unkn0wn @@@
import { JsonPropertyDto } from "~/modules/jsonProperties/dtos/JsonPropertyTypeDto";
import { TFunction } from "i18next";

export type WidgetsConfiguration = {
  enabled: boolean;
  metadata: Array<JsonPropertyDto> | undefined;
};

export function getWidgetsConfiguration({ t }: { t: TFunction }): WidgetsConfiguration {
  const conf: WidgetsConfiguration = {
    enabled: false,
    metadata: [
      // {
      //   name: "description",
      //   title: t("shared.description"),
      //   type: "string",
      //   required: true,
      // },
    ],
  };

  return conf;
}
