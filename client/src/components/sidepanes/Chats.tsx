import { useEffect, useState } from "react";
import { usePageStore } from "@/context/page.slice";
import SearchInput from "../inputs/SearchInput";
import { useAppStore } from "@/context";
import { FaInbox } from "react-icons/fa6";
import IconButton from "../buttons/IconButton";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import PlaceHolder from "../containers/PlaceHolder";
import empty from "@/assets/void.svg";
import { Link } from "react-router-dom";

export default function Chats() {
  const setPage = usePageStore((state) => state.setPage);
  const user = useAppStore((state) => state.user);
  const [chats, setChats] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => setPage("Chats"), []);
  return (
    <>
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-semibold font-Playwrite">Chats</h3>
        <Popover open={open} onOpenChange={setOpen}>
          {/* <PopoverTrigger> */}
            <div className="indicator">
              <span className="indicator-item h-2 w-2 p-0 mx-1 my-1 badge badge-primary"></span>
              <IconButton
                Icon={<FaInbox />}
                onClick={() => {}}
                className={`hover:bg-accent/20 text-accent ${
                  open ? "bg-accent/20 hover:bg-accent/40" : ""
                }`}
              />
            </div>
          {/* </PopoverTrigger> */}
          <PopoverContent align="end" sideOffset={10}></PopoverContent>
        </Popover>
      </div>
      <SearchInput />

      {/* Case 1: Loading chats */}

      {
        /* Case 2: No Chats */
        !chats.length && (
          <PlaceHolder src={empty}>
            Feels Empty
            <br />{" "}
            <Link to="/new-chat" className="btn btn-sm btn-link text-sm">
              Start a new chat
            </Link>
          </PlaceHolder>
        )
      }
    </>
  );
}
