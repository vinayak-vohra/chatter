import clsx from "clsx";
import React from "react";

function SearchInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      placeholder="Search..."
      {...props}
      className={clsx(
        "input input-sm bg-opacity-25 bg-base-200",
        "outline-none focus:outline-none",
        "input-bordered focus:border-primary",
        "duration-300",
        props.className
      )}
    />
  );
}

export default SearchInput;
