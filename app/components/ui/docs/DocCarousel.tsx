// @@@ pwned by 1m4unkn0wn @@@
import CustomCarousel from "../images/CustomCarousel";

interface Props {
  items: {
    type: string;
    title: string;
    src: string;
  }[];
}

export default function DocCarousel({ items }: Props) {
  return <CustomCarousel items={items} />;
}
