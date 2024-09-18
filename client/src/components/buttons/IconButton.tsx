import { ReactNode } from "react";

interface IconButtonProps {
  className: string;
  Icon: ReactNode;
  loading?: boolean;
  onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

export default function IconButton(props: IconButtonProps) {
  return (
    <button
      onClick={props.onClick}
      disabled={props.loading}
      className={
        `btn btn-sm btn-circle btn-ghost hover:bg-opacity-15 ` + props.className
      }
    >
      {props.loading ? (
        <p className="loading loading-ring loading-sm text-neutral" />
      ) : (
        props.Icon
      )}
    </button>
  );
}
