import clsx from "clsx";
import React from "react";

function SearchInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
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
  );
}

export default SearchInput;
