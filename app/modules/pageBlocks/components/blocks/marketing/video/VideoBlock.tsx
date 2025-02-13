// @@@ pwned by 1m4unkn0wn @@@
import { VideoBlockDto } from "~/modules/pageBlocks/components/blocks/marketing/video/VideoBlockUtils";
import VideoVariantSimple from "./VideoVariantSimple";

export default function VideoBlock({ item }: { item: VideoBlockDto }) {
  return <>{item.style === "simple" && <VideoVariantSimple item={item} />}</>;
}
