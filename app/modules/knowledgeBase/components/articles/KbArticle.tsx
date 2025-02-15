// @@@ pwned by 1m4unkn0wn @@@
import type { KnowledgeBaseDto } from "../../dtos/KnowledgeBaseDto";
import BreadcrumbSimple from "~/components/ui/breadcrumbs/BreadcrumbSimple";
import type { KbArticleDto } from "~/modules/knowledgeBase/dtos/KbArticleDto";
import type { KbCategoryDto } from "~/modules/knowledgeBase/dtos/KbCategoryDto";
import KbArticleContent from "./KbArticleContent";
import { useParams } from "react-router";
import KnowledgeBaseUtils from "../../utils/KnowledgeBaseUtils";

export default function KbArticle({
  kb,
  category,
  item,
  userState,
  actions,
  withMenu = true,
}: {
  kb: KnowledgeBaseDto;
  category: KbCategoryDto;
  item: KbArticleDto;
  userState: {
    hasThumbsUp: boolean;
    hasThumbsDown: boolean;
  };
  actions: {
    onThumbsUp: () => void;
    onThumbsDown: () => void;
  };
  withMenu?: boolean;
}) {
  const params = useParams();
  return (
    <div className="space-y-6">
      {withMenu && (
        <BreadcrumbSimple
          menu={[
            // {
            //   title: kb.title,
            //   routePath: KnowledgeBaseUtils.getKbUrl({ kb, params }),
            // },
            {
              title: category.title,
              routePath: KnowledgeBaseUtils.getCategoryUrl({ kb, category, params }),
            },
            {
              title: item.title,
              routePath: item.href,
            },
          ]}
        />
      )}

      <KbArticleContent item={item} content={item.contentPublished} userState={userState} actions={actions} />
    </div>
  );
}
