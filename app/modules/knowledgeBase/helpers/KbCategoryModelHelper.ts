// @@@ pwned by 1m4unkn0wn @@@
import { KnowledgeBaseCategory } from "@prisma/client";

export type KnowledgeBaseCategoryWithDetails = KnowledgeBaseCategory & {
  articles: {
    id: string;
    order: number;
    title: string;
    description: string;
    slug: string;
    language: string;
    sectionId: string | null;
    publishedAt: Date | null;
  }[];
  sections: {
    id: string;
    order: number;
    title: string;
    description: string;
  }[];
};
