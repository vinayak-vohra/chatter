import { InputHTMLAttributes, PropsWithChildren } from "react";
import { Pages } from "../../types/Pages";
import clsx from "clsx";

interface ContainerProps
  extends PropsWithChildren,
    InputHTMLAttributes<HTMLInputElement> {
  title: Pages;
}
export default function ViewContainer({
  title,
  children,
  ...props
}: ContainerProps) {
  return (
    <div className="flex flex-col h-dvh w-80 bg-white gap-4 p-4">
      <div className="flex space-between ">
        <h3 className="text-2xl font-semibold font-Playwrite">{title}</h3>
      </div>
      <input
        placeholder="Search..."
        {...props}
        className={clsx(
          "input input-sm",
          "outline-none focus:outline-none",
          "input-bordered focus:border-primary",
          "duration-300",
          props.className
        )}
      />
      {children}
    </div>
  );
}
