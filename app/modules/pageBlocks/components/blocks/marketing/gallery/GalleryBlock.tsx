// @@@ pwned by 1m4unkn0wn @@@
import { GalleryBlockDto } from "~/modules/pageBlocks/components/blocks/marketing/gallery/GalleryBlockUtils";
import GalleryVariantCarousel from "./GalleryVariantCarousel";

export default function GalleryBlock({ item }: { item: GalleryBlockDto }) {
  return <>{item.style === "carousel" && <GalleryVariantCarousel item={item} />}</>;
}
