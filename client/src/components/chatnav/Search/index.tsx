import { useEffect, useState } from "react";
import { toast } from "sonner";

import newchat from "../../../assets/newchat.svg";
import empty from "../../../assets/void.svg";

import ViewContainer from "../ViewContainer";
import PlaceHolder from "../PlaceHolder";

import { searchUsers } from "../../../api";
import { usePageStore } from "../../../context/page.slice";
import ChatLoader from "../../loader/ChatLoader";

let controller: AbortController;
let timeout: NodeJS.Timeout;

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
    <ViewContainer title="Search" value={query} onChange={handleChange}>
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
          <PlaceHolder src={empty}>
            Nothing found
          </PlaceHolder>
        )
      }

      {
        // Case 4: Show results
        data &&
          !!data.length &&
          data.map((user) => <div key={user.email}>{user.name}</div>)
      }
    </ViewContainer>
  );
}
