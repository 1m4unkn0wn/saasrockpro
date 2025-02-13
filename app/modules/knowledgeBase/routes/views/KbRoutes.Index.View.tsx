// @@@ pwned by 1m4unkn0wn @@@
import { KbRoutesIndexApi } from "../api/KbRoutes.Index.Api";
import KbHeader from "../../components/KbHeader";
import KbFeaturedArticles from "../../components/KbFeaturedArticles";
import KbCategories from "../../components/categories/KbCategories";
import KbDocsLayout from "../../components/layouts/KbDocsLayout";
import { useLoaderData } from "react-router";

export default function KbRoutesIndex() {
  const data = useLoaderData<KbRoutesIndexApi.LoaderData>();

  if (data.kb.layout === "docs") {
    return <KbDocsLayout kb={data.kb} categories={data.categories} featured={data.featured} isAdmin={data.isAdmin} />;
  }

  return (
    <div className="bg-background text-foreground min-h-screen">
      <KbHeader kb={data.kb} withTitleAndDescription={true} />
      <div className="mx-auto max-w-5xl px-2 py-6 sm:px-8">
        <div className="space-y-8">
          {data.featured.length > 0 && <KbFeaturedArticles kb={data.kb} items={data.featured} />}
          <KbCategories kb={data.kb} items={data.categories} />
        </div>
      </div>
    </div>
  );
}
