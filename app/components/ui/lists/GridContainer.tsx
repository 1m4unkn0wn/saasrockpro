// @@@ pwned by 1m4unkn0wn @@@
import clsx from "clsx";
import { GridLayoutDto } from "~/application/dtos/layout/GridLayoutDto";

type Props = GridLayoutDto & {
  children: React.ReactNode;
  className?: string;
};
export default function GridContainer({ children, className, columns, sm, md, lg, xl, xl2, gap }: Props) {
  return (
    <div
      className={clsx(
        className,
        "grid",
        gap === "xs" && "gap-2",
        gap === "sm" && "gap-4",
        gap === "md" && "gap-6",
        gap === "lg" && "gap-8",
        gap === "xl" && "gap-10",
        columns === 1 && "grid-cols-1",
        columns === 2 && "grid-cols-2",
        columns === 3 && "grid-cols-3",
        columns === 4 && "grid-cols-4",
        columns === 5 && "grid-cols-5",
        columns === 6 && "grid-cols-6",
        columns === 7 && "grid-cols-7",
        columns === 8 && "grid-cols-8",
        columns === 9 && "grid-cols-9",
        columns === 10 && "grid-cols-10",
        columns === 11 && "grid-cols-11",
        columns === 12 && "grid-cols-12",
        sm === 1 && "sm:grid-cols-1",
        sm === 2 && "sm:grid-cols-2",
        sm === 3 && "sm:grid-cols-3",
        sm === 4 && "sm:grid-cols-4",
        sm === 5 && "sm:grid-cols-5",
        sm === 6 && "sm:grid-cols-6",
        sm === 7 && "sm:grid-cols-7",
        sm === 8 && "sm:grid-cols-8",
        sm === 9 && "sm:grid-cols-9",
        sm === 10 && "sm:grid-cols-10",
        sm === 11 && "sm:grid-cols-11",
        sm === 12 && "sm:grid-cols-12",
        md === 1 && "md:grid-cols-1",
        md === 2 && "md:grid-cols-2",
        md === 3 && "md:grid-cols-3",
        md === 4 && "md:grid-cols-4",
        md === 5 && "md:grid-cols-5",
        md === 6 && "md:grid-cols-6",
        md === 7 && "md:grid-cols-7",
        md === 8 && "md:grid-cols-8",
        md === 9 && "md:grid-cols-9",
        md === 10 && "md:grid-cols-10",
        md === 11 && "md:grid-cols-11",
        md === 12 && "md:grid-cols-12",
        lg === 1 && "lg:grid-cols-1",
        lg === 2 && "lg:grid-cols-2",
        lg === 3 && "lg:grid-cols-3",
        lg === 4 && "lg:grid-cols-4",
        lg === 5 && "lg:grid-cols-5",
        lg === 6 && "lg:grid-cols-6",
        lg === 7 && "lg:grid-cols-7",
        lg === 8 && "lg:grid-cols-8",
        lg === 9 && "lg:grid-cols-9",
        lg === 10 && "lg:grid-cols-10",
        lg === 11 && "lg:grid-cols-11",
        lg === 12 && "lg:grid-cols-12",
        xl === 1 && "xl:grid-cols-1",
        xl === 2 && "xl:grid-cols-2",
        xl === 3 && "xl:grid-cols-3",
        xl === 4 && "xl:grid-cols-4",
        xl === 5 && "xl:grid-cols-5",
        xl === 6 && "xl:grid-cols-6",
        xl === 7 && "xl:grid-cols-7",
        xl === 8 && "xl:grid-cols-8",
        xl === 9 && "xl:grid-cols-9",
        xl === 10 && "xl:grid-cols-10",
        xl === 11 && "xl:grid-cols-11",
        xl === 12 && "xl:grid-cols-12",
        xl2 === 1 && "2xl:grid-cols-1",
        xl2 === 2 && "2xl:grid-cols-2",
        xl2 === 3 && "2xl:grid-cols-3",
        xl2 === 4 && "2xl:grid-cols-4",
        xl2 === 5 && "2xl:grid-cols-5",
        xl2 === 6 && "2xl:grid-cols-6",
        xl2 === 7 && "2xl:grid-cols-7",
        xl2 === 8 && "2xl:grid-cols-8",
        xl2 === 9 && "2xl:grid-cols-9",
        xl2 === 10 && "2xl:grid-cols-10",
        xl2 === 11 && "2xl:grid-cols-11",
        xl2 === 12 && "2xl:grid-cols-12"
      )}
    >
      {children}
    </div>
  );
}
