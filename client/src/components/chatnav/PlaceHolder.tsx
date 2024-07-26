import React from "react";

interface AltChatProps extends React.PropsWithChildren {
  /** Image source */
  src: string;
}
export default function PlaceHolder(props: AltChatProps) {
  return (
    <div className="m-auto flex flex-col gap-3 items-center">
      <img src={props.src} className="w-1/2" />
      <span className="text-accent text-center text-xl">{props.children}</span>
    </div>
  );
}

