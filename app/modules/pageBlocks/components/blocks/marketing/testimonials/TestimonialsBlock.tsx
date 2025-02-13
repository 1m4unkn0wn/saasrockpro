// @@@ pwned by 1m4unkn0wn @@@
import { TestimonialsBlockDto } from "~/modules/pageBlocks/components/blocks/marketing/testimonials/TestimonialsBlockUtils";
import TestimonialsVariantSimple from "./TestimonialsVariantSimple";
import TestimonialsVariantScroll from "./TestimonialsVariantScroll";

export default function TestimonialsBlock({ item }: { item: TestimonialsBlockDto }) {
  return (
    <>
      {item.style === "simple" && <TestimonialsVariantSimple item={item} />}
      {item.style === "scroll" && <TestimonialsVariantScroll item={item} />}
    </>
  );
}
