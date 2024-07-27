import React from "react";
import { Pages } from "../../types/Pages";
import SearchInput from "../inputs/SearchInput";

interface ContainerProps
  extends React.PropsWithChildren,
    React.InputHTMLAttributes<HTMLInputElement> {
  title: Pages;
  actionButtons?: React.ReactNode;
}
export default function ViewContainer({
  title,
  actionButtons,
  children,
  ...props
}: ContainerProps) {
  return (
    <div className="flex flex-col h-dvh w-80 bg-white gap-4 p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-semibold font-Playwrite">{title}</h3>
        {!!actionButtons && actionButtons}
      </div>
      <SearchInput {...props} />
      {children}
    </div>
  );
}
