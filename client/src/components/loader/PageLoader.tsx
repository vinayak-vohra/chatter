import clsx from "clsx";
import cat from "../../assets/Cat.gif";

export default function Loader() {
  return (
    <div
      className={clsx(
        "h-dvh w-dvw",
        "flex flex-col",
        "justify-center items-center",
        "px-5"
      )}
    >
      <img src={cat} className="h-60 md:h-80 mb-32" />
    </div>
  );
}
