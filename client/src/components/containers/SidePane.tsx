import clsx from "clsx";
import { PropsWithChildren } from "react";
import { useParams } from "react-router-dom";

export default function SidePane({ children }: PropsWithChildren) {
  const { id } = useParams();

  return (
    <div
      className={clsx(
        "flex flex-col gap-4",
        "p-4 bg-base-100",
        "border-e border-s h-dvh duration-300",
        "min-w-80 w-2/3 mx-auto md:w-1/4",
        id && "hidden md:flex"
      )}
    >
      {children}
    </div>
  );
}
