// @@@ pwned by 1m4unkn0wn @@@
import { useTranslation } from "react-i18next";
import { LogoCloudDto } from "~/modules/pageBlocks/components/blocks/marketing/logoClouds/LogoCloudsBlockUtils";

export default function LogoCloudsVariantWithHeading({ headline, items }: { headline?: string; items: LogoCloudDto[] }) {
  const { t } = useTranslation();
  return (
    <div className="ring-ring text-foreground rounded-lg py-8 ring-2">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-8">
          {headline && <h2 className="mx-auto max-w-md text-center text-3xl font-bold tracking-tight lg:max-w-xl lg:text-left">{t(headline)}</h2>}
          <div className="mt-8 flow-root self-center lg:mt-0">
            <div className="-ml-8 -mt-4 flex flex-wrap justify-between lg:-ml-4">
              {items.map((item, idx) => {
                return (
                  <a
                    key={idx}
                    href={item.href}
                    className="ml-8 mt-4 flex flex-shrink-0 flex-grow justify-center lg:ml-4 lg:flex-grow-0"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {!item.srcDark ? (
                      <img className="h-12" src={item.src} alt={item.alt} />
                    ) : (
                      <>
                        <img className="h-12 dark:hidden" src={item.src} alt={item.alt} />
                        <img className="hidden h-12 dark:block" src={item.srcDark} alt={item.alt} />
                      </>
                    )}
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
