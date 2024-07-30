import { usePageStore } from "@/context/page.slice";
import SearchInput from "../inputs/SearchInput";
import { useEffect } from "react";
import { useAppStore } from "@/context";
import { UserBase } from "@/types/User";
import { Link } from "react-router-dom";
import empty from "@/assets/void.svg";
import PlaceHolder from "../containers/PlaceHolder";

export default function NewChats() {
  const setPage = usePageStore((state) => state.setPage);
  const user = useAppStore((state) => state.user);

  useEffect(() => {
    setPage("New Chat");
  }, []);
  return (
    <>
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-semibold font-Playwrite">New Chat</h3>
      </div>
      <SearchInput />
      {user?.friends.map((f) => (
        <UserCard key={f._id} user={f} />
      ))}
      {!user?.friends.length && (
        <PlaceHolder src={empty}>
          Feels Empty <br />
          <Link to="/search" className="mx-auto text-sm btn btn-sm btn-link">
            Search more users
          </Link>
        </PlaceHolder>
      )}
    </>
  );
}

function UserCard({ user }: { user: UserBase }) {
  return (
    <div
      id={user._id}
      className="p-2 flex gap-2 items-center overflow-hidden border-b-2 duration-300"
    >
      <img src={user.photoURL} className="w-1/6 rounded-full" />
      <div className="flex flex-col grow overflow-x-hidden">
        <span className="text-sm text-neutral text-ellipsis text-nowrap overflow-hidden">
          {user.name}
        </span>
        <span className="text-xs text-neutral/80 text-ellipsis text-nowrap overflow-hidden">
          {user.email}
        </span>
      </div>
    </div>
  );
}
