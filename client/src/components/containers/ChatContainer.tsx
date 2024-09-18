import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import clsx from "clsx";
import { getChatById } from "@/api";
import errorLogger from "@/utils/errorLogger";
import logo from "@/assets/logo.svg";
import ChatLoader from "../loader/ChatLoader";
import { Toggle } from "@/components/ui/toggle";
import EmojiPicker from "emoji-picker-react";
import { FaRegFaceSmile, FaRegPaperPlane } from "react-icons/fa6";
import { useAppStore } from "@/context";
import { User } from "@/types/User";

export default function ChatContainer() {
  const { id } = useParams();
  const [emojiOpen, setEmojiOpen] = useState(false);
  const [chatInfo, setChatInfo] = useState<Object | null>(null);

  const onClickOutside = (ev: MouseEvent) => {
    if (emojiRef.current && emojiButtonRef.current) {
      const emojiMenu = emojiRef.current.getBoundingClientRect();
      const emojiBtn = emojiButtonRef.current.getBoundingClientRect();
      if (
        !(
          ev.clientX >= emojiMenu.left &&
          ev.clientX <= emojiMenu.right &&
          ev.clientY >= emojiMenu.top &&
          ev.clientY <= emojiMenu.bottom
        ) &&
        !(
          ev.clientX >= emojiBtn.left &&
          ev.clientX <= emojiBtn.right &&
          ev.clientY >= emojiBtn.top &&
          ev.clientY <= emojiBtn.bottom
        )
      ) {
        setEmojiOpen(false);
      }
    }
  };

  const toggleEmoji = () => {
    if (emojiOpen) {
      window.removeEventListener("click", onClickOutside);
    } else {
      window.addEventListener("click", onClickOutside);
    }
    setEmojiOpen(!emojiOpen);
  };

  const emojiRef = useRef<null | HTMLDivElement>(null);
  const emojiButtonRef = useRef<null | HTMLButtonElement>(null);

  useEffect(() => {
    if (id) {
      getChatById(id)
        .then((res) => setChatInfo(res.data))
        .catch(errorLogger);
    }
  }, [id]);

  console.log(chatInfo);

  return id ? (
    <div className="grow flex flex-col">
      <div className="bg-base-100 w-full px-5 py-2">
        {!chatInfo && <ChatLoader count={1} />}
        {chatInfo && <ChatInfo chatInfo={chatInfo} />}
      </div>

      <div className="h-full flex flex-col">
        <span className="text-2xl font-semibold text-neutral self-center my-auto">No Messages yet</span>
      </div>

      <div className="mt-auto px-5 py-2 relative flex items-center bg-base-100">
        {/* <IconButton Icon={<FaRegFaceSmile />} onClick={toggleEmoji} className="" /> */}
        <Toggle
          pressed={emojiOpen}
          onPressedChange={toggleEmoji}
          ref={emojiButtonRef}
        >
          <FaRegFaceSmile />
        </Toggle>
        <div ref={emojiRef} className="absolute bottom-14">
          <EmojiPicker
            open={emojiOpen}
            width={400}
            lazyLoadEmojis
            previewConfig={{ showPreview: false }}
            onEmojiClick={(e) => console.log(e)}
          />
        </div>
        {/* <SearchInput placeholder="Type a message"/> */}
        <form
          id="message-input"
          onSubmit={(e) => {
            e.preventDefault();
            console.log("clicked");
          }}
        />
        <input
          form="message-input"
          placeholder="Type a message"
          className="input input-sm w-full border-none focus:outline-none"
        />
        <button
          form="message-input"
          className="btn btn-sm btn-square btn-primary"
        >
          <FaRegPaperPlane />
        </button>
      </div>
    </div>
  ) : (
    <div
      className={clsx(
        "grow items-center justify-center",
        "hidden md:flex flex-col gap-5",
        "font-semibold text-2xl text-neutral duration-300"
      )}
    >
      <img src={logo} alt="chatter" className="w-48 h-48" />
      Select or Start a new chat
    </div>
  );
}

function getOtherInfo(users: User[], current: User) {
  return users.filter((u) => u._id !== current._id)![0];
}

function ChatInfo({ chatInfo }: { chatInfo: any }) {
  const user = useAppStore((state) => state.user);
  const chatWith = getOtherInfo(chatInfo.users, user!);

  return (
    <div className="flex items-center gap-4">
      <img
        src={chatWith.photoURL}
        className="h-12 w-12 shrink-0 rounded-full"
      />
      <div className="flex flex-col gap-1">
        <div className="text-sm">{chatWith.name}</div>
        <div className="text-xs text-neutral">{chatWith.email}</div>
      </div>
    </div>
  );
}
