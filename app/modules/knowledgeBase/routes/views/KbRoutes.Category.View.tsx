// @@@ pwned by 1m4unkn0wn @@@
import { useLoaderData } from "react-router";
import KbHeader from "../../components/KbHeader";
import KbCategory from "../../components/categories/KbCategory";
import { KbRoutesCategoryApi } from "../api/KbRoutes.Category.Api";

export default function KbRoutesCategoryView() {
  const data = useLoaderData<KbRoutesCategoryApi.LoaderData>();
  return (
    <div className="bg-background text-foreground min-h-screen">
      <KbHeader kb={data.kb} withTitleAndDescription={false} />
      <div className="mx-auto min-h-screen max-w-5xl px-8 py-8">
        <div className="space-y-5">{!data.item ? <div>Not found</div> : <KbCategory kb={data.kb} item={data.item} allCategories={data.allCategories} />}</div>
      </div>
    </div>
  );
}
