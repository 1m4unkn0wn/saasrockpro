// @@@ pwned by 1m4unkn0wn @@@
import { SurveyWithDetails } from "../db/surveys.db.server";
import { SurveyDto, SurveyItemDto } from "../dtos/SurveyDtos";

function surveyToDto(survey: SurveyWithDetails) {
  const items: SurveyItemDto[] = survey.items.map((item) => {
    const surveyItem: SurveyItemDto = {
      title: item.title,
      description: item.description || "",
      type: item.type as SurveyItemDto["type"],
      order: item.order,
      categories: item.categories as string[],
      href: item.href || undefined,
      color: item.color as SurveyItemDto["color"],
      style: item.style === "grid" ? "grid" : "default",
      options: (item.options as any).map((option: any) => {
        return {
          title: option.title,
          link: option.link || undefined,
          isOther: option.isOther || false,
          icon: option.icon || undefined,
          shortName: option.shortName || undefined,
        };
      }),
    };
    return surveyItem;
  });
  const item: SurveyDto = {
    id: survey.id,
    createdAt: survey?.createdAt ?? new Date(),
    title: survey?.title ?? "",
    slug: survey?.slug ?? "",
    description: survey?.description ?? "",
    isEnabled: survey?.isEnabled ?? true,
    isPublic: survey?.isPublic ?? true,
    items,
    minSubmissions: survey?.minSubmissions,
    image: survey?.image ?? null,
  };
  return item;
}

export default {
  surveyToDto,
};
