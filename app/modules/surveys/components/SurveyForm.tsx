// @@@ pwned by 1m4unkn0wn @@@
import { Form } from "react-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import LoadingButton from "~/components/ui/buttons/LoadingButton";
import InputText from "~/components/ui/input/InputText";
import UrlUtils from "~/utils/app/UrlUtils";
import { SurveyWithDetails } from "../db/surveys.db.server";
import SurveyItemsList from "./SurveyItemsList";
import { SurveyDto } from "../dtos/SurveyDtos";
import SurveyUtils from "../utils/SurveyUtils";
import InputCheckbox from "~/components/ui/input/InputCheckbox";
import InputCheckboxWithDescription from "~/components/ui/input/InputCheckboxWithDescription";
import InputNumber from "~/components/ui/input/InputNumber";

interface Props {
  item: SurveyWithDetails | null;
}
export default function SurveyForm({ item }: Props) {
  const { t } = useTranslation();
  const [state, setState] = useState<SurveyDto>(
    item
      ? SurveyUtils.surveyToDto(item)
      : {
          id: "",
          title: "",
          slug: "",
          description: "",
          items: [],
          isEnabled: true,
          isPublic: false,
          createdAt: new Date(),
          minSubmissions: 50,
          image: "",
        }
  );
  return (
    <div>
      <Form method="post">
        <input type="hidden" name="action" value={!item ? "create" : "edit"} readOnly hidden />
        <input type="hidden" name="item" value={JSON.stringify(state)} readOnly hidden />

        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <div className="w-1/2">
              <InputText
                name="title"
                title="Title"
                value={state.title}
                setValue={(e) => setState({ ...state, title: e.toString() })}
                required
                onBlur={() => {
                  if (!item) {
                    setState({ ...state, slug: UrlUtils.slugify(state.title) });
                  }
                }}
              />
            </div>
            <div className="w-1/2">
              <InputText name="slug" title="Slug" value={state.slug} setValue={(e) => setState({ ...state, slug: e.toString() })} required />
            </div>
          </div>
          <div>
            <InputText
              name="description"
              title="Description"
              value={state.description || ""}
              setValue={(e) => setState({ ...state, description: e.toString() })}
            />
          </div>
          <div>
            <InputText name="image" title="Image" value={state.image || ""} setValue={(e) => setState({ ...state, image: e.toString() })} />
          </div>

          <div>
            <InputNumber
              name="minSubmissions"
              title="Show results after submissions"
              value={state.minSubmissions}
              setValue={(e) => setState({ ...state, minSubmissions: Number(e) })}
            />
          </div>

          <div>
            <InputCheckboxWithDescription
              name="enabled"
              title="Enabled"
              value={state.isEnabled}
              setValue={(e) => setState({ ...state, isEnabled: Boolean(e) })}
              description="If disabled, no new submissions will be accepted."
            />
          </div>
          <div>
            <InputCheckboxWithDescription
              name="isPublic"
              title="isPublic"
              value={state.isPublic}
              setValue={(e) => setState({ ...state, isPublic: Boolean(e) })}
              description="If public, the survey will be visible to everyone."
            />
          </div>

          <div>
            <div className="space-y-1">
              <h3 className="text-xs font-medium leading-3">Items</h3>
              <SurveyItemsList items={state.items} onChange={(e) => setState({ ...state, items: e })} />
            </div>
          </div>

          <div className="flex justify-end pt-3">
            <LoadingButton type="submit">{item ? t("shared.save") : t("shared.create")}</LoadingButton>
          </div>
        </div>
      </Form>
    </div>
  );
}
