import { usePageStore } from "@/context/page.slice";
import SearchInput from "../inputs/SearchInput";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useAppStore } from "@/context";
import { UserBase } from "@/types/User";
import { Link, useNavigate } from "react-router-dom";
import empty from "@/assets/void.svg";
import PlaceHolder from "../containers/PlaceHolder";
import includes from "@/utils/includes";
import clsx from "clsx";
import { FaCirclePlus } from "react-icons/fa6";
import { getChatId } from "@/api";
import { Switch } from "../ui/switch";
import errorLogger from "@/utils/errorLogger";

export default function NewChats() {
  const setPage = usePageStore((state) => state.setPage);
  const user = useAppStore((state) => state.user);
  const [filter, setFilter] = useState("");
  const [gc, setGC] = useState(false);
  const [gName, setGName] = useState("");
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<Record<string, boolean>>({});

  const nav = useNavigate();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFilter(e.target.value);

  const groupSize = useMemo(
    () => Object.values(selected).filter(Boolean).length,
    [selected]
  );

  const createNewGroup = useCallback(() => {}, []);

  const handleUserClick = useCallback(
    async (id: string) => {
      if (gc) {
        setSelected((s) => ({ ...s, [id]: !s[id] }));
      } else {
        try {
          setLoading(true);
          const chatid = await getChatId(id);
          setLoading(false);

          if (typeof chatid.data !== "string") {
            throw new Error("Invalid Chat.");
          }

          nav(`/chats/${chatid.data}`);
        } catch (error: any) {
          setLoading(false);
          errorLogger(error);
        }
      }
    },
    [groupSize, selected]
  );

  useEffect(() => {
    setPage("New Chat");
  }, []);

  useEffect(() => {
    setSelected({});
  }, [gc]);

  return (
    <>
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-semibold font-Playwrite">New Chat</h3>
      </div>
      <SearchInput value={filter} onChange={handleSearchChange} />
      <div className="flex flex-col justify-center">
        <div className="flex p-1">
          <label
            htmlFor="group-chat"
            className="text-neutral text-sm cursor-pointer grow"
          >
            New Group
          </label>
          <Switch id="group-chat" className="data-[state=checked]:bg-primary" checked={gc} onCheckedChange={setGC} />
        </div>
        <div
          className={clsx(
            "flex grow gap-2 duration-300 overflow-hidden",
            gc ? "h-12 py-2 mt-2" : "h-0 py-0 m-0"
          )}
        >
          <SearchInput
            value={gName}
            id="groupname"
            onChange={(e) => setGName(e.target.value)}
            placeholder="Group name"
            className="grow"
            disabled={loading}
          />
          <button
            className="btn btn-sm btn-neutral btn-outline duration-500"
            disabled={groupSize < 2 || !gName.length || loading}
            onClick={createNewGroup}
          >
            <span>Create</span>
            <FaCirclePlus />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="m-auto flex flex-col items-center gap-2">
          <div className="loading loading-ring text-primary loading-lg"></div>
          <div className="text-neutral">Hang on</div>
        </div>
      ) : (
        <div className="overflow-y-auto border-t">
          {user?.friends
            .filter(
              (f) => includes(f.name, filter) || includes(f.email, filter)
            )
            .map((f) => (
              <UserCard
                key={f._id}
                user={f}
                selected={selected[f._id]}
                toggle={() => handleUserClick(f._id)}
              />
            ))}
        </div>
      )}
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

interface IUserCard {
  user: UserBase;
  selected: boolean;
  toggle: () => void;
}
function UserCard({ user, selected, toggle }: IUserCard) {
  return (
    <div
      onClick={toggle}
      className={clsx(
        "flex my-1 items-center gap-2",
        "rounded-lg p-3 overflow-hidden border border-transparent",
        !selected && "hover:bg-opacity-5 hover:bg-neutral",
        selected &&
          "border-primary hover:bg-opacity-15 bg-opacity-5 bg-primary",
        "duration-300 cursor-pointer"
      )}
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
