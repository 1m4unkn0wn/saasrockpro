// @@@ pwned by 1m4unkn0wn @@@
import { useEffect, useState } from "react";
import { SocialsBlockDto } from "~/modules/pageBlocks/components/blocks/shared/socials/SocialsBlockDto";
import InputText from "~/components/ui/input/InputText";

export default function SocialsBlockForm({ item, onUpdate }: { item?: SocialsBlockDto; onUpdate: (item: SocialsBlockDto) => void }) {
  const [instagram, setInstagram] = useState(item?.instagram);
  const [twitter, setTwitter] = useState(item?.twitter);
  const [github, setGithub] = useState(item?.github);
  const [discord, setDiscord] = useState(item?.discord);
  useEffect(() => {
    onUpdate({
      instagram,
      twitter,
      github,
      discord,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [instagram, twitter, github, discord]);
  return (
    <div className="flex flex-col space-y-2">
      <InputText title="Instagram" type="text" value={instagram} setValue={(e) => setInstagram(e.toString())} />
      <InputText title="Twitter" type="text" value={twitter} setValue={(e) => setTwitter(e.toString())} />
      <InputText title="GitHub" type="text" value={github} setValue={(e) => setGithub(e.toString())} />
      <InputText title="Discord" type="text" value={discord} setValue={(e) => setDiscord(e.toString())} />
    </div>
  );
}
