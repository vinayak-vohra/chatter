import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { FaCheck, FaPlus, FaUserPlus, FaXmark } from "react-icons/fa6";

import newchat from "../../../assets/newchat.svg";
import empty from "../../../assets/void.svg";

import ViewContainer from "../ViewContainer";
import PlaceHolder from "../PlaceHolder";

import { searchUsers, friendRequest } from "../../../api";
import { usePageStore } from "../../../context/page.slice";
import ChatLoader from "../../loader/ChatLoader";
import { FriendRequest, User } from "../../../types/User";
import errorLogger from "../../../utils/errorLogger";
import { Link } from "react-router-dom";
import IconButton from "../../buttons/IconButton";

let controller: AbortController;
let timeout: NodeJS.Timeout;

interface SearchedUser extends User {
  isSender?: FriendRequest;
  isReceiver?: FriendRequest;
}

export default function Search() {
  const setPage = usePageStore((state) => state.setPage);
  const [query, setQuery] = useState("");
  const [data, setData] = useState<Array<any> | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const q = e.target.value;
    setQuery(q);

    if (timeout && controller) {
      controller.abort();
      clearTimeout(timeout);
    }

    if (q.length < 3) {
      setData(null);
      return;
    }

    timeout = setTimeout(() => {
      setData(null);
      controller = new AbortController();
      searchUsers(q, controller.signal)
        .then((res) => setData(res.data))
        .catch((err) => toast.error(err.message));
    }, 300);
  }

  useEffect(() => {
    setPage("Search");
  }, []);
  return (
    <ViewContainer
      title="Search"
      value={query}
      onChange={handleChange}
      actionButtons={
        <div className="dropdown dropdown-bottom dropdown-end">
          <button role="button" className="btn btn-sm btn-square btn-ghost">
            <FaPlus />
          </button>
          <ul
            tabIndex={0}
            className="dropdown-content menu bg-base-100 w-40 rounded-lg z-[1] p-2 shadow"
          >
            <li>
              <Link to="/new-chat">New Chat</Link>
            </li>
            <li>
              <Link to="/new-group-chat">New Group Chat</Link>
              
            </li>
          </ul>
        </div>
      }
    >
      {
        // Case 1: Waiting for input
        !data && query.length < 3 && (
          <PlaceHolder src={newchat}>Enter 3 letters to search</PlaceHolder>
        )
      }

      {
        // Case 2: Loading Skeleton
        !data && query.length > 2 && <ChatLoader />
      }

      {
        // Case 3: No Search Results
        data && !data.length && (
          <PlaceHolder src={empty}>Nothing found</PlaceHolder>
        )
      }

      {
        // Case 4: Show results
        data &&
          !!data.length &&
          data.map((user: SearchedUser) => (
            <UserCard key={user.uid} user={user} />
          ))
      }
    </ViewContainer>
  );
}

function UserCard({ user }: { user: SearchedUser }) {
  const [loading, setLoading] = useState(false);
  const [isSender, setSender] = useState(user.isSender);
  const [isReceiver, setReceiver] = useState(user.isReceiver);
  const [isFriend, setFriend] = useState(false);

  const sendFriendRequest = useCallback(async (receiverId: string) => {
    setLoading(true);
    friendRequest
      .send(receiverId)
      .then((res) => {
        setSender(res.data);
        toast.success(`Friend request sent to ${user.name.split(" ")[0]}`, {
          id: "send",
        });
      })
      .catch(errorLogger)
      .finally(() => setLoading(false));
  }, []);

  const cancelFriendRequest = useCallback(
    async (entity: FriendRequest, setter: (v?: FriendRequest) => void) => {
      setLoading(true);
      friendRequest
        .cancel(entity._id)
        .then((res) => {
          setter(res.data);
          toast.success("Friend request removed.", { id: "cancel" });
        })
        .catch(errorLogger)
        .finally(() => setLoading(false));
    },
    []
  );

  const acceptFriendRequest = useCallback(async (request: FriendRequest) => {
    setLoading(true);
    friendRequest
      .accept(request)
      .then(() => {
        toast.success("Yaay! You got a new friend.", { id: "accept" });
        document.getElementById(user._id)?.classList.add("animate-shrink");
        setTimeout(() => {
          setFriend(true);
        }, 300);
      })
      .catch(errorLogger)
      .finally(() => setLoading(false));
  }, []);

  if (isFriend) return <></>;
  return (
    <div
      id={user._id}
      className="p-2 flex gap-2 items-center overflow-hidden border-b-2 duration-300"
    >
      <img src={user.photoURL} className="w-1/6 rounded-full" />
      <div className="flex flex-col grow overflow-x-hidden">
        <span className="text-sm text-neutral-600 text-ellipsis text-nowrap overflow-hidden">
          {user.name}
        </span>
        <span className="text-xs text-neutral text-ellipsis text-nowrap overflow-hidden">
          {user.email}
        </span>
      </div>
      <div className="w-1/8 flex">
        {
          // accept or decline received friend request
          isReceiver && (
            <>
              {!loading && (
                <IconButton
                  loading={loading}
                  Icon={<FaCheck />}
                  type="success"
                  onClick={() => acceptFriendRequest(isReceiver)}
                />
              )}

              <IconButton
                loading={loading}
                Icon={<FaXmark />}
                type="error"
                onClick={() => cancelFriendRequest(isReceiver, setReceiver)}
              />
            </>
          )
        }
        {
          // cancel friend request
          isSender && (
            <IconButton
              loading={loading}
              Icon={<FaXmark />}
              type="error"
              onClick={() => cancelFriendRequest(isSender, setSender)}
            />
          )
        }
        {
          // send friend request
          !isReceiver && !isSender && (
            <IconButton
              loading={loading}
              Icon={<FaUserPlus />}
              type="primary"
              onClick={() => sendFriendRequest(user._id)}
            />
          )
        }
      </div>
    </div>
  );
}

// function 