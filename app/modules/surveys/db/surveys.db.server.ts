// @@@ pwned by 1m4unkn0wn @@@
import { Survey, SurveyItem } from "@prisma/client";
import { db } from "~/utils/db.server";

export type SurveyWithDetails = Survey & {
  items: SurveyItem[];
  _count: {
    submissions: number;
  };
};

export async function getAllSurveys({ tenantId, isPublic }: { tenantId: string | null; isPublic?: boolean }): Promise<SurveyWithDetails[]> {
  return await db.survey.findMany({
    where: {
      tenantId,
      isPublic,
    },
    include: {
      items: { orderBy: { order: "asc" } },
      _count: { select: { submissions: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getSurveyById({ tenantId, id }: { tenantId: string | null; id: string }): Promise<SurveyWithDetails | null> {
  return await db.survey.findFirst({
    where: {
      tenantId,
      id,
    },
    include: {
      items: { orderBy: { order: "asc" } },
      _count: { select: { submissions: true } },
    },
  });
}

export async function getSurveyBySlug({ tenantId, slug }: { tenantId: string | null; slug: string }): Promise<SurveyWithDetails | null> {
  return await db.survey.findFirst({
    where: {
      tenantId,
      slug,
    },
    include: {
      items: { orderBy: { order: "asc" } },
      _count: { select: { submissions: true } },
    },
  });
}

export async function createSurvey(data: {
  tenantId: string | null;
  title: string;
  slug: string;
  description: string | null;
  isEnabled: boolean;
  isPublic: boolean;
  minSubmissions: number;
  image: string | null;
  items: {
    title: string;
    description: string | null;
    type: string;
    order: number;
    categories: string[];
    href: string | null;
    color: string;
    style: string;
    options: {
      title: string;
      // link: string | null;
      isOther: boolean;
      icon: string | null;
      shortName: string | null;
    }[];
  }[];
}) {
  return await db.survey.create({
    data: {
      title: data.title,
      slug: data.slug,
      description: data.description,
      isEnabled: data.isEnabled,
      isPublic: data.isPublic,
      tenantId: data.tenantId,
      minSubmissions: data.minSubmissions,
      image: data.image,
      items: {
        createMany: {
          data: data.items.map((item) => {
            return {
              title: item.title,
              description: item.description,
              type: item.type,
              order: item.order,
              categories: item.categories,
              href: item.href,
              color: item.color,
              options: item.options,
              style: item.style,
            };
          }),
        },
      },
    },
  });
}

export async function updateSurvey(
  id: string,
  data: {
    tenantId?: string | null;
    title?: string;
    slug?: string;
    description?: string | null;
    isEnabled?: boolean;
    isPublic?: boolean;
    minSubmissions?: number;
    image?: string | null;
    items: {
      title: string;
      description: string | null;
      type: string;
      order: number;
      categories: string[];
      href: string | null;
      color: string;
      style: string;
      options: {
        title: string;
        // link: string | null;
        isOther: boolean;
        icon: string | null;
        shortName: string | null;
      }[];
    }[];
  }
) {
  return await db.survey.update({
    where: { id },
    data: {
      title: data.title,
      slug: data.slug,
      description: data.description,
      isEnabled: data.isEnabled,
      isPublic: data.isPublic,
      tenantId: data.tenantId,
      minSubmissions: data.minSubmissions,
      image: data.image,
      items: {
        deleteMany: {},
        createMany: {
          data: data.items.map((item) => {
            return {
              title: item.title,
              description: item.description,
              type: item.type,
              order: item.order,
              categories: item.categories,
              href: item.href,
              color: item.color,
              options: item.options,
              style: item.style,
            };
          }),
        },
      },
    },
  });
}
