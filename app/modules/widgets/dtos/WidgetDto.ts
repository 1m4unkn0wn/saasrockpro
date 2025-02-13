// @@@ pwned by 1m4unkn0wn @@@
import { JsonPropertiesValuesDto } from "~/modules/jsonProperties/dtos/JsonPropertiesValuesDto";

export type WidgetDto = {
  id: string;
  createdAt: Date;
  name: string;
  metadata: JsonPropertiesValuesDto | null;
  appearance: {
    logo: string | null;
    theme: string;
    mode: "light" | "dark";
    position: "bottom-right" | "bottom-left" | "top-right" | "top-left" | "center";
    hiddenInUrls: string[];
    visibleInUrls: string[];
  };
};

export type WidgetDataDto = {
  success?: string;
  error?: string;
};
