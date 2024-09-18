import clsx from "clsx";
import React from "react";

type NavButtonProps = { selected?: boolean } & React.PropsWithChildren &
  React.HTMLAttributes<HTMLButtonElement>;

export default function NavButton({ selected, ...props }: NavButtonProps) {
  return (
    <button
      {...props}
      className={clsx(
        "btn btn-sm btn-square",
        "border-none hover:bg-opacity-75",
        selected && "shadow-lg bg-base-100",
        props.className
      )}
      onClick={props.onClick}
    >
      {props.children}
    </button>
  );
}
