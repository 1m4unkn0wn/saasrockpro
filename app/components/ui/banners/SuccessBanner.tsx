// @@@ pwned by 1m4unkn0wn @@@
import { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import CheckIcon from "../icons/CheckIcon";

interface Props {
  title?: string;
  text?: ReactNode | string;
  redirect?: string;
  children?: ReactNode;
}

export default function SuccessBanner({ title, text = "", redirect, children }: Props) {
  const { t } = useTranslation();
  return (
    <div className="not-prose rounded-md border border-teal-300 bg-teal-50 dark:border-teal-700 dark:bg-teal-900">
      <div className="rounded-md p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <CheckIcon className="h-5 w-5 text-teal-400 dark:text-teal-600" />
          </div>

          <div className="ml-3 w-full">
            {title && <h3 className="text-sm font-medium leading-5 text-teal-900 dark:text-teal-50">{t(title)}</h3>}
            <div className="mt-2 text-sm leading-5 text-teal-800 dark:text-teal-100">
              <div>
                {text}{" "}
                {redirect && (
                  <Link className="mt-2 text-teal-900 underline dark:text-teal-50" to={redirect}>
                    {t("shared.goTo")} {redirect}
                  </Link>
                )}
                {children}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
