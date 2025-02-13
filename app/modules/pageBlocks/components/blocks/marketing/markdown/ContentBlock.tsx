// @@@ pwned by 1m4unkn0wn @@@
import { ContentBlockDto } from "./ContentBlockUtils";
import ContentVariantSimple from "./ContentVariantSimple";

export default function ContentBlock({ item }: { item: ContentBlockDto }) {
  return <>{item.style === "simple" && <ContentVariantSimple item={item} />}</>;
}
