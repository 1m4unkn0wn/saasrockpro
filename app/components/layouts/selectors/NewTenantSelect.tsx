// @@@ pwned by 1m4unkn0wn @@@
import { useAppData } from "~/utils/data/useAppData";

interface Props {
  onOpenCommandPalette: () => void;
}

export default function NewTenantSelect({ onOpenCommandPalette }: Props) {
  const appData = useAppData();
  if (!appData.currentTenant) {
    return null;
  }
  return (
    <>
      <button type="button" onClick={onOpenCommandPalette} className="text-foreground group flex w-full flex-shrink-0 focus:outline-none">
        <div className="group block w-full flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center truncate text-left">
              {appData?.currentTenant?.icon ? (
                <img className="inline-block h-9 w-9 shrink-0 rounded-full shadow-sm" src={appData?.currentTenant?.icon} alt={appData?.currentTenant?.name} />
              ) : (
                <span className="bg-primary inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full">
                  <span className="text-primary-foreground text-sm font-medium leading-none">{appData?.currentTenant?.name.substring(0, 1)}</span>
                </span>
              )}
              <div className="ml-3 truncate">
                <p className="text-sm font-medium">{appData?.currentTenant?.name}</p>
                <p className="text-muted-foreground truncate text-xs font-normal">{appData?.user.email}</p>
              </div>
            </div>
            {/* <svg
              xmlns="http://www.w3.org/2000/svg"
              className="text-muted-foreground group-hover:text-foreground h-4 w-4"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg> */}
          </div>
        </div>
      </button>
    </>
  );
}
