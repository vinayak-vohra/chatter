import clsx from "clsx";
import React from "react";

type NavButtonProps = { selected?: boolean } & React.PropsWithChildren &
  React.HTMLAttributes<HTMLButtonElement>;

export default function NavButton({ selected, ...props }: NavButtonProps) {
  return (
    <button
      {...props}
      className={clsx(
        "btn btn-sm btn-ghost btn-square",
        "border-none hover:bg-opacity-5",
        selected && "shadow-lg bg-white",
        props.className
      )}
      onClick={props.onClick}
    >
      {props.children}
    </button>
  );
}
