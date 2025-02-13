// @@@ pwned by 1m4unkn0wn @@@
import { DialogTitle } from "@headlessui/react";
import { useState } from "react";
import ButtonSecondary from "../ui/buttons/ButtonSecondary";
import XIcon from "../ui/icons/XIcon";
import OpenModal from "../ui/modals/OpenModal";

export type ChangelogItem = {
  date: string;
  title: string;
  description: string;
  url?: string;
  closed: Issue[];
  added?: Issue[];
  videos?: { title: string; url: string; target?: string }[];
};

type Issue = {
  title: string;
  img?: { title: string; img: string }[];
  video?: string;
};

interface Props {
  title: string;
  icon: string;
  items: Issue[];
}
export default function ChangelogIssues({ title, icon, items }: Props) {
  const [viewImages, setViewImages] = useState(false);
  const [selectedImage, setSelectedImage] = useState<{
    title: string;
    img: string;
  }>();
  function imageCount() {
    return items.filter((f) => (f.img?.length ?? 0) > 0).length;
  }
  return (
    <div className="mx-auto ">
      <div className="prose dark:prose-dark text-sm">
        <>
          {items.length > 0 && (
            <>
              <div className=" flex items-baseline space-x-1">
                <h2 className="dark text-sm font-semibold">{title}</h2>
                {imageCount() > 0 && (
                  <button className=" text-xs underline" type="button" onClick={() => setViewImages(!viewImages)}>
                    ({!viewImages ? "Click here to show images" : "Hide images"})
                  </button>
                )}
              </div>
              <ul>
                {items.map((issue, idx) => {
                  return (
                    <li key={idx}>
                      {icon} {issue.title}
                      {viewImages && (
                        <div className="flex items-baseline space-x-3">
                          {issue.img?.map((image, idx) => {
                            return (
                              <img
                                onClick={() => setSelectedImage(image)}
                                key={idx}
                                alt={image.title}
                                src={image.img}
                                className="w-28 cursor-pointer overflow-hidden rounded-lg border-2 border-dashed border-gray-300 object-cover shadow-lg hover:border-gray-500 hover:opacity-90 hover:shadow-2xl"
                              />
                            );
                          })}
                        </div>
                      )}
                      {/* {viewImages && (
                        <>
                          {issue.img?.map((image, idx) => {
                            return (
                              <div key={idx} className="">
                                <img alt={image.title} src={image.img} className="object-cover rounded-lg shadow-lg overflow-hidden" />
                                {image.title && <h4 className="text-sm font-normal text-center flex justify-center mx-auto text-gray-500">{image.title}</h4>}
                              </div>
                            );
                          })}
                          {issue.video && (
                            <a href={issue.video} target="_blank" rel="noreferrer">
                              Watch demo video
                            </a>
                          )}
                        </>
                      )} */}
                    </li>
                  );
                })}
              </ul>
            </>
          )}
        </>
        {selectedImage && (
          <OpenModal onClose={() => setSelectedImage(undefined)}>
            <div>
              <div className="">
                <div className=" flex items-center justify-between space-x-2">
                  <DialogTitle as="h3" className="text-foreground text-lg font-medium leading-6">
                    {selectedImage.title}
                  </DialogTitle>
                  <div className="flex space-x-2">
                    <ButtonSecondary type="button" onClick={() => setSelectedImage(undefined)}>
                      <XIcon className="h-4 w-4" />
                    </ButtonSecondary>
                  </div>
                </div>
                <div className="mt-4 space-y-3">
                  <div>
                    <img alt={selectedImage.title} className="mx-auto h-96 object-contain" src={selectedImage.img} />
                  </div>
                </div>
              </div>
            </div>
          </OpenModal>
        )}
      </div>
    </div>
  );
}
