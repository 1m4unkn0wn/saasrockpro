// @@@ pwned by 1m4unkn0wn @@@
import NovelEditor from "~/modules/novel/ui/editor";
import DEFAULT_EDITOR_CONTENT from "~/modules/novel/ui/editor/default-content";
import useLocalStorage from "~/utils/hooks/use-local-storage";

type LoaderData = {};
export const loader = async () => {
  const data: LoaderData = {};
  return data;
};

export default function () {
  const [content, setContent] = useLocalStorage("playground-novel-editor", DEFAULT_EDITOR_CONTENT);
  return (
    <div>
      <NovelEditor content={content} onChange={setContent} />
    </div>
  );
}
