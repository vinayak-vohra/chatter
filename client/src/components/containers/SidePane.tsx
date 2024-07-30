import { PropsWithChildren } from "react";

export default function SidePane({ children }: PropsWithChildren) {
  return (
    <div className="flex flex-col border-e h-dvh w-80 gap-4 p-4">
      {children}
    </div>
  );
}
